## Legacy InputMiddleName

React 17-compatible delivery of the middle-name field with a switch for FOS integration.

### Files

- `InputMiddleName.jsx` — component implementation
- `styles.css` — component styles with shared legacy InputText and Switch imports
- `index.js` — export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Composes `legacy/components/input-text/` and `legacy/components/switch/`.
- Keeps label `Отчество`, renders switch `Нет отчества` below the field and disables the input when the switch is active.
- Exports `isMiddleNameValueValid(value)` for external submit gating.

### Example

```jsx
import React from 'react';
import InputMiddleName from './index';

export default function Example() {
  return <InputMiddleName switchLabel="Нет отчества" />;
}
```
