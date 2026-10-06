// Usuario de prueba
const usuarioRegistrado = {
  correo: "test@gmail.com",
  password: "Test123#",
};

function iniciarSesion() {
  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("contrasena").value;
  document.getElementById("mensaje").innerHTML = "";

  if (correo === usuarioRegistrado.correo && password === usuarioRegistrado.password) {
    localStorage.setItem("usuario", correo);
    window.location.href = "index.html";
  } else {
    document.getElementById("mensaje").innerHTML = "El correo o la contraseña son incorrectos.";
  }
}
