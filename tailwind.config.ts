import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        prestige: {
          gold: "#c9a227",
          goldLight: "#f5e6c8",
          charcoal: "#1a1a1a",
          cream: "#faf8f5",
          sand: "#e8e4de",
        },
      },
      animation: {
        "blob-float": "blob-float 20s ease-in-out infinite",
        "blob-float-slow": "blob-float 25s ease-in-out infinite reverse",
        "blob-pulse": "blob-pulse 8s ease-in-out infinite",
      },
      keyframes: {
        "blob-float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(20px, -30px) scale(1.1)" },
          "50%": { transform: "translate(-20px, 20px) scale(0.95)" },
          "75%": { transform: "translate(30px, 10px) scale(1.05)" },
        },
        "blob-pulse": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
