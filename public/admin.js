const socket = io();
const tbody = document.querySelector('#tablaTurnos tbody');

// Helper para crear una fila
function crearFila(t) {
  const tr = document.createElement('tr');
  if (t.atendido) tr.classList.add('atendido');
  tr.dataset.id = t.id;
  tr.innerHTML = `
    <td>${t.id}</td>
    <td>${t.turno}</td>
    <td>${t.nombre}</td>
    <td>${t.cedula}</td>
    <td>${new Date(t.fecha).toLocaleString()}</td>
    <td>${t.atendido ? 'Sí' : 'No'}</td>
    <td>
      <button class="btn-atender">${t.atendido ? 'Atendido' : 'Marcar atendido'}</button>
      <button class="btn-eliminar">Eliminar</button>
    </td>
  `;

  // Atender
  tr.querySelector('.btn-atender').addEventListener('click', async () => {
    if (t.atendido) return alert('Ya está atendido');
    const res = await fetch(`/turnos/${t.id}/atender`, { method: 'POST' });
    if (!res.ok) return alert('Error al marcar atendido');
  });

  // Eliminar
  tr.querySelector('.btn-eliminar').addEventListener('click', async () => {
    if (!confirm('Eliminar este turno?')) return;
    const res = await fetch(`/turnos/${t.id}`, { method: 'DELETE' });
    if (!res.ok) return alert('Error al eliminar');
  });

  return tr;
}

// Cargar turnos existentes
async function cargarTurnos() {
  const res = await fetch('/turnos');
  const turnos = await res.json();
  tbody.innerHTML = '';
  turnos.forEach(t => {
    tbody.appendChild(crearFila(t));
  });
}

// Escuchar nuevos turnos
socket.on('nuevo_turno', (data) => {
  // Pedir recarga completa o insertar directamente
  cargarTurnos();
});

// Escuchar actualizaciones
socket.on('turno_actualizado', (data) => {
  cargarTurnos();
});

// Escuchar eliminaciones
socket.on('turno_eliminado', (info) => {
  cargarTurnos();
});

// Init
cargarTurnos();
