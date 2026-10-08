# Actividad 5. Proyecto de Login

## Portada

| Campo        | Detalle                                          |
| ------------ | ------------------------------------------------ |
| Proyecto     | Proyecto de Login                                |
| Materia      | Programación Web                                 |
| Actividad    | Actividad 5                                      |
| GitHub Pages | `https://azalorenzo.github.io/Actividad5_login/` |

### Integrantes del equipo

- ANGEL OMAR SANTOS RIOS
- AZAEL CHAVEZ LORENZO

### Descripción breve

Sistema web de gestión escolar que cuenta con un login con validaciones, un navbar que muestra el usuario que inició sesión, una sidebar que se puede abrir y cerrar, captura de usuarios y registro de alumnos con cálculo de edad. Los datos se guardan en `localStorage`, por lo que no se utiliza un backend. Las validaciones principales se encuentran en la librería `js/utileria.js`.

---

## Índice

1. [Framework CSS y librerías](#1-framework-css-y-librerías)
2. [Flujo login → sistema](#2-flujo-login--sistema)
3. [Cómo pasa el nombre de usuario del login al navbar](#3-cómo-pasa-el-nombre-de-usuario-del-login-al-navbar)
4. [Métodos principales](#4-métodos-principales)
5. [Proceso de creación paso a paso](#5-proceso-de-creación-paso-a-paso)
6. [Capturas del flujo completo](#6-capturas-del-flujo-completo-funcionando)
7. [Estructura del proyecto](#7-estructura-del-proyecto)
8. [Cómo ejecutarlo + usuario de prueba](#8-cómo-ejecutarlo--usuario-de-prueba)

---

## 1. Framework CSS y librerías

- **Bootstrap 5.3.3** (CDN): se utiliza para organizar el diseño y algunos elementos como el navbar, formularios, botones, tablas, menú desplegable del usuario, submenú y modal. El JavaScript de Bootstrap se carga mediante `bootstrap.bundle.min.js`.

- **Bootstrap Icons 1.11.3** (CDN): se utiliza para los iconos de Inicio, Usuarios, Alumnos y el botón para abrir y cerrar el menú.

- CSS propio:
  - `css/login.css`: contiene los estilos de la pantalla de login, como el fondo, la tarjeta centrada y el tamaño del logo.

  - `css/index.css`: contiene los estilos principales del sistema, como la distribución de la página, la sidebar, su estado cerrado, la adaptación a pantallas pequeñas y el número que aparece en el modal de edad.

- **Sin framework JS**: se utiliza JavaScript y `localStorage` para manejar las funciones del sistema.

---

## 2. Flujo login → sistema

```text
login.html → js/login.js: iniciarSesion()

  1. validarCorreo() + validarPassword()

  2. busca una coincidencia en localStorage["usuarios"]

  3. si es correcto: localStorage["usuario"] = nombre → redirect a index.html

  4. si no es correcto: muestra un mensaje de error en #mensaje

index.html → js/index.js (al cargar)

  1. lee localStorage["usuario"]

  2. si existe → muestra el nombre en #usuarioNavbar

  3. si no existe → redirect a login.html

index.html → cerrarSesion()

  1. removeItem("usuario") → redirect a login.html
```

Archivos involucrados: `login.html`, `js/login.js`, `index.html`, `js/index.js`.

---

## 3. Cómo pasa el nombre de usuario del login al navbar

Se utiliza `localStorage` para guardar y recuperar el nombre del usuario.

**1. Guardar el nombre en el login:** `js/login.js`

```js
localStorage.setItem("usuario", existe.nombre);

window.location.href = "index.html";
```

**2. Leer el nombre en el sistema:** `js/index.js`

```js
const usuario = localStorage.getItem("usuario");

if (usuario) {
  document.getElementById("usuarioNavbar").textContent = usuario;
} else {
  window.location.href = "login.html";
}
```

**3. Cerrar sesión:** `js/index.js` → `localStorage.removeItem("usuario")` y después vuelve a `login.html`.

En `index.html`, el navbar tiene un botón desplegable con `id="usuarioNavbar"`. Su texto inicial es `"Usuario"` y después se cambia por el nombre guardado.

---

## 4. Métodos principales

### 4.1 `js/utileria.js` — funciones de validación

| Método                                 | Qué hace                                                                                                               | Dónde se usa               |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `validarCorreo(correo)`                | Comprueba que el correo tenga un formato válido.                                                                       | Login, captura de usuarios |
| `soloLetras(texto)`                    | Comprueba que el texto tenga solo letras y espacios.                                                                   | Captura, alumnos           |
| `validarLongitud(numero, maxLongitud)` | Comprueba que la cantidad de dígitos no supere el máximo indicado.                                                     | Nº de control              |
| `calcularEdad(fechaNacimiento)`        | Calcula la edad de una persona y toma en cuenta si ya cumplió años este año.                                           | Alumnos + modal            |
| `esMayorDeEdad(fechaNacimiento)`       | Comprueba si la persona tiene 18 años o más.                                                                           | Badge del modal            |
| `validarPassword(password)`            | Comprueba que la contraseña tenga mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial, sin espacios. | Login, captura             |

### 4.2 `js/login.js` — inicio de sesión

| Método                           | Qué hace                                                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `obtenerUsuarios()` (`login.js`) | Obtiene los usuarios guardados en `localStorage["usuarios"]` y agrega el usuario de prueba si todavía no está.          |
| `iniciarSesion()` (`login.js`)   | Valida los datos, busca una coincidencia entre correo y contraseña, guarda el nombre del usuario y lo lleva al sistema. |

### 4.3 `js/index.js` — sistema

| Método                                                     | Qué hace                                                                                                                                            |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Guardar sesión (`index.js`)                                | Comprueba que exista una sesión y muestra el nombre en `#usuarioNavbar`.                                                                            |
| `cerrarSesion()` (`index.js`)                              | Elimina la sesión y regresa al login.                                                                                                               |
| Toggle sidebar (`index.js`)                                | Abre y cierra la sidebar mediante el botón `#btnMenu`.                                                                                              |
| `mostrarVista(nombre)` (`index.js`)                        | Muestra la sección seleccionada y oculta las demás.                                                                                                 |
| `agregarFilaUsuario()` + submit `formCaptura` (`index.js`) | Valida los datos, evita correos repetidos, guarda el usuario en `localStorage["usuarios"]` y lo agrega a la tabla.                                  |
| Submit `formAlumno` + `bootstrap.Modal` (`index.js`)       | Valida el nombre, número de control y fecha, calcula la edad, agrega al alumno a la tabla y muestra el modal indicando si es mayor o menor de edad. |

---

## 5. Proceso de creación paso a paso

### Paso 1 — Login (`login.html` + `css/login.css` + `js/login.js`)
