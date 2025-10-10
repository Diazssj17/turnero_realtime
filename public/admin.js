const btnCargar = document.getElementById("btnCargar");
const tabla = document.getElementById("tablaUsuarios");
const mensaje = document.getElementById("mensaje");

const API_URL = window.location.origin;

btnCargar.addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_URL}/usuarios`);
    const data = await res.json();

    tabla.innerHTML = ""; // limpiar tabla

    if (data.length === 0) {
      mensaje.textContent = "⚠️ No hay usuarios registrados aún.";
      return;
    }

    data.forEach((user) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
      `;
      tabla.appendChild(fila);
    });

    mensaje.textContent = "✅ Usuarios cargados correctamente.";
  } catch (error) {
    console.error(error);
    mensaje.textContent = "❌ Error al conectar con el servidor.";
  }
});

