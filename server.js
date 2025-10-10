import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const dataPath = path.join(__dirname, "data", "registros.json");

// Asegurar que el archivo exista
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]");
}

// Guardar nuevo registro
app.post("/api/registrar", (req, res) => {
  const { nombre, cedula } = req.body;
  if (!nombre || !cedula) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const registros = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  registros.push({ nombre, cedula, fecha: new Date().toISOString() });
  fs.writeFileSync(dataPath, JSON.stringify(registros, null, 2));

  res.json({ mensaje: "Registro guardado" });
});

// Mostrar todos los registros
app.get("/api/registros", (req, res) => {
  const registros = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  res.json(registros);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor activo en puerto ${PORT}`);
});

