/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/context/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        brand: ["Benzin-ExtraBold"],
        system: ["System"],
      },
      fontSize: {
        // Typography system from Figma
        "brand-header": "48px",
        "heading-1": "24px",
        "heading-2": "20px",
        "body-main": "16px",
        "body-medium": "16px",
        "caption-medium": "13px",
        "caption-main": "13px",
        "caption-fine": "11px",
      },
      colors: {
        "text-primary": "#dadada",
        "text-secondary": "#7f7f7f",
        // App background color
        "app-background": "#0E0E0E",
      },
      // Note: Tailwind's default spacing scale already matches our Figma spacing system:
      // 0=0px (5XS), 0.5=2px (4XS), 1=4px (3XS), 2=8px (2XS), 3=12px (XS), 4=16px (S),
      // 5=20px (M), 6=24px (L), 8=32px (XL), 12=48px (2XL), 16=64px (3XL)
      // See lib/spacing.ts for the spacing system documentation
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
