## Legacy GenderItem

React 17-compatible side-specific segmented radio item used by the Gender control.

### Files

- `GenderItem.jsx` — component implementation
- `styles.css` — item styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations

### Integration Notes

- Use `position="left"` for the left item and `position="right"` for the right item.
- Set `grouped={true}` when rendered inside a Gender control (enables the shared border).
- Pass `name` and `value` so the underlying radio inputs work correctly as a group.

### Example

```jsx
import React from 'react';
import GenderItem from './index';

export default function Example() {
  return (
    <>
      <GenderItem grouped label="Муж" name="gender" position="left" value="male" />
      <GenderItem grouped label="Жен" name="gender" position="right" value="female" />
    </>
  );
}
```
