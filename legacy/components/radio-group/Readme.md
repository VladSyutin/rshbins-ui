## Legacy RadioGroup

React 17-compatible radio-group composition for FOS integration.

### Files

- `RadioGroup.jsx` — group implementation
- `styles.css` — layout styles with shared legacy Radio import
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations

### Integration Notes

- Composes `legacy/components/radio/` items into a single-select group.
- Supports controlled and uncontrolled usage through `value`/`defaultValue`.
- Auto-generates a radio `name` when one is not provided.

### Example

```jsx
import React from 'react';
import RadioGroup from './index';

export default function Example() {
  return (
    <RadioGroup
      options={[
        { label: 'Контент', value: 'first' },
        { label: 'Контент', value: 'second' }
      ]}
    />
  );
}
```
