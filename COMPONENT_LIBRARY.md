# Component Library Usage Guide

This document explains how to use the component library that matches your Figma design system.

## Button Components

### Primary Button (White Background, Black Text)

```tsx
import { Button } from '../components';

<Button variant="primary" onPress={handlePress}>
  Continue
</Button>
```

**Props:**
- `variant="primary"` - White background, black text
- `fullWidth` - Makes button full width (default: 370px width)
- `disabled` - Disabled state (gray background)
- `loading` - Shows loading spinner
- `size` - "default" (py-4) or "small" (py-3)

### Secondary Button (Border, White Text)

```tsx
<Button variant="secondary" onPress={handlePress}>
  Continue
</Button>
```

**Props:**
- `variant="secondary"` - Transparent background, white border, white text
- Same props as primary

### Tertiary Button (Transparent, White Text)

```tsx
<Button variant="tertiary" onPress={handlePress}>
  Continue
</Button>
```

### Text Button (Link-style)

```tsx
import { TextButton } from '../components';

<TextButton onPress={handlePress}>
  Forgot password?
</TextButton>
```

## Selection Tile Component

For selecting friends/users in lists:

```tsx
import { SelectionTile } from '../components';

<SelectionTile
  name="Leonardo Del Toro"
  username="@springbreakmorons"
  avatarUrl={avatarUri}
  isSelected={isSelected}
  onPress={() => setIsSelected(!isSelected)}
/>
```

**Props:**
- `name` - User's full name
- `username` - User's username (with @)
- `avatarUrl` - Image URI or require() source
- `isSelected` - Selection state (shows checkmark)
- `onPress` - Selection handler

## Icon Button Component

For icon-only buttons (Filter, Sort, etc.):

```tsx
import { IconButton } from '../components';

<IconButton
  icon="filter-list"
  isActive={isFilterActive}
  onPress={() => setIsFilterActive(!isFilterActive)}
  size={48}
/>
```

**Props:**
- `icon` - Ionicons icon name
- `isActive` - Active state (different color)
- `size` - Button size (default: 48)

## Notification Button Component

Small button for notification actions:

```tsx
import { NotificationButton } from '../components';

<NotificationButton
  label="Add Back"
  isSelected={isAdded}
  onPress={() => setIsAdded(!isAdded)}
/>
```

**Props:**
- `label` - Button label (e.g., "Add Back")
- `isSelected` - Selected state (shows checkmark and "Added" text)
- `onPress` - Handler

## Button States

All buttons support:
- **Idle** - Default state
- **Pressed** - Uses `active:opacity-90` class (automatically handled)
- **Disabled** - Gray background, disabled interaction
- **Loading** - Shows spinner (Button component only)

## Styling Details (From Figma)

- **Border Radius:** 30px (rounded-[30px])
- **Primary Button Width:** 370px (when not fullWidth)
- **Padding:** py-4 (default), py-3 (small)
- **Text:** BodyMedium typography with letterSpacing: -0.48
- **Colors:**
  - Primary: White background (#FFFFFF), Black text (#000000)
  - Secondary: Transparent background, Border #c4c4c4, White text
  - Disabled: Gray-600 background (#4B5563), Gray-400 text (#9CA3AF)

