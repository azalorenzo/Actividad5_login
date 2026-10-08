const usuarioRegistrado = {
  correo: "test@gmail.com",
  password: "Test123#",
};

function iniciarSesion() {
  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("contrasena").value;
  const mensaje = document.getElementById("mensaje");
  mensaje.innerHTML = "";

  if (!validarCorreo(correo)) {
    mensaje.innerHTML = "Escribe un correo electrónico con formato válido.";
    return;
  }
  if (!validarPassword(password)) {
    mensaje.innerHTML =
      "La contraseña debe tener mayúscula, minúscula, número, carácter especial y 8+ caracteres.";
    return;
  }

  if (correo === usuarioRegistrado.correo && password === usuarioRegistrado.password) {
    localStorage.setItem("usuario", correo);
    window.location.href = "index.html";
  } else {
    mensaje.innerHTML = "El correo o la contraseña son incorrectos.";
  }
}
