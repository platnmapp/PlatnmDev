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
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
