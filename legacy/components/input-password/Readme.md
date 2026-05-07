## Legacy InputPassword

React 17-compatible delivery of the password field for FOS integration.

### Files

- `InputPassword.jsx` — component implementation
- `styles.css` — component styles with shared legacy InputText import
- `index.js` — default export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Reuses the legacy floating-label text-field pattern and adds a trailing visibility toggle.
- Filters input to the allowed password character set, validates required value after blur and preserves caret position when switching between hidden and visible modes.
- Clear and helper icons are inline SVGs, so no external icon assets are required.

### Example

```jsx
import React from 'react';
import InputPassword from './index';

export default function Example() {
  return <InputPassword label="Пароль" />;
}
```
