'use strict';

const express = require('express');
const path = require('node:path');
const { appendFile } = require('node:fs/promises');

const app = express();
const publicRoot = path.resolve(__dirname, '..');
const contactsFile = path.join(__dirname, 'contacts.log');
const port = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));

app.post('/api/contact', async (req, res) => {
  const body = req.body || {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const errors = {};

  if (!name || name.length > 100) {
    errors.name = 'Nama wajib diisi, maksimal 100 karakter.';
  }
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Masukkan alamat email yang valid, maksimal 254 karakter.';
  }
  if (!message || message.length > 5000) {
    errors.message = 'Pesan wajib diisi, maksimal 5.000 karakter.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Pesan belum disimpan. Periksa kembali isian formulir.',
      errors
    });
  }

  try {
    const entry = { timestamp: new Date().toISOString(), name, email, message };
    await appendFile(contactsFile, `${JSON.stringify(entry)}\n`, { encoding: 'utf8', mode: 0o600 });
    return res.status(201).json({
      success: true,
      message: 'Pesan berhasil disimpan. Terima kasih telah menghubungi FERDINAN.'
    });
  } catch (error) {
    console.error('Tidak dapat menyimpan pesan kontak:', error.code || 'UNKNOWN_ERROR');
    return res.status(500).json({
      success: false,
      message: 'Pesan belum tersimpan karena gangguan server. Silakan coba lagi atau hubungi melalui email.'
    });
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

// Hanya berkas publik yang disajikan; contacts.log dan berkas backend tetap privat.
const publicFiles = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/styles.css', 'styles.css'],
  ['/app.js', 'app.js']
]);

app.get([...publicFiles.keys()], (req, res, next) => {
  const file = publicFiles.get(req.path);
  if (!file) return next();
  return res.sendFile(file, { root: publicRoot });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const invalidBody = error.type === 'entity.parse.failed';
  const oversizedBody = error.type === 'entity.too.large';
  const status = oversizedBody ? 413 : invalidBody ? 400 : 500;
  return res.status(status).json({
    success: false,
    message: oversizedBody
      ? 'Pesan terlalu besar. Kurangi panjang isian formulir.'
      : invalidBody
        ? 'Format permintaan tidak valid. Silakan kirim kembali formulir.'
        : 'Terjadi gangguan server. Silakan coba lagi atau hubungi melalui email.'
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Portofolio FERDINAN berjalan di http://localhost:${port}`);
  });
}

module.exports = app;
