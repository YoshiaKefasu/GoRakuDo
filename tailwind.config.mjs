// tailwind.config.mjs
// GoRakuDo Project - Updated Tailwind Configuration

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // === Astro Native Optimization ===
    // Priority 1: Astro files (static-first approach)
    './src/**/*.astro',
    './src/pages/**/*.astro',
    './src/components/**/*.astro',
    './src/layouts/**/*.astro',

    // Priority 2: Content Collections (structured content)
    './src/content/**/*.{md,mdx}',

    // Priority 3: Interactive Islands (minimal JS components)
    './src/components/**/*.vue', // Only Vue components that need hydration

    // Priority 4: TypeScript/JavaScript (only for utilities and configs)
    './src/utils/**/*.ts',
    './src/scripts/**/*.ts',

    // Exclude: jsx, svelte, tsx (not used in Astro-native approach)
    // Exclude: html (handled by Astro)
  ],

  theme: {
    extend: {
      /* === 🎨 Colors - Unified OKLCH Color System === */
      colors: {
        // === Core Semantic Colors ===
        background: 'oklch(0.05 0 0)',
        foreground: 'oklch(1 0 0)',

        // === Text Colors ===
        text: {
          primary: 'oklch(1 0 0)',
          secondary: 'oklch(0.8 0 0)',
          muted: 'oklch(0.67 0 0)',
        },

        // === Primary Color Scale (Purple) ===
        primary: {
          50: 'oklch(0.98 0.02 280)',
          100: 'oklch(0.95 0.05 280)',
          200: 'oklch(0.9 0.1 280)',
          300: 'oklch(0.85 0.15 280)',
          400: 'oklch(0.8 0.2 280)',
          500: 'oklch(0.65 0.25 280)', // Main purple
          600: 'oklch(0.6 0.25 280)',
          700: 'oklch(0.55 0.25 280)',
          800: 'oklch(0.5 0.25 280)',
          900: 'oklch(0.45 0.25 280)',
          950: 'oklch(0.3 0.25 280)',
        },

        // === Secondary Color Scale (Gold) ===
        secondary: {
          50: 'oklch(0.98 0.02 85)',
          100: 'oklch(0.95 0.05 85)',
          200: 'oklch(0.9 0.08 85)',
          300: 'oklch(0.85 0.12 85)',
          400: 'oklch(0.8 0.15 85)',
          500: 'oklch(0.75 0.12 85)', // Main gold
          600: 'oklch(0.7 0.12 85)',
          700: 'oklch(0.65 0.12 85)',
          800: 'oklch(0.6 0.12 85)',
          900: 'oklch(0.55 0.12 85)',
          950: 'oklch(0.4 0.12 85)',
        },

        // === Accent Colors (Aliases for Primary) ===
        accent: {
          DEFAULT: 'oklch(0.65 0.25 280)', // primary-500
          dark: 'oklch(0.6 0.25 280)', // primary-600
        },

        // === Paper Theme Colors ===
        paper: {
          bg: 'oklch(0.97 0.01 60)',
          border: 'oklch(0.9 0.01 60)',
          lines: 'oklch(0.88 0.01 60)',
          text: {
            primary: 'oklch(0.25 0 0)',
            secondary: 'oklch(0.35 0 0)',
          },
        },

        // === Content Specific Colors ===
        content: {
          border: 'oklch(0.2 0.01 280)',
          meta: 'oklch(0.6 0 0)',
          text: 'oklch(0.9 0 0)',
        },

        // === Legacy Aliases (for backward compatibility) ===
        gold: {
          light: 'oklch(0.95 0.08 85)', // secondary-100
          dark: 'oklch(0.75 0.12 85)', // secondary-500
        },

        // === Accessibility & Interactive States ===
        focus: {
          DEFAULT: 'oklch(0.65 0.25 280)', // Primary focus color
          ring: 'oklch(0.65 0.25 280 / 0.5)', // Focus ring
        },
        interactive: {
          hover: 'oklch(0.6 0.25 280)', // Hover state
          active: 'oklch(0.55 0.25 280)', // Active state
          disabled: 'oklch(0.4 0 0)', // Disabled state
        },
        semantic: {
          error: 'oklch(0.6 0.2 20)', // Error color
          success: 'oklch(0.6 0.15 140)', // Success color
          warning: 'oklch(0.7 0.15 85)', // Warning color
          info: 'oklch(0.6 0.15 240)', // Info color
        },
      },

      /* === 🔠 Font Families - Updated for GoRakuDo === */
      fontFamily: {
        sans: [
          'Noto Sans JP',
          'Hiragino Sans',
          'Yu Gothic',
          'Meiryo',
          'Inter',
          'ui-sans-serif',
          'system-ui',
        ],
        serif: ['Lora', 'Merriweather', 'ui-serif', 'Georgia'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular'],
        jp: ['Yuji Syuku', 'serif'],
        cursive: ['Cedarville Cursive', 'cursive'],
      },

      /* === 📏 Spacing Scale - Enhanced === */
      spacing: {
        128: '32rem',
        144: '36rem',
        // Custom spacing for GoRakuDo
        'section-padding-y': 'clamp(80px, 10vw, 120px)',
        'touch-target-min': '44px',
        'touch-target-padding': 'calc((44px - 1.5rem) / 2)',
      },

      /* === 📱 Responsive Breakpoints - GoRakuDo Standard === */
      screens: {
        xs: '320px', // Extra small devices
        sm: '640px', // Small devices
        md: '768px', // Medium devices
        lg: '1024px', // Large devices
        xl: '1280px', // Extra large devices
        '2xl': '1600px', // 2X large devices
        // Custom breakpoints for GoRakuDo
        'max-sm': { max: '640px' }, // Mobile-first approach
        'max-480': { max: '480px' }, // Small mobile devices
        'max-md': { max: '768px' }, // Tablet and below
        'max-lg': { max: '1024px' }, // Desktop and below
      },

      /* === 🟦 Border Radius - Enhanced === */
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        // Custom border radius for GoRakuDo
        pill: '35px',
        card: '20px',
        'btn-small': '25px',
      },

      /* === 🌙 Box Shadows - OKLCH Enhanced === */
      boxShadow: {
        soft: '0 4px 12px oklch(0 0 0 / 0.1)',
        strong: '0 8px 20px oklch(0 0 0 / 0.25)',
        accent: '0 0 15px oklch(0.65 0.25 280 / 0.6)',
        // Custom shadows for GoRakuDo - OKLCH
        card: '0 4px 12px oklch(0.65 0.25 280 / 0.3)',
        glow: '0 0 15px oklch(0.65 0.25 280 / 0.6)',
        content: '0 10px 15px -3px oklch(0 0 0 / 0.1)',
      },

      /* === ✨ Animations - Enhanced for GoRakuDo === */
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        // Custom animations for GoRakuDo
        wave: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px oklch(0.65 0.25 280 / 0.3)' },
          '50%': { boxShadow: '0 0 20px oklch(0.65 0.25 280 / 0.6)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.5s ease-out',
        spin: 'spin 1s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // Custom animations for GoRakuDo
        wave: 'wave 2s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
      },

      /* === 🎯 Z-Index Scale - GoRakuDo System === */
      zIndex: {
        'content-main': '10',
        'content-progress': '20',
        navbar: '50',
        modal: '9999',
      },

      /* === ⚡ Transition Timing === */
      transitionDuration: {
        fast: '0.3s',
        normal: '0.5s',
        slow: '1s',
      },

      /* === 🏝️ Islands Architecture Utilities === */
      // Client directive specific utilities
      islands: {
        load: 'opacity-100', // client:load - immediately visible
        idle: 'opacity-0 transition-opacity duration-300', // client:idle - below fold
        visible: 'opacity-0 transition-opacity duration-500', // client:visible - when in view
        media: 'opacity-0 transition-opacity duration-300', // client:media - responsive
      },

      // Hydration states
      hydration: {
        pending: 'opacity-50 pointer-events-none',
        loading: 'opacity-75 pointer-events-none',
        loaded: 'opacity-100 pointer-events-auto',
        error: 'opacity-100 pointer-events-auto border-2 border-semantic-error',
      },
    },
  },

  /* === 📦 Plugins - Enhanced for GoRakuDo === */
  plugins: [
    require('@tailwindcss/typography')({
      target: 'modern',
      modifiers: {
        prose: {
          // Enhanced typography for GoRakuDo content
          p: {
            'margin-bottom': '2.5rem', // 40px - generous spacing
            'line-height': '1.8', // 28.8px - comfortable reading
            'margin-top': '0.5rem', // 8px - small top margin
          },
          // Proper heading spacing
          'h1, h2, h3, h4, h5, h6': {
            'margin-top': '3rem', // 48px - clear section separation
            'margin-bottom': '1.5rem', // 24px - generous heading spacing
          },
          // Enhanced list spacing
          'ul, ol': {
            'margin-bottom': '2.5rem', // 40px - consistent with paragraphs
            'margin-top': '1rem', // 16px - space before lists
          },
          // Blockquote spacing
          blockquote: {
            'margin-top': '2rem', // 32px - space before blockquotes
            'margin-bottom': '2rem', // 32px - space after blockquotes
          },
          // Code block styling
          pre: {
            'background-color': 'oklch(0.05 0 0)', // Dark background
            'border-radius': '0.5rem',
            padding: '1.5rem',
          },
          code: {
            'background-color': 'oklch(0.1 0 0)',
            padding: '0.25rem 0.5rem',
            'border-radius': '0.25rem',
            'font-size': '0.875rem',
          },
        },
        // Custom prose variants for GoRakuDo
        'prose-go': {
          color: 'oklch(0.9 0 0)', // Light text
          'max-width': 'none', // Full width for content
        },
        // Astro Content Collections optimized prose
        'prose-content': {
          color: 'oklch(0.9 0 0)',
          'max-width': '65ch', // Optimal reading width
          '--tw-prose-body': 'oklch(0.9 0 0)',
          '--tw-prose-headings': 'oklch(1 0 0)',
          '--tw-prose-links': 'oklch(0.65 0.25 280)',
          '--tw-prose-code': 'oklch(0.8 0 0)',
          '--tw-prose-pre-bg': 'oklch(0.05 0 0)',
          '--tw-prose-th-borders': 'oklch(0.2 0.01 280)',
          '--tw-prose-td-borders': 'oklch(0.2 0.01 280)',
        },
      },
    }),
  ],

  /* === 🎨 Dark Mode Configuration === */
  darkMode: 'class', // Enable class-based dark mode

  /* === ⚡ Astro Native Performance Optimization === */
  corePlugins: {
    // Disable unused features to reduce bundle size (Astro performance budget)
    float: false, // Not needed for Astro static-first approach
    clear: false, // Rarely used in modern layouts
    skew: false, // Uncommon transform
    caretColor: false, // Not needed for content sites
    resize: false, // Not needed for static content
    scrollSnap: false, // Can be added back if needed
    scrollBehavior: false, // Not needed for static sites
  },

  /* === 🔧 Future Configuration === */
  future: {
    hoverOnlyWhenSupported: true, // Better mobile support
  },

  /* === 🚀 Experimental Optimizations === */
  experimental: {
    optimizeUniversalDefaults: true, // Optimize default values for better performance
  },
};
