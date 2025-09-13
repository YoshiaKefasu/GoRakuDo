<template>
  <div class="navbar-wrapper">
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="nav-container">
        <div class="nav-left">
          <span
            class="nav-item"
            role="button"
            tabindex="0"
            @click="goToResources"
            @keydown.enter="goToResources"
            @keydown.space="goToResources"
          >
            Resources
          </span>
          <span
            class="nav-item"
            role="button"
            tabindex="0"
            @click="goToTools"
            @keydown.enter="goToTools"
            @keydown.space="goToTools"
          >
            Tools
          </span>
          <span
            class="nav-item"
            role="button"
            tabindex="0"
            @click="goToPanduan"
            @keydown.enter="goToPanduan"
            @keydown.space="goToPanduan"
          >
            Panduan
          </span>
        </div>
        <div class="nav-center">
          <a
            href="/"
            class="logo-japanese"
            aria-label="GoRakuDo - Kembali ke beranda"
            title="GoRakuDo - Kembali ke beranda"
          >
            語楽道
          </a>
        </div>
        <div class="nav-right">
          <button
            class="get-started-btn"
            @click="goToPosts"
            @keydown.enter="goToPosts"
            @keydown.space="goToPosts"
            role="button"
            tabindex="0"
          >
            <svg
              class="nav-svg-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M11 3V11L14 8L17 11V3M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z"
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
            @keydown.enter="scrollToMission"
            @keydown.space="scrollToMission"
            aria-label="Mulai perjalanan belajar bahasa Jepang"
          >
            Mulai Sekarang
          </button>
        </div>
        <!-- Mobile menu button -->
        <button
          class="mobile-menu-btn"
          @click="openInvitationModal"
          @keydown.enter="openInvitationModal"
          @keydown.space="openInvitationModal"
          @touchstart="preloadModal"
          aria-label="Gabung komunitas Discord"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            class="nav-svg-icon lucide lucide-gamepad2-icon lucide-gamepad-2"
            aria-hidden="true"
          >
            <line x1="6" x2="10" y1="11" y2="11" />
            <line x1="8" x2="8" y1="9" y2="13" />
            <line x1="15" x2="15.01" y1="12" y2="12" />
            <line x1="18" x2="18.01" y1="10" y2="10" />
            <path
              d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Join
        </button>
      </div>
    </nav>

    <!-- Lazy-loaded Invitation Modal - Only rendered when needed -->
    <InvitationModal v-if="showModal" ref="invitationModal" />
  </div>
</template>

<style scoped>

  /* Navbar Component Variables - 最適化版 */
  :root {
    /* コンポーネント固有の変数のみ保持 */
    --navbar-bg-primary: oklch(4% 0.005 270 / 0.06);
    --navbar-bg-secondary: oklch(6% 0.008 270 / 0.09);
    --navbar-bg-tertiary: oklch(8% 0.01 270 / 0.14);
    --navbar-bg-quaternary: oklch(10% 0.012 270 / 0.18);

    --navbar-button-bg: oklch(45% 0.25 280);
    --navbar-button-hover: oklch(55% 0.16 280);

    --navbar-overlay-light: oklch(98% 0.002 270 / 0.015);
    --navbar-overlay-dark: oklch(4% 0.005 270 / 0.03);

    --navbar-glow: oklch(98% 0.002 270 / 0.02);
    --navbar-border: oklch(98% 0.002 270 / 0.04);

    --navbar-bg-hover: oklch(98% 0.002 270 / 0.1);
    --navbar-bg-focus: oklch(98% 0.002 270 / 0.15);
    --navbar-bg-active: oklch(98% 0.002 270 / 0.2);

    --navbar-logo-glow: oklch(65% 0.18 280 / 0.6);
    --navbar-ruby-text: oklch(65% 0.008 270);
    --navbar-ruby-hover: oklch(70% 0.12 280);
    
    --navbar-opacity: 1;
  }

    /* ---------- Navbar component - GoRakuDo UI/UX Team 2025 CSS Unit Optimization ---------- */
.navbar-wrapper {
  /* Wrapper for single root element - ensure proper layout */
  display: block !important;
  width: 100svw !important;
}

.navbar {
  /* Spacing: REM for responsive scaling with user font preferences */
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
  /* Fixed positioning: PX for precise control */
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
  top: 0 !important;
  z-index: 1000 !important; /* Fixed z-index for precise layering */

  /* Enhanced Organic Glass Morphism with Curved Edges - Using CSS Variables */
  background: 
    /* Primary organic glass layer with softer transparency */
    linear-gradient(
      135deg,
      var(--navbar-bg-primary) 0%,
      var(--navbar-bg-secondary) 20%,
      var(--navbar-bg-tertiary) 40%,
      var(--navbar-bg-quaternary) 60%,
      var(--navbar-bg-tertiary) 80%,
      var(--navbar-bg-secondary) 100%
    ),
    /* Soft organic overlay for natural depth */
      radial-gradient(
        ellipse at top,
        var(--navbar-overlay-light) 0%,
        transparent 40%,
        var(--navbar-overlay-dark) 100%
      ),
    /* Organic border glow for curved glass effect */
      radial-gradient(
        circle at 50% 0%,
        var(--navbar-glow) 0%,
        transparent 70%
      ) !important;

  /* Enhanced Organic Glass Backdrop Filters */
  backdrop-filter: blur(12px) saturate(150%) brightness(1.05) contrast(1.05) !important;
  -webkit-backdrop-filter: blur(12px) saturate(150%) brightness(1.05)
    contrast(1.02) !important;

  /* Organic curved glass border effect */
  border: 1px solid var(--navbar-border) !important;
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

/* ---------- UNIFIED SVG ICON STYLING SYSTEM ---------- */
.nav-svg-icon {
  color: inherit !important;
  stroke: currentColor !important;
  fill: none !important;

  flex-shrink: 0 !important;
  vertical-align: middle !important;

  /* global.cssの変数を使用 */
  transition:
    color var(--duration-fast) ease,
    transform var(--duration-fast) ease,
    opacity var(--duration-fast) ease !important;

  width: 1em !important;
  height: 1em !important;
  max-width: 100% !important;
  max-height: 100% !important;
}

/* REASONING: Hover effects for interactive SVG icons */
.nav-svg-icon:hover {
  /* REASONING: Subtle scale effect on hover for better UX */
  transform: scale(1.05) !important;
  opacity: 0.9 !important;
}

/* REASONING: Active state for pressed feedback */
.nav-svg-icon:active {
  transform: scale(0.95) !important;
  opacity: 0.8 !important;
}

/* global.cssの変数を使用 */
.nav-svg-icon:focus {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
  border-radius: 2px;
}

/* ---------- Mobile-First Base Styles (0px - 640px) ---------- */
.nav-left,
.nav-right {
  display: none !important; /* Show navigation on all screen sizes */
  flex: 1 1 0% !important;
  align-items: center !important;
}

.nav-left {
  gap: 0.75rem !important; /* Small gap for mobile */
}

.nav-right {
  justify-content: flex-end !important;
  gap: 0.5rem !important; /* Small gap for mobile */
}

.nav-item {
  cursor: pointer !important;
  /* Typography: REM for accessibility scaling with user font preferences */
  font-size: 0.75rem !important; /* Mobile-first: Start with smaller font */
  /* global.cssの変数を使用 */
  color: var(--color-muted-foreground) !important;
  /* Add padding for better touch targets */
  padding: 0.5rem 0.75rem !important;
  border-radius: 0.375rem !important;
  transition:
    color 0.12s ease,
    background-color 0.12s ease,
    transform 0.12s ease;
  /* Ensure proper focus outline */
  outline: none !important;
}

.nav-item:hover {
  /* global.cssの変数を使用 */
  color: var(--color-primary) !important;
  background-color: var(--navbar-bg-hover) !important;
  transform: translateY(-1px) !important;
}

.nav-item:focus {
  /* global.cssの変数を使用 */
  outline: 2px solid var(--color-primary) !important;
  outline-offset: 2px !important;
  background-color: var(--navbar-bg-focus) !important;
}

.nav-item:active {
  /* Active state for click feedback */
  transform: translateY(0) !important;
  background-color: var(--navbar-bg-active) !important;
}

.mobile-menu-btn {
  display: flex !important; /* Changed from block to flex for icon alignment */
  align-items: center !important; /* Center icon and text vertically */
  justify-content: center !important; /* Center content horizontally */
  gap: 0.25rem !important; /* Space between icon and text */
  cursor: pointer !important;
  /* Fixed border radius: PX for precise visual consistency */
  border-radius: 20px !important;
  border: none !important;
  /* global.cssの変数を使用 */
  background-color: var(--color-primary) !important;
  /* Button spacing: REM for accessibility scaling */
  padding-left: 1rem !important; /* 16px → 1rem for accessibility scaling */
  padding-right: 1rem !important; /* 16px → 1rem for accessibility scaling */
  padding-top: 0.5rem !important; /* 8px → 0.5rem for accessibility scaling */
  padding-bottom: 0.5rem !important; /* 8px → 0.5rem for accessibility scaling */
  /* Typography: REM for accessibility scaling */
  font-size: 0.875rem !important; /* 14px → 0.875rem for accessibility scaling */
  font-weight: 500 !important;
  /* global.cssの変数を使用 */
  color: var(--color-primary-foreground) !important;
  /* Letter spacing for better text readability */
  letter-spacing: 0.02em !important; /* Slightly looser spacing for "Join" */
  transition: background-color 0.12s ease;
}

.mobile-menu-btn:hover {
  /* global.cssの変数を使用 */
  background-color: var(--color-primary-dark) !important;
}

/* ---------- Logo Japanese Component - Brand consistency with accessibility ---------- */
.logo-japanese {
  cursor: pointer !important;
  /* Logo size: REM for accessibility while maintaining brand recognition */
  font-size: 1.5rem !important; /* Mobile-first: Start with smaller logo */
  line-height: 1 !important;
  text-decoration: none !important;
  /* global.cssの変数を使用 */
  font-family: var(--font-jp);
  color: var(--color-foreground) !important;

  /* Enhanced hover effects with lift and glow */
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    text-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    filter 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

  /* Initial state with subtle glow */
  text-shadow:
    0 0 0px var(--navbar-logo-glow),
    0 0 0px var(--navbar-logo-glow) !important;
}

.logo-japanese:hover {
  /* Lift effect with transform */
  transform: translateY(-2px) scale(1.02) !important;

  /* global.cssの変数を使用 */
  color: var(--color-primary) !important;

  /* Enhanced purple glow effect */
  text-shadow:
    0 0 8px var(--navbar-logo-glow),
    0 0 16px var(--navbar-logo-glow),
    0 0 24px var(--navbar-logo-glow) !important;

  /* Additional glow filter for extra effect */
  filter: drop-shadow(0 0 8px var(--navbar-logo-glow)) !important;
}

.logo-japanese rt {
  /* Fixed positioning: PX for precise brand consistency */
  margin-bottom: -15px !important; /* Keep PX for precise ruby text positioning */
  /* Relative scaling: EM for scaling with parent logo size */
  font-size: 0.4em !important; /* Keep EM for relative scaling to parent logo */
  font-weight: 600 !important;
  font-family: "Inter", sans-serif;
  /* global.cssの変数を使用 */
  color: var(--navbar-ruby-text) !important;

  /* Coordinated hover transition with parent logo */
  transition:
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    text-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

  /* Initial state */
  text-shadow: 0 0 0px var(--navbar-logo-glow) !important;
}

/* Ruby text hover effect coordinated with parent logo */
.logo-japanese:hover rt {
  /* global.cssの変数を使用 */
  color: var(--navbar-ruby-hover) !important;

  /* Subtle purple glow for ruby text */
  text-shadow:
    0 0 4px var(--navbar-logo-glow),
    0 0 8px var(--navbar-logo-glow) !important;
}

/* ---------- Get Started Button - REM for accessibility ---------- */
.get-started-btn {
  font-size: 0.875rem !important; /* 14px → 0.875rem for accessibility scaling */
  font-weight: 500 !important;
  /* Button spacing: REM for accessibility scaling */
  padding-left: 1.15rem !important; /* 24px → 1.5rem for accessibility scaling */
  padding-right: 1.15rem !important; /* 24px → 1.5rem for accessibility scaling */
  padding-top: 0.625rem !important; /* 10px → 0.625rem for accessibility scaling */
  padding-bottom: 0.625rem !important; /* 10px → 0.625rem for accessibility scaling */
  cursor: pointer !important;
  border: none !important;
  /* global.cssの変数を使用 */
  color: var(--color-primary-foreground) !important;
  background-color: var(--color-primary) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius-btn-small);

  transition:
    background-color var(--animate-duration-slow) ease,
    box-shadow var(--animate-duration-normal) ease,
    transform var(--animate-duration-fast) ease,
    opacity var(--animate-duration-fast) ease;

  /* Add flexbox for icon and text alignment */
  display: flex !important;
  align-items: center !important;
  gap: 0.25rem !important;
}

.get-started-btn:hover {
  /* global.cssの変数を使用 */
  background-color: var(--color-primary-dark) !important;

  /* Enhanced hover shadow - larger, more prominent */
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.get-started-btn:active {
  transform: translateY(0);
  opacity: 0.98;
}

/* ========== RESPONSIVE BREAKPOINTS - ALL BREAKPOINT STYLING BELOW ========== */
/* ---------- Small Breakpoint (320px+) - Tablet and Up ---------- */
@media (min-width: 320px) {
  /* 320px → 20rem for responsive scaling */
  .nav-left,
  .nav-right {
    display: none !important; /* Show navigation on all screen sizes */
    flex: 1 1 0% !important;
    align-items: center !important;
  }

  .nav-left {
    gap: 1rem !important; /* Smaller gap for mobile */
  }

  .nav-right {
    justify-content: flex-end !important;
    gap: 0.5rem !important; /* Smaller gap for mobile */
  }

  .nav-item {
    font-size: 0.8rem !important; /* Slightly larger for tablet */
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
@media (min-width: 640px) {
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
@media (min-width: 768px) {
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

  .nav-item {
    font-size: 0.875rem !important; /* Full size for desktop */
  }

  .mobile-menu-btn {
    display: none !important; /* Hide mobile menu button since navigation is now available */
  }
}

/* ---------- Large Breakpoint (1024px+) - Wide Desktop and Up ---------- */
@media (min-width: 1024px) {
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
@media (min-width: 1280px) {
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
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import InvitationModal from "./InvitationModal.vue";

// Lazy loading state
const showModal = ref(false);
const invitationModal = ref(null);

// Pre-load modal on touch start (mobile optimization)
function preloadModal() {
  if (!showModal.value) {
    showModal.value = true;
  }
}

// Navigation functions
function goToResources() {
  window.location.href = "/docs";
}

function goToPosts() {
  window.location.href = "/docs";
}

function goToTools() {
  window.location.href = "/tools";
}

function goToPanduan() {
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

// Lazy-loaded modal opening function - Mobile optimized
async function openInvitationModal() {
  try {
    // Ensure modal is loaded
    if (!showModal.value) {
      showModal.value = true;
      await nextTick();
    }

    // Wait a bit more for mobile devices
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Try to open the modal
    if (
      invitationModal.value &&
      typeof invitationModal.value.open === "function"
    ) {
      invitationModal.value.open();
      return;
    }

    // Fallback: Try global function
    if (typeof window.openInvitationModal === "function") {
      window.openInvitationModal();
      return;
    }

    // Final fallback: Open Discord directly
    window.open("https://discord.gg/j8qmYPAGQh", "_blank");
  } catch (err) {
    console.error("openInvitationModal error:", err);
    // Fallback to direct Discord link
    window.open("https://discord.gg/j8qmYPAGQh", "_blank");
  }
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
