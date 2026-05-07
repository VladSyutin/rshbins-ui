## Legacy Theme

React 17-compatible theme toggle button for FOS integration. Moon/Sun icons are inlined as JSX instead of using `?url` imports.

### Files

- `Theme.jsx` — component implementation
- `styles.css` — button styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations

### Integration Notes

- `applyToDocument` (default `true`) toggles `theme-light` / `theme-dark` classes on `<html>` and writes the preference to `localStorage`.
- Set `applyToDocument={false}` inside Storybook or sandbox environments.
- Controlled usage: pass `mode` + `onModeChange`. Uncontrolled: use `defaultMode`.

### Example

```jsx
import React, { useState } from 'react';
import Theme from './index';

export default function Example() {
  const [mode, setMode] = useState('light');

  return (
    <Theme
      applyToDocument={false}
      mode={mode}
      onModeChange={setMode}
    />
  );
}
```
