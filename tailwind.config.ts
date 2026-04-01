import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a2e",
        paper: "#faf6f1",
        blossom: {
          DEFAULT: "#f0a0b0",
          light: "#fce4ec",
          deep: "#d4687a",
        },
        branch: {
          DEFAULT: "#5d4037",
          light: "#8d6e63",
        },
        leaf: "#7a9e7e",
        sky: "#e8eaf6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        fall: {
          "0%": { transform: "translateY(-10vh) translateX(0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh) translateX(80px) rotate(360deg)", opacity: "0" },
        },
        sway: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(30px)" },
        },
      },
      animation: {
        "petal-fall": "fall var(--duration, 8s) var(--delay, 0s) linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
