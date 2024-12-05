const express = require("express");
const todosRoutes = require("./routes/tododb.js"); // Pastikan path ini benar
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000; // Menetapkan port default jika tidak ada di .env

const db = require("./database/db"); // Pastikan Anda memiliki koneksi database yang benar
const expressLayouts = require("express-ejs-layouts");

// Middleware untuk session dan bcrypt
const session = require("express-session");
const authRoutes = require("./routes/authRoutes.js");
const { isAuthenticated } = require("./middlewares/middleware.js");

// Middleware untuk static files dan layout
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set ke true jika menggunakan HTTPS
  })
);

// Rute untuk todos
app.use("/todos", todosRoutes);

// Rute untuk autentikasi
app.use("/", authRoutes);

// Set view engine
app.set("view engine", "ejs");

// Rute untuk halaman utama
app.get("/", isAuthenticated, (req, res) => {
  res.render("index", { layout: "layouts/main-layout.ejs" });
});

// Rute untuk halaman kontak
app.get("/contact", isAuthenticated, (req, res) => {
  res.render("contact", {
    layout: "layouts/main-layout.ejs",
  });
});

// Rute untuk menampilkan todos
app.get("/todo-view", isAuthenticated, (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.render("todo", {
      layout: "layouts/main-layout.ejs",
      todos: todos,
    });
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
