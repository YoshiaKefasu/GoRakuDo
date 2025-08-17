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
/* Styles moved to global.css using Tailwind v4 @media syntax */
</style>

<script setup>
import { onMounted, onUnmounted } from "vue";

// `hompage-script.js`から移動した関数
function goToPosts() {
  window.location.href = "/docs/posts";
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