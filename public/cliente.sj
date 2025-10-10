const API_URL = window.location.origin;

document.getElementById("btnRegistrar").addEventListener("click", async () => {
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!nombre || !email || !password) {
    alert("⚠️ Todos los campos son obligatorios");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await res.json();
    alert(data.message || data.error);
  } catch (error) {
    alert("❌ Error al registrar usuario");
  }
});

