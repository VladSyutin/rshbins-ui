## Legacy Header

React 17-compatible page header with the RSHB Insurance logo and theme toggle for FOS integration.

### Files

- `Header.jsx` — component implementation
- `styles.css` — header styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations

### Dependencies

- `../logo/` — inline SVG logo
- `../theme/` — theme toggle button

### Integration Notes

- `size="responsive"` (default) adapts padding at 1024px and 743px breakpoints.
- Fixed sizes: `l` (1280px+), `m` / `s` (62px padding), `xs` (no padding, transparent background).
- Pass `themeProps` to configure the theme toggle, including `applyToDocument` and `onModeChange`.
- Pass `brandButtonProps` to attach click handlers or aria attributes to the logo button.

### Example

```jsx
import React, { useState } from 'react';
import Header from './index';

export default function Example() {
  const [mode, setMode] = useState('light');

  return (
    <Header
      themeProps={{
        applyToDocument: true,
        mode,
        onModeChange: setMode
      }}
    />
  );
}
```
