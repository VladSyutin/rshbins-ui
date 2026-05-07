## Legacy Radio

React 17-compatible delivery of the radio component for FOS integration.

### Files

- `Radio.jsx` — component implementation
- `styles.css` — radio styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations

### Integration Notes

- Supports `checked`/`defaultChecked`, `disabled`, `label` and Storybook-only `previewState`.
- Controlled usage: pass `checked` + `onChange`. Uncontrolled usage: pass `defaultChecked`.
- Built as a native radio input without React 18/19 APIs.

### Example

```jsx
import React from 'react';
import Radio from './index';

export default function Example() {
  return <Radio label="Контент" name="example" value="first" />;
}
```
