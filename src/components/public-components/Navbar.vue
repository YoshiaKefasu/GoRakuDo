<template>
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-container">
      <div class="nav-left">
        <span class="nav-item" role="button" tabindex="0">Resources</span>
        <span class="nav-item" role="button" tabindex="0">Tools</span>
        <span class="nav-item" role="button" tabindex="0">Panduan</span>
      </div>
      <div class="nav-center">
        <a
          href="/"
          class="logo-japanese"
          aria-label="GoRakuDo - Kembali ke beranda"
        >
          語楽道
        </a>
      </div>
      <div class="nav-right">
        <button
          class="get-started-btn"
          @click="goToPosts"
          role="button"
          tabindex="0"
        >
          <svg
            class="btn-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M11 3V11L14 8L17 11V3M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Metodologi
        </button>
        <button
          class="get-started-btn"
          @click="scrollToMission"
          aria-label="Mulai perjalanan belajar bahasa Jepang"
        >
          Mulai Sekarang
        </button>
      </div>
      <!-- Mobile menu button -->
      <button
        class="mobile-menu-btn"
        @click="openInvitationModal"
        aria-label="Gabung komunitas Discord"
      >
        Join
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* ---------- Navbar component - Google UI/UX Team 2025 CSS Unit Optimization ---------- */
.navbar {
  /* Spacing: REM for responsive scaling with user font preferences */
  padding-top: 0.75rem !important;
  padding-bottom: 1rem !important;
  /* Fixed positioning: PX for precise control */
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
  top: 0 !important;
  z-index: 1000 !important; /* Fixed z-index for precise layering */

  /* Enhanced Organic Glass Morphism with Curved Edges */
  background: 
    /* Primary organic glass layer with softer transparency */
    linear-gradient(
      135deg,
      oklch(4% 0.005 270 / 0.06) 0%,
      oklch(6% 0.008 270 / 0.09) 20%,
      oklch(8% 0.01 270 / 0.14) 40%,
      oklch(10% 0.012 270 / 0.18) 60%,
      oklch(8% 0.01 270 / 0.14) 80%,
      oklch(6% 0.008 270 / 0.09) 100%
    ),
    /* Soft organic overlay for natural depth */
      radial-gradient(
        ellipse at top,
        oklch(98% 0.002 270 / 0.015) 0%,
        transparent 40%,
        oklch(4% 0.005 270 / 0.03) 100%
      ),
    /* Organic border glow for curved glass effect */
      radial-gradient(
        circle at 50% 0%,
        oklch(98% 0.002 270 / 0.02) 0%,
        transparent 70%
      ) !important;

  /* Enhanced Organic Glass Backdrop Filters */
  backdrop-filter: blur(12px) saturate(150%) brightness(1.05) contrast(1.05) !important;
  -webkit-backdrop-filter: blur(12px) saturate(150%) brightness(1.05)
    contrast(1.02) !important;

  /* Organic curved glass border effect */
  border: 1px solid oklch(98% 0.002 270 / 0.04) !important;
  border-radius: 0.75rem !important;

  /* Smooth transitions for all glass properties */
  transition:
    background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    backdrop-filter 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.nav-container {
  margin-left: auto !important;
  margin-right: auto !important;
  display: flex !important;
  /* Container width: REM for responsive scaling */
  max-width: 75rem !important; /* 1200px → 75rem for responsive scaling */
  align-items: center !important;
  justify-content: space-between !important;
  /* Spacing: REM for responsive scaling with user font preferences */
  padding-left: 1.25rem !important; /* 20px → 1.25rem for responsive scaling */
  padding-right: 1.25rem !important; /* 20px → 1.25rem for responsive scaling */
  background: transparent !important;
}

/* ---------- Mobile-First Base Styles (0px - 640px) ---------- */
.nav-left,
.nav-right {
  display: none !important; /* Hidden by default on mobile */
}

.nav-item {
  cursor: pointer !important;
  /* Typography: REM for accessibility scaling with user font preferences */
  font-size: 0.875rem !important; /* 14px → 0.875rem for accessibility scaling */
  /* Enhanced WCAG-compliant text color using OKLCH */
  color: oklch(75% 0.008 270) !important; /* Enhanced contrast from #cccccc */
  transition: color 0.12s ease;
}

.nav-item:hover {
  /* Enhanced hover color using brand purple from global.css */
  color: oklch(
    65% 0.18 280
  ) !important; /* Brand purple with excellent contrast */
}

.mobile-menu-btn {
  display: block !important; /* Visible by default on mobile */
  cursor: pointer !important;
  /* Fixed border radius: PX for precise visual consistency */
  border-radius: 20px !important;
  border: none !important;
  /* Enhanced WCAG-compliant button background using OKLCH */
  background-color: oklch(
    45% 0.25 280
  ) !important; /* Brand purple converted from #410AC2 */
  /* Button spacing: REM for accessibility scaling */
  padding-left: 1rem !important; /* 16px → 1rem for accessibility scaling */
  padding-right: 1rem !important; /* 16px → 1rem for accessibility scaling */
  padding-top: 0.5rem !important; /* 8px → 0.5rem for accessibility scaling */
  padding-bottom: 0.5rem !important; /* 8px → 0.5rem for accessibility scaling */
  /* Typography: REM for accessibility scaling */
  font-size: 0.875rem !important; /* 14px → 0.875rem for accessibility scaling */
  font-weight: 500 !important;
  /* Enhanced WCAG-compliant text color */
  color: oklch(98% 0.002 270) !important; /* Pure white for maximum contrast */
  transition: background-color 0.12s ease;
}

.mobile-menu-btn:hover {
  /* Enhanced hover state using darker purple from global.css */
  background-color: oklch(
    55% 0.16 280
  ) !important; /* Darker purple for hover */
}

/* ---------- Logo Japanese Component - Brand consistency with accessibility ---------- */
.logo-japanese {
  cursor: pointer !important;
  /* Logo size: REM for accessibility while maintaining brand recognition */
  font-size: 1.5rem !important; /* Mobile-first: Start with smaller logo */
  line-height: 1 !important;
  text-decoration: none !important;
  font-family: "Yuji Syuku", serif;
  /* Enhanced WCAG-compliant logo color using OKLCH */
  color: oklch(98% 0.002 270) !important; /* Pure white for maximum contrast */

  /* Enhanced hover effects with lift and glow */
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    text-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    filter 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

  /* Initial state with subtle glow */
  text-shadow:
    0 0 0px oklch(65% 0.18 280 / 0),
    0 0 0px oklch(65% 0.18 280 / 0) !important;
}

.logo-japanese:hover {
  /* Lift effect with transform */
  transform: translateY(-2px) scale(1.02) !important;

  /* Purple accent glow on hover */
  color: oklch(75% 0.15 280) !important; /* Lighter purple for hover */

  /* Enhanced purple glow effect */
  text-shadow:
    0 0 8px oklch(65% 0.18 280 / 0.6),
    0 0 16px oklch(65% 0.18 280 / 0.4),
    0 0 24px oklch(65% 0.18 280 / 0.2) !important;

  /* Additional glow filter for extra effect */
  filter: drop-shadow(0 0 8px oklch(65% 0.18 280 / 0.3)) !important;
}

.logo-japanese rt {
  /* Fixed positioning: PX for precise brand consistency */
  margin-bottom: -15px !important; /* Keep PX for precise ruby text positioning */
  /* Relative scaling: EM for scaling with parent logo size */
  font-size: 0.4em !important; /* Keep EM for relative scaling to parent logo */
  font-weight: 600 !important;
  font-family: "Inter", sans-serif;
  /* Enhanced WCAG-compliant ruby text color */
  color: oklch(65% 0.008 270) !important; /* Light gray with better contrast */

  /* Coordinated hover transition with parent logo */
  transition:
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    text-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

  /* Initial state */
  text-shadow: 0 0 0px oklch(65% 0.18 280 / 0) !important;
}

/* Ruby text hover effect coordinated with parent logo */
.logo-japanese:hover rt {
  /* Enhanced ruby text color on hover */
  color: oklch(
    70% 0.12 280
  ) !important; /* Slightly lighter purple for ruby text */

  /* Subtle purple glow for ruby text */
  text-shadow:
    0 0 4px oklch(65% 0.18 280 / 0.4),
    0 0 8px oklch(65% 0.18 280 / 0.2) !important;
}

/* ---------- Get Started Button - REM for accessibility ---------- */
.get-started-btn {
  /* Button spacing: REM for accessibility scaling */
  padding-left: 1.15rem !important; /* 24px → 1.5rem for accessibility scaling */
  padding-right: 1.15rem !important; /* 24px → 1.5rem for accessibility scaling */
  padding-top: 0.625rem !important; /* 10px → 0.625rem for accessibility scaling */
  padding-bottom: 0.625rem !important; /* 10px → 0.625rem for accessibility scaling */
  cursor: pointer !important;
  border: none !important;
  /* Enhanced WCAG-compliant button background using OKLCH */
  background-color: oklch(
    45% 0.25 280
  ) !important; /* Brand purple converted from #410AC2 */
  /* Typography: REM for accessibility scaling */
  font-size: 0.875rem !important; /* 14px → 0.875rem for accessibility scaling */
  font-weight: 500 !important;
  /* Enhanced WCAG-compliant text color */
  color: oklch(98% 0.002 270) !important; /* Pure white for maximum contrast */
  /* Border radius: CSS variable for consistent theming */
  border-radius: var(--border-radius-btn-small);
  transition:
    box-shadow var(--animate-duration-normal) ease,
    transform var(--animate-duration-fast) ease,
    opacity var(--animate-duration-fast) ease;

  /* Add flexbox for icon and text alignment */
  display: flex !important;
  align-items: center !important;
  gap: 0.25rem !important;
}

.get-started-btn:hover {
  /* Enhanced hover state using darker purple from global.css */
  background-color: oklch(30% 0.3 280) !important; /* Darker purple for hover */
  box-shadow: 0 12px 35px var(--color-accent-shadow);
  transform: translateY(-1px);
}

.get-started-btn:active {
  transform: translateY(0);
  opacity: 0.98;
}

/* Icon styling within button */
.btn-icon {
  /* Icon inherits the button's text color (white) */
  color: inherit !important;
  /* Ensure icon scales with button text */
  flex-shrink: 0 !important;
  /* Smooth transition for any icon color changes */
  transition: color 0.12s ease !important;
}

/* ========== RESPONSIVE BREAKPOINTS - ALL BREAKPOINT STYLING BELOW ========== */
/* ---------- Small Breakpoint (640px+) - Tablet and Up ---------- */
@media (min-width: 24rem) {
  /* 640px → 40rem for responsive scaling */
  .nav-left,
  .nav-right {
    display: none !important; /* Hidden by default on mobile */
  }

  .navbar {
    /* Enhanced spacing for larger screens */
    padding-top: 0.75rem !important;
    padding-bottom: 1rem !important;
  }

  .nav-container {
    /* Enhanced container spacing for tablet */
    padding-left: 1.25rem !important;
    padding-right: 1.25rem !important;
  }
}

/* ---------- Small Breakpoint (640px+) - Tablet and Up ---------- */
@media (min-width: 40rem) {
  .navbar {
    /* Enhanced spacing for larger screens */
    padding-top: 1rem !important; /* 16px → 1rem for responsive scaling */
    padding-bottom: 1.25rem !important; /* 20px → 1.25rem for responsive scaling */
  }

  .nav-container {
    /* Enhanced container spacing for tablet */
    padding-left: 1.5rem !important; /* 24px → 1.5rem for responsive scaling */
    padding-right: 1.5rem !important; /* 24px → 1.5rem for responsive scaling */
  }
}

/* ---------- Medium Breakpoint (768px+) - Desktop and Up ---------- */
@media (min-width: 48rem) {
  /* 768px → 48rem for responsive scaling */
  .nav-left,
  .nav-right {
    display: flex !important; /* Show desktop navigation */
    flex: 1 1 0% !important;
    align-items: center !important;
  }

  .nav-left {
    gap: 2rem !important; /* 32px → 2rem for responsive scaling */
  }

  .nav-right {
    justify-content: flex-end !important;
    gap: 1rem !important;
  }

  .mobile-menu-btn {
    display: none !important; /* Hide mobile menu button on desktop */
  }
}

/* ---------- Large Breakpoint (1024px+) - Wide Desktop and Up ---------- */
@media (min-width: 64rem) {
  /* 1024px → 64rem for responsive scaling */
  .nav-container {
    /* Enhanced container spacing for wide desktop */
    padding-left: 2rem !important; /* 32px → 2rem for responsive scaling */
    padding-right: 2rem !important; /* 32px → 2rem for responsive scaling */
  }

  .nav-left {
    /* Enhanced gap for wide desktop */
    gap: 2.5rem !important;
  }

  .nav-right {
    gap: 1.5rem !important;
  }

  .logo-japanese {
    font-size: 1.75rem !important; /* Full logo size for desktop */
  }
}

/* ---------- Extra Large Breakpoint (1280px+) - Ultra Wide Desktop ---------- */
@media (min-width: 80rem) {
  /* 1280px → 80rem for responsive scaling */
  .nav-container {
    /* Maximum container spacing for ultra wide screens */
    padding-left: 2.5rem !important; /* 40px → 2.5rem for responsive scaling */
    padding-right: 2.5rem !important; /* 40px → 2.5rem for responsive scaling */
  }

  .nav-left {
    /* Maximum gap for ultra wide screens */
    gap: 3rem !important; /* 48px → 3rem for responsive scaling */
  }

  .nav-right {
    gap: 1.75rem !important;
  }

  .logo-japanese {
    font-size: 1.85rem !important; /* Full logo size for desktop */
  }
}
</style>

<script setup>
import { onMounted, onUnmounted } from "vue";

// `hompage-script.js`から移動した関数
function goToPosts() {
  window.location.href = "/docs";
}

function scrollToMission() {
  const missionSection = document.getElementById("mission");
  const navbar = document.querySelector(".navbar");

  if (missionSection && navbar) {
    const navbarHeight = navbar.offsetHeight;
    const missionSectionTop =
      missionSection.getBoundingClientRect().top + window.pageYOffset;
    const desiredTopMargin = 40;
    const scrollToPosition =
      missionSectionTop - navbarHeight - desiredTopMargin;
    window.scrollTo({
      top: scrollToPosition,
      behavior: "smooth",
    });
  }
}

function openInvitationModal() {
  // Use the same event-based system as the homepage
  window.dispatchEvent(new CustomEvent("open-invitation-modal"));
}

// Navbarのスクロール効果 - Dynamic transparency based on scroll
function handleNavbarScroll() {
  const scrollY = window.scrollY;
  const maxScroll = 200; // Adjust this value to control when full opacity is reached
  const opacity = Math.min(scrollY / maxScroll, 1);

  // Update CSS variable for dynamic gradient transparency
  document.documentElement.style.setProperty("--navbar-opacity", opacity);
}

// コンポーネントがページに表示されたら、スクロールイベントを追加
onMounted(() => {
  window.addEventListener("scroll", handleNavbarScroll);
});

// コンポーネントがページから消えるときに、イベントを削除（メモリリーク防止）
onUnmounted(() => {
  window.removeEventListener("scroll", handleNavbarScroll);
});
</script>
