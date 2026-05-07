## Legacy InputCode

React 17-compatible delivery of the single-field verification code input for FOS integration.

### Files

- `InputCode.jsx` — component implementation
- `styles.css` — component styles with shared legacy InputText import
- `index.js` — default export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Reuses the legacy floating-label input layout and keeps the same preview-state matrix as `InputText`.
- Accepts only digits, limits input to `4` characters, shows mask `0000` while focused/entered and validates required value after blur.
- Browser suggestions are disabled by default to match the modern component behavior.

### Example

```jsx
import React from 'react';
import InputCode from './index';

export default function Example() {
  return <InputCode label="Проверочный код" />;
}
```
