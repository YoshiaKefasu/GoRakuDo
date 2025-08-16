<template>
    <transition name="fade-scale">
        <div v-if="isOpen" class="modal-overlay" role="dialog" aria-labelledby="modal-title" aria-modal="true">
            <div class="modal-content">
                <button class="modal-close" @click="closeModal" aria-label="Tutup modal">
                    ×
                </button>

                <div class="modal-header">
                    <ruby class="modal-japanese-title" id="modal-title">
                        語<rt>ご</rt>楽<rt>らく</rt>道<rt>どう</rt>
                    </ruby>
                </div>

                <div class="modal-body">
                    <p>
                        Kami bukan komunitas biasa. Kita adalah rumah bagi para pembelajar
                        otodidak yang terjun langsung ke
                        <strong>🌊 Metode IMMERSION</strong>—sebuah cara belajar yang seru, alami, dan terbukti secara
                        ilmiah
                        oleh 🎓 Prof. Stephen Krashen.
                    </p>

                    <p><strong>Siapa yang kami cari?</strong></p>
                    <ul class="modal-list" role="list">
                        <li role="listitem">
                            ✅ <strong>Otaku & Anime Lovers:</strong> Ubah hobimu jadi skill!
                        </li>
                        <li role="listitem">
                            ✅ <strong>Pembelajar Serius:</strong> Temukan cara belajar paling
                            efektif.
                        </li>
                    </ul>

                    <p class="modal-final-pitch">
                        Semua 100% GRATIS. Yang kamu butuhkan hanya NIAT.<br />Ayo
                        bergabung! 👍
                    </p>
                </div>

                <a href="https://discord.gg/j8qmYPAGQh" target="_blank" rel="noopener noreferrer" class="discord-link"
                    aria-label="Bergabung dengan server Discord GoRakuDo">
                    <div class="discord-header">Alamat Komunitas Digital Kami:</div>
                    <div class="discord-url">
                        discord.gg/j8qmYPAGQh<span class="arrow">→</span>
                    </div>
                </a>

                <div class="modal-signature">
                    <img src="/img/Logo%20Discord%2080px.png" alt="Logo Gorakudou" class="logo-stamp" />
                    <div class="signature-text">
                        <div class="signature-title">Hormat kami,</div>
                        <p class="signature-name">Tim GoRakuDo</p>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: "InvitationModal",
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isOpen() {
            return this.modelValue;
        }
    },
    methods: {
        closeModal() {
            this.$emit("update:modelValue", false);
        }
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* Content modal */
.modal-content {
    background: white;
    max-width: 600px;
    width: 90%;
    padding: 1.5rem;
    border-radius: 12px;
    position: relative;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

/* Tombol close */
.modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

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
