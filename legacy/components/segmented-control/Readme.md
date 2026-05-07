## Legacy SegmentedControl

React 17-compatible segmented-control composition for FOS integration.

### Files

- `SegmentedControl.jsx` — group implementation
- `styles.css` — layout styles with shared legacy Segment import
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations

### Integration Notes

- Composes `legacy/components/segment/` items into a horizontal single-select group.
- Supports controlled and uncontrolled usage through `value`/`defaultValue`.
- Auto-generates a radio `name` when one is not provided.

### Example

```jsx
import React from 'react';
import SegmentedControl from './index';

export default function Example() {
  return (
    <SegmentedControl
      options={[
        { label: 'Сетка', value: 'grid' },
        { label: 'Список', value: 'list' }
      ]}
    />
  );
}
```
