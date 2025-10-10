const API_URL = "https://TU-PROYECTO.up.railway.app";

document.getElementById("btnCargar").addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_URL}/usuarios`);
    const data = await res.json();

    const tabla = document.getElementById("tablaUsuarios");
    tabla.innerHTML = ""; // limpiar tabla antes de llenar

    data.forEach((u) => {
      const fila = `<tr>
        <td>${u.id}</td>
        <td>${u.nombre}</td>
        <td>${u.email}</td>
      </tr>`;
      tabla.innerHTML += fila;
    });
  } catch (error) {
    alert("❌ Error al cargar usuarios");
    console.error(error);
  }
});

});

