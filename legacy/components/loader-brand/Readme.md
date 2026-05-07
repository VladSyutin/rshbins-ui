## Legacy LoaderBrand

React 17-compatible delivery of the animated brand loader for FOS integration.

### Files

- `LoaderBrand.jsx` — component implementation
- `styles.css` — loader styles
- `index.js` — default export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- Animation timing is hardcoded as JS constants matching the design token values (logo: 200ms, text: 300ms/5000ms).
- `logoStep` and `textStep` are optional overrides for static/preview rendering; omit both for the default autoPlay animation.
- `autoPlay={false}` with explicit `logoStep`/`textStep` is useful for Storybook matrix stories.

### Example

```jsx
import React from 'react';
import LoaderBrand from './index';

export default function Example() {
  return <LoaderBrand />;
}
```
