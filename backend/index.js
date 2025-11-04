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

  db.run(`CREATE TABLE IF NOT EXISTS medicine_taken_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medicine_user_id INTEGER NOT NULL,
    taken_date TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medicine_user_id) REFERENCES medicine_user(id)
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

// İlaç alındı işaretle
app.post("/api/medicine-taken", (req, res) => {
  const { medicine_user_id } = req.body;
  const taken_date = new Date().toISOString().split("T")[0];

  // Önce bu ilacın bugün alınıp alınmadığını kontrol et
  db.get(
    "SELECT id FROM medicine_taken_logs WHERE medicine_user_id = ? AND taken_date = ?",
    [medicine_user_id, taken_date],
    (err, row) => {
      if (err) {
        console.error("Kontrol hatası:", err);
        return res.status(500).json({ error: err.message });
      }

      // Eğer zaten alınmışsa hata dön
      if (row) {
        return res
          .status(400)
          .json({ error: "Bu ilaç bugün zaten alınmış olarak işaretlenmiş" });
      }

      // Yeni kayıt ekle
      db.run(
        "INSERT INTO medicine_taken_logs (medicine_user_id, taken_date) VALUES (?, ?)",
        [medicine_user_id, taken_date],
        function (err) {
          if (err) {
            console.error("Kayıt hatası:", err);
            return res.status(500).json({ error: err.message });
          }
          res.json({ success: true, id: this.lastID });
        }
      );
    }
  );
});

// Bugün alınan ilaçları getir
app.get("/api/medicine-taken/:date", (req, res) => {
  const date = req.params.date;

  db.all(
    "SELECT medicine_user_id FROM medicine_taken_logs WHERE taken_date = ?",
    [date],
    (err, rows) => {
      if (err) {
        console.error("Veri getirme hatası:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows.map((row) => row.medicine_user_id));
    }
  );
});

// İlaç alındı olarak işaretle
app.post("/api/medicine-taken", (req, res) => {
  console.log("POST isteği alındı /api/medicine-taken:", req.body);

  const { medicine_user_id } = req.body;
  if (!medicine_user_id) {
    console.error("medicine_user_id eksik");
    return res.status(400).json({ error: "medicine_user_id gerekli" });
  }

  const taken_date = new Date().toISOString().split("T")[0];
  console.log("İşleniyor:", { medicine_user_id, taken_date });

  // Önce ilişkinin var olup olmadığını kontrol et
  db.get(
    "SELECT id FROM medicine_user WHERE id = ?",
    [medicine_user_id],
    (err, medicineUser) => {
      if (err) {
        console.error("İlişki kontrol hatası:", err);
        return res.status(500).json({ error: err.message });
      }

      if (!medicineUser) {
        console.error("İlişki bulunamadı:", medicine_user_id);
        return res
          .status(404)
          .json({ error: "İlaç-kullanıcı ilişkisi bulunamadı" });
      }

      // İlacın bugün alınıp alınmadığını kontrol et
      db.get(
        "SELECT id FROM medicine_taken_logs WHERE medicine_user_id = ? AND taken_date = ?",
        [medicine_user_id, taken_date],
        (err, row) => {
          if (err) {
            console.error("Kontrol hatası:", err);
            return res.status(500).json({ error: err.message });
          }

          if (row) {
            console.log("İlaç zaten alınmış:", {
              medicine_user_id,
              taken_date,
            });
            return res.status(400).json({
              error: "Bu ilaç bugün zaten alınmış olarak işaretlenmiş",
            });
          }

          // Yeni kayıt ekle
          db.run(
            "INSERT INTO medicine_taken_logs (medicine_user_id, taken_date) VALUES (?, ?)",
            [medicine_user_id, taken_date],
            function (err) {
              if (err) {
                console.error("Kayıt hatası:", err);
                return res.status(500).json({ error: err.message });
              }
              console.log("Kayıt başarılı:", { id: this.lastID });
              res.json({ success: true, id: this.lastID });
            }
          );
        }
      );
    }
  );
});

// Bugün alınan ilaçları getir
app.get("/api/medicine-taken/:date", (req, res) => {
  const date = req.params.date;
  console.log("Alınan ilaçlar istendi:", date);

  db.all(
    "SELECT medicine_user_id FROM medicine_taken_logs WHERE taken_date = ?",
    [date],
    (err, rows) => {
      if (err) {
        console.error("Veri getirme hatası:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("Bulunan kayıtlar:", rows);
      res.json(rows.map((row) => row.medicine_user_id));
    }
  );
});

// Server başlat
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Backend çalışıyor: Port ${port}`);
});
