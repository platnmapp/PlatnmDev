# Button Component States - Complete Reference

All button states extracted from Figma design system.

## Active States (Idle)

### Primary Button
- **Background:** White (#FFFFFF)
- **Text:** Black (#000000)
- **Border:** None
- **Typography:** BodyMedium
- **Letter Spacing:** -0.48px
- **Width:** 370px (default, or fullWidth)

### Secondary Button
- **Background:** Transparent
- **Text:** White (#FFFFFF)
- **Border:** White (#FFFFFF), 1px solid
- **Typography:** BodyMedium
- **Letter Spacing:** -0.48px
- **Width:** 370px (default, or fullWidth)

### Tertiary Button (Third)
- **Background:** Transparent
- **Text:** White (#FFFFFF)
- **Border:** None
- **Typography:** BodyMedium
- **Letter Spacing:** -0.48px
- **Width:** 370px (default, or fullWidth)

## Disabled States

### Primary Disabled
- **Background:** White with 50% opacity (rgba(255, 255, 255, 0.5))
- **Text:** Black (#000000) - **NOT gray!**
- **Border:** None
- **Typography:** BodyMedium
- **Letter Spacing:** -0.48px

### Secondary Disabled
- **Background:** Transparent
- **Text:** White (#FFFFFF)
- **Border:** White with 50% opacity (rgba(255, 255, 255, 0.5))
- **Typography:** BodyMedium
- **Letter Spacing:** -0.48px

### Tertiary Disabled (Third Disabled)
- **Background:** Transparent
- **Text:** White (#FFFFFF)
- **Border:** None
- **Typography:** BodyMedium
- **Letter Spacing:** -0.48px

## Pressed State
- All variants use `active:opacity-90` class (handled automatically by Pressable)

## Usage Examples

```tsx
// Primary Active
<Button variant="primary" onPress={handlePress}>
  Continue
</Button>

// Primary Disabled
<Button variant="primary" disabled onPress={handlePress}>
  Continue
</Button>

// Secondary Active
<Button variant="secondary" onPress={handlePress}>
  Continue
</Button>

// Secondary Disabled
<Button variant="secondary" disabled onPress={handlePress}>
  Continue
</Button>

// Tertiary Active
<Button variant="tertiary" onPress={handlePress}>
  Continue
</Button>

// Tertiary Disabled
<Button variant="tertiary" disabled onPress={handlePress}>
  Continue
</Button>
```

