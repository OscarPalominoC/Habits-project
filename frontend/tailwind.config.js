/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "sans-serif"],
      },
      colors: {
        // RPG Dark Navy
        void: {
          50: "#e8eaf6",
          100: "#c5c8e8",
          200: "#9fa4d9",
          300: "#7880c9",
          400: "#5a63bd",
          500: "#3d47b1",
          600: "#3740aa",
          700: "#2f37a1",
          800: "#272f98",
          900: "#1a2088",
          950: "#0d1240",
        },
        // Gold XP accent
        gold: {
          300: "#fde68a",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        // Background shades
        dark: {
          900: "#080c1a",
          800: "#0f1629",
          700: "#151f38",
          600: "#1c2a47",
          500: "#243356",
          400: "#2d3f66",
        },
      },
      backgroundImage: {
        "rpg-gradient": "linear-gradient(135deg, #080c1a 0%, #0f1629 50%, #1a2088 100%)",
        "gold-gradient": "linear-gradient(90deg, #f59e0b, #fbbf24, #fde68a)",
        "xp-bar": "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(251, 191, 36, 0.4)",
        violet: "0 0 20px rgba(139, 92, 246, 0.4)",
        glow: "0 0 30px rgba(99, 102, 241, 0.3)",
      },
      animation: {
        "xp-fill": "xpFill 1s ease-out forwards",
        "float-up": "floatUp 2s ease-out forwards",
        "level-up": "levelUp 0.6s ease-out",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        xpFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--xp-width)" },
        },
        floatUp: {
          "0%": { opacity: "1", transform: "translateY(0px)" },
          "100%": { opacity: "0", transform: "translateY(-80px)" },
        },
        levelUp: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(251,191,36,0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(251,191,36,0.7)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
