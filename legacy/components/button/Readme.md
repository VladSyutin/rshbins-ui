## Legacy Button

React 17-compatible delivery of the button component for FOS integration.

### Files

- `Button.jsx` — component implementation
- `styles.css` — button styles
- `index.js` — default export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- `loading`, `selected`, `iconOnly`, `leadingIcon`, and `trailingIcon` mirror the modern button behavior.

### Example

```jsx
import React from 'react';
import Button from './index';

export default function Example() {
  return (
    <Button variant="brand" size="m">
      Продолжить
    </Button>
  );
}
```
