## Legacy Switch

React 17-compatible delivery of the binary switch control for FOS integration.

### Files

- `Switch.jsx` — component implementation
- `styles.css` — switch styles
- `index.js` — default export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Implemented as native `input[type='checkbox']` with `role='switch'`.
- Supports `checked`/`defaultChecked`, `disabled`, `label` and Storybook-only `previewState`.
- Does not depend on React 18/19 APIs, Sass or Storybook runtime.

### Example

```jsx
import React from 'react';
import Switch from './index';

export default function Example() {
  return <Switch label="Контент" defaultChecked={false} />;
}
```
