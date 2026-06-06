import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "warm-ivory": "#f5f1eb",
        "light-cream": "#faf8f5",
        background: "#faf8f5",
        "lavender-elegant": "#a09ac2",
        "lavender-light": "#ede8f5",
        "forest-green": "#1a5e5c",
        gold: "#d29649",
        taupe: "#8d7f75",
        foreground: "#2d2d2d",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Crimson Pro", "Georgia", "serif"],
      },
    },
  },
  plugins: [typography],
};

export default config;
