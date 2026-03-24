import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#07111F",
        panel: "#0E1A2B",
        panelSoft: "#122239",
        border: "#21344F",
        text: "#E6EEF8",
        muted: "#9EB1C7",
        accent: "#78E6D0",
        accentWarm: "#F7B87B",
        danger: "#F87171"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(8, 15, 30, 0.45)"
      },
      backgroundImage: {
        haze:
          "radial-gradient(circle at top, rgba(120, 230, 208, 0.14), transparent 34%), radial-gradient(circle at 20% 20%, rgba(247, 184, 123, 0.08), transparent 24%)"
      }
    }
  },
  plugins: []
};

export default config;
