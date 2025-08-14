// Definisikan nama situs Anda di sini. Cukup ubah di satu tempat ini.
const siteName = "語楽道";

// Fungsi untuk mengatur judul halaman
function setPageTitle(pageTitle) {
  // Menggabungkan judul halaman spesifik dengan nama situs
  // Hasil: "Nama Halaman・語楽道"
  document.title = `${pageTitle} ・ ${siteName}`;
}
