# Legacy Components

This folder stores React 17-compatible component deliveries intended for FOS integration.

Each component folder should be self-contained and easy to copy:

```text
legacy/components/component-name/
  ComponentName.jsx
  styles.css
  index.js
  Readme.md
  ComponentName.stories.tsx
```

If a component needs helper files, keep them inside the same component folder unless the helpers are clearly shared across multiple legacy components.

Recommended conventions based on the sample FOS UI repository:

- class component or function component is both acceptable, but keep the implementation React 17-safe
- default export through `index.js` is preferred for copy/paste familiarity
- use plain CSS selectors with stable class names
- keep README examples close to the actual integration shape
