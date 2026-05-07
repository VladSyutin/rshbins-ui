## Legacy Segment

React 17-compatible delivery of the segmented option primitive for FOS integration.

### Files

- `Segment.jsx` — component implementation
- `styles.css` — segment styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations

### Integration Notes

- Built on top of native radio semantics.
- Supports optional leading/trailing icons and Storybook-only `previewState`.
- Intended for use standalone in reviews and as the primitive for `SegmentedControl`.

### Example

```jsx
import React from 'react';
import Segment from './index';

export default function Example() {
  return <Segment label="Контент" name="example-segment" value="first" />;
}
```
