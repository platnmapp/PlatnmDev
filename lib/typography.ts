/**
 * Typography System - Extracted from Figma Design System
 * Matches the text styles defined in the Figma file
 */

import { TextStyle } from "react-native";

/**
 * Font Families
 */
export const fontFamilies = {
  brand: "Benzin-ExtraBold", // Custom font for brand headers
  system: "System", // SF Pro Display (iOS default)
} as const;

/**
 * Typography Styles - Matched to Figma Text Styles
 */
export const typography = {
  // Brand Header - Largest, most prominent text
  brandHeader: {
    fontFamily: fontFamilies.brand,
    fontSize: 48,
    fontWeight: "900" as TextStyle["fontWeight"],
    lineHeight: 48, // 100% line height
    letterSpacing: 0,
  } as TextStyle,

  // Header Styles
  heading1: {
    fontFamily: fontFamilies.system,
    fontSize: 24,
    fontWeight: "600" as TextStyle["fontWeight"], // Semibold
    lineHeight: 24, // 100% line height
    letterSpacing: 0,
  } as TextStyle,

  heading2: {
    fontFamily: fontFamilies.system,
    fontSize: 20,
    fontWeight: "400" as TextStyle["fontWeight"], // Regular
    lineHeight: 20, // 100% line height
    letterSpacing: 0,
  } as TextStyle,

  // Body Styles
  bodyMain: {
    fontFamily: fontFamilies.system,
    fontSize: 16,
    fontWeight: "400" as TextStyle["fontWeight"], // Regular
    lineHeight: 16, // 100% line height
    letterSpacing: 0,
  } as TextStyle,

  bodyMedium: {
    fontFamily: fontFamilies.system,
    fontSize: 16,
    fontWeight: "500" as TextStyle["fontWeight"], // Medium
    lineHeight: 22, // Better line spacing for readability
    letterSpacing: 0,
  } as TextStyle,

  // Caption Styles
  captionMedium: {
    fontFamily: fontFamilies.system,
    fontSize: 13,
    fontWeight: "500" as TextStyle["fontWeight"], // Medium
    lineHeight: 13, // 100% line height
    letterSpacing: 0,
  } as TextStyle,

  captionMain: {
    fontFamily: fontFamilies.system,
    fontSize: 13,
    fontWeight: "400" as TextStyle["fontWeight"], // Regular
    lineHeight: 13, // 100% line height
    letterSpacing: 0,
  } as TextStyle,

  captionFineLine: {
    fontFamily: fontFamilies.system,
    fontSize: 11,
    fontWeight: "400" as TextStyle["fontWeight"], // Regular
    lineHeight: 11, // 100% line height
    letterSpacing: 0,
  } as TextStyle,
} as const;

/**
 * Typography Style Names (for easy reference)
 */
export type TypographyStyle = keyof typeof typography;

