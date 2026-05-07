## Legacy Toast

React 17-compatible delivery of the toast notification for FOS integration.

### Files

- `Toast.jsx` — component implementation
- `styles.css` — toast styles
- `index.js` — default export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- Status and close icons are rendered as inline SVGs — no external icon files required.
- `autoCloseDuration` defaults to 5000ms; pass `null` to disable auto-close.
- `placement="top-center"` renders the toast as `position: fixed` — wrap in a portal in the consuming app.
- `previewState` overrides computed state for static/Storybook rendering.
- Close button hover uses `rgba(255,255,255,0.12/0.20)` instead of `color-mix` for broader browser support.

### Example

```jsx
import React from 'react';
import Toast from './index';

export default function Example() {
  return (
    <Toast variant="success" onClose={() => console.log('closed')}>
      Операция выполнена успешно
    </Toast>
  );
}
```
