## Legacy Calendar

React 17-compatible delivery of the calendar component for FOS integration.

### Files

- `Calendar.jsx` — component implementation with `day`, `month`, and `year` views
- `styles.css` — plain CSS styles for the flyout surface and picker cells
- `index.js` — default export entry point plus named item exports
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- `value`, `defaultValue`, `onChange`, `minDate`, `maxDate`, and `initialView` mirror the modern calendar behavior.
- `CalendarDayItem` and `CalendarPeriodItem` are also exported for focused previews and custom layouts.

### Example

```jsx
import React from 'react';
import Calendar from './index';

export default function Example() {
  return <Calendar initialView="day" />;
}
```
