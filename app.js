const port = 3000;

const express = require('express');
const app = express();

// --- START: Contoh Middleware ---

// 1. Middleware Level Aplikasi Sederhana (Custom Logger)
// Middleware ini akan dijalankan untuk SETIAP permintaan yang masuk ke server.
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Permintaan Masuk: ${req.method} ${req.url}`);
    // 'next()' adalah fungsi penting yang memanggil middleware berikutnya dalam tumpukan
    // atau handler rute jika tidak ada middleware lain.
    // Tanpa next(), permintaan akan 'terjebak' di middleware ini.
    next();
});

// Middleware untuk parsing JSON request bodies (ini sudah Anda gunakan)
app.use(express.json());

// --- END: Contoh Middleware ---


// Configure EJS as the view engine
app.set("view engine", "ejs");

// Rute untuk halaman utama
app.get("/", (req, res) => {
    // Merender contact.ejs ketika mengakses root
    res.render("contact");
});

// Rute untuk halaman kontak
app.get("/contact", (req, res) => {
    // Merender contact.ejs ketika mengakses /contact
    res.render("contact");
});

// Rute untuk halaman index (jika masih ingin ada akses langsung)
app.get("/index", (req, res) => {
    res.render("index");
});


app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log(`Lihat log permintaan di konsol terminal ini.`);
});