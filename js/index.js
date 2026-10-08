const usuario = localStorage.getItem("usuario");

if (usuario) {
  document.getElementById("usuarioNavbar").textContent = usuario;
} else {
  window.location.href = "login.html";
}

function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}

const btnMenu = document.getElementById("btnMenu");

btnMenu.addEventListener("click", () => {
  const cerrada = document.body.classList.toggle("sidebar-cerrada");
  btnMenu.setAttribute("aria-expanded", String(!cerrada));
});

document.body.classList.add("sidebar-cerrada");

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
    if (window.matchMedia("(max-width: 768px)").matches) {
      document.body.classList.add("sidebar-cerrada");
    }
  });
});

const formCaptura = document.getElementById("formCaptura");
const tablaUsuarios = document.querySelector("#tablaUsuarios tbody");

function agregarFilaUsuario(nombre, correo) {
  const fila = document.createElement("tr");
  const tdNombre = document.createElement("td");
  const tdCorreo = document.createElement("td");
  tdNombre.textContent = nombre;
  tdCorreo.textContent = correo;
  fila.append(tdNombre, tdCorreo);
  tablaUsuarios.appendChild(fila);
}

(JSON.parse(localStorage.getItem("usuarios")) || []).forEach((u) => agregarFilaUsuario(u.nombre, u.correo));

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

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.some((u) => u.correo === correo)) {
    document.getElementById("errorCapCorreo").textContent = "Ese correo ya está registrado.";
    return;
  }

  usuarios.push({ nombre, correo, password });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  agregarFilaUsuario(nombre, correo);

  exito.textContent = "Usuario guardado correctamente.";
  formCaptura.reset();
});

const formAlumno = document.getElementById("formAlumno");
const tablaAlumnos = document.querySelector("#tablaAlumnos tbody");
const modalEdad = new bootstrap.Modal(document.getElementById("modalEdad"));

formAlumno.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("alNombre").value.trim();
  const controlInput = document.getElementById("alControl").value.trim();
  const fecha = document.getElementById("alFecha").value;

  const controlDigitos = controlInput.replace(/\D/g, "");
  const controlOk = validarLongitud(controlDigitos, 6) && controlDigitos.length === 6;
  const nombreOk = soloLetras(nombre);
  const fechaOk = fecha !== "" && !isNaN(calcularEdad(fecha));

  document.getElementById("errorAlNombre").textContent = nombreOk ? "" : "Solo letras y espacios.";
  document.getElementById("errorAlControl").textContent = controlOk ? "" : "Debe tener exactamente 6 dígitos.";
  document.getElementById("errorAlFecha").textContent = fechaOk ? "" : "Elige una fecha de nacimiento válida.";

  if (!(nombreOk && controlOk && fechaOk)) return;

  const edad = calcularEdad(fecha);
  const mayor = esMayorDeEdad(fecha);

  const fila = document.createElement("tr");
  [nombre, controlDigitos, edad].forEach((valor) => {
    const td = document.createElement("td");
    td.textContent = valor;
    fila.appendChild(td);
  });
  tablaAlumnos.appendChild(fila);

  document.getElementById("modalEdadNombre").textContent = nombre;
  document.getElementById("modalEdadNumero").textContent = edad;
  const badge = document.getElementById("modalEdadBadge");
  badge.textContent = mayor ? "Mayor de edad" : "Menor de edad";
  badge.className = "badge " + (mayor ? "bg-success" : "bg-danger");
  modalEdad.show();

  formAlumno.reset();
});
