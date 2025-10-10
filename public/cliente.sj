const form = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

// ⚠️ Usa la URL base de Railway cuando despliegues
const API_URL = window.location.origin;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      mensaje.textContent = "✅ " + data.message;
      mensaje.style.color = "green";
    } else {
      mensaje.textContent = "❌ " + data.error;
      mensaje.style.color = "red";
    }
  } catch (error) {
    mensaje.textContent = "❌ Error al conectar con el servidor";
    mensaje.style.color = "red";
    console.error(error);
  }
});

