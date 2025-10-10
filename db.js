// db.js
import mysql from "mysql2";

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "turnero_realtime",
  port: process.env.MYSQLPORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con la base de datos:", err);
    return;
  }
  console.log("✅ Conectado a la base de datos MySQL");
});

export default db;
