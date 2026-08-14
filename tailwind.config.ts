import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0A0D13",
        surface: "#10141C",
        surface2: "#161B25",
        border: "rgba(232,234,237,0.08)",
        ink: "#E8EAED",
        muted: "#7C8798",
        teal: {
          DEFAULT: "#f04e4e",
          dim: "#8f2c36",
        },
        indigo: {
          DEFAULT: "#6C7CFF",
          dim: "#3D46A8",
        },
      },
      fontFamily: {
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
