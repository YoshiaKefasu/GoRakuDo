<template>
  <transition name="fade-scale">
    <div
      v-if="isOpen"
      id="invitationModal"
      class="modal-overlay"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <!-- Floating background particles with varied animations -->
      <div
        class="floating-particle"
        style="top: 10%; left: 10%; animation: float 6s ease-in-out infinite"
      >
        🌸
      </div>
      <div
        class="floating-particle"
        style="
          top: 20%;
          right: 10%;
          animation: float-2 8s ease-in-out infinite 2s;
        "
      >
        ⭐
      </div>
      <div
        class="floating-particle"
        style="
          bottom: 20%;
          left: 20%;
          animation: float-3 7s ease-in-out infinite 1s;
        "
      >
        🎌
      </div>
      <div
        class="floating-particle"
        style="
          bottom: 30%;
          right: 20%;
          animation: float 9s ease-in-out infinite 3s;
        "
      >
        🌊
      </div>

      <div class="invitation-container">
        <button class="back-button" @click="close" aria-label="Tutup modal">
          ←
        </button>

        <div class="header">
          <ruby class="japanese-title" id="modal-title">
            語<rt>ご</rt>楽<rt>らく</rt>道<rt>どう</rt>
          </ruby>
        </div>

        <div class="content">
          <p>
            Kami bukan komunitas biasa. Kita adalah rumah bagi para pembelajar
            otodidak yang terjun langsung ke
            <strong>🌊 Metode IMMERSION</strong>—sebuah cara belajar yang seru,
            alami, dan terbukti secara ilmiah oleh 🎓 Prof. Stephen Krashen.
          </p>

          <p><strong>Siapa yang kami cari?</strong></p>
          <ul class="member-list" role="list">
            <li role="listitem">
              ✅ <strong>Otaku & Anime Lovers:</strong> Ubah hobimu jadi skill!
            </li>
            <li role="listitem">
              ✅ <strong>Pembelajar Serius:</strong> Temukan cara belajar paling
              efektif.
            </li>
          </ul>

          <p class="final-pitch">
            Semua 100% GRATIS👍<br />Yang kamu butuhkan hanya NIAT.<br />Ayo
            bergabung..!
          </p>
        </div>

        <a
          href="https://discord.gg/j8qmYPAGQh"
          target="_blank"
          rel="noopener noreferrer"
          class="discord-link"
          aria-label="Bergabung dengan server Discord GoRakuDo"
        >
          <div class="discord-header">Alamat Komunitas Digital Kami:</div>
          <div class="discord-url">
            discord.gg/j8qmYPAGQh<span class="arrow">→</span>
          </div>
        </a>

        <div class="signature">
          <img
            src="/img/Logo%20Discord%2080px.webp"
            alt="Logo Gorakudou"
            class="logo-stamp"
          />
          <div class="signature-text">
            <div class="signature-title">Hormat kami,</div>
            <p class="signature-name">Tim GoRakuDo</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isOpen = ref(false);

function open() {
  isOpen.value = true;
  document.body.style.overflow = "hidden";
}

function close() {
  isOpen.value = false;
  document.body.style.overflow = "";
}

// Keyboard navigation handler
function handleKeydown(e) {
  if (e.key === "Escape" && isOpen.value) {
    close();
  }
}

// Touch gesture support for mobile
let touchStartY = 0;
let touchEndY = 0;

function handleTouchStart(e) {
  touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
  touchEndY = e.changedTouches[0].clientY;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 100;
  const swipeDistance = touchEndY - touchStartY;

  // Swipe down to close modal (only if started from top area)
  if (swipeDistance > swipeThreshold && touchStartY < 100) {
    close();
  }
}

// Mobile viewport height detection and adjustment
function adjustModalForMobile() {
  const modalOverlay = document.querySelector(".modal-overlay");
  const invitationContainer = document.querySelector(".invitation-container");

  if (modalOverlay && invitationContainer) {
    if (window.innerHeight < 700) {
      // Small screen detected - adjust for mobile scrolling
      modalOverlay.style.alignItems = "flex-start";
      modalOverlay.style.paddingTop = "10px";
      modalOverlay.style.paddingBottom = "10px";
    } else {
      // Desktop - center the modal
      modalOverlay.style.alignItems = "center";
      modalOverlay.style.paddingTop = "20px";
      modalOverlay.style.paddingBottom = "20px";
    }
  }
}

onMounted(() => {
  // Expose to global for legacy code compatibility
  window.openInvitationModal = open;
  window.closeInvitationModal = close;

  // Add keyboard event listener
  document.addEventListener("keydown", handleKeydown);

  // Add touch event listeners for mobile gesture support
  const modalOverlay = document.querySelector(".modal-overlay");
  if (modalOverlay) {
    modalOverlay.addEventListener("touchstart", handleTouchStart);
    modalOverlay.addEventListener("touchend", handleTouchEnd);
  }

  // Adjust modal for mobile viewport
  adjustModalForMobile();
  window.addEventListener("resize", adjustModalForMobile);

  // Add content animations when modal opens
  if (isOpen.value) {
    animateContent();
  }

  // Global event listener for opening modal from anywhere
  window.addEventListener("open-invitation-modal", open);

  // Global function for opening modal
  window.openInvitationModal = open;

  // Check URL parameter for modal opening
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("openModal") === "true") {
    open();
    // Clean up URL
    const newUrl = window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }
});

onUnmounted(() => {
  // Clean up event listeners
  document.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", adjustModalForMobile);

  const modalOverlay = document.querySelector(".modal-overlay");
  if (modalOverlay) {
    modalOverlay.removeEventListener("touchstart", handleTouchStart);
    modalOverlay.removeEventListener("touchend", handleTouchEnd);
  }

  // Clean up global listeners
  window.removeEventListener("open-invitation-modal", open);
  delete window.openInvitationModal;
});

// Watch for modal open state to trigger animations
import { watch } from "vue";
watch(isOpen, (newValue) => {
  if (newValue) {
    // Trigger animations after modal is rendered
    setTimeout(animateContent, 100);
    // Adjust for mobile after modal opens
    setTimeout(adjustModalForMobile, 150);
  }
});

function animateContent() {
  const elements = document.querySelectorAll(".content p, .member-list li");
  elements.forEach((el, index) => {
    const element = el;
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";

    setTimeout(
      () => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      },
      (index + 1) * 100,
    );
  });
}
</script>

<style scoped>
/* Import fonts to match discord.astro exactly */
@import url("https://fonts.googleapis.com/css2?family=Yuji+Syuku&family=Inter:wght@300;400;500;600;700&family=Lora:wght@400;600&family=Cedarville+Cursive&display=swap");

/* Modal overlay with responsive scrolling - FIXED for mobile overflow */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  display: flex;
  align-items: center; /* Default center for desktop */
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  color: #333;
  /* Enable smooth scrolling on mobile */
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden; /* Prevent horizontal scrolling */
  -webkit-overflow-scrolling: touch; /* iOS smooth scrolling */
  scroll-behavior: smooth; /* Modern browsers */
}

/* Main invitation container - responsive for mobile scrolling with wave pattern background and FIXED DESKTOP WIDTH */
.invitation-container {
  background-color: #fdfdf6;
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"%3E%3Cg fill="none" stroke="%23DCD9D5" stroke-width="1"%3E%3Cpath d="M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30S1000 75 1000 75"/%3E%3Cpath d="M-500 125c0 0 125-30 250-30S0 125 0 125s125 30 250 30s250-30 250-30s125-30 250-30S1000 125 1000 125"/%3E%3Cpath d="M-500 175c0 0 125-30 250-30S0 175 0 175s125 30 250 30s250-30 250-30s125-30 250-30S1000 175 1000 175"/%3E%3Cpath d="M-500 225c0 0 125-30 250-30S0 225 0 225s125 30 250 30s250-30 250-30s125-30 250-30S1000 225 1000 225"/%3E%3Cpath d="M-500 275c0 0 125-30 250-30S0 275 0 275s125 30 250 30s250-30 250-30s125-30 250-30S1000 275 1000 275"/%3E%3Cpath d="M-500 325c0 0 125-30 250-30S0 325 0 325s125 30 250 30s250-30 250-30s125-30 250-30S1000 325 1000 325"/%3E%3Cpath d="M-500 375c0 0 125-30 250-30S0 375 0 375s125 30 250 30s250-30 250-30s125-30 250-30S1000 375 1000 375"/%3E%3Cpath d="M-500 425c0 0 125-30 250-30S0 425 0 425s125 30 250 30s250-30 250-30s125-30 250-30S1000 425 1000 425"/%3E%3Cpath d="M-500 475c0 0 125-30 250-30S0 475 0 475s125 30 250 30s250-30 250-30s125-30 250-30S1000 475 1000 475"/%3E%3Cpath d="M-500 525c0 0 125-30 250-30S0 525 0 525s125 30 250 30s250-30 250-30s125-30 250-30S1000 525 1000 525"/%3E%3Cpath d="M-500 575c0 0 125-30 250-30S0 575 0 575s125 30 250 30s250-30 250-30s125-30 250-30S1000 575 1000 575"/%3E%3Cpath d="M-500 625c0 0 125-30 250-30S0 625 0 625s125 30 250 30s250-30 250-30s125-30 250-30S1000 625 1000 625"/%3E%3Cpath d="M-500 675c0 0 125-30 250-30S0 675 0 675s125 30 250 30s250-30 250-30s125-30 250-30S1000 675 1000 675"/%3E%3Cpath d="M-500 725c0 0 125-30 250-30S0 725 0 725s125 30 250 30s250-30 250-30s125-30 250-30S1000 725 1000 725"/%3E%3Cpath d="M-500 775c0 0 125-30 250-30S0 775 0 775s125 30 250 30s250-30 250-30s125-30 250-30S1000 775 1000 775"/%3E%3C/g%3E%3C/svg%3E');
  border: 1px solid #e0dcd8;

  /* FIXED DESKTOP WIDTH - No expansion beyond 600px */
  max-width: 600px;
  width: 600px; /* Fixed width for desktop */
  min-width: 600px; /* Prevent shrinking */

  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(139, 93, 255, 0.2);
  position: relative;
  animation: fadeIn 1s ease-out;
  margin: auto;
  min-height: fit-content;
}

/* Fade-in animation matching discord.astro */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Back button styling - responsive positioning */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 10; /* Ensure it's above content */
}

.back-button:hover {
  background: #f0f0f0;
  color: #333;
}

/* Header section */
.header {
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 25px;
  margin-bottom: 30px;
}

/* Japanese title - responsive typography */
.japanese-title {
  font-family: "Yuji Syuku", serif;
  font-size: 4.5rem;
  color: #2a2a2a;
  ruby-position: over;
  font-weight: 400;
  line-height: 1;
}

.japanese-title rt {
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  color: #555;
  font-weight: 600;
}

/* Content styling - responsive typography */
.content {
  color: #3c3c3c;
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 30px;
  font-family: "Lora", serif;
}

.content p {
  margin-bottom: 1.2em;
}

.content strong {
  color: #333;
}

/* Member list styling */
.member-list {
  list-style: none;
  padding-left: 0;
  margin: 25px 0;
}

.member-list li {
  margin-bottom: 10px;
  font-family: "Inter", sans-serif;
}

/* Final pitch styling */
.final-pitch {
  font-weight: 600;
  text-align: center;
  font-size: 1.15rem;
  margin-top: 30px;
  color: #333;
}

/* Discord link styling - exact replica */
.discord-link {
  display: block;
  text-decoration: none;
  color: #333;
  background-color: #f8f9fa;
  border: 1px solid #eaeaea;
  margin-left: 2.5px !important;
  margin-right: 2.5px !important;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  margin-bottom: 40px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.discord-link:hover {
  border-color: #8b5dff;
  box-shadow: 0 5px 15px rgba(139, 93, 255, 0.2);
  transform: scale(1.02);
}

.discord-header {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.discord-url {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  color: #8b5dff;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.arrow {
  font-weight: bold;
  transition: transform 0.2s ease;
  display: inline-block;
}

.discord-link:hover .arrow {
  transform: translateX(5px);
}

/* Signature section - responsive layout */
.signature {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 20px;
}

.logo-stamp {
  width: 80px;
  height: 80px;
  opacity: 0.85;
  flex-shrink: 0;
}

.signature-text {
  text-align: right;
}

.signature-title {
  text-align: right;
  margin-bottom: -10px;
  color: #333;
}

.signature-name {
  font-family: "Cedarville Cursive", cursive;
  font-size: 1.9rem;
  color: #333;
  text-align: right;
}

/* Floating particles - ensure they don't interfere with scrolling */
.floating-particle {
  position: fixed;
  pointer-events: none;
  opacity: 0.15;
  z-index: -1;
  /* Prevent particles from blocking scroll */
}

/* Buttery smooth floating animations with varied patterns */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-8px) translateX(4px);
  }
  50% {
    transform: translateY(-4px) translateX(-6px);
  }
  75% {
    transform: translateY(-12px) translateX(2px);
  }
}

@keyframes float-2 {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-6px) translateX(-3px);
  }
  66% {
    transform: translateY(-10px) translateX(5px);
  }
}

@keyframes float-3 {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-8px) translateX(-2px);
  }
}

/* Mobile-first responsive design - FIXED for mobile overflow with edge-to-edge layout */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0; /* Remove all padding for edge-to-edge */
    align-items: flex-start;
  }

  .invitation-container {
    padding: 30px 20px;
    margin: 0; /* Remove margins for edge-to-edge */
    border-radius: 0; /* Remove border radius for edge-to-edge */
    width: 100vw; /* Full viewport width */
    max-width: 100vw; /* Override max-width */
    min-height: 100vh; /* Full viewport height */
  }
  .japanese-title {
    font-size: clamp(3.2rem, 12vw, 4.2rem); /* Increased from 2.2rem-2.8rem */
    line-height: 1.1;
    margin-bottom: 25px; /* Increased spacing */
    font-weight: 500; /* Slightly bolder for better visibility */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings:
      "liga" 1,
      "kern" 1;
    letter-spacing: 0.02em; /* Slight letter spacing for clarity */
    color: #2a2a2a; /* Slightly darker for better contrast */
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* Subtle shadow */
    animation: logoEmphasis 0.8s ease-out;
  }

  .japanese-title rt {
    font-size: clamp(1rem, 4vw, 1.2rem); /* Increased ruby text */
    font-weight: 600;
    margin-top: 8px; /* Better spacing for ruby text */
  }

  .content {
    font-size: clamp(0.9rem, 4vw, 0.95rem);
    line-height: 1.7;
    margin-bottom: 25px;
    text-align: justify; /* Better text alignment */
    hyphens: auto; /* Enable hyphenation */
    word-break: break-word; /* Prevent overflow */
  }

  .content p {
    margin-bottom: 1em;
    text-indent: 0; /* Remove text indentation */
  }

  .member-list {
    margin: 20px 0;
    padding-left: 0;
  }

  .member-list li {
    margin-bottom: 12px;
    line-height: 1.5;
    padding-left: 0;
    text-align: left;
  }

  .final-pitch {
    font-size: clamp(1rem, 4.5vw, 1.15rem);
    line-height: 1.4;
    margin-top: 25px;
    text-align: center;
    font-weight: 600;
  }

  .discord-header {
    font-size: clamp(0.8rem, 3.5vw, 0.9rem);
    margin-bottom: 10px;
  }

  .discord-url {
    font-size: clamp(1rem, 4.5vw, 1.1rem);
    line-height: 1.3;
  }

  .signature-name {
    font-size: clamp(1.4rem, 6vw, 1.6rem);
    line-height: 1.2;
  }

  /* Visual scroll indicators for mobile */
  .invitation-container::before,
  .invitation-container::after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: rgba(139, 93, 255, 0.3);
    border-radius: 2px;
    opacity: 0.6;
  }

  .invitation-container::before {
    top: 10px;
  }

  .invitation-container::after {
    bottom: 10px;
  }

  /* Sticky back button for mobile */
  .back-button {
    position: sticky;
    top: 10px;
    left: 10px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(139, 93, 255, 0.1);
    width: 48px; /* Larger touch target */
    height: 48px;
    font-size: 22px;
  }

  /* Better touch targets for mobile */
  .discord-link {
    min-height: 60px; /* Minimum touch target height */
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* Better visual hierarchy on mobile */
  .header {
    padding-bottom: 20px;
    margin-bottom: 25px;
    border-bottom-width: 2px; /* Slightly thicker border */
  }

  .content strong {
    font-weight: 700; /* Bolder emphasis */
    color: #2a2a2a;
  }

  .member-list li strong {
    font-weight: 600;
    color: #333;
  }

  /* Add subtle spacing between sections */
  .content > p:not(:last-child) {
    margin-bottom: 1.5em;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0;
  }

  .invitation-container {
    padding: 25px 15px;
    margin: 0;
    border-radius: 0;
    width: 100vw;
    max-width: 100vw;
  }

  .japanese-title {
    font-size: clamp(2.8rem, 10vw, 3.6rem); /* Increased from 1.8rem-2.4rem */
    line-height: 1.05;
    margin-bottom: 20px;
  }

  .japanese-title rt {
    font-size: clamp(0.9rem, 3.5vw, 1.1rem);
    margin-top: 6px;
  }

  .content {
    font-size: clamp(0.85rem, 3.5vw, 0.9rem);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .member-list li {
    margin-bottom: 10px;
    font-size: clamp(0.8rem, 3.5vw, 0.9rem);
  }

  .final-pitch {
    font-size: clamp(0.9rem, 4vw, 1rem);
    margin-top: 20px;
  }

  .discord-link {
    padding: 20px 15px;
    margin: 15px 0 30px 0;
  }

  .signature {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 15px;
  }

  .signature-text {
    text-align: center;
  }

  .logo-stamp {
    width: 60px;
    height: 60px;
  }

  /* Enhanced touch targets for mobile */
  .back-button {
    width: 44px; /* Minimum touch target size */
    height: 44px;
    font-size: 20px;
  }
}

/* Desktop-specific back button positioning */
@media (min-width: 769px) {
  .back-button {
    position: absolute; /* Revert to absolute on desktop */
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
}

/* High DPI display optimizations */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .invitation-container {
    border-width: 0.5px; /* Thinner borders on high DPI */
  }

  .back-button {
    border-width: 0.5px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .modal-overlay {
    scroll-behavior: auto;
  }

  .invitation-container {
    animation: none;
  }

  .floating-particle {
    animation: none;
  }

  .discord-link:hover {
    transform: none;
  }

  .arrow {
    transition: none;
  }

  .discord-link:hover .arrow {
    transform: none;
  }
}

/* Vue transition for modal scale + fade */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Android-specific viewport fixes */
@supports (-webkit-touch-callout: none) {
  /* iOS devices */
  .modal-overlay {
    padding: env(safe-area-inset-top) env(safe-area-inset-right)
      env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
}

/* Android Chrome and other browsers */
@media screen and (max-width: 768px) {
  .modal-overlay {
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
  }

  .invitation-container {
    width: 100%;
    max-width: none;
    margin: 0;
    border-radius: 0;
  }
}

/* Android viewport fixes */
@supports not (-webkit-touch-callout: none) {
  /* Non-iOS devices (Android) */
  .modal-overlay {
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
  }

  .invitation-container {
    width: 100%;
    max-width: none;
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
  }
}

/* Prevent horizontal scrolling on Android */
@media screen and (max-width: 768px) {
  body {
    overflow-x: hidden;
  }

  .modal-overlay {
    overflow-x: hidden;
  }
}

/* Android Chrome specific adjustments */
@media screen and (max-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
  .invitation-container {
    transform: translateZ(0); /* Force hardware acceleration */
    -webkit-transform: translateZ(0);
  }

  .modal-overlay {
    -webkit-overflow-scrolling: touch;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }
}

/* Optimize for high DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .japanese-title {
    font-weight: 600; /* Slightly bolder on high DPI */
  }

  .japanese-title rt {
    font-weight: 700; /* Bolder ruby text */
  }
}

/* Desktop-first approach with fixed sizing and HEIGHT CONSTRAINTS */
@media (min-width: 768px) {
  .invitation-container {
    width: 600px; /* Fixed width on desktop */
    max-width: 600px;
    min-width: 600px;

    /* HEIGHT CONSTRAINTS - Prevent excessive stretching */
    max-height: 90vh; /* Maximum 90% of viewport height */
    min-height: auto; /* Allow content to determine minimum height */
    height: auto; /* Let content determine natural height */

    /* Ensure proper overflow handling */
    overflow-y: auto; /* Enable scrolling if content exceeds max-height */
    overflow-x: hidden; /* Prevent horizontal scrolling */

    /* Content-based height with constraints */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    /* Optimal padding for desktop */
    padding: 40px 50px; /* Slightly reduced top/bottom padding */

    margin: auto;
    flex-shrink: 0; /* Prevent flex shrinking */

    /* Smooth scrolling for overflow content */
    scrollbar-width: thin;
    scrollbar-color: rgba(139, 93, 255, 0.3) transparent;
  }

  /* Custom scrollbar styling for webkit browsers */
  .invitation-container::-webkit-scrollbar {
    width: 6px;
  }

  .invitation-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .invitation-container::-webkit-scrollbar-thumb {
    background: rgba(139, 93, 255, 0.3);
    border-radius: 3px;
  }

  .invitation-container::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 93, 255, 0.5);
  }

  .modal-overlay {
    align-items: center;
    justify-content: center;
    padding: 20px;
    /* Ensure overlay can handle modal height constraints */
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* Optimize content spacing for constrained height */
  .header {
    flex-shrink: 0; /* Prevent header from shrinking */
    margin-bottom: 25px; /* Reduced margin */
    padding-bottom: 20px; /* Reduced padding */
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .content {
    flex: 1; /* Allow content to expand */
    margin-bottom: 25px; /* Reduced margin */
    max-width: 500px; /* Optimal reading width */
    margin-left: auto;
    margin-right: auto;
    /* Ensure content is scrollable if needed */
    overflow-y: auto;
    overflow-x: hidden;
  }

  .discord-link {
    flex-shrink: 0; /* Prevent link from shrinking */
    margin: 15px auto 30px auto; /* Reduced margins */
    max-width: 500px;
  }

  .signature {
    flex-shrink: 0; /* Prevent signature from shrinking */
    margin-top: 15px; /* Reduced margin */
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Optimize typography for fixed container width */
  .japanese-title {
    font-size: 4.2rem; /* Slightly smaller for better fit */
    line-height: 1;
    margin-bottom: 0;
  }

  .japanese-title rt {
    font-size: 0.85rem;
  }

  .content {
    font-size: 1.05rem; /* Slightly smaller for better fit */
    line-height: 1.7;
    margin-bottom: 20px;
    text-align: left; /* Left align for better readability */
  }

  .content p {
    margin-bottom: 1em;
  }

  .member-list {
    margin: 20px 0;
    padding-left: 0;
  }

  .member-list li {
    margin-bottom: 8px;
    text-align: left;
  }

  .final-pitch {
    font-size: 1.1rem;
    line-height: 1.4;
    margin-top: 20px;
    text-align: center;
  }

  .discord-url {
    font-size: 1.1rem;
  }

  .discord-link {
    padding: 18px 20px; /* Slightly reduced padding */
  }

  .signature-name {
    font-size: 1.8rem; /* Slightly smaller */
  }

  /* Ensure perfect centering on desktop */
  .modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .invitation-container {
    position: relative;
    top: 0;
    left: 0;
    transform: none; /* Remove any transforms */
  }

  /* Maintain consistent visual hierarchy on desktop */
  .header {
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
  }

  /* Enhanced desktop styling */
  .invitation-container {
    box-shadow:
      0 20px 60px rgba(139, 93, 255, 0.2),
      0 8px 32px rgba(0, 0, 0, 0.1),
      0 4px 16px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0dcd8;
    border-radius: 12px;
  }

  .back-button {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 40px;
    height: 40px;
    font-size: 24px;
  }

  /* Optimize spacing between sections */
  .header + .content {
    margin-top: 0; /* Remove extra margin */
  }

  .content + .discord-link {
    margin-top: 15px; /* Consistent spacing */
  }

  .discord-link + .signature {
    margin-top: 15px; /* Consistent spacing */
  }
}

/* Tablet breakpoint - slightly smaller but still fixed */
@media (min-width: 480px) and (max-width: 768px) {
  .invitation-container {
    width: 90vw; /* Responsive on tablet */
    max-width: 550px;
    min-width: 400px;
    margin: auto;
  }
}

/* Mobile breakpoint - full width edge-to-edge */
@media (max-width: 480px) {
  .invitation-container {
    width: 100vw;
    max-width: 100vw;
    min-width: 100vw;
    margin: 0;
    border-radius: 0;
    padding: 25px 15px;
  }

  .modal-overlay {
    padding: 0;
    align-items: flex-start;
  }
}

/* Large desktop screens - tighter height constraints */
@media (min-width: 1200px) {
  .invitation-container {
    max-height: 85vh; /* Slightly tighter constraint on large screens */
    padding: 35px 50px; /* Reduced padding */
  }

  .header {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }

  .content {
    margin-bottom: 20px;
  }

  .discord-link {
    margin: 10px auto 25px auto;
  }

  .signature {
    margin-top: 10px;
  }
}

/* Medium desktop screens - balanced constraints */
@media (min-width: 768px) and (max-width: 1199px) {
  .invitation-container {
    max-height: 90vh;
    padding: 40px 50px;
  }
}

/* Small desktop screens - more generous constraints */
@media (min-width: 768px) and (max-width: 1024px) {
  .invitation-container {
    max-height: 95vh; /* More generous on smaller desktop screens */
    padding: 45px 50px;
  }
}
</style>
