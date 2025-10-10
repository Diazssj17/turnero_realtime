// db.js
// db.js
import mysql from "mysql2";

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || process.env.HOST || "mysql.railway.internal",
  user: process.env.MYSQLUSER || process.env.USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.PASSWORD || "JogTRBVozjGbMnPNOSxkBQbWjSpySKld",
  database: process.env.MYSQLDATABASE || process.env.DATABASE || "railway",
  port: process.env.MYSQLPORT || process.env.PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con la base de datos:", err);
    return;
  }
  console.log("✅ Conectado correctamente a la base de datos MySQL");
});

export default db;
