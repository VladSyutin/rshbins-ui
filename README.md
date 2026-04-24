# RSHBINS UI

RSHBINS UI is a React + TypeScript + Sass UI kit workspace with Storybook as the primary visual contract.

## What is in this repository

- `src/` — reusable UI components, dialogs, templates, and stories
- `design-tokens/` — raw Figma token exports and normalized token artifacts
- `icons/` — shared SVG icon library
- `.storybook/` — Storybook configuration
- `scripts/design_tokens/` — token build scripts

## Tech stack

- Vite
- React 19
- TypeScript
- Sass
- Storybook

## Getting started

```bash
npm install
npm run storybook
```

Storybook runs the token build before startup, so generated token artifacts stay in sync with the source token files.

## Available scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build the project
- `npm run tokens:build` — rebuild normalized runtime tokens and CSS variables
- `npm run storybook` — start Storybook on port `6006`
- `npm run build-storybook` — build static Storybook output
- `npm run typecheck` — run TypeScript type checking

## Design token workflow

- Source token files live in `design-tokens/*.tokens.json`
- Generated files are committed intentionally and must not be edited by hand:
  - `design-tokens/normalized/runtime.tokens.json`
  - `design-tokens/normalized/validation-report.json`
  - `src/styles/tokens.css`
- After changing token sources, run `npm run tokens:build`

## Contribution rules

- Keep reusable UI under `src/components/`
- Use React + TypeScript + colocated `.scss` styles
- Reuse existing components and tokens before adding new variants
- Prefer semantic token variables over hardcoded design values
- Add or update Storybook stories for reusable UI changes
- Run `npm run typecheck` before opening a pull request

Detailed repository conventions live in `AGENTS.md`.

## Repository notes

- Internal project memory and local assistant artifacts are intentionally not part of the public repository
- `package.json` is currently marked with `"private": true`, which prevents accidental npm publication but does not affect GitHub publishing
