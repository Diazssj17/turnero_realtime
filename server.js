// server.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(express.static("public")); // donde estarán cliente.html y admin.html

// Rutas de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "registros.json");

// Crear carpeta y archivo si no existen
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]", "utf-8");
  console.log("🆕 Archivo registros.json creado automáticamente.");
}

// Leer registros
function leerRegistros() {
  try {
    const data = fs.readFileSync(dataFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Error al leer registros:", error);
    return [];
  }
}

// Guardar registros
function guardarRegistros(registros) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(registros, null, 2));
  } catch (error) {
    console.error("❌ Error al guardar registros:", error);
  }
}

// ✅ Ruta principal
app.get("/", (req, res) => {
  res.send("🚀 Servidor activo y en funcionamiento");
});

// 📩 Ruta para cliente (registro)
app.post("/registro", (req, res) => {
  const { nombre, cedula } = req.body;

  if (!nombre || !cedula) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const registros = leerRegistros();
  registros.push({ nombre, cedula, hora: new Date().toLocaleString() });
  guardarRegistros(registros);

  console.log(`🟢 Nuevo registro: ${nombre} (${cedula})`);
  res.json({ message: "✅ Registro guardado correctamente" });
});

// 📤 Ruta para admin (ver todos los registros)
app.get("/registros", (req, res) => {
  const registros = leerRegistros();
  res.json(registros);
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
});

