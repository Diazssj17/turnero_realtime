import express from "express";
import db from "./db.js";

const app = express();
app.use(express.json());

// ✅ Servir archivos del frontend
app.use(express.static("public"));

// ✅ Ruta de prueba
app.get("/", (req, res) => res.send("Servidor activo 🚀"));

// ✅ Registro
app.post("/registro", (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
  db.query(sql, [nombre, email, password], (err, result) => {
    if (err) {
      console.error("❌ Error en /registro:", err);
      return res.status(500).json({ error: "Error al registrar usuario" });
    }
    res.json({ message: "✅ Usuario registrado correctamente" });
  });
});

// ✅ Puerto dinámico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});

// ✅ Escuchar en el puerto asignado por Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});

