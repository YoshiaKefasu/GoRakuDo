<script setup>
import { onMounted, onUnmounted } from 'vue';

// `hompage-script.js`から移動した関数
function goToPosts() {
  window.location.href = '/docs/posts';
}

function scrollToMission() {
  const missionSection = document.getElementById('mission');
  const navbar = document.querySelector('.navbar');

  if (missionSection && navbar) {
    const navbarHeight = navbar.offsetHeight;
    const missionSectionTop = missionSection.getBoundingClientRect().top + window.pageYOffset;
    const desiredTopMargin = 40;
    const scrollToPosition = missionSectionTop - navbarHeight - desiredTopMargin;
    window.scrollTo({
      top: scrollToPosition,
      behavior: 'smooth'
    });
  }
}

function openInvitationModal() {
  const modal = document.getElementById('invitationModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      modal.style.opacity = '1';
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.style.transform = 'scale(1)';
      }
    }, 10);
  }
}

// Navbarのスクロール効果
function handleNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 10, 0.95)';
      navbar.style.backdropFilter = 'blur(15px)';
    } else {
      navbar.style.background = 'rgba(10, 10, 10, 0.9)';
      navbar.style.backdropFilter = 'blur(10px)';
    }
  }
}

// コンポーネントがページに表示されたら、スクロールイベントを追加
onMounted(() => {
  window.addEventListener('scroll', handleNavbarScroll);
});

// コンポーネントがページから消えるときに、イベントを削除（メモリリーク防止）
onUnmounted(() => {
  window.removeEventListener('scroll', handleNavbarScroll);
});
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="nav-container">
            <div class="nav-left">
                <span class="nav-item" role="button" tabindex="0">Tentang</span>
                <span class="nav-item" role="button" tabindex="0">Metodologi</span>
            </div>
            <div class="nav-center">
                <a href="/" class="logo-japanese" aria-label="GoRakuDo - Kembali ke beranda">
                    語楽道
                </a>
            </div>
            <div class="nav-right">
                <span class="nav-item" role="button" tabindex="0">Resources</span>
                <span class="nav-item" @click="goToPosts" role="button" tabindex="0">Panduan</span>
                <span class="nav-item" role="button" tabindex="0">Tools</span>
                <button class="get-started-btn" @click="scrollToMission" aria-label="Mulai perjalanan belajar bahasa Jepang">Mulai Sekarang</button>
            </div>
            <!-- Mobile menu button -->
            <button class="mobile-menu-btn" @click="openInvitationModal" aria-label="Gabung komunitas Discord">Join</button>
        </div>
    </nav>
</template>

<style scoped>
/* --- Navigation --- */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding-block: 20px;
    background: rgba(10, 10, 10, 0.9);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--clr-accent-glow-medium);
    z-index: 1000;
    /* Vueコンポーネント内でグローバルなCSS変数を使うためには、
       :rootの定義をどこかグローバルなCSSファイルに残しておく必要があります。 */
}
.nav-container {
    max-width: 1200px;
    margin-inline: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 20px;
}
.nav-left, .nav-right {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 32px;
}
.nav-right {
    justify-content: flex-end;
}
.nav-item {
    font-size: 14px;
    color: var(--clr-text-secondary);
    cursor: pointer;
}
.nav-item:hover {
    color: var(--clr-accent);
}
.logo-japanese {
    font-family: var(--font-jp);
    font-size: 28px;
    color: var(--clr-text-primary);
    cursor: pointer;
    line-height: 1;
    text-decoration: none; /* aタグに変更したため追加 */
}
.logo-japanese rt {
    font-family: var(--font-primary);
    font-size: 0.4em;
    color: #999;
    font-weight: 600;
    margin-bottom: -15px;
}
.get-started-btn {
    background: var(--clr-accent);
    color: var(--clr-text-primary);
    border: none;
    padding: 10px 24px;
    border-radius: var(--border-radius-btn-small); 
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}
.get-started-btn:hover {
    background: var(--clr-accent-dark);
}
.mobile-menu-btn { 
    display: none; 
}

/* --- Responsive Design for Navbar --- */
@media (max-width: 1024px) {
    .nav-left, .nav-right { display: none; }
    .mobile-menu-btn { 
        display: block; 
        background: var(--clr-accent); 
        color: var(--clr-text-primary); 
        border: none; 
        padding: 8px 16px; 
        border-radius: 20px; 
        font-size: 14px; 
        font-weight: 500; 
        cursor: pointer; 
    }
    .mobile-menu-btn:hover { background: var(--clr-accent-dark); }
    .logo-japanese { font-size: 24px; }
}
</style>