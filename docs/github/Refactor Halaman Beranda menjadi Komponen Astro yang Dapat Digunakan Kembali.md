### **Deskripsi**

Tugas ini adalah untuk me-refactor halaman beranda utama (`/src/pages/index.astro`) dengan memecah setiap bagiannya menjadi komponen Astro individual yang dapat digunakan kembali. Tujuannya adalah untuk meningkatkan *maintainability*, keterbacaan, dan reusabilitas. Semua komponen baru harus dirancang untuk menerima `Astro.props` untuk konten dinamis.

### **Tugas-tugas**

-   [ ] **1. Buat Komponen Astro untuk Setiap Bagian Halaman Beranda**
    -   [ ] Buat `src/components/homepage/MissionSection.astro`.
    -   [ ] Buat `src/components/homepage/FeaturesSection.astro`.
        -   [ ] Di dalam `FeaturesSection.astro`, buat dan impor sebuah sub-komponen untuk kartu fitur (contoh: `src/components/FeatureCard.astro` dari elemen `<article class="feature-card">`).
    -   [ ] Buat `src/components/homepage/DocumentationPreviewSection.astro`.

-   [ ] **2. Perbarui Halaman Beranda untuk Menggunakan `BaseLayout.astro`**
    -   [ ] Modifikasi `/src/pages/index.astro` agar menggunakan `BaseLayout.astro` utama.
    -   [ ] Impor dan letakkan komponen-komponen yang baru dibuat (`<!-- Mission Section --> `, `<!-- Features Section -->`, `<!-- Documentation Preview Section -->`) sebagai isi untuk `<slot />` dari layout.

### **Panduan Teknis**

* **Props untuk Komponen**: Semua komponen harus *stateless* dan menerima kontennya melalui `Astro.props`. Gunakan *object destructuring* untuk akses props yang mudah.
    ```astro
    ---
    // Contoh untuk sebuah komponen
    const { title, description, link } = Astro.props;
    ---
    ```

* **Styling (CSS)**: Semua CSS (`<style>`) untuk sebuah komponen harus ditempatkan langsung di dalam file `.astro`-nya (otomatis menjadi *scoped*). **Jangan** membuat file `.css` terpisah untuk komponen.

* **Scripting (JavaScript/TypeScript)**: Semua JavaScript/TypeScript sisi klien (`<script>`) harus ditulis *inline* di dalam file komponen. Hanya buat file `.ts` terpisah jika jumlah baris skrip **melebihi 600 baris**.