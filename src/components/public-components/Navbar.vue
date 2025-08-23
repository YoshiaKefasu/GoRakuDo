<template>
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-container">
      <div class="nav-left">
        <span class="nav-item" role="button" tabindex="0">Tentang</span>
        <span class="nav-item" role="button" tabindex="0">Metodologi</span>
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
        <span class="nav-item" role="button" tabindex="0">Resources</span>
        <span class="nav-item" @click="goToPosts" role="button" tabindex="0"
          >Panduan</span
        >
        <span class="nav-item" role="button" tabindex="0">Tools</span>
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
  padding-top: 0.5rem !important; /* 8px → 0.5rem for accessibility scaling */
  padding-bottom: 0.25rem !important; /* 4px → 0.25rem for accessibility scaling */
  /* Fixed positioning: PX for precise control */
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
  top: 0 !important;
  z-index: 1000 !important; /* Fixed z-index for precise layering */
  background: linear-gradient(
    to top,
    rgba(10, 10, 10, 0) 0%,
    rgba(10, 10, 10, 0.15) 2%,
    rgba(10, 10, 10, 0.45) 5%,
    rgba(10, 10, 10, 0.65) 7%,
    rgba(10, 10, 10, 0.95) 10%,
    rgba(10, 10, 10, 0.99) 11%
  ) !important;
  transition: background 0.3s ease;
  border: none;
  backdrop-filter: none !important;
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

.nav-left,
.nav-right {
  display: flex !important;
  flex: 1 1 0% !important;
  align-items: center !important;
  /* Gap: REM for responsive scaling */
  gap: 2rem !important; /* 32px → 2rem for responsive scaling */
}

.nav-right {
  justify-content: flex-end !important;
}

.nav-item {
  cursor: pointer !important;
  /* Typography: REM for accessibility scaling with user font preferences */
  font-size: 0.875rem !important; /* 14px → 0.875rem for accessibility scaling */
  color: var(--color-text-secondary);
  transition: color 0.12s ease;
}

.nav-item:hover {
  color: var(--color-accent);
}

/* ---------- Get Started Button - REM for accessibility ---------- */
.get-started-btn {
  /* Button spacing: REM for accessibility scaling */
  padding-left: 1.5rem !important; /* 24px → 1.5rem for accessibility scaling */
  padding-right: 1.5rem !important; /* 24px → 1.5rem for accessibility scaling */
  padding-top: 0.625rem !important; /* 10px → 0.625rem for accessibility scaling */
  padding-bottom: 0.625rem !important; /* 10px → 0.625rem for accessibility scaling */
  cursor: pointer !important;
  border: none !important;
  background-color: var(--color-accent-purple) !important;
  /* Typography: REM for accessibility scaling */
  font-size: 0.875rem !important; /* 14px → 0.875rem for accessibility scaling */
  font-weight: 500 !important;
  color: var(--color-text-primary) !important;
  /* Border radius: CSS variable for consistent theming */
  border-radius: var(--border-radius-btn-small);
  transition: background-color 0.12s ease;
}

.get-started-btn:hover {
  background-color: var(--color-accent-dark) !important;
}

/* ---------- Mobile Menu Button ---------- */
.mobile-menu-btn {
  display: none !important;
}

/* Mobile responsive adjustments - REM breakpoints for accessibility */
@media (max-width: 48rem) { /* 768px → 48rem for responsive scaling */
  .navbar {
    /* Mobile spacing: REM for accessibility scaling */
    padding-top: 0.75rem !important; /* 12px → 0.75rem for accessibility scaling */
    padding-bottom: 0.75rem !important; /* 12px → 0.75rem for accessibility scaling */
  }
}

/* ---------- Mobile Menu Button (Responsive) - REM breakpoints ---------- */
@media (max-width: 64rem) { /* 1024px → 64rem for responsive scaling */
  .nav-left,
  .nav-right {
    display: none !important;
  }

  .mobile-menu-btn {
    display: block !important;
    cursor: pointer !important;
    /* Fixed border radius: PX for precise visual consistency */
    border-radius: 20px !important;
    border: none !important;
    background-color: var(--color-accent-purple) !important;
    /* Button spacing: REM for accessibility scaling */
    padding-left: 1rem !important; /* 16px → 1rem for accessibility scaling */
    padding-right: 1rem !important; /* 16px → 1rem for accessibility scaling */
    padding-top: 0.5rem !important; /* 8px → 0.5rem for accessibility scaling */
    padding-bottom: 0.5rem !important; /* 8px → 0.5rem for accessibility scaling */
    /* Typography: REM for accessibility scaling */
    font-size: 0.875rem !important; /* 14px → 0.875rem for accessibility scaling */
    font-weight: 500 !important;
    color: var(--color-text-primary) !important;
    transition: background-color 0.12s ease;
  }

  .mobile-menu-btn:hover {
    background-color: var(--color-accent-dark) !important;
  }

  .logo-japanese {
    /* Mobile logo: REM for accessibility scaling */
    font-size: 1.5rem !important; /* 24px → 1.5rem for accessibility scaling */
  }
}

/* ---------- Logo Japanese Component - Brand consistency with accessibility ---------- */
.logo-japanese {
  cursor: pointer !important;
  /* Logo size: REM for accessibility while maintaining brand recognition */
  font-size: 1.75rem !important; /* 28px → 1.75rem for accessibility scaling */
  line-height: 1 !important;
  text-decoration: none !important;
  font-family: "Yuji Syuku", serif;
  color: var(--color-text-primary);
}

.logo-japanese rt {
  /* Fixed positioning: PX for precise brand consistency */
  margin-bottom: -15px !important; /* Keep PX for precise ruby text positioning */
  /* Relative scaling: EM for scaling with parent logo size */
  font-size: 0.4em !important; /* Keep EM for relative scaling to parent logo */
  font-weight: 600 !important;
  font-family: "Inter", sans-serif;
  color: #999;
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
  document.documentElement.style.setProperty('--navbar-opacity', opacity);
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