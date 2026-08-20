# Rencana Pengembangan — AAA, Login, Role, dan Database

Dokumen ini berisi rencana pengembangan berikutnya untuk AI Modul Ajar Generator. Isinya adalah desain dan roadmap; fitur-fitur di bawah belum dianggap selesai sampai implementasi dan pengujian dilakukan.

## Tujuan

Mengubah aplikasi lokal berbasis draft browser menjadi aplikasi multi-pengguna dengan:

- Authentication: pengguna dapat login dengan aman.
- Authorization: akses ditentukan berdasarkan role.
- Accounting/Audit: aktivitas penting pengguna tercatat.
- Penyimpanan server: modul dapat diakses kembali setelah login.

## Role pengguna

### Admin

Admin dapat:

- login dan logout;
- menambah user guru;
- mengubah data user;
- mengaktifkan atau menonaktifkan user;
- mengatur atau mengganti role;
- melihat seluruh modul;
- mengedit atau menghapus modul bila diperlukan;
- melihat audit log;
- mengelola konfigurasi aplikasi yang memang diberi izin.

### Guru

Guru dapat:

- login dan logout;
- membuat modul baru;
- melihat modul yang dibuat olehnya;
- melanjutkan draft miliknya;
- mengubah modul miliknya;
- menghapus modul miliknya bila diizinkan;
- mengekspor modul miliknya ke DOCX.

Guru tidak boleh mengakses modul guru lain hanya dengan mengubah URL, request, ID, atau payload dari browser. Pemeriksaan kepemilikan wajib dilakukan di backend pada setiap endpoint.

## Rekomendasi DBMS

### Pilihan utama: PostgreSQL

PostgreSQL direkomendasikan apabila aplikasi digunakan melalui server sekolah atau oleh banyak guru. Keuntungannya:

- mendukung banyak pengguna secara bersamaan;
- constraint dan transaksi relasional kuat;
- cocok untuk audit log dan pencarian riwayat modul;
- mudah dikembangkan untuk deployment server/cloud.

### Pilihan lokal: SQLite

SQLite dapat digunakan bila aplikasi benar-benar berjalan pada satu komputer. SQLite lebih sederhana, tetapi kurang cocok untuk banyak pengguna yang mengakses satu server secara bersamaan.

Keputusan DBMS harus ditetapkan sebelum migration dan instalasi dependency dilakukan.

## Struktur database awal

### `users`

Kolom minimum:

- `id`
- `username` atau `email`
- `password_hash`
- `display_name`
- `role`: `admin` atau `guru`
- `is_active`
- `created_at`
- `updated_at`
- `last_login_at`

### `modules`

Kolom minimum:

- `id`
- `owner_user_id`
- seluruh data modul yang saat ini dikirim ke export;
- `status`: `draft`, `ready`, atau `archived`;
- `created_at`
- `updated_at`

Relasi utama:

```text
users.id 1 ──────── N modules.owner_user_id
```

### `sessions`

Digunakan bila aplikasi memakai session server:

- `id`
- `user_id`
- `session_token_hash`
- `expires_at`
- `created_at`
- `last_seen_at`

### `audit_logs`

Kolom minimum:

- `id`
- `actor_user_id`
- `action`
- `target_type`
- `target_id`
- `ip_address` bila sesuai kebijakan privasi;
- `metadata` yang tidak menyimpan password atau secret;
- `created_at`

Contoh action: `login_success`, `login_failed`, `logout`, `user_created`, `user_disabled`, `module_created`, `module_updated`, `module_deleted`, `module_exported`.

## Authentication

Rancangan yang direkomendasikan:

- password tidak pernah disimpan sebagai plaintext;
- gunakan Argon2id atau bcrypt dengan cost yang sesuai;
- gunakan session cookie `HttpOnly` dan `SameSite`;
- gunakan `Secure` pada HTTPS;
- jangan menyimpan token login di LocalStorage;
- tambahkan rate limit untuk login gagal;
- pesan login gagal tidak membocorkan apakah username/email terdaftar;
- sediakan logout yang menghapus/invalidate session;
- validasi dan sanitasi input di backend.

Jika aplikasi nanti ditempatkan di belakang reverse proxy atau domain publik, HTTPS wajib digunakan.

## Authorization

Authorization harus diterapkan berlapis:

1. Middleware autentikasi memastikan session valid.
2. Middleware role memastikan endpoint sesuai role.
3. Query modul selalu membatasi `owner_user_id` untuk guru.
4. Admin memakai endpoint khusus yang memang mengizinkan akses lintas pemilik.
5. Frontend hanya menyembunyikan atau menampilkan UI; frontend bukan sumber keamanan.

Contoh aturan:

```text
GET /api/modules
  admin → semua modul
  guru  → modul dengan owner_user_id = user.id

GET /api/modules/:id
  admin → boleh jika modul ada
  guru  → hanya jika owner_user_id = user.id
```

## API yang direncanakan

### Authentication

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/change-password`

### Admin user management

- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/:id`
- `POST /api/admin/users/:id/reset-password`
- `POST /api/admin/users/:id/disable`

### Module persistence

- `GET /api/modules`
- `POST /api/modules`
- `GET /api/modules/:id`
- `PATCH /api/modules/:id`
- `DELETE /api/modules/:id`
- `POST /api/modules/:id/export`

### Audit

- `GET /api/admin/audit-logs`

Endpoint admin wajib memiliki middleware role admin. Endpoint modul wajib memeriksa ownership sebelum mengembalikan atau mengubah data.

## Perubahan frontend yang direncanakan

- halaman login sebelum wizard;
- informasi user aktif dan role;
- tombol logout;
- halaman admin untuk user management;
- halaman daftar modul milik guru;
- tombol `Modul Baru` dan `Lanjutkan Draft`;
- autosave ke database melalui API;
- fallback draft lokal hanya sebagai cache sementara;
- UI admin tidak ditampilkan kepada guru.

Alur wizard pembuatan modul, AI, continuity checker, mail merge, dan struktur Pembukaan/Penutup tetap dipertahankan.

## Migrasi LocalStorage

Saat ini draft disimpan di LocalStorage. Rencana migrasi:

1. Guru login.
2. Sistem mendeteksi draft LocalStorage.
3. Guru memilih `Import Draft` atau `Abaikan`.
4. Draft yang diimpor dibuat sebagai record `modules` milik guru tersebut.
5. Setelah tersimpan, database menjadi sumber data utama.

Jangan mengimpor draft secara otomatis tanpa persetujuan guru karena data dapat berasal dari browser atau user sebelumnya.

## Audit dan keamanan data

- Jangan mencatat password, API key, atau token mentah ke audit log.
- Batasi metadata audit pada informasi yang diperlukan.
- Terapkan validasi ownership pada read, update, delete, dan export.
- Tambahkan CSRF protection bila menggunakan cookie session.
- Gunakan helmet dan konfigurasi CORS yang spesifik untuk deployment.
- Gunakan backup database berkala.
- Tentukan kebijakan retensi audit log.
- Pertimbangkan perlindungan data pribadi guru sesuai kebijakan organisasi/sekolah.

## Tahapan implementasi

### Fase 1 — Persiapan

- menetapkan PostgreSQL atau SQLite;
- menetapkan username/email login;
- menetapkan admin pertama;
- memilih session cookie atau mekanisme session lain;
- menetapkan kebijakan reset password dan audit log.

### Fase 2 — Database dan authentication

- membuat migration;
- membuat model/repository database;
- membuat password hashing;
- membuat login, logout, dan session validation;
- membuat bootstrap admin pertama.

### Fase 3 — Authorization dan user management

- membuat role middleware;
- membuat CRUD user admin;
- menerapkan status user aktif/nonaktif;
- mengunci akses guru ke modul miliknya.

### Fase 4 — Penyimpanan modul

- membuat CRUD modul;
- mengganti autosave utama dari LocalStorage ke database;
- menambahkan daftar modul guru;
- menambahkan migrasi draft lama;
- mempertahankan export DOCX yang sudah ada.

### Fase 5 — Audit, pengujian, dan hardening

- audit log aktivitas penting;
- pengujian akses lintas role;
- pengujian IDOR/ownership;
- pengujian session expiry;
- pengujian login brute-force/rate limit;
- pengujian regresi AI, continuity, mail merge, dan export.

## Kriteria penerimaan

Implementasi dianggap berhasil apabila:

- user guru tidak dapat membaca modul guru lain melalui API;
- user guru tidak dapat mengubah atau menghapus modul guru lain;
- admin dapat membuat dan menonaktifkan user;
- user nonaktif tidak dapat login;
- session dapat berakhir dan logout berfungsi;
- modul tetap dapat diekspor ke DOCX;
- Pembukaan, Penutup, dan template DOCX tidak berubah;
- aktivitas penting tercatat di audit log;
- draft lama dapat diimpor secara eksplisit;
- seluruh test existing dan regression test tetap lulus.

## Keputusan yang perlu ditetapkan sebelum coding

1. PostgreSQL atau SQLite?
2. Login memakai email, username, atau keduanya?
3. Apakah guru boleh menghapus modul miliknya?
4. Apakah admin boleh mengubah isi semua modul?
5. Apakah reset password dilakukan admin saja atau melalui email?
6. Apakah audit log dapat dihapus, atau bersifat append-only?
7. Apakah aplikasi akan dijalankan lokal atau pada server sekolah/cloud?
8. Berapa lama session login berlaku?

Tidak ada implementasi AAA yang dilakukan hanya dengan dokumen ini. Coding dilakukan setelah keputusan deployment, DBMS, dan kebijakan role disetujui.
