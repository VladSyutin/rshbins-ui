#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


HEADER = """/* This file is auto-generated. Do not edit manually.
   Source: design-tokens/normalized/runtime.tokens.json
   Builder: scripts/design_tokens/export_css_variables.py */
"""


def normalize_bool(value: bool) -> str:
    return "1" if value else "0"


def css_value(value: Any) -> str:
    if isinstance(value, bool):
        return normalize_bool(value)
    if isinstance(value, (int, float)):
        return str(value)
    return str(value)


def css_var_name(parts: tuple[str, ...]) -> str:
    return "--" + "-".join(parts)


def flatten_dict(node: Any, prefix: tuple[str, ...] = ()) -> list[tuple[tuple[str, ...], Any]]:
    items: list[tuple[tuple[str, ...], Any]] = []
    if isinstance(node, dict):
        for key, value in node.items():
            items.extend(flatten_dict(value, prefix + (key,)))
        return items
    items.append((prefix, node))
    return items


def typography_variables(typography: dict[str, Any]) -> list[tuple[str, str]]:
    variables: list[tuple[str, str]] = []
    for style_name, variants in typography.items():
        for variant_name, definition in variants.items():
            prefix = ("typography", style_name, variant_name)
            for property_name, value in definition.items():
                variables.append((css_var_name(prefix + (property_name,)), css_value(value)))
    return variables


def shadow_variables(shadows: dict[str, Any]) -> list[tuple[str, str]]:
    variables: list[tuple[str, str]] = []
    for shadow_name, layers in shadows.items():
        shadow_value = ", ".join(
            f"{layer['offsetX']} {layer['offsetY']} {layer['blur']} {layer['spread']} {layer['color']}"
            for layer in layers
        )
        variables.append((css_var_name(("shadow", shadow_name)), shadow_value))
    return variables


def motion_variables(motion: dict[str, Any]) -> list[tuple[str, str]]:
    variables: list[tuple[str, str]] = []
    for path, value in flatten_dict(motion, ("motion",)):
        variables.append((css_var_name(path), css_value(value)))
    return variables


def primitive_variables(runtime_tokens: dict[str, Any]) -> list[tuple[str, str]]:
    variables: list[tuple[str, str]] = []
    primitives = runtime_tokens["primitive"]
    for path, value in flatten_dict(primitives["color"], ("primitive", "color")):
        variables.append((css_var_name(path), css_value(value)))
    for path, value in flatten_dict(primitives["radius"], ("radius",)):
        variables.append((css_var_name(path), css_value(value)))
    for path, value in flatten_dict(primitives["space"], ("space",)):
        variables.append((css_var_name(path), css_value(value)))
    for path, value in flatten_dict(primitives["breakpoint"], ("breakpoint",)):
        variables.append((css_var_name(path), css_value(value)))
    for path, value in flatten_dict(primitives["font"]["family"], ("font", "family")):
        variables.append((css_var_name(path), css_value(value)))
    for weight_name, properties in primitives["font"]["weight"].items():
        for property_name, value in properties.items():
            variables.append(
                (css_var_name(("font", "weight", weight_name, property_name)), css_value(value))
            )
    for path, value in flatten_dict(primitives["font"]["size"], ("font", "size")):
        variables.append((css_var_name(path), css_value(value)))
    for path, value in flatten_dict(primitives["font"]["lineHeight"], ("font", "line-height")):
        variables.append((css_var_name(path), css_value(value)))
    return variables


def semantic_theme_variables(theme_name: str, runtime_tokens: dict[str, Any]) -> list[tuple[str, str]]:
    variables: list[tuple[str, str]] = []
    colors = runtime_tokens["semantic"]["color"][theme_name]
    for path, value in flatten_dict(colors, ("color",)):
        variables.append((css_var_name(path), css_value(value)))
    icons = runtime_tokens["semantic"]["icon"][theme_name]
    for path, value in flatten_dict(icons, ("icon",)):
        variables.append((css_var_name(path), css_value(value)))
    return variables


def common_semantic_variables(runtime_tokens: dict[str, Any]) -> list[tuple[str, str]]:
    variables: list[tuple[str, str]] = []
    variables.extend(typography_variables(runtime_tokens["semantic"]["typography"]))
    variables.extend(shadow_variables(runtime_tokens["semantic"]["shadow"]))
    variables.extend(motion_variables(runtime_tokens["semantic"]["motion"]))
    return variables


def render_block(selector: str, variables: list[tuple[str, str]]) -> str:
    lines = [f"{selector} {{"]
    for name, value in variables:
        lines.append(f"  {name}: {value};")
    lines.append("}")
    return "\n".join(lines)


def main() -> int:
    repo_root = Path(__file__).resolve().parents[2]
    runtime_path = repo_root / "design-tokens" / "normalized" / "runtime.tokens.json"
    output_path = repo_root / "src" / "styles" / "tokens.css"
    runtime_tokens = json.loads(runtime_path.read_text(encoding="utf-8"))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    blocks = [
        HEADER.rstrip(),
        render_block(":root", primitive_variables(runtime_tokens) + common_semantic_variables(runtime_tokens)),
        render_block(":root, .theme-light", semantic_theme_variables("light", runtime_tokens)),
        render_block(".theme-dark", semantic_theme_variables("dark", runtime_tokens)),
    ]
    output_path.write_text("\n\n".join(blocks) + "\n", encoding="utf-8")

    print(f"[OK] CSS variables exported to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
