## Legacy InputText

React 17-compatible delivery of the floating-label text input for FOS integration.

### Files

- `InputText.jsx` — component implementation
- `styles.css` — input styles
- `index.js` — default export entry point
- `../../tokens/legacy-theme.css` — shared legacy token aliases with semantic-token fallbacks

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- Clear and helper icons are rendered as inline SVGs — no external icon files required.
- `helperText` is only shown in error states (`invalid` + blur).
- `previewState` overrides the computed interactive state for Storybook/Figma matrix use.

### Example

```jsx
import React from 'react';
import InputText from './index';

export default function Example() {
  return (
    <InputText
      label="Email"
      helperText="Неверный формат"
      invalid={false}
    />
  );
}
```
