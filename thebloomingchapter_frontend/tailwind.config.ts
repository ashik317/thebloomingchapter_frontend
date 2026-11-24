import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: "#2E4A3B", dark: "#1F3328", light: "#3E5E4B" },
        cream: { DEFAULT: "#F6F0E6", dark: "#E9DFCF" },
        rose: { DEFAULT: "#C2546F", light: "#F2B8C6", dark: "#9E3F57" },
        marigold: "#F2A93B",
        teak: "#8A5A3B",
        ink: "#22312A",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
