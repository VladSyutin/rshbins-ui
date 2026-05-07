## Legacy InputLogin

React 17-compatible delivery of the login field for FOS integration.

### Files

- `InputLogin.jsx` — component implementation
- `styles.css` — component styles with shared legacy InputText import
- `index.js` — default export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Depends on `legacy/components/input-text/` and reuses its floating-label behavior.
- Accepts latin letters, digits and separators `.`, `_`, `-`, while collapsing duplicate separators.
- Validates required value after blur and disables autocorrect/spellcheck by default.

### Example

```jsx
import React from 'react';
import InputLogin from './index';

export default function Example() {
  return <InputLogin label="Логин" />;
}
```
