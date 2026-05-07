## Legacy Gender

React 17-compatible gender selection control composed from two GenderItem radio buttons.

### Files

- `Gender.jsx` — component implementation
- `styles.css` — layout styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, React 18/19 APIs, or `useId`.
- Unique radio group `name` is auto-generated via a counter; pass an explicit `name` to override.
- Controlled usage: pass `value` + `onChange`. Uncontrolled usage: pass `defaultValue`.
- `invalid` shows an error ring only when no value is selected.

### Example

```jsx
import React, { useState } from 'react';
import Gender from './index';

export default function Example() {
  const [gender, setGender] = useState(undefined);

  return (
    <Gender
      value={gender}
      onChange={(value) => setGender(value)}
    />
  );
}
```
