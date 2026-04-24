#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from itertools import product
from pathlib import Path
from typing import Any

REFERENCE_RE = re.compile(r"^\{(.+)\}$")
DURATION_KEYS = {"duration", "delay"}
CURVE_MAP = {
    "ease out": "ease-out",
    "ease in": "ease-in",
    "ease in and out": "ease-in-out",
    "ease in-out": "ease-in-out",
    "linear": "linear",
}
FONT_WEIGHT_MAP = {
    "light": (300, "normal"),
    "regular": (400, "normal"),
    "medium": (500, "normal"),
    "bold": (700, "normal"),
    "light italic": (300, "italic"),
    "italic": (400, "italic"),
    "medium italic": (500, "italic"),
    "bold italic": (700, "italic"),
}
RAW_FILE_MAP = {
    "color_primitives": "Color Primitives.Mode 1.tokens.json",
    "color_light": "Color Styles.Mode: Light.tokens.json",
    "color_dark": "Color Styles.Mode: Dark.tokens.json",
    "effects": "Effects.Mode 1.tokens.json",
    "effect_styles": "effect.styles.tokens.json",
    "icon_light": "Icon.Mode: Light.tokens.json",
    "icon_dark": "Icon.Mode: Dark.tokens.json",
    "radius": "Radius.Mode 1.tokens.json",
    "responsive": "Responsive.Mode 1.tokens.json",
    "spacing": "Spacings.Mode 1.tokens.json",
    "typography_primitives": "Typography Primitives.Mode 1.tokens.json",
    "typography_styles": "text.styles.tokens.json",
    "grid_styles": "grid.styles.tokens.json",
    "animation": "Animation.Mode 1.tokens.json",
    "manifest": "manifest.json",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate raw Figma token export and build runtime-friendly normalized tokens."
    )
    parser.add_argument(
        "--tokens-dir",
        default="design-tokens",
        help="Path to the raw design-tokens directory. Defaults to ./design-tokens",
    )
    return parser.parse_args()


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def walk_tokens(node: Any, path: tuple[str, ...] = ()) -> list[tuple[tuple[str, ...], dict[str, Any]]]:
    found: list[tuple[tuple[str, ...], dict[str, Any]]] = []
    if isinstance(node, dict):
        if "$type" in node and "$value" in node:
            found.append((path, node))
        else:
            for key, value in node.items():
                found.extend(walk_tokens(value, path + (key,)))
    elif isinstance(node, list):
        for index, item in enumerate(node):
            found.extend(walk_tokens(item, path + (str(index),)))
    return found


def normalize_key(name: str) -> str:
    normalized = name.strip().lower().replace("&", "and")
    normalized = normalized.replace("/", "-").replace(" ", "-").replace("_", "-")
    normalized = normalized.replace(":", "")
    normalized = re.sub(r"[^a-z0-9-]+", "-", normalized)
    normalized = re.sub(r"-{2,}", "-", normalized).strip("-")
    return normalized


def normalize_tree_keys(value: Any) -> Any:
    if isinstance(value, dict):
        return {normalize_key(key): normalize_tree_keys(item) for key, item in value.items()}
    if isinstance(value, list):
        return [normalize_tree_keys(item) for item in value]
    return value


class TokenBuilder:
    def __init__(self, tokens_dir: Path) -> None:
        self.tokens_dir = tokens_dir
        self.output_dir = tokens_dir / "normalized"
        self.raw_files = {
            key: tokens_dir / file_name for key, file_name in RAW_FILE_MAP.items()
        }
        self.documents = {
            key: load_json(path) for key, path in self.raw_files.items() if path.exists()
        }
        self.token_index: dict[str, dict[str, Any]] = {}
        self.token_source: dict[str, str] = {}
        self.ref_cache: dict[str, Any] = {}
        self.warnings: list[str] = []
        self.errors: list[str] = []
        self.stats: dict[str, int] = {"rawTokenCount": 0, "resolvedReferenceCount": 0}
        self._build_index()

    def _build_index(self) -> None:
        for key, document in self.documents.items():
            source_name = self.raw_files[key].name
            for path, token in walk_tokens(document):
                dotted_path = ".".join(path)
                self.token_index[dotted_path] = token
                self.token_source[dotted_path] = source_name
                self.stats["rawTokenCount"] += 1

    def ref_candidates(self, ref: str) -> list[str]:
        parts = ref.split(".")
        per_part_options: list[list[str]] = []
        for part in parts:
            variants = [part]
            variants.append(part.replace(" ", "_"))
            variants.append(part.replace("_", " "))
            unique = list(dict.fromkeys(variant for variant in variants if variant))
            per_part_options.append(unique)
        candidates = [".".join(candidate_parts) for candidate_parts in product(*per_part_options)]
        return list(dict.fromkeys(candidates))

    def resolve_reference(self, ref: str, trail: tuple[str, ...] = ()) -> Any:
        if ref in trail:
            chain = " -> ".join(trail + (ref,))
            raise ValueError(f"Circular token reference detected: {chain}")
        if ref in self.ref_cache:
            return self.ref_cache[ref]

        token_path = None
        for candidate in self.ref_candidates(ref):
            if candidate in self.token_index:
                token_path = candidate
                break

        if token_path is None:
            raise KeyError(f"Unknown token reference: {ref}")

        token = self.token_index[token_path]
        self.stats["resolvedReferenceCount"] += 1
        resolved = self.resolve_value(token["$value"], trail + (token_path,))
        self.ref_cache[ref] = resolved
        return resolved

    def resolve_value(self, value: Any, trail: tuple[str, ...] = ()) -> Any:
        if isinstance(value, str):
            match = REFERENCE_RE.match(value)
            if match:
                ref = match.group(1)
                return self.resolve_reference(ref, trail)
            return value
        if isinstance(value, dict):
            return {key: self.resolve_value(item, trail) for key, item in value.items()}
        if isinstance(value, list):
            return [self.resolve_value(item, trail) for item in value]
        return value

    def collapse_tokens(self, value: Any, trail: tuple[str, ...] = ()) -> Any:
        if isinstance(value, dict):
            if "$type" in value and "$value" in value:
                resolved = self.resolve_value(value["$value"], trail)
                return self.collapse_tokens(resolved, trail)
            return {
                key: self.collapse_tokens(item, trail + (key,))
                for key, item in value.items()
            }
        if isinstance(value, list):
            return [self.collapse_tokens(item, trail) for item in value]
        return self.resolve_value(value, trail)

    def warn(self, message: str) -> None:
        if message not in self.warnings:
            self.warnings.append(message)

    def normalize_duration(self, raw_value: Any, token_path: str) -> Any:
        if not isinstance(raw_value, str):
            return raw_value
        match = re.fullmatch(r"(-?\d+(?:\.\d+)?)px", raw_value.strip())
        if not match:
            return raw_value
        number = match.group(1)
        normalized = f"{number}ms"
        self.warn(
            "Animation timing tokens are exported as px by the Figma plugin; runtime output normalizes them to ms."
        )
        return normalized

    def normalize_curve(self, raw_value: Any) -> Any:
        if not isinstance(raw_value, str):
            return raw_value
        return CURVE_MAP.get(raw_value.strip().lower(), raw_value)

    def normalize_letter_spacing(self, raw_value: Any, token_path: str) -> Any:
        if not isinstance(raw_value, str):
            return raw_value
        if raw_value == "0%":
            return "0"
        if raw_value.endswith("%"):
            self.warn(
                f"{token_path}: non-zero percentage letterSpacing is preserved as-is; convert manually if CSS output needs absolute units."
            )
        return raw_value

    def normalize_weight_value(self, raw_value: Any, token_path: str) -> dict[str, Any]:
        if isinstance(raw_value, int):
            return {"fontWeight": raw_value, "fontStyle": "normal", "source": raw_value}
        if isinstance(raw_value, str):
            compact = raw_value.replace("-", " ").strip().lower()
            if compact in FONT_WEIGHT_MAP:
                font_weight, font_style = FONT_WEIGHT_MAP[compact]
                self.warn(
                    "Typography weight labels are normalized to numeric fontWeight and explicit fontStyle in runtime output."
                )
                return {
                    "fontWeight": font_weight,
                    "fontStyle": font_style,
                    "source": raw_value,
                }
            if raw_value.isdigit():
                return {
                    "fontWeight": int(raw_value),
                    "fontStyle": "normal",
                    "source": raw_value,
                }
        self.warn(f"{token_path}: unsupported font weight value {raw_value!r}; kept as-is.")
        return {"fontWeight": raw_value, "fontStyle": "normal", "source": raw_value}

    def normalize_motion_node(self, value: Any, path: tuple[str, ...] = ()) -> Any:
        if isinstance(value, dict):
            normalized: dict[str, Any] = {}
            for key, item in value.items():
                normalized_key = normalize_key(key)
                token_path = ".".join(path + (key,))
                if isinstance(item, dict):
                    normalized[normalized_key] = self.normalize_motion_node(item, path + (key,))
                elif normalized_key in DURATION_KEYS:
                    normalized[normalized_key] = self.normalize_duration(item, token_path)
                elif normalized_key == "curve":
                    normalized[normalized_key] = self.normalize_curve(item)
                else:
                    normalized[normalized_key] = item
            return normalized
        if isinstance(value, list):
            return [self.normalize_motion_node(item, path) for item in value]
        return value

    def normalize_typography_styles(self) -> dict[str, Any]:
        raw_styles = self.documents["typography_styles"]
        resolved_styles = self.collapse_tokens(raw_styles)
        normalized_styles: dict[str, Any] = {}

        for style_name, variants in resolved_styles.items():
            style_key = normalize_key(style_name)
            normalized_styles[style_key] = {}
            for variant_name, typography in variants.items():
                variant_key = normalize_key(variant_name)
                token_path = f"text.styles.{style_name}.{variant_name}"
                weight_info = self.normalize_weight_value(
                    typography["fontWeight"], f"{token_path}.fontWeight"
                )
                normalized_variant = {
                    "fontFamily": typography["fontFamily"],
                    "fontSize": typography["fontSize"],
                    "fontWeight": weight_info["fontWeight"],
                    "fontStyle": weight_info["fontStyle"],
                    "lineHeight": typography["lineHeight"],
                    "letterSpacing": self.normalize_letter_spacing(
                        typography["letterSpacing"], f"{token_path}.letterSpacing"
                    ),
                    "textTransform": typography["textTransform"],
                    "textDecoration": typography["textDecoration"],
                }
                if weight_info["source"] != weight_info["fontWeight"]:
                    normalized_variant["fontWeightToken"] = weight_info["source"]
                normalized_styles[style_key][variant_key] = normalized_variant
        return normalized_styles

    def normalize_font_primitives(self) -> dict[str, Any]:
        raw_primitives = self.documents["typography_primitives"]
        resolved = self.collapse_tokens(raw_primitives)
        font_families = normalize_tree_keys(resolved["font-family"])
        font_sizes = normalize_tree_keys(resolved["font-size"])
        line_heights = normalize_tree_keys(resolved["line-height"])
        font_weights: dict[str, Any] = {}

        for raw_name, raw_value in resolved["font-weight"].items():
            key = normalize_key(raw_name)
            info = self.normalize_weight_value(raw_value, f"font-weight.{raw_name}")
            font_weights[key] = {
                "fontWeight": info["fontWeight"],
                "fontStyle": info["fontStyle"],
                "source": info["source"],
            }

        return {
            "family": font_families,
            "weight": font_weights,
            "size": font_sizes,
            "lineHeight": line_heights,
        }

    def build_runtime_tokens(self) -> dict[str, Any]:
        raw_shadow = self.collapse_tokens(self.documents["effect_styles"])
        normalized_shadow = {
            normalize_key(name): value for name, value in raw_shadow.items()
        }
        raw_grid = self.collapse_tokens(self.documents["grid_styles"])
        normalized_grid = {
            normalize_key(name): value for name, value in raw_grid.items()
        }
        runtime = {
            "meta": {
                "format": "rshbins-runtime-tokens",
                "source": "raw Figma plugin export",
                "notes": [
                    "Raw export remains the source artifact.",
                    "This file resolves references and normalizes values for runtime usage.",
                ],
            },
            "primitive": {
                "color": normalize_tree_keys(self.collapse_tokens(self.documents["color_primitives"])),
                "radius": normalize_tree_keys(self.collapse_tokens(self.documents["radius"])),
                "space": normalize_tree_keys(self.collapse_tokens(self.documents["spacing"])),
                "breakpoint": normalize_tree_keys(self.collapse_tokens(self.documents["responsive"])),
                "font": self.normalize_font_primitives(),
            },
            "semantic": {
                "color": {
                    "light": normalize_tree_keys(self.collapse_tokens(self.documents["color_light"])),
                    "dark": normalize_tree_keys(self.collapse_tokens(self.documents["color_dark"])),
                },
                "icon": {
                    "light": normalize_tree_keys(self.collapse_tokens(self.documents["icon_light"])),
                    "dark": normalize_tree_keys(self.collapse_tokens(self.documents["icon_dark"])),
                },
                "typography": self.normalize_typography_styles(),
                "shadow": normalized_shadow,
                "grid": normalized_grid,
                "motion": self.normalize_motion_node(self.collapse_tokens(self.documents["animation"])),
            },
        }
        return runtime

    def build_validation_report(self) -> dict[str, Any]:
        return {
            "errors": self.errors,
            "warnings": self.warnings,
            "stats": self.stats,
            "checkedFiles": sorted(path.name for path in self.raw_files.values() if path.exists()),
        }

    def validate(self) -> None:
        for token_path, token in self.token_index.items():
            try:
                self.resolve_value(token["$value"], (token_path,))
            except Exception as exc:  # noqa: BLE001
                self.errors.append(f"{token_path}: {exc}")

        if not any("$description" in token for token in self.token_index.values()):
            self.warn(
                "Raw export does not include token descriptions. This is fine for now, but documentation and tooling will be easier with descriptions in a curated layer."
            )

    def write_outputs(self) -> None:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        runtime_tokens = self.build_runtime_tokens()
        validation_report = self.build_validation_report()
        runtime_path = self.output_dir / "runtime.tokens.json"
        validation_path = self.output_dir / "validation-report.json"
        runtime_path.write_text(
            json.dumps(runtime_tokens, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        validation_path.write_text(
            json.dumps(validation_report, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )


def main() -> int:
    args = parse_args()
    tokens_dir = Path(args.tokens_dir).resolve()
    if not tokens_dir.exists():
        raise SystemExit(f"[ERROR] Tokens directory not found: {tokens_dir}")

    builder = TokenBuilder(tokens_dir)
    builder.validate()
    builder.write_outputs()

    if builder.errors:
        print("[ERROR] Runtime tokens were generated with validation errors:")
        for issue in builder.errors:
            print(f"- {issue}")
        return 1

    print("[OK] Runtime tokens generated")
    print(f"     {builder.output_dir / 'runtime.tokens.json'}")
    print(f"     {builder.output_dir / 'validation-report.json'}")
    if builder.warnings:
        print("[WARN] Normalization warnings:")
        for warning in builder.warnings:
            print(f"- {warning}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
