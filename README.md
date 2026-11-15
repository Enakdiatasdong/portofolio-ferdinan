# Portofolio FERDINAN

Website single-page berbahasa Indonesia untuk profil Shipping Leader. Dibangun dengan HTML, CSS, dan JavaScript tanpa framework frontend atau CDN.

## Membuka website (lokal)

- Buka `index.html` langsung di browser; navigasi, diagram shipping, dan pemilih model drop tetap berfungsi.
- Untuk server statis, jalankan `python3 -m http.server 8080` dari direktori ini, lalu buka `http://localhost:8080`.
- Form kontak membutuhkan backend (lihat bawah). Jika dibuka sebagai file atau melalui server statis saja, form menampilkan pesan gagal yang jelas dan pengunjung dapat memakai tautan email atau telepon.

## Deploy ke GitHub Pages (hosting yang dipakai)

> **Keputusan Sambo 16 Nov 2026 00:28 WIB: hosting pakai GitHub Pages, .MY.ID DIBATALKAN.** Target domain `.MY.ID` (ferdinan.my.id) tidak lagi dipakai — jangan pointing DNS ke mana pun untuk domain itu dari proyek ini.

Akun GitHub Sambo: **Enakdiatasdong** (https://github.com/Enakdiatasdong).

### Opsi A — Project site (disarankan)

Repo: `portofolio-ferdinan` — URL hasil: **https://enakdiatasdong.github.io/portofolio-ferdinan/**

1. Di GitHub, buat repo publik baru bernama `portofolio-ferdinan` (tanpa README, tanpa .gitignore, tanpa lisensi — isinya sudah ada di lokal).
2. Dari direktori proyek ini (repo lokal + commit awal sudah disiapkan), jalankan:
   ```bash
   git remote add origin https://github.com/Enakdiatasdong/portofolio-ferdinan.git
   git push -u origin main
   ```
   (Login GitHub Sambo diperlukan di langkah ini — push TIDAK dilakukan oleh agen.)
3. Di repo GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main, folder: / (root) → Save.**
4. Tunggu 1–2 menit, lalu buka https://enakdiatasdong.github.io/portofolio-ferdinan/ — selesai.

### Opsi B — User site (jadi alamat root)

Repo: `enakdiatasdong.github.io` — URL hasil: **https://enakdiatasdong.github.io/**

Langkahnya sama seperti Opsi A, hanya nama repo yang berbeda. Pilih salah satu opsi saja — jangan pakai dua-duanya untuk konten yang sama.

### Catatan penting soal GitHub Pages

- **GitHub Pages itu static-only: backend di `backend/` TIDAK berjalan di Pages.** Folder `backend/` tetap ada di repo sebagai bonus terpisah (untuk dijalankan lokal / di hosting Node.js), tapi di Pages hanya file statis (`index.html`, `styles.css`, `app.js`) yang disajikan.
- **Form kontak di Pages pakai mailto.** Karena `/api/contact` tidak ada di Pages, form akan menampilkan pesan gagal yang jelas, dan pengunjung diarahkan ke tautan **email** (`mailto:ferdinanpvt@gmail.com`) / telepon yang ada di halaman — termasuk tautan "kirim langsung via email" di bawah form.
- File `.nojekyll` sudah ada di root supaya GitHub Pages menyajikan file apa adanya tanpa proses Jekyll.
- Semua path di site ini relatif (`styles.css`, `app.js`, `api/contact`), jadi site jalan baik di alamat root (Opsi B) maupun subpath `/portofolio-ferdinan/` (Opsi A). Tidak ada dependensi build.

## Menjalankan backend (bonus, lokal saja)

Gunakan Node.js 18 atau lebih baru:

```bash
cd backend
npm install
npm start
```

Buka `http://localhost:3000`. Backend sekaligus melayani website dan endpoint `POST /api/contact`. Pesan yang lolos validasi disimpan sebagai JSON lines di `backend/contacts.log`; tidak ada email yang dikirim. Detail tersedia di `backend/README.md`.

## Struktur file

```text
index.html             Konten dan struktur single-page
styles.css             Desain muted dan layout responsif
app.js                 Navigasi, diagram shipping, model drop, form kontak
.nojekyll              Nonaktifkan Jekyll di GitHub Pages
backend/server.js      Server Express, validasi, dan penyimpanan pesan
backend/package.json   Dependensi Express dan script start
backend/README.md      Petunjuk backend dan format API
```

Dashboard menggunakan batang ilustratif tanpa angka operasional tambahan dan label "Contoh ilustrasi — bukan data operasional nyata". Isi portofolio mengikuti data CV yang diberikan.
