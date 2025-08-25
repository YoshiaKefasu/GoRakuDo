---
title: "Panduan Setup Migaku"
description: "Setup dan penggunaan Migaku suite untuk immersion learning dengan browser extension dan Anki integration."
publishedDate: "2024-01-25T00:00:00.000Z"
readTime: 20
author: "Tim GoRakuDo"
emoji: "🎯"
difficulty: "intermediate"
category: "tools"
tags: ["migaku", "browser-extension", "anki-integration", "immersion", "suite"]
featured: false
mindMapBranch: "D"
contentType: "resource"
---

# Panduan Setup Migaku

## Apa itu Migaku?

Migaku adalah suite tools yang dirancang khusus untuk immersion learning bahasa Jepang. Migaku terdiri dari beberapa komponen utama:

- **Migaku Browser Extension** - Untuk video dan web content
- **Migaku Dictionary** - Dictionary terintegrasi
- **Migaku Anki Addon** - Integrasi dengan Anki
- **Migaku Video Player** - Player khusus untuk video learning

## Komponen Migaku

### 🎬 **Migaku Browser Extension**

- Auto-pause video saat hover kata
- Subtitle extraction dan translation
- Vocabulary mining otomatis
- Integration dengan Anki

### 📚 **Migaku Dictionary**

- Dictionary terintegrasi dengan browser
- Audio pronunciation
- Pitch accent information
- Multiple dictionary sources

### 🔄 **Migaku Anki Addon**

- Auto-import vocabulary dari video
- Card template yang optimal
- Audio attachment otomatis
- Progress tracking

## Setup Migaku

### 1. Install Migaku Browser Extension

**Chrome/Edge:**

1. Buka [Migaku Browser Extension](https://chrome.google.com/webstore/detail/migaku-browser-extension/...)
2. Klik "Add to Chrome"
3. Konfirmasi instalasi

**Firefox:**

1. Buka [Migaku Firefox Addon](https://addons.mozilla.org/en-US/firefox/addon/migaku/)
2. Klik "Add to Firefox"
3. Konfirmasi instalasi

### 2. Install Migaku Anki Addon

1. Buka Anki
2. Pilih **Tools > Add-ons**
3. Klik **"Browse & Install"**
4. Cari **"Migaku"**
5. Install addon dan restart Anki

### 3. Setup Dictionary

1. Buka **Migaku Settings** di browser
2. Pilih tab **"Dictionary"**
3. Download dictionary yang diperlukan
4. Import dictionary ke Migaku

### 4. Konfigurasi Anki Integration

1. Di Migaku settings, pilih **"Anki"**
2. Masukkan AnkiConnect URL (biasanya `http://localhost:8765`)
3. Pilih deck dan card template
4. Test koneksi

## Cara Menggunakan

### Video Learning dengan Migaku

#### 1. Setup Video

1. Buka video dengan subtitle bahasa Jepang
2. Aktifkan Migaku extension
3. Pastikan subtitle terdeteksi

#### 2. Vocabulary Mining

1. **Hover di kata** - Video akan pause otomatis
2. **Lihat definisi** - Dictionary popup muncul
3. **Klik "+"** - Tambah ke Anki deck
4. **Lanjutkan video** - Video resume otomatis

#### 3. Review di Anki

1. Buka Anki deck yang sudah dibuat
2. Review kartu dengan audio dan context
3. Gunakan SRS untuk retention optimal

### Web Content Learning

#### 1. Text Selection

1. Pilih teks bahasa Jepang di web
2. Migaku akan menampilkan definisi
3. Klik untuk tambah ke Anki

#### 2. Bulk Import

1. Gunakan **"Bulk Import"** feature
2. Pilih multiple kata sekaligus
3. Import ke Anki dengan satu klik

## Advanced Features

### Custom Card Templates

Migaku menyediakan card template yang optimal:

```html
<!-- Front Template -->
<div class="word">{{kanji}}</div>
<div class="reading">{{reading}}</div>

<!-- Back Template -->
<div class="word">{{kanji}}</div>
<div class="reading">{{reading}}</div>
<div class="meaning">{{meaning}}</div>
<div class="audio">{{audio}}</div>
<div class="context">{{context}}</div>
```

### Video Player Integration

#### Supported Platforms

- **YouTube** - Full integration
- **Netflix** - Limited support
- **Crunchyroll** - Full integration
- **Local videos** - MP4, MKV support

#### Features

- **Auto-pause** saat hover kata
- **Subtitle extraction** otomatis
- **Audio extraction** untuk Anki
- **Progress tracking** per video

### Dictionary Management

#### Multiple Sources

- **JMDict** - English-Japanese
- **Daijirin** - Japanese-Japanese
- **Custom dictionaries** - User-created

#### Audio Sources

- **Forvo** - Native pronunciation
- **Custom audio** - User uploads
- **TTS** - Text-to-speech

## Best Practices

### 🎯 **Video Selection**

- Pilih video dengan subtitle yang akurat
- Mulai dari content yang sesuai level
- Fokus pada content yang menarik

### 📝 **Vocabulary Strategy**

- Jangan tambah semua kata baru
- Fokus pada kata yang sering muncul
- Prioritaskan kata yang relevan dengan level Anda

### 🔄 **Review Consistency**

- Review Anki deck setiap hari
- Gunakan SRS interval yang optimal
- Fokus pada retention, bukan speed

### 🎬 **Video Learning Tips**

- Tonton video multiple kali
- Fokus pada pronunciation
- Gunakan context untuk memahami arti

## Troubleshooting

### Extension Tidak Berfungsi

1. Pastikan extension sudah diinstall
2. Refresh halaman web
3. Cek apakah video platform didukung
4. Restart browser

### Anki Integration Error

1. Pastikan AnkiConnect sudah diinstall
2. Cek koneksi localhost:8765
3. Restart Anki dan browser
4. Cek log error di Anki

### Dictionary Issues

1. Pastikan dictionary sudah diimport
2. Cek ukuran file dictionary
3. Restart Migaku extension
4. Re-import dictionary

### Video Player Problems

1. Pastikan video platform didukung
2. Cek subtitle availability
3. Refresh halaman video
4. Coba video lain

## Tips Lanjutan

### 🎨 **Custom Styling**

```css
/* Custom Migaku popup styling */
.migaku-popup {
  background: var(--clr-accent-glow-faint);
  border: 1px solid var(--clr-accent-glow-medium);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### 📊 **Progress Tracking**

- Gunakan Migaku analytics
- Track vocabulary per video
- Monitor learning progress
- Set realistic goals

### 🔗 **Workflow Optimization**

- Buat sistem video selection
- Schedule review sessions
- Kombinasikan dengan tools lain
- Maintain consistency

## Kesimpulan

Migaku adalah suite tools yang sangat powerful untuk immersion learning. Dengan setup yang tepat dan penggunaan yang konsisten, Anda akan melihat peningkatan signifikan dalam kemampuan listening, reading, dan vocabulary acquisition.

**Langkah Selanjutnya:**

1. Setup Migaku sesuai panduan di atas
2. Mulai dengan video sederhana
3. Buat sistem review yang konsisten
4. Kombinasikan dengan tools lain
5. Track progress dan adjust strategy

Selamat belajar! 🎉
