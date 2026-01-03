/**
 * Color System - Design tokens for consistent colors throughout the app
 * Extracted from Figma design system
 */

export const colors = {
  /**
   * Background Colors
   */
  background: "#0E0E0E", // Main app background color
  
  /**
   * Text Colors (Grey Scale)
   * From Figma design system
   */
  "grey-scale-0": "#FFFFFF", // White
  "grey-scale-200": "#C4C4C4",
  "grey-scale-300": "#B4B4B4",
  "grey-scale-400": "#9F9F9F",
  "grey-scale-500": "#7F7F7F",
  "grey-scale-600": "#545454",
  "grey-scale-700": "#373737",
  "grey-scale-800": "#282828",
  
  /**
   * Card/Container Colors
   */
  card: "#1B1B1B", // Card background color
  cardBorder: "#282828", // Card border color
  
  /**
   * Other commonly used colors
   */
  black: "#000000",
  white: "#FFFFFF",
} as const;

/**
 * Type for color keys
 */
export type ColorKey = keyof typeof colors;

/**
 * Helper function to get a color value
 * @param key - The color key
 * @returns The color hex value
 */
export function getColor(key: ColorKey): string {
  return colors[key];
}

