## Legacy InputSurname

React 17-compatible delivery of the surname field for FOS integration.

### Files

- `InputSurname.jsx` — component implementation
- `styles.css` — component styles with shared legacy InputText import
- `index.js` — export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Depends on `legacy/components/input-text/` and reuses its floating-label behavior.
- Accepts Cyrillic letters and limited separators, uppercases the first character, trims forbidden trailing separators on blur and validates paired brackets.
- Exports `isSurnameValueValid(value)` for external submit gating.

### Example

```jsx
import React from 'react';
import InputSurname from './index';

export default function Example() {
  return <InputSurname label="Фамилия" />;
}
```
