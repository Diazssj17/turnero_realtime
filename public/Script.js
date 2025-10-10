const socket = io();
const form = document.getElementById('registroForm');
const lista = document.getElementById('lista');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const cedula = document.getElementById('cedula').value.trim();
  if (!nombre || !cedula) return alert('Completa los datos');

  const res = await fetch('/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, cedula })
  });

  if (res.ok) {
    const data = await res.json();
    alert(`Turno asignado: #${data.turno}`);
    form.reset();
  } else {
    alert('Error registrando cliente');
  }
});

// Escuchar nuevos turnos
socket.on('nuevo_turno', (data) => {
  const li = document.createElement('li');
  li.textContent = `Turno #${data.turno} → ${data.nombre} (Cédula: ${data.cedula})`;
  lista.prepend(li);
});

// Escuchar actualizaciones (por ejemplo, marcado como atendido)
socket.on('turno_actualizado', (data) => {
  const li = document.createElement('li');
  li.textContent = `Turno actualizado: #${data.turno} → ${data.nombre} (Atendido: ${data.atendido})`;
  lista.prepend(li);
});

// Escuchar eliminaciones
socket.on('turno_eliminado', (info) => {
  const li = document.createElement('li');
  li.textContent = `Turno eliminado: id=${info.id}`;
  lista.prepend(li);
});
