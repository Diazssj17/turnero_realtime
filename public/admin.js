const API_URL = "https://turnero-production.up.railway.app";

document.getElementById("btnCargar").addEventListener("click", async () => {
  const res = await fetch(`${API_URL}/usuarios`);
  const data = await res.json();

  const tabla = document.getElementById("tablaUsuarios");
  tabla.innerHTML = "";

  data.forEach((u) => {
    const fila = `<tr><td>${u.id}</td><td>${u.nombre}</td><td>${u.email}</td></tr>`;
    tabla.innerHTML += fila;
  });
});


    mensaje.textContent = "✅ Usuarios cargados correctamente.";
  } catch (error) {
    console.error(error);
    mensaje.textContent = "❌ Error al conectar con el servidor.";
  }
});

