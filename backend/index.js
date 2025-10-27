const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = process.env.PORT || 5000;

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
  db.run(`CREATE TABLE IF NOT EXISTS medicine_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    medicine_id INTEGER NOT NULL,
    start_date TEXT,
    end_date TEXT,
    daily_dosage INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id)
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

// 🔹 Kullanıcı ilaç ilişkisi ekle
app.post("/api/user-medicines", (req, res) => {
  const { user_id, medicine_id, start_date, end_date, daily_dosage } = req.body;

  // Kullanıcı ve ilacın var olup olmadığını kontrol et
  db.get(
    "SELECT id FROM users WHERE id = ? UNION SELECT id FROM medicines WHERE id = ?",
    [user_id, medicine_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row)
        return res
          .status(404)
          .json({ error: "Kullanıcı veya ilaç bulunamadı" });

      // İlişkiyi ekle
      db.run(
        "INSERT INTO medicine_user (user_id, medicine_id, start_date, end_date, daily_dosage) VALUES (?, ?, ?, ?, ?)",
        [user_id, medicine_id, start_date, end_date, daily_dosage],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({
            id: this.lastID,
            user_id,
            medicine_id,
            start_date,
            end_date,
            daily_dosage,
          });
        }
      );
    }
  );
});

// 🔹 Kullanıcı ilaç ilişkilerini listele
app.get("/api/user-medicines", (req, res) => {
  const query = `
    SELECT 
      mu.*,
      m.name as medicine_name,
      m.dosage as medicine_dosage
    FROM medicine_user mu
    LEFT JOIN medicines m ON mu.medicine_id = m.id
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 🔹 Belirli bir kullanıcının ilaçlarını listele
app.get("/api/user-medicines/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      mu.*,
      m.name as medicine_name,
      m.dosage as medicine_dosage,
      json_object(
        'id', m.id,
        'name', m.name,
        'dosage', m.dosage
      ) as medicine
    FROM medicine_user mu
    JOIN medicines m ON mu.medicine_id = m.id
    WHERE mu.user_id = ?
  `;

  // Önce kullanıcının var olup olmadığını kontrol et
  db.get("SELECT id FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });

    // Kullanıcı yoksa 404 dön
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    // Kullanıcı varsa, ilaçlarını getir
    db.all(query, [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      // Kullanıcının ilacı yoksa boş array dön
      if (rows.length === 0) {
        return res.json([]);
      }

      // medicine field'ını JSON'dan parse edelim
      const formattedRows = rows.map((row) => ({
        ...row,
        medicine: JSON.parse(row.medicine),
      }));

      res.json(formattedRows);
    });
  });
});

// 🔹 Kullanıcı ilaç ilişkisini sil
app.delete("/api/user-medicines/:userId/:medicineId", (req, res) => {
  const { userId, medicineId } = req.params;
  console.log("DELETE İsteği Detayları:", {
    url: `/api/user-medicines/${userId}/${medicineId}`,
    userId: userId,
    medicineId: medicineId,
    params: req.params,
    query: req.query,
    body: req.body,
  });

  console.log("SQL Sorgusu çalıştırılacak:", {
    userId: userId,
    medicineId: medicineId,
    userIdType: typeof userId,
    medicineIdType: typeof medicineId,
  });

  db.run(
    "DELETE FROM medicine_user WHERE user_id = ? AND medicine_id = ?",
    [Number(userId), Number(medicineId)],
    function (err) {
      if (err) {
        console.error("Database hatası:", err.message);
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        console.log("Kayıt bulunamadı");
        return res.status(404).json({ error: "Kayıt bulunamadı" });
      }

      console.log("Kayıt başarıyla silindi");
      res.json({ message: "Kayıt başarıyla silindi", userId, medicineId });
    }
  );
});

// Server başlat
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Backend çalışıyor: Port ${port}`);
});
