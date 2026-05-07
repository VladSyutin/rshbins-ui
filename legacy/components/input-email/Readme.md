## Legacy InputEmail

React 17-compatible delivery of the email field for FOS integration.

### Files

- `InputEmail.jsx` — component implementation
- `styles.css` — component styles with shared legacy InputText import
- `index.js` — export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Depends on `legacy/components/input-text/` and reuses its floating-label behavior.
- Normalizes input to lowercase latin characters, keeps a single `@`, disables browser text helpers by default and validates domain structure after blur.
- Exports `isEmailValueValid(value)` for external submit gating.

### Example

```jsx
import React from 'react';
import InputEmail from './index';

export default function Example() {
  return <InputEmail label="Электронная почта" />;
}
```
