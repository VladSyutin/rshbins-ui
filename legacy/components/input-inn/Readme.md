## Legacy InputInn

React 17-compatible delivery of the INN field for FOS integration.

### Files

- `InputInn.jsx` — component implementation
- `styles.css` — component styles with shared legacy InputText import
- `index.js` — default export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Depends on `legacy/components/input-text/` and reuses its floating-label behavior.
- Accepts only digits, trims to `12` characters and validates `10` or `12` digits after blur.

### Example

```jsx
import React from 'react';
import InputInn from './index';

export default function Example() {
  return <InputInn label="ИНН" />;
}
```
