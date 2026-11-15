# Backend formulir kontak

Memerlukan Node.js 18 atau lebih baru dan npm. Dari direktori proyek:

```bash
cd backend
npm install
npm start
```

Buka `http://localhost:3000`. Server menyajikan `index.html`, `styles.css`, dan `app.js` dari direktori utama. Port bawaan adalah `3000`; variabel lingkungan `PORT` dapat digunakan untuk menggantinya.

`POST /api/contact` menerima JSON dengan kolom `name`, `email`, dan `message`. Nama dan pesan wajib diisi; alamat email harus valid. Batas panjang: nama 100 karakter, email 254 karakter, dan pesan 5.000 karakter. Respons sukses berstatus `201` dengan `success: true`; kesalahan validasi berstatus `400`, dan kegagalan penyimpanan berstatus `500` dengan `success: false` serta pesan yang jelas.

Pesan disimpan dalam `backend/contacts.log`, satu objek JSON per baris, berisi waktu, nama, email, dan pesan. File dibuat saat pesan valid pertama diterima dan tidak disajikan melalui HTTP. Backend hanya menyimpan pesan; tidak mengirim email. Tidak diperlukan kredensial atau API key. Simpan cadangan log dan batasi aksesnya karena log memuat data kontak.

Jika halaman dibuka langsung sebagai file atau melalui server statis tanpa endpoint ini, formulir akan menampilkan pesan gagal dan pengunjung dapat menggunakan tautan email atau telepon.
