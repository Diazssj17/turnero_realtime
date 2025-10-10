import express from "express";
import db from "./db.js"; // 👈 Importa la conexión correctamente

const app = express();
app.use(express.json());

app.post("/registro", (req, res) => {
  const { nombre, email, password } = req.body;

  const sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
  db.query(sql, [nombre, email, password], (err, result) => {
    if (err) {
      console.error("Error en /registro:", err);
      res.status(500).json({ error: "Error al registrar usuario" });
      return;
    }
    res.json({ message: "Usuario registrado correctamente" });
  });
});

app.listen(3000, () => console.log("🚀 Servidor corriendo en el puerto 3000"));
