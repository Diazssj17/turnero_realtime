const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Registrar cliente y asignar turno
app.post('/registro', async (req, res) => {
  try {
    const { nombre, cedula } = req.body;
    if (!nombre || !cedula) return res.status(400).json({ error: 'Faltan datos' });

    // Insertar o actualizar cliente
    const [resultCliente] = await db.query(
      'INSERT INTO clientes (nombre, cedula) VALUES (?, ?) ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)',
      [nombre, cedula]
    );

    const clienteId = resultCliente.insertId || (await (async () => {
      // si ya existía, obtener su id
      const [rows] = await db.query('SELECT id FROM clientes WHERE cedula = ?', [cedula]);
      return rows[0].id;
    })());

    // Obtener último número de turno
    const [rowsUlt] = await db.query('SELECT MAX(numero_turno) as ultimo FROM turnos');
    const nuevoTurno = (rowsUlt[0].ultimo || 0) + 1;

    // Insertar turno
    await db.query('INSERT INTO turnos (cliente_id, numero_turno) VALUES (?, ?)', [clienteId, nuevoTurno]);

    const data = { nombre, cedula, turno: nuevoTurno };
    io.emit('nuevo_turno', data);
    res.json(data);
  } catch (err) {
    console.error('Error en /registro:', err);
    res.status(500).json({ error: 'Error en BD' });
  }
});

// Obtener todos los turnos (para admin)
app.get('/turnos', async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT t.id, t.numero_turno AS turno, t.atendido, c.nombre, c.cedula, t.fecha
       FROM turnos t JOIN clientes c ON t.cliente_id = c.id
       ORDER BY t.id DESC`
    );
    res.json(results);
  } catch (err) {
    console.error('Error en /turnos:', err);
    res.status(500).send('Error en la BD');
  }
});

// Marcar como atendido
app.post('/turnos/:id/atender', async (req, res) => {
  try {
    const id = req.params.id;
    await db.query('UPDATE turnos SET atendido = TRUE WHERE id = ?', [id]);
    // Notificar a clientes/admins
    const [rows] = await db.query('SELECT t.numero_turno AS turno, c.nombre, c.cedula, t.atendido FROM turnos t JOIN clientes c ON t.cliente_id = c.id WHERE t.id = ?', [id]);
    const updated = rows[0];
    io.emit('turno_actualizado', updated);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en /turnos/:id/atender', err);
    res.status(500).send('Error en BD');
  }
});

// Eliminar turno
app.delete('/turnos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.query('DELETE FROM turnos WHERE id = ?', [id]);
    io.emit('turno_eliminado', { id: Number(id) });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en DELETE /turnos/:id', err);
    res.status(500).send('Error en BD');
  }
});

// WebSockets
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado');
  socket.on('disconnect', () => console.log('🔴 Cliente desconectado'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
