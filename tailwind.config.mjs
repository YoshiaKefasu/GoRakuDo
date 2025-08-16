// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],

  theme: {
    extend: {
      /* === 🎨 Colors === */
      colors: {
        background: "#0A0A0A",

        text: {
          primary: "#FFFFFF",
          secondary: "#CCCCCC",
          muted: "#AAAAAA",
        },

        accent: {
          DEFAULT: "#8B5DFF",
          dark: "#7B4DEF",
        },

        gold: {
          light: "#FFEFB8",
          dark: "#E4B43B",
        },

        paper: {
          bg: "#F7F4F1",
          border: "#E0DCD8",
          lines: "#DCD9D5",
          text: {
            primary: "#3C3C3C",
            secondary: "#555555",
          },
        },
      },

      /* === 🔠 Font Families === */
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Merriweather", "ui-serif", "Georgia"],
        mono: ["Fira Code", "ui-monospace", "SFMono-Regular"],
      },

      /* === 📏 Spacing Scale (optional tweak) === */
      spacing: {
        128: "32rem",
        144: "36rem",
      },

      /* === 🟦 Border Radius === */
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      /* === 🌙 Box Shadows === */
      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.1)",
        strong: "0 8px 20px rgba(0,0,0,0.25)",
        accent: "0 0 15px rgba(139,93,255,0.6)",
      },

      /* === ✨ Animations === */
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        slideUp: "slideUp 0.5s ease-out",
      },
    },
  },

  /* === 📦 Plugins === */
  plugins: [],
};
