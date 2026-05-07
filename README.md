# RSHBINS UI

React + TypeScript + Sass UI kit with Storybook as the primary visual contract. The repository contains two parallel delivery layers: a modern component library in `src/` and a React 17-compatible legacy layer in `legacy/` for integration with legacy stacks.

## Repository structure

```
src/
  components/     modern UI kit components (React + TypeScript + Sass)
  dialogs/        scenario templates: modals/, toasts/, cookies/
  templates/      reusable auth compositions
  prototypes/     experimental auth-flow screen prototypes
  styles/         global styles, tokens.css (generated)
  theme/          runtime token data and theme utilities
legacy/
  components/     React 17-compatible delivery components (plain CSS)
  tokens/         (removed — legacy components now use shared design tokens directly)
design-tokens/    Figma raw export and normalized runtime artifacts
icons/            shared SVG icon library
scripts/
  design_tokens/  token build pipeline
.storybook/       Storybook configuration (Modern/* and Legacy/* roots)
```

## Tech stack

| Layer | Stack |
|---|---|
| Modern | React 19, TypeScript, Sass, Vite |
| Legacy | React 17-compatible JSX, plain CSS, CommonJS-friendly entrypoints |
| Stories | Storybook 8 |
| Tokens | Figma export → Python build pipeline → CSS custom properties |

## Getting started

```bash
npm install
npm run storybook
```

Storybook runs the token build before startup so generated token artifacts stay in sync with the source files.

## Available scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build the project
- `npm run tokens:build` — rebuild normalized runtime tokens and CSS variables from source
- `npm run storybook` — start Storybook on port 6006
- `npm run build-storybook` — build static Storybook output
- `npm run typecheck` — TypeScript type checking

## Design token pipeline

Source → Build → Output. Never edit outputs by hand.

```
design-tokens/*.tokens.json          ← edit here (or re-export from Figma)
  ↓  scripts/design_tokens/build_runtime_tokens.py
design-tokens/normalized/runtime.tokens.json
  ↓  scripts/design_tokens/export_css_variables.py
src/styles/tokens.css                ← consumed by all components
```

Run `npm run tokens:build` after any change to source token files.

### Token naming conventions

- `--color-*` — semantic color tokens
- `--space-paddings-inside-*` / `--space-margins-inside-*` — 2XS(4px)…2XL(32px)
- `--space-margins-outside-*` — 3XL(40px)…10XL(96px), continues the inside scale
- `--radius-*` — border radius
- `--typography-*` — font family, size, weight, line-height
- `--motion-*` — animation duration and easing
- `--shadow-*` — box shadows

## Components

### Modern (`src/components/`)

button, calendar, checkbox, cookies, divider, gender, gender-item, header, input-birth-date, input-captcha, input-code, input-code-item, input-email, input-inn, input-login, input-middle-name, input-name, input-password, input-phone, input-surname, input-text, loader-brand, logo, modal, radio, radio-group, segment, segmented-control, spin, switch, tab, tabs, theme, toast

### Legacy (`legacy/components/`)

button, calendar, input-text, loader-brand, modal, toast

Legacy components are React 17-compatible, use plain CSS, and share the same design tokens as modern components (`src/styles/tokens.css`).

## Contribution rules

- Keep reusable UI under `src/components/`
- Use React + TypeScript + colocated `.scss` styles
- Reuse existing components and tokens before adding new variants
- Use design token CSS variables — avoid hardcoded design values in spacing, color, typography, animation
- Component-internal geometry (asymmetric paddings, icon sizes, hit-zone sizes) may be hardcoded
- Template and page-level spacing must use tokens
- Add or update Storybook stories for all reusable UI changes
- Run `npm run typecheck` before opening a pull request

Detailed conventions live in `AGENTS.md`.

## Legacy layer notes

Legacy components target React 17 / Webpack 3 environments. Key constraints:

- No TypeScript source — compiled JSX with `.d.ts` entrypoints
- No CSS modules — plain scoped CSS with BEM-like class names
- No `color-mix()`, `useId()`, or other modern browser/React APIs
- SVG icons inlined as JSX components (no `?url` imports)
- Animation timing constants hardcoded in JS (no `runtimeTokens` import)
- Design tokens consumed directly from `src/styles/tokens.css` — same token names as modern components

## Repository notes

- Internal project memory and local assistant artifacts are intentionally not part of the public repository
- `package.json` is marked `"private": true` to prevent accidental npm publication
