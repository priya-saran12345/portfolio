import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
colors: {
  base: "#07090D",
  surface: "#0D1117",
  surface2: "#141A22",

  border: "rgba(226,232,240,0.10)",

  ink: "#F1F5F9",
  muted: "#8894A6",

  teal: {
    DEFAULT: "#22D3EE",
    dim: "#0E7490",
  },

  indigo: {
    DEFAULT: "#60A5FA",
    dim: "#2563EB",
  },
},      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(232,234,237,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(232,234,237,0.035) 1px, transparent 1px)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        blink: "blink 1.1s steps(2, start) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
