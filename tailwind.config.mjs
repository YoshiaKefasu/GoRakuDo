// tailwind.config.mjs
// GoRakuDo Project - Updated Tailwind Configuration
// Tailwind CSS v4.1.13 with Astro Native Approach
// Updated: 2025-01-11

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

  theme: {
    extend: {
      /* === 🎨 Colors - Full OKLCH Color Space === */
      colors: {
        // Converted to OKLCH for consistency
        background: "oklch(0.05 0 0)",
        text: {
          primary: "oklch(1 0 0)",
          secondary: "oklch(0.8 0 0)",
          muted: "oklch(0.67 0 0)",
        },
        accent: {
          DEFAULT: "oklch(0.65 0.25 280)",
          dark: "oklch(0.6 0.25 280)",
        },
        gold: {
          light: "oklch(0.95 0.08 85)",
          dark: "oklch(0.75 0.12 85)",
        },

        // OKLCH Color System - Modern color space
        'color-background': 'oklch(0.05 0 0)',
        'color-text-primary': 'oklch(1 0 0)',
        'color-text-secondary': 'oklch(0.8 0 0)',
        'color-text-muted': 'oklch(0.67 0 0)',
        'color-accent': 'oklch(0.65 0.25 280)',
        'color-accent-purple': 'oklch(0.65 0.25 280)',
        'color-accent-purple-dark': 'oklch(0.6 0.25 280)',
        'color-gold-light': 'oklch(0.95 0.08 85)',
        'color-gold-dark': 'oklch(0.75 0.12 85)',
        
        // Paper theme colors
        'color-paper-bg': 'oklch(0.97 0.01 60)',
        'color-paper-text-primary': 'oklch(0.25 0 0)',
        'color-paper-text-secondary': 'oklch(0.35 0 0)',
        'color-paper-border': 'oklch(0.9 0.01 60)',
        'color-paper-lines': 'oklch(0.88 0.01 60)',
        
        // Content specific colors
        'color-content-border': 'oklch(0.2 0.01 280)',
        'color-content-meta': 'oklch(0.6 0 0)',
        'color-content-text': 'oklch(0.9 0 0)',
        'color-primary': 'oklch(0.65 0.25 280)',

        // Primary color scale - OKLCH Purple Scale
        primary: {
          50: "oklch(0.98 0.02 280)",
          100: "oklch(0.95 0.05 280)",
          200: "oklch(0.9 0.1 280)",
          300: "oklch(0.85 0.15 280)",
          400: "oklch(0.8 0.2 280)",
          500: "oklch(0.65 0.25 280)", // Main purple
          600: "oklch(0.6 0.25 280)",
          700: "oklch(0.55 0.25 280)",
          800: "oklch(0.5 0.25 280)",
          900: "oklch(0.45 0.25 280)",
          950: "oklch(0.3 0.25 280)",
        },
        // Secondary color scale - OKLCH Gold Scale
        secondary: {
          50: "oklch(0.98 0.02 85)",
          100: "oklch(0.95 0.05 85)",
          200: "oklch(0.9 0.08 85)",
          300: "oklch(0.85 0.12 85)",
          400: "oklch(0.8 0.15 85)",
          500: "oklch(0.75 0.12 85)", // Main gold
          600: "oklch(0.7 0.12 85)",
          700: "oklch(0.65 0.12 85)",
          800: "oklch(0.6 0.12 85)",
          900: "oklch(0.55 0.12 85)",
          950: "oklch(0.4 0.12 85)",
        },
        paper: {
          bg: "oklch(0.97 0.01 60)",
          border: "oklch(0.9 0.01 60)",
          lines: "oklch(0.88 0.01 60)",
          text: {
            primary: "oklch(0.25 0 0)",
            secondary: "oklch(0.35 0 0)",
          },
        },
      },

      /* === 🔠 Font Families - Updated for GoRakuDo === */
      fontFamily: {
        sans: [
          "Noto Sans JP",
          "Hiragino Sans", 
          "Yu Gothic",
          "Meiryo",
          "Inter",
          "ui-sans-serif",
          "system-ui"
        ],
        serif: [
          "Lora",
          "Merriweather", 
          "ui-serif", 
          "Georgia"
        ],
        mono: [
          "Fira Code", 
          "ui-monospace", 
          "SFMono-Regular"
        ],
        jp: [
          "Yuji Syuku",
          "serif"
        ],
        cursive: [
          "Cedarville Cursive",
          "cursive"
        ],
      },

      /* === 📏 Spacing Scale - Enhanced === */
      spacing: {
        128: "32rem",
        144: "36rem",
        // Custom spacing for GoRakuDo
        'section-padding-y': 'clamp(80px, 10vw, 120px)',
        'touch-target-min': '44px',
        'touch-target-padding': 'calc((44px - 1.5rem) / 2)',
      },

      /* === 📱 Responsive Breakpoints - GoRakuDo Standard === */
      screens: {
        'xs': '320px',   // Extra small devices
        'sm': '640px',   // Small devices
        'md': '768px',   // Medium devices  
        'lg': '1024px',  // Large devices
        'xl': '1280px',  // Extra large devices
        '2xl': '1600px', // 2X large devices
        // Custom breakpoints for GoRakuDo
        'max-sm': {'max': '640px'},     // Mobile-first approach
        'max-480': {'max': '480px'},    // Small mobile devices
        'max-md': {'max': '768px'},     // Tablet and below
        'max-lg': {'max': '1024px'},    // Desktop and below
      },

      /* === 🟦 Border Radius - Enhanced === */
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem", 
        "3xl": "2rem",
        // Custom border radius for GoRakuDo
        'pill': '35px',
        'card': '20px',
        'btn-small': '25px',
      },

      /* === 🌙 Box Shadows - OKLCH Enhanced === */
      boxShadow: {
        soft: "0 4px 12px oklch(0 0 0 / 0.1)",
        strong: "0 8px 20px oklch(0 0 0 / 0.25)",
        accent: "0 0 15px oklch(0.65 0.25 280 / 0.6)",
        // Custom shadows for GoRakuDo - OKLCH
        'card': '0 4px 12px oklch(0.65 0.25 280 / 0.3)',
        'glow': '0 0 15px oklch(0.65 0.25 280 / 0.6)',
        'content': '0 10px 15px -3px oklch(0 0 0 / 0.1)',
      },

      /* === ✨ Animations - Enhanced for GoRakuDo === */
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
        // Custom animations for GoRakuDo
        wave: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px oklch(0.65 0.25 280 / 0.3)" },
          "50%": { boxShadow: "0 0 20px oklch(0.65 0.25 280 / 0.6)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        slideUp: "slideUp 0.5s ease-out",
        spin: "spin 1s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        // Custom animations for GoRakuDo
        wave: "wave 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },

      /* === 🎯 Z-Index Scale - GoRakuDo System === */
      zIndex: {
        'content-main': '10',
        'content-progress': '20',
        'navbar': '50',
        'modal': '9999',
      },

      /* === ⚡ Transition Timing === */
      transitionDuration: {
        'fast': '0.3s',
        'normal': '0.5s',
        'slow': '1s',
      },
    },
  },

  /* === 📦 Plugins - Enhanced for GoRakuDo === */
  plugins: [
    require('@tailwindcss/typography')({
      target: 'modern',
      modifiers: {
        'prose': {
          // Enhanced typography for GoRakuDo content
          'p': {
            'margin-bottom': '2.5rem', // 40px - generous spacing
            'line-height': '1.8',      // 28.8px - comfortable reading
            'margin-top': '0.5rem',    // 8px - small top margin
          },
          // Proper heading spacing
          'h1, h2, h3, h4, h5, h6': {
            'margin-top': '3rem',      // 48px - clear section separation
            'margin-bottom': '1.5rem', // 24px - generous heading spacing
          },
          // Enhanced list spacing
          'ul, ol': {
            'margin-bottom': '2.5rem', // 40px - consistent with paragraphs
            'margin-top': '1rem',      // 16px - space before lists
          },
          // Blockquote spacing
          'blockquote': {
            'margin-top': '2rem',      // 32px - space before blockquotes
            'margin-bottom': '2rem',   // 32px - space after blockquotes
          },
          // Code block styling
          'pre': {
            'background-color': 'oklch(0.05 0 0)', // Dark background
            'border-radius': '0.5rem',
            'padding': '1.5rem',
          },
          'code': {
            'background-color': 'oklch(0.1 0 0)',
            'padding': '0.25rem 0.5rem',
            'border-radius': '0.25rem',
            'font-size': '0.875rem',
          },
        },
        // Custom prose variants for GoRakuDo
        'prose-go': {
          'color': 'oklch(0.9 0 0)', // Light text
          'max-width': 'none', // Full width for content
        },
      },
    }),
  ],

  /* === 🎨 Dark Mode Configuration === */
  darkMode: 'class', // Enable class-based dark mode

  /* === 🔧 Future Configuration === */
  future: {
    hoverOnlyWhenSupported: true, // Better mobile support
  },
};
