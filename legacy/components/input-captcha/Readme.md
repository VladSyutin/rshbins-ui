## Legacy InputCaptcha

React 17-compatible delivery of the captcha text field for FOS integration.

### Files

- `InputCaptcha.jsx` — component implementation
- `styles.css` — component styles with shared legacy InputText import
- `index.js` — export entry point
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Depends on `legacy/components/input-text/` and reuses its floating-label behavior.
- Removes whitespace on input and validates required value after blur.
- Exports `isCaptchaValueValid(value)` for external submit gating.

### Example

```jsx
import React from 'react';
import InputCaptcha from './index';

export default function Example() {
  return <InputCaptcha label="Код с картинки" />;
}
```
