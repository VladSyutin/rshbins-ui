## Legacy Cookies

React 17-compatible delivery of the cookie consent banner for FOS integration.

### Files

- `Cookies.jsx` — component implementation
- `styles.css` — banner styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- Pass `onClose` to enable the animated exit sequence (150 ms slide-down before unmount).
- `closeOnPrimaryAction` (default `true`) triggers `onClose` automatically after the primary button click.
- Use `placement="bottom-center"` to render the banner as a fixed overlay at the bottom of the viewport.
- `size="xs"` renders the compact stacked variant; `size="s"` (default) renders the wide inline variant.

### Example

```jsx
import React, { useState } from 'react';
import Cookies from './index';

export default function Example() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Cookies
      heading="Мы используем куки"
      description="Для улучшения работы сайта."
      primaryActionLabel="Принять"
      secondaryActionLabel="Настройки"
      placement="bottom-center"
      onClose={() => setVisible(false)}
    />
  );
}
```
