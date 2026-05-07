## Legacy Modal

React 17-compatible delivery of the modal dialog for FOS integration.

### Files

- `Modal.jsx` — component implementation
- `styles.css` — modal styles
- `index.js` — default export entry point
- `../../tokens/legacy-theme.css` — shared legacy token aliases with semantic-token fallbacks

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- Uses legacy Button component for action buttons and captcha controls.
- Captcha/volume icons are rendered as inline SVGs — no external icon files required.
- `placement="top-center"` wraps the modal in a fullscreen overlay layer (`rshb-legacy-modal-layer`). Render it in a portal in the consuming app.
- `actions` prop accepts either ReactNode or a render function `({ requestClose }) => ReactNode` for custom action layouts.
- `useId` (React 18) is replaced with a module-level counter for heading/description IDs.

### Example

```jsx
import React, { useState } from 'react';
import Modal from './index';

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Открыть</button>
      {open && (
        <Modal
          heading="Подтверждение"
          description="Вы уверены?"
          onClose={() => setOpen(false)}
          placement="top-center"
        />
      )}
    </>
  );
}
```
