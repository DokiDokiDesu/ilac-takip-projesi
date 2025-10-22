const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// SQLite veritabanı dosyası (yoksa oluşturur)
const db = new sqlite3.Database("./database.sqlite");

// Tablo oluştur (ilk çalıştırmada oluşacak)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    dosage TEXT
  )`);
});

// 🔹 Kullanıcı ekle
app.post("/users", (req, res) => {
  const { name } = req.body;
  db.run("INSERT INTO users (name) VALUES (?)", [name], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name });
  });
});

// 🔹 Kullanıcıları listele
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 🔹 İlaç ekle
app.post("/medicines", (req, res) => {
  const { name, dosage } = req.body;
  db.run(
    "INSERT INTO medicines (name, dosage) VALUES (?, ?)",
    [name, dosage],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, dosage });
    }
  );
});

// 🔹 İlaçları listele
app.get("/medicines", (req, res) => {
  db.all("SELECT * FROM medicines", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 🔹 İlaç sil
app.delete("/medicines/:id", (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /medicines/${id} isteği alındı`);

  db.run("DELETE FROM medicines WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("Database hatası:", err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log(`Silinen kayıt sayısı: ${this.changes}`);

    if (this.changes === 0) {
      console.log("İlaç bulunamadı");
      return res.status(404).json({ error: "İlaç bulunamadı" });
    }

    console.log("İlaç başarıyla silindi");
    res.json({ message: "İlaç başarıyla silindi", deletedId: id });
  });
});

// 🔹 Kullanıcı sil
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /users/${id} isteği alındı`);

  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("Database hatası:", err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log(`Silinen kayıt sayısı: ${this.changes}`);

    if (this.changes === 0) {
      console.log("Kullanıcı bulunamadı");
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    console.log("Kullanıcı başarıyla silindi");
    res.json({ message: "Kullanıcı başarıyla silindi", deletedId: id });
  });
});

// Server başlat
app.listen(port, () => {
  console.log(`✅ Backend çalışıyor: http://localhost:${port}`);
});
