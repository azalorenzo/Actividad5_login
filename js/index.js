// Obtener usuario
const usuario = localStorage.getItem("usuario");

// Mostrar usuario en el navbar
if (usuario) {
  document.getElementById("usuarioNavbar").textContent = usuario;
} else {
  window.location.href = "login.html";
}

function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}
