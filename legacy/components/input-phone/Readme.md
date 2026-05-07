## Legacy InputPhone

React 17-compatible delivery of the phone field for FOS integration.

### Files

- `InputPhone.jsx` — component implementation
- `styles.css` — standalone component styles
- `index.js` — default export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Implements a dedicated `+7` phone field instead of wrapping `InputText`, because the mask and keyboard behavior are custom.
- Stores Russian local digits after the country code, ignores leading `7/8`, accepts only numbers that start with `9` and validates required/length/repeating digits after blur.
- Uses the same preview-state matrix as the modern text-field family.

### Example

```jsx
import React from 'react';
import InputPhone from './index';

export default function Example() {
  return <InputPhone label="Номер телефона" />;
}
```
