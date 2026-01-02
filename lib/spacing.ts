/**
 * Spacing System - Extracted from Figma Design System
 * Matches the spacing scale defined in Figma
 */

/**
 * Spacing Values - Size to Pixel Mapping
 * 
 * Based on Figma spacing system:
 * 5XS: 0px
 * 4XS: 2px
 * 3XS: 4px
 * 2XS: 8px
 * XS: 12px
 * S: 16px
 * M: 20px
 * L: 24px
 * XL: 32px
 * 2XL: 48px
 * 3XL: 64px
 */
export const spacing = {
  "5XS": 0,
  "4XS": 2,
  "3XS": 4,
  "2XS": 8,
  "XS": 12,
  "S": 16,
  "M": 20,
  "L": 24,
  "XL": 32,
  "2XL": 48,
  "3XL": 64,
} as const;

/**
 * Spacing Size Names (for easy reference)
 */
export type SpacingSize = keyof typeof spacing;

/**
 * Helper function to get spacing value in pixels
 * @example
 * getSpacing("XS") // returns 12
 * getSpacing("L") // returns 24
 */
export const getSpacing = (size: SpacingSize): number => {
  return spacing[size];
};

/**
 * Spacing values for use in Tailwind config
 * Maps to Tailwind spacing scale (0.25rem increments)
 * 
 * Note: Some values don't map directly to Tailwind defaults,
 * so we'll define custom values in tailwind.config.js
 */
export const spacingValues = {
  0: "0px",      // 5XS
  0.5: "2px",    // 4XS
  1: "4px",      // 3XS
  2: "8px",      // 2XS
  3: "12px",     // XS
  4: "16px",     // S
  5: "20px",     // M
  6: "24px",     // L
  8: "32px",     // XL
  12: "48px",    // 2XL
  16: "64px",    // 3XL
} as const;

