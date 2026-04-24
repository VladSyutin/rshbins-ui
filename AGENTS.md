# RSHBINS UI Agent Rules

## Project Snapshot

- Stack: Vite + React 19 + TypeScript + Sass + Storybook.
- This repository currently behaves like a UI kit / foundations workspace, not an app shell.
- Storybook is the primary visual contract for validating design-system work before broader integration.

## Source of Truth

- Raw Figma token exports live in `design-tokens/*.tokens.json`.
- Runtime-friendly normalized tokens are generated into `design-tokens/normalized/runtime.tokens.json`.
- CSS variables are generated into `src/styles/tokens.css`.
- IMPORTANT: Do not manually edit generated files:
  - `design-tokens/normalized/runtime.tokens.json`
  - `design-tokens/normalized/validation-report.json`
  - `src/styles/tokens.css`
- When token inputs change, regenerate with `npm run tokens:build`.

## Framework And Styling Rules

- Implement UI in React + TypeScript only.
- Use colocated `.scss` files for component styling. This project does not use Tailwind, CSS Modules, or styled-components.
- Import component styles directly from the component entry file, following the existing pattern:

```tsx
import './FoundationsPreview.scss';
```

- Keep global styling concerns in `src/styles/global.scss`.
- Use `type` imports when importing TypeScript-only symbols.
- Prefer named function exports for components:

```tsx
export function ComponentName() {
  return <div />;
}
```

## Component Organization

- Put reusable UI components under `src/components/`.
- Follow the existing folder convention:
  - folder name in kebab-case
  - component file in PascalCase
  - colocated story file in PascalCase with `.stories.tsx`
  - colocated stylesheet in PascalCase with `.scss`
- Preferred structure for new reusable components:

```text
src/components/component-name/
  ComponentName.tsx
  ComponentName.scss
  ComponentName.stories.tsx
```

- Reuse and extend existing components before creating parallel variants.
- Keep components presentational unless the task explicitly requires behavior or data wiring.

## Token Usage Rules

- IMPORTANT: Never hardcode brand colors, semantic colors, radii, shadows, spacing, or typography values when a project token already exists.
- Use semantic CSS variables for UI surfaces whenever possible, for example:
  - `--color-background-default-primary`
  - `--color-text-default-primary`
  - `--color-border-default-default`
  - `--shadow-flyout`
- Use primitive tokens only when working on the token/foundation layer itself.
- Typography should come from generated typography variables, not ad hoc font declarations.
- The default font baseline is wired through tokens and Ubuntu font files loaded in Storybook preview.
- Prefer CSS custom properties in SCSS for static component styles.
- Use `cssVar()` from `src/theme/runtimeTokens.ts` only when values must be composed dynamically in TSX.
- Reserve inline `style={...}` objects for token-driven dynamic presentation cases, such as previews, token demos, or runtime-selected typography variants.

## Theme Rules

- Components must be theme-aware through semantic tokens, not through hardcoded light/dark overrides.
- The theme switcher works via `.theme-light` and `.theme-dark` classes in Storybook.
- IMPORTANT: Any component added to the library must render correctly in both light and dark themes without changing component logic.

## Responsive Rules

- Responsive behavior should be simple and deliberate.
- Breakpoint source of truth is the runtime token set generated from `design-tokens/`.
- When authoring media queries, align them with the canonical breakpoint values already exported by the token pipeline.
- Follow the existing responsive style approach in SCSS rather than introducing JS-driven layout logic unless explicitly required.

## Storybook Rules

- Add or update a Storybook story for every new reusable component or notable variant.
- Use the existing Storybook typing pattern with `Meta` and `StoryObj` from `@storybook/react-vite`.
- Prefer stories that validate:
  - default state
  - major variants
  - theme behavior when relevant
- Treat Storybook as the first place to visually verify Figma parity.

## Import And Code Style Rules

- Use relative imports consistent with the current codebase. Do not introduce path aliases unless the project is explicitly reconfigured for them.
- Keep code strict-TypeScript compatible.
- Keep prop APIs small and explicit.
- Avoid speculative abstractions. Build the simplest component that matches the design and current library maturity.
- Keep markup and class naming readable; the current style favors a BEM-like pattern such as `component-name__element` and `component-name--modifier`.

## Icon And Asset Rules

- Shared icons live in the root `icons/` directory as kebab-case `.svg` files.
- IMPORTANT: Do not install a new icon package for Figma implementation work.
- If Figma provides a reusable SVG icon that belongs in the library, store it in `icons/` using the existing naming convention.
- If the Figma MCP payload includes a localhost asset URL, use that asset instead of inventing placeholders.
- Avoid adding persistent raster assets unless the design actually requires them.

## Figma MCP Workflow

These steps are mandatory for every Figma-driven implementation.

1. Run `get_design_context` for the exact node you are implementing.
2. If the payload is too large, run `get_metadata` and then re-fetch only the needed node(s) with `get_design_context`.
3. Run `get_screenshot` for the same node/variant.
4. Translate the returned implementation into this project's conventions:
   - React + TypeScript
   - colocated Sass
   - semantic CSS variables
   - existing component and story structure
5. Reuse existing components, tokens, and icon assets before creating new ones.
6. Validate visually against the Figma screenshot in Storybook before considering the work complete.

## Figma Translation Rules

- Treat Figma MCP code output as a structural reference, not production-ready project code.
- IMPORTANT: Replace any Tailwind-style output or inline-heavy output with project-native TSX + SCSS.
- Do not paste raw Figma-generated utility classes into this repository.
- Map Figma colors, typography, spacing, radii, and effects to the generated token system first.
- Preserve the design faithfully, but express it through this repository's token and styling architecture.
- Prefer semantic tokens over raw hex values even when the Figma payload exposes raw color values.

## Token Pipeline Rules

- If a task changes the design token source files, update generated artifacts through the provided scripts instead of hand-editing outputs.
- The relevant scripts are:
  - `scripts/design_tokens/build_runtime_tokens.py`
  - `scripts/design_tokens/export_css_variables.py`
- `src/theme/runtimeTokens.ts` is the runtime bridge for token consumption in TSX.
- `src/styles/global.scss` is responsible for loading generated tokens and defining global surface variables.

## Validation Checklist

Before finishing any design-system or Figma task, verify the following:

- `npm run typecheck` passes.
- If tokens changed, `npm run tokens:build` was run and generated files were updated intentionally.
- The component has a Storybook story when it is reusable UI.
- Styling uses project tokens instead of hardcoded design values.
- Light and dark themes both render correctly when applicable.
- No new icon dependency was added.

## What To Avoid

- Do not introduce Tailwind.
- Do not introduce CSS Modules.
- Do not introduce styled-components or other parallel styling systems.
- Do not manually edit generated token artifacts.
- Do not hardcode design values that already exist as tokens.
- Do not skip Storybook verification for reusable UI.
