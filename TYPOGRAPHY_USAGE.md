# Typography System Usage Guide

This document explains how to use the typography system that matches your Figma design system.

## Available Text Styles

All text styles are extracted from your Figma file and match exactly:

### Brand Header
- **Variant:** `brandHeader`
- **Font:** Benzin-ExtraBold (custom font)
- **Size:** 48px
- **Use:** For the main app brand name "platnm"

### Header Styles
- **Heading 1:** `heading1` - SF Pro Display Semibold, 24px, weight 600
- **Heading 2:** `heading2` - SF Pro Display Regular, 20px, weight 400

### Body Styles
- **Body Main:** `bodyMain` - SF Pro Display Regular, 16px, weight 400
- **Body Medium:** `bodyMedium` - SF Pro Display Medium, 16px, weight 500

### Caption Styles
- **Caption Medium:** `captionMedium` - SF Pro Display Medium, 13px, weight 500
- **Caption Main:** `captionMain` - SF Pro Display Regular, 13px, weight 400
- **Caption Fine Line:** `captionFineLine` - SF Pro Display Regular, 11px, weight 400

## Usage Methods

### Method 1: Using Typography Component (Recommended)

```tsx
import { Typography, BrandHeader, Heading1, BodyMain } from '../components/Typography';

// Using the main Typography component
<Typography variant="brandHeader" className="text-white">
  platnm
</Typography>

// Using pre-defined components
<BrandHeader className="text-white">platnm</BrandHeader>
<Heading1 className="text-white">Welcome</Heading1>
<BodyMain className="text-gray-400">This is body text</BodyMain>
```

### Method 2: Using Typography Styles Directly

```tsx
import { typography } from '../lib/typography';
import { Text } from 'react-native';

<Text style={typography.brandHeader}>platnm</Text>
<Text style={[typography.heading1, { color: '#fff' }]}>Welcome</Text>
```

### Method 3: Using Tailwind Classes (for simple cases)

The Tailwind config has been extended with font sizes, but for full control use the Typography component or styles directly.

## Examples

### Brand Header (App Name)
```tsx
import { BrandHeader } from '../components/Typography';

<BrandHeader className="text-white">platnm</BrandHeader>
```

### Page Heading
```tsx
import { Heading1 } from '../components/Typography';

<Heading1 className="text-white">My Profile</Heading1>
```

### Body Text
```tsx
import { BodyMain } from '../components/Typography';

<BodyMain className="text-gray-400">
  This is regular body text content.
</BodyMain>
```

### Caption Text
```tsx
import { CaptionMain } from '../components/Typography';

<CaptionMain className="text-gray-500">
  Secondary information or helper text
</CaptionMain>
```

## Notes

- All styles have 100% line height (lineHeight = fontSize)
- Letter spacing is 0 for all styles
- SF Pro Display is the system font on iOS (no need to load separately)
- Benzin-ExtraBold is a custom font that must be loaded using `expo-font`
- You can combine typography styles with other style props as needed

