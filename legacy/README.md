# Legacy UI Delivery

`legacy/` is the compatibility layer for teams integrating UI pieces into the FOS legacy stack.

## Purpose

- Keep `src/` as the modern Storybook-first implementation layer.
- Keep `legacy/` as the copy-friendly React 17-compatible delivery layer.
- Avoid forcing FOS developers to adapt React 19, TypeScript, Sass, and Storybook-specific details by hand.
- Match the existing FOS delivery shape where practical: `Component.jsx`, `styles.css`, `index.js`, and a local `Readme.md`.

## Planned Structure

```text
legacy/
  components/
  tokens/
  LegacySetup.stories.tsx
```

## Rules

- Do not import legacy components from `src/components` at runtime.
- Legacy components should stay compatible with React 17.
- Avoid React 18/19-only APIs such as `useId`.
- Prefer plain `.jsx` component sources for the delivered legacy layer.
- Prefer plain `.css` delivery for legacy component styles. Do not depend on Sass in the copied files.
- Keep dependencies explicit and minimal.
- Avoid `.module.css` unless a component genuinely needs local name isolation and the FOS team confirms that pattern is acceptable.
- Keep exports simple and familiar for the FOS stack, ideally through a local `index.js`.
- Add a Storybook story for each legacy component so it can be reviewed alongside the modern version.
- Treat Storybook as a review surface only. Final compatibility is defined by whether the files can be copied into the Webpack 3 / Babel legacy environment with minimal edits.

## Workflow

1. Build or update the modern component in `src/components`.
2. Create an adapted legacy counterpart in `legacy/components`.
3. Verify the legacy version in this Storybook under the `Legacy/*` section.
4. Document copy/paste requirements and external dependencies next to the component when needed.
