// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    // Include all pages and components for proper purging
    "./src/pages/**/*.{astro,ts,js}",
    "./src/components/**/*.{astro,vue,ts,js}",
    "./src/layouts/**/*.{astro,ts,js}",
    // Include content collections that might use Tailwind classes
    "./src/content/**/*.{md,astro}",
  ],
  // Enable purging in production to reduce CSS bundle size
  purge: {
    enabled: process.env.NODE_ENV === "production",
    preserveHtmlElements: false,
    layers: ["base", "components", "utilities"],
    mode: "all",
    content: [
      "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
      "./src/pages/**/*.{astro,ts,js}",
      "./src/components/**/*.{astro,vue,ts,js}",
      "./src/layouts/**/*.{astro,ts,js}",
      "./src/content/**/*.{md,astro}",
    ],
    options: {
      safelist: [
        // Preserve critical classes that might be added dynamically
        /^bg-/,
        /^text-/,
        /^border-/,
        /^rounded-/,
        /^shadow-/,
        /^opacity-/,
        // Preserve animation classes
        /^animate-/,
        /^fade-/,
        /^slide-/,
        // Preserve responsive utilities
        /^sm:/,
        /^md:/,
        /^lg:/,
        /^xl:/,
        // Preserve state utilities
        /^hover:/,
        /^focus:/,
        /^active:/,
        // Preserve accessibility utilities
        /^sr-only$/,
        /^focus:not-sr-only$/,
        // Preserve article-specific classes
        /^article-content$/,
        // Preserve navbar and component classes
        /^navbar$/,
        /^logo-/,
        // Preserve color utilities used in components
        /^primary$/,
        /^secondary$/,
        /^muted$/,
        /^foreground$/,
        /^background$/,
      ],
    },
  },

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

        // ADD THIS: Primary color scale for theme() function
        primary: {
          50: "#f3f0ff",
          100: "#e5dbff",
          200: "#d1bfff",
          300: "#b794ff",
          400: "#9f75ff",
          500: "#8b5dff", // Your main purple
          600: "#7b4def",
          700: "#6b3de0",
          800: "#5a2fc8",
          900: "#4c2ba3",
          950: "#2e1b5e",
        },
        // ADD THIS: Secondary color scale
        secondary: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#e4b43b", // Your main gold
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          950: "#422006",
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
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        slideUp: "slideUp 0.5s ease-out",
        spin: "spin 1s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },

  /* === 📦 Plugins === */
  plugins: [],
};
