# AI Modul Ajar Generator

Aplikasi web berbasis Node.js dan Express untuk membantu guru menyusun Modul Ajar Kurikulum Merdeka secara lebih cepat, terstruktur, dan konsisten. Aplikasi ini menggabungkan asistensi AI Google Gemini, knowledge base model pembelajaran, continuity checking, validasi data, serta ekspor dokumen Word DOCX dengan mekanisme Mail Merge ke template master yang sudah disiapkan.

## Ringkasan Aplikasi

Aplikasi ini dirancang untuk mempermudah proses pembuatan modul ajar dari awal hingga dokumen final. Pertama, pengguna mengisi data identitas, CP/TP, model pembelajaran, apersepsi, sintaks kegiatan, dan asesmen. Selanjutnya, AI menghasilkan isi yang relevan berdasarkan data yang dimasukkan. Setelah semua data lengkap, aplikasi melakukan validasi dan mengekspor dokumen dalam format DOCX yang siap dipakai atau dicetak.

Dengan kata lain, aplikasi ini berfungsi sebagai:

- generator modul ajar berbasis form wizard
- asisten penulisan pembelajaran berbasis AI
- learning designer subject-agnostic untuk berbagai mata pelajaran
- knowledge base model pembelajaran dan sintaks
- continuity engine dari apersepsi sampai sintaks terakhir
- validator kelengkapan data modul ajar
- engine ekspor dokumen DOCX dengan mail merge

## Tujuan Utama

1. Mempercepat penyusunan modul ajar guru.
2. Menjaga konsistensi format modul ajar sesuai template.
3. Menghasilkan kegiatan pembelajaran yang selaras dengan model, CP, dan TP.
4. Mengurangi risiko data kosong atau tidak lengkap sebelum export.
5. Menyediakan dokumen Word yang bisa langsung digunakan sebagai modul ajar.

## Fitur Utama

### 1. Wizard pembuatan modul ajar
Aplikasi memiliki alur langkah-langkah (wizard) yang memandu pengguna dari:

- identitas pembelajaran
- CP dan TP
- pemilihan model pembelajaran
- apersepsi
- kegiatan sintaks pembelajaran
- asesmen
- preview
- export DOCX

### 2. Integrasi AI Gemini
Aplikasi memanggil Google Gemini untuk menghasilkan:

- narasi apersepsi
- kegiatan sintaks/model pembelajaran tertentu
- seluruh sintaks pembelajaran sekaligus
- rekomendasi asesmen

AI digunakan untuk membantu menulis konten yang sesuai konteks pembelajaran, sementara CP dan TP tetap diisi manual oleh guru agar tetap sesuai kurikulum dan tidak diubah oleh AI.

### 3. Validasi data modul ajar
Sebelum ekspor dokumen, aplikasi memvalidasi kelengkapan data wajib seperti:

- nama guru
- mata pelajaran
- tanggal
- fase
- kelas
- JP
- elemen/tema
- materi utama
- sub materi
- CP
- TP
- model pembelajaran
- apersepsi
- 3 slot kegiatan utama

Jika ada data yang belum lengkap, pengguna akan diberi informasi yang spesifik.

### 4. Export file DOCX
Aplikasi mengekspor dokumen dengan mekanisme Mail Merge ke file template DOCX master. Fitur ini mencakup:

- pengisian field template secara otomatis
- proses pemetaan data ke tabel dan textbox
- penghapusan mail merge settings agar file lebih bersih
- validasi struktur XML DOCX agar file tidak rusak

### 5. Auto-save draft
Data form disimpan ke LocalStorage browser, sehingga pengguna tidak kehilangan data saat reload atau berpindah tab.

### 6. Preview data modul ajar
Sebelum export, ada stage preview yang mencerminkan informasi modul ajar yang sudah diisi dan disusun.

### 7. Knowledge Base dan Continuity Engine
Knowledge base menyimpan fungsi pedagogis, input, output, dependensi, evidence, risiko, dan pola terlarang untuk setiap sintaks. AI menggunakan data tersebut sebagai learning designer, bukan sekadar text generator.

Continuity engine memastikan hubungan:

```text
Apersepsi → Sintaks 1 → Sintaks 2 → ... → Sintaks terakhir → Penutup template
```

CP dan TP tetap berasal dari guru. AI menggunakannya sebagai konteks dan melakukan pemeriksaan alignment tanpa mengubahnya.

### 8. Quality Gate informatif
Sistem memeriksa kelengkapan, continuity, alignment TP, konteks subject, keterbacaan kegiatan, dan evidence akhir. Hasilnya ditampilkan sebagai informasi/rekomendasi.

Quality Gate tidak mengambil keputusan atas nama guru. Selama field wajib lengkap, guru tetap dapat mengunduh DOCX meskipun status kualitas `REVIEW` atau `FAIL`.

### 9. UI minimalis
Antarmuka menggunakan gaya minimalis terang dengan panel bersih, tipografi yang lebih ringan, responsivitas mobile, serta tetap mempertahankan seluruh wizard dan fungsi yang sudah ada.

## Arsitektur Aplikasi

Aplikasi terdiri dari beberapa bagian utama:

### Backend
- Node.js
- Express
- CORS
- dotenv
- Google Generative AI SDK
- PizZip untuk manipulasi file DOCX

### Frontend
- HTML, CSS, JavaScript vanilla
- single-page app (SPA)
- komunikasi ke API backend via fetch

### Struktur folder utama

- `server.js` — server utama Express
- `config/models.config.js` — konfigurasi model pembelajaran, sintaks, dan pilihan default
- `config/knowledge-base.js` — knowledge base pedagogis, struktur sintaks, dan registry sumber model
- `services/gemini.service.js` — komunikasi dengan Google Gemini
- `services/prompt.service.js` — penyusun prompt AI per bagian modul
- `services/learning-design.service.js` — contract pembelajaran, continuity, alignment, dan Quality Gate
- `services/continuity.service.js` — utilitas pemeriksaan keterhubungan kegiatan
- `services/validation.service.js` — validasi data modul ajar
- `services/mailmerge.service.js` — engine pengisian template DOCX
- `public/` — antarmuka pengguna (frontend)
- `template.docx` — template DOCX master yang dipakai untuk ekspor
- `.env` — konfigurasi lingkungan local

## Model Pembelajaran yang Didukung

Aplikasi saat ini menampilkan model berikut pada web:

- Discovery Learning
- Problem Based Learning (PBL)
- Project Based Learning (PjBL)
- Inquiry Learning
- Cooperative Learning
- Contextual Teaching and Learning (CTL)

Untuk masing-masing model ada sintaks yang berbeda dan dibagi ke slot template:

- LANGKAH_1
- LANGKAH_2
- LANGKAH_3

Knowledge base mendukung metadata pedagogis yang lebih rinci daripada tiga slot DOCX tersebut. Beberapa model/variant masih memiliki status sumber `proposed` atau `source_required` dan perlu ditetapkan rujukan definitif sebelum disebut sebagai sintaks resmi.

## API Backend

Aplikasi menyediakan endpoint utama berikut:

### Konfigurasi aplikasi
- GET `/api/config/models`

Mengembalikan konfigurasi model pembelajaran, jenis apersepsi, metode, media, UKRK, dan fase.

### Generate apersepsi
- POST `/api/ai/generate-apersepsi`

Membuat narasi apersepsi berdasarkan materi dan tipe apersepsi.

### Generate satu sintaks
- POST `/api/ai/generate-step`

Membuat isi kegiatan untuk satu sintaks tertentu dalam model pembelajaran.

### Generate semua sintaks
- POST `/api/ai/generate-all-steps`

Membuat semua kegiatan pembelajaran dalam urutan model yang dipilih.

### Generate asesmen
- POST `/api/ai/generate-assessment`

Membuat rekomendasi asesmen yang sesuai dengan TP dan materi.

### Validasi data
- POST `/api/validate`

Memeriksa field wajib dan mengembalikan informasi Quality Gate. Status kualitas bersifat advisory; validasi field wajib tetap menjadi pemeriksaan utama sebelum ekspor.

### Validasi learning design
- POST `/api/learning-design/validate`

Menghasilkan Learning Design Contract, state tiap tahap, skor transisi, continuity issue, alignment TP, dan status subject-agnostic.

### Ekspor DOCX
- POST `/api/export/docx`

Mengekspor modul ajar ke file DOCX berdasarkan template master.

## Alur Kerja Aplikasi

1. User membuka aplikasi di browser.
2. User mengisi data identitas dan pembelajaran.
3. User memilih model pembelajaran serta tipe apersepsi.
4. User dapat menghasilkan apersepsi dan kegiatan pembelajaran secara otomatis dengan Google Gemini.
5. User meninjau CP dan TP yang dimasukkan secara manual.
6. User mengecek validasi data.
7. User meninjau catatan Quality Gate dan menentukan sendiri apakah hasil sudah siap digunakan.
8. User mengekspor hasilnya ke DOCX.
9. File DOCX siap digunakan sebagai modul ajar resmi.

## Teknologi yang Digunakan

- JavaScript
- Node.js
- Express.js
- Google Generative AI
- HTML5
- CSS3
- DOCX manipulation via PizZip

## Prasyarat

Sebelum menjalankan aplikasi, pastikan sudah terinstall:

- Node.js 18+
- npm atau pnpm
- akses internet untuk memanggil Google Gemini

## Instalasi

1. Buka terminal di folder proyek.
2. Jalankan perintah:

```bash
npm install
```

## Konfigurasi Environment

File `.env` digunakan untuk menyimpan konfigurasi local. Contoh isinya:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash
PORT=3000
```

> Pastikan API key Google Gemini valid agar fitur AI dapat berjalan. Simpan key hanya di `.env` dan jangan commit file tersebut.

## Menjalankan Aplikasi

Jalankan perintah berikut:

```bash
npm start
```

Atau untuk mode development:

```bash
node server.js
```

Setelah server berjalan, buka browser ke:

```text
http://localhost:3000
```

## Catatan Penting Tentang Logika Aplikasi

### Prinsip integritas master data
Aplikasi secara sengaja membedakan antara:

- data master guru (CP, TP, materi, tujuan pembelajaran) yang harus diisi manual
- konten AI yang membantu merancang kegiatan dan narasi pendukung

Tujuannya adalah agar kurikulum tetap valid, tidak terdistorsi, dan tetap sesuai dengan dokumen resmi yang dimiliki guru.

### Keamanan dan reliabilitas Google Gemini
Pada `services/gemini.service.js`, sistem menggunakan model Gemini yang dapat dikonfigurasi melalui `GEMINI_MODEL`, dengan fallback model, timeout, dan retry terbatas.

### Keamanan template DOCX
Untuk ekspor DOCX, aplikasi melakukan validasi struktur XML agar hasil dokumen tetap valid dan tidak rusak setelah diunduh.

### Kebijakan keputusan guru
Sistem memberikan informasi kualitas dan rekomendasi revisi. Keputusan untuk menerima, memperbaiki, atau mengunduh modul tetap berada pada guru.

## Keterbatasan

- Aplikasi memerlukan koneksi internet saat menggunakan fitur AI Gemini.
- Keberhasilan eksekusi AI tergantung pada kuota dan status layanan Google Gemini.
- Template DOCX harus tetap tersedia di folder `template.docx`.
- Pengguna perlu memastikan data CP dan TP benar karena isi tersebut tidak dibentuk ulang oleh AI.
- Penyimpanan modul masih berbasis draft LocalStorage; autentikasi dan database server belum diterapkan.
- Sumber beberapa variant model pembelajaran masih perlu disahkan secara eksplisit.

## Skenario Penggunaan

Aplikasi ini cocok untuk:

- guru mata pelajaran di tingkat SMA/SMK/SMP/SD
- pengajar yang membuat modul ajar secara rutin
- sekolah yang ingin mempersingkat proses pembuatan dokumen kurikulum
- tim pengembang pembelajaran yang membutuhkan template modul ajar konsisten

## Kesimpulan

Aplikasi ini adalah solusi praktis untuk membantu guru menyusun Modul Ajar dengan pendekatan yang lebih modern: form-driven, AI-assisted, dan export otomatis ke dokumen Word. Kekuatan utamanya terletak pada kombinasi antara human-controlled curriculum data dan AI generation yang terstruktur, sehingga tetap akuntabel, cepat, dan siap digunakan di dunia pendidikan.

## Developer Notes

Proyek ini merupakan aplikasi lokal yang berfokus pada kepraktisan penggunaan sehari-hari, bukan framework frontend besar seperti React atau Next.js. Struktur yang dipakai masih sederhana dan mudah dikembangkan lebih lanjut bila nanti ingin ditambah:

- autentikasi dan otorisasi berbasis role admin/guru
- database penyimpanan modul ajar dan kepemilikan modul
- audit log aktivitas pengguna
- export ke PDF
- versi multi-template
- riwayat modul ajar
- integrasi dengan LMS atau sekolah

Rencana pengembangan terperinci tersedia pada [readme3.md](readme3.md).

## Lisensi

Proyek ini dibuat untuk kebutuhan internal penggunaan aplikasi modul ajar dan belum disertai lisensi formal yang spesifik. Silakan sesuaikan lisensi sesuai kebutuhan organisasi atau pengembang.
