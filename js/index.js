// ============================================================================
// index.js — lógica de la pantalla "dentro" del sistema.
// Depende de utileria.js (debe cargarse antes que este archivo en index.html).
// ============================================================================

/* --------------------------- sesión / usuario en el navbar --------------------------- */

const usuario = localStorage.getItem("usuario");

if (usuario) {
  document.getElementById("usuarioNavbar").textContent = usuario;
} else {
  // Sin sesión iniciada: regresa al login.
  window.location.href = "login.html";
}

function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}

/* -------------------------------- sidebar: abrir/cerrar -------------------------------- */

const btnMenu = document.getElementById("btnMenu");

btnMenu.addEventListener("click", () => {
  const cerrada = document.body.classList.toggle("sidebar-cerrada");
  btnMenu.setAttribute("aria-expanded", String(!cerrada));
});

// En pantallas angostas, que la sidebar empiece cerrada.
if (window.matchMedia("(max-width: 768px)").matches) {
  document.body.classList.add("sidebar-cerrada");
}

/* -------------------------------- cambiar de vista -------------------------------- */

const enlacesVista = document.querySelectorAll(".enlace-vista");
const vistas = document.querySelectorAll(".vista");

function mostrarVista(nombre) {
  vistas.forEach((vista) => {
    vista.classList.toggle("d-none", vista.id !== `vista-${nombre}`);
  });
  enlacesVista.forEach((enlace) => {
    enlace.classList.toggle("activo", enlace.dataset.vista === nombre);
  });
}

enlacesVista.forEach((enlace) => {
  enlace.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarVista(enlace.dataset.vista);
    // En móvil, cerrar la sidebar al elegir una opción.
    if (window.matchMedia("(max-width: 768px)").matches) {
      document.body.classList.add("sidebar-cerrada");
    }
  });
});

/* ===================================================================== */
/*  Usuarios > Captura — validada con validarCorreo() y validarPassword() */
/* ===================================================================== */

const formCaptura = document.getElementById("formCaptura");
const tablaUsuarios = document.querySelector("#tablaUsuarios tbody");

formCaptura.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("capNombre").value.trim();
  const correo = document.getElementById("capCorreo").value.trim();
  const password = document.getElementById("capPassword").value;

  const nombreOk = soloLetras(nombre);
  const correoOk = validarCorreo(correo);
  const passwordOk = validarPassword(password);

  document.getElementById("errorCapNombre").textContent = nombreOk ? "" : "Solo letras y espacios.";
  document.getElementById("errorCapCorreo").textContent = correoOk ? "" : "Formato de correo no válido.";
  document.getElementById("errorCapPassword").textContent = passwordOk
    ? ""
    : "Necesita mayúscula, minúscula, número, carácter especial y 8+ caracteres.";

  const exito = document.getElementById("exitoCaptura");
  exito.textContent = "";

  if (!(nombreOk && correoOk && passwordOk)) return;

  // "Guardar": lo agregamos a la tabla en pantalla (no hay backend real).
  const fila = document.createElement("tr");
  fila.innerHTML = `<td>${nombre}</td><td>${correo}</td>`;
  tablaUsuarios.appendChild(fila);

  exito.textContent = "Usuario guardado correctamente.";
  formCaptura.reset();
});

/* ===================================================================== */
/*  Alumnos — número de control (validarLongitud) + modal de edad          */
/* ===================================================================== */

const formAlumno = document.getElementById("formAlumno");
const tablaAlumnos = document.querySelector("#tablaAlumnos tbody");
const modalEdad = new bootstrap.Modal(document.getElementById("modalEdad"));

formAlumno.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("alNombre").value.trim();
  const controlInput = document.getElementById("alControl").value.trim();
  const fecha = document.getElementById("alFecha").value;

  const controlDigitos = controlInput.replace(/\D/g, "");
  // validarLongitud(numero, 6) confirma que no excede 6 dígitos; exigimos
  // además que sean exactamente 6, ya que un número de control real tiene
  // una longitud fija.
  const controlOk = validarLongitud(controlDigitos, 6) && controlDigitos.length === 6;
  const nombreOk = soloLetras(nombre);
  const fechaOk = fecha !== "" && !isNaN(calcularEdad(fecha));

  document.getElementById("errorAlNombre").textContent = nombreOk ? "" : "Solo letras y espacios.";
  document.getElementById("errorAlControl").textContent = controlOk ? "" : "Debe tener exactamente 6 dígitos.";
  document.getElementById("errorAlFecha").textContent = fechaOk ? "" : "Elige una fecha de nacimiento válida.";

  if (!(nombreOk && controlOk && fechaOk)) return;

  const edad = calcularEdad(fecha);
  const mayor = esMayorDeEdad(fecha);

  // Tabla en pantalla.
  const fila = document.createElement("tr");
  fila.innerHTML = `<td>${nombre}</td><td>${controlDigitos}</td><td>${edad}</td>`;
  tablaAlumnos.appendChild(fila);

  // Modal de edad.
  document.getElementById("modalEdadNombre").textContent = nombre;
  document.getElementById("modalEdadNumero").textContent = edad;
  const badge = document.getElementById("modalEdadBadge");
  badge.textContent = mayor ? "Mayor de edad" : "Menor de edad";
  badge.className = "badge " + (mayor ? "bg-success" : "bg-danger");
  modalEdad.show();

  formAlumno.reset();
});
