const mysql = require('mysql2');

// Pool de conexiones para mejor manejo de concurrencia
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'turnero_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error conectando a la BD:', err);
  } else {
    console.log('✅ Conectado a la base de datos MySQL (pool)');
    connection.release();
  }
});

module.exports = pool.promise();
