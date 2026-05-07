## Legacy InputBirthDate

React 17-compatible delivery of the birth-date input with floating label, masked desktop input, native mobile picker, and flyout calendar for FOS integration.

### Files

- `InputBirthDate.jsx` — component implementation
- `styles.css` — component styles
- `index.js` — default export entry point
- `src/styles/tokens.css` — design tokens loaded globally in the host app

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component depends on the neighboring legacy `Calendar` component and does not import `src/components` at runtime.
- `helperText` is shown only in error states; required and out-of-range validation messages are computed inside the component after blur.
- `pickerMode="auto"` switches between desktop flyout and native date input around `1024px`, matching the current legacy delivery baseline.
- `min` and `max` can further narrow the built-in `18–100` age window for both desktop and native picker flows.

### Example

```jsx
import React from 'react';
import InputBirthDate from './index';

export default function Example() {
  return (
    <InputBirthDate
      label="Дата рождения"
      helperText="Возраст должен быть от 18 до 100 лет."
      showHelperIcon
    />
  );
}
```
