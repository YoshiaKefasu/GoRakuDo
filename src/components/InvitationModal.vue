<template>
    <transition name="fade-scale">
        <div v-if="isOpen" id="invitationModal" class="modal-overlay" role="dialog" aria-labelledby="modal-title" aria-modal="true">
        <div class="modal-content">
            <button class="modal-close" onclick="closeInvitationModal()" aria-label="Tutup modal">×</button>
            
            <div class="modal-header">
                <ruby class="modal-japanese-title" id="modal-title">
                    語<rt>ご</rt>楽<rt>らく</rt>道<rt>どう</rt>
                </ruby>
            </div>

            <div class="modal-body">
                <p>
                    Kami bukan komunitas biasa. Kita adalah rumah bagi para pembelajar otodidak yang terjun langsung ke <strong>🌊 Metode IMMERSION</strong>—sebuah cara belajar yang seru, alami, dan terbukti secara ilmiah oleh 🎓 Prof. Stephen Krashen.
                </p>
                
                <p><strong>Siapa yang kami cari?</strong></p>
                <ul class="modal-list" role="list">
                    <li role="listitem">✅ <strong>Otaku & Anime Lovers:</strong> Ubah hobimu jadi skill!</li>
                    <li role="listitem">✅ <strong>Pembelajar Serius:</strong> Temukan cara belajar paling efektif.</li>
                </ul>

                <p class="modal-final-pitch">
                    Semua 100% GRATIS. Yang kamu butuhkan hanya NIAT.<br/>Ayo bergabung! 👍
                </p>
            </div>

            <a href="https://discord.gg/j8qmYPAGQh" target="_blank" rel="noopener noreferrer" class="discord-link" aria-label="Bergabung dengan server Discord GoRakuDo">
                <div class="discord-header">Alamat Komunitas Digital Kami:</div>
                <div class="discord-url">
                    discord.gg/j8qmYPAGQh<span class="arrow">→</span>
                </div>
            </a>
            
            <div class="modal-signature">
                <img src="/img/Logo%20Discord%2080px.png" alt="Logo Gorakudou" class="logo-stamp">
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
import { ref, onMounted } from "vue";

const isOpen = ref(false);

function open() {
  isOpen.value = true;
  document.body.style.overflow = "hidden";
}
function close() {
  isOpen.value = false;
  document.body.style.overflow = "";
}

onMounted(() => {
  // expose ke global agar kode lama tetap bisa jalan
  window.openInvitationModal = open;
  window.closeInvitationModal = close;
});
</script>

<style scoped>
/* Transition untuk modal scale + fade */
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
</style>
