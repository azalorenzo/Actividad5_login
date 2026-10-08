const usuarioPrueba = { nombre: "Test", correo: "test@gmail.com", password: "Test123#" };

function obtenerUsuarios() {
  const guardados = JSON.parse(localStorage.getItem("usuarios")) || [];
  if (!guardados.some((u) => u.correo === usuarioPrueba.correo)) {
    guardados.push(usuarioPrueba);
  }
  return guardados;
}

function iniciarSesion() {
  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("contrasena").value;
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = "";

  if (!validarCorreo(correo)) {
    mensaje.textContent = "Escribe un correo electrónico con formato válido.";
    return;
  }
  if (!validarPassword(password)) {
    mensaje.textContent =
      "La contraseña debe tener mayúscula, minúscula, número, carácter especial y 8+ caracteres.";
    return;
  }

  const existe = obtenerUsuarios().find(
    (u) => u.correo === correo && u.password === password
  );

  if (existe) {
    localStorage.setItem("usuario", correo);
    window.location.href = "index.html";
  } else {
    mensaje.textContent = "El correo o la contraseña son incorrectos.";
  }
}