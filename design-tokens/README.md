# Design Tokens Workflow

This directory now contains two layers:

- `*.tokens.json`: raw export from Figma plugins. Keep these files close to the design source.
- `normalized/`: generated runtime-friendly tokens derived from the raw export.

## Why there is a normalized layer

The raw Figma export is good as a source artifact, but it is not ideal for direct use in code:

- effect/style references may need validation;
- typography weights come through as design labels like `Regular` or `Italic`;
- animation timing values may be exported as `dimension` tokens with `px` units;
- file names and token names are optimized for Figma, not for runtime consumption.

## Build normalized tokens

Run:

```bash
python3 scripts/design_tokens/build_runtime_tokens.py
```

The script writes:

- `normalized/runtime.tokens.json`: resolved and normalized runtime tokens for code and Storybook.
- `normalized/validation-report.json`: validation summary and warnings for the raw export.

## Recommended workflow

1. Re-export raw tokens from Figma into this directory.
2. Run `python3 scripts/design_tokens/build_runtime_tokens.py`.
3. Use files from `normalized/` in the UI kit runtime layer.
4. If validation shows errors, fix the raw export or add a deliberate normalization rule in the builder.
