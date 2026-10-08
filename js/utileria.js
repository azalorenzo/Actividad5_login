/**
 * ============================================================================
 *  utileria.js
 * ----------------------------------------------------------------------------
 *  Librería JS de validaciones y utilidades para formularios.
 *  Sin frameworks, sin dependencias externas, sin componentes visuales:
 *  solo funciones puras que devuelven boolean, número o string y que
 *  cualquier formulario, modal o login puede usar.
 *
 *  Uso:
 *      <script src="js/utileria.js"></script>
 *      <script>
 *          if (validarCorreo(campo.value)) { ... }
 *      </script>
 *
 *  Todas las funciones quedan disponibles como globales (para usarlas
 *  directo en HTML/JS clásico) y también agrupadas en `window.Utileria`
 *  por si se prefiere llamarlas con espacio de nombres, p. ej.
 *  `Utileria.validarCorreo(...)`.
 * ============================================================================
 */

/* ------------------------------------------------------------------------ */
/*  PARTE OBLIGATORIA                                                       */
/* ------------------------------------------------------------------------ */

/**
 * Valida que un correo electrónico tenga un formato correcto
 * (usuario@dominio.extensión).
 *
 * @param {string} correo - Correo electrónico a validar.
 * @returns {boolean} true si el formato es válido, false en caso contrario.
 *
 * @example
 * validarCorreo("ana@correo.com");   // true
 * validarCorreo("ana@correo");       // false
 * validarCorreo("ana en correo.com");// false
 */
function validarCorreo(correo) {
  if (typeof correo !== "string") return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(correo.trim());
}

/**
 * Valida que un texto contenga únicamente letras (mayúsculas y minúsculas),
 * incluyendo vocales acentuadas (á é í ó ú, Á É Í Ó Ú), la letra ñ/Ñ y la
 * diéresis (ü/Ü). Permite espacios simples entre palabras para poder
 * validar nombres compuestos ("María José").
 *
 * @param {string} texto - Texto a validar.
 * @returns {boolean} true si el texto solo contiene letras/espacios, false
 *                     si contiene números, signos de puntuación u otros símbolos.
 *
 * @example
 * soloLetras("María José");  // true
 * soloLetras("Peña123");     // false
 * soloLetras("");            // false
 */
function soloLetras(texto) {
  if (typeof texto !== "string" || texto.trim() === "") return false;
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
  return regex.test(texto);
}

/**
 * Valida que la cantidad de dígitos de un número no exceda una longitud
 * máxima permitida. Útil para campos como teléfono, código postal o
 * número de tarjeta, donde interesa limitar cuántos dígitos se aceptan.
 *
 * @param {number|string} numero - Número (o cadena numérica) a validar.
 * @param {number} maxLongitud - Cantidad máxima de dígitos permitidos.
 * @returns {boolean} true si "numero" tiene entre 1 y "maxLongitud" dígitos.
 *
 * @example
 * validarLongitud(12345, 5);   // true  (5 dígitos, cabe en el máximo)
 * validarLongitud(123456, 5);  // false (6 dígitos, excede el máximo)
 * validarLongitud("951-123", 10); // true (se ignoran los caracteres no numéricos)
 */
function validarLongitud(numero, maxLongitud) {
  if (numero === null || numero === undefined) return false;
  const soloDigitos = String(numero).replace(/[^0-9]/g, "");
  if (soloDigitos === "") return false;
  return soloDigitos.length <= maxLongitud;
}

/**
 * Calcula la edad en años cumplidos a partir de una fecha de nacimiento,
 * tomando en cuenta si el cumpleaños de este año ya ocurrió o no.
 *
 * @param {string|Date} fechaNacimiento - Fecha de nacimiento, en formato
 *        "YYYY-MM-DD" (el que entrega un <input type="date">) o como
 *        objeto Date.
 * @returns {number} Edad en años cumplidos (entero). Devuelve NaN si la
 *                    fecha no es válida.
 *
 * @example
 * calcularEdad("2000-05-15"); // p. ej. 26, según la fecha actual
 * calcularEdad("fecha-mala"); // NaN
 */
function calcularEdad(fechaNacimiento) {
  const nacimiento = new Date(fechaNacimiento);
  if (isNaN(nacimiento.getTime())) return NaN;

  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesDiferencia = hoy.getMonth() - nacimiento.getMonth();

  if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

/**
 * Valida si una persona es mayor de edad (18 años cumplidos o más) a
 * partir de su fecha de nacimiento. Internamente reutiliza calcularEdad().
 *
 * @param {string|Date} fechaNacimiento - Fecha de nacimiento ("YYYY-MM-DD" o Date).
 * @returns {boolean} true si tiene 18 años o más, false en caso contrario
 *                     (incluida una fecha inválida).
 *
 * @example
 * esMayorDeEdad("2000-05-15"); // true
 * esMayorDeEdad("2015-01-01"); // false
 */
function esMayorDeEdad(fechaNacimiento) {
  const edad = calcularEdad(fechaNacimiento);
  if (isNaN(edad)) return false;
  return edad >= 18;
}

/**
 * Valida que una contraseña cumpla reglas mínimas de seguridad: al menos
 * una mayúscula, una minúscula, un número, un carácter especial, sin
 * espacios y con una longitud mínima de 8 caracteres.
 *
 * @param {string} password - Contraseña a validar.
 * @returns {boolean} true si cumple todas las reglas, false en caso contrario.
 *
 * @example
 * validarPassword("Abcdef1!");  // true
 * validarPassword("abcdefgh");  // false (sin mayúscula, número ni especial)
 * validarPassword("Ab1!");      // false (menos de 8 caracteres)
 */
function validarPassword(password) {
  if (typeof password !== "string") return false;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/;
  return regex.test(password);
}

/* ------------------------------------------------------------------------ */
/*  SECCIÓN LIBRE — funciones propias                                       */
/* ------------------------------------------------------------------------ */

/**
 * Evalúa la fuerza de una contraseña y devuelve una etiqueta descriptiva
 * en lugar de un simple true/false. Resuelve un problema real de UX: decirle
 * al usuario, mientras escribe, qué tan segura va quedando su contraseña,
 * en vez de solo aprobarla o rechazarla al final.
 *
 * @param {string} password - Contraseña a evaluar.
 * @returns {string} Una de: "Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte".
 *
 * @example
 * calcularFuerzaPassword("abc");        // "Muy débil"
 * calcularFuerzaPassword("abcdefgh");   // "Débil"
 * calcularFuerzaPassword("Abcdefgh1");  // "Media"
 * calcularFuerzaPassword("Abcdefgh1!"); // "Fuerte" o "Muy fuerte"
 */
function calcularFuerzaPassword(password) {
  if (typeof password !== "string" || password.length === 0) return "Muy débil";

  let puntos = 0;
  if (password.length >= 8) puntos++;
  if (password.length >= 12) puntos++;
  if (/[a-z]/.test(password)) puntos++;
  if (/[A-Z]/.test(password)) puntos++;
  if (/\d/.test(password)) puntos++;
  if (/[^A-Za-z0-9]/.test(password)) puntos++;

  if (puntos <= 1) return "Muy débil";
  if (puntos === 2) return "Débil";
  if (puntos <= 4) return "Media";
  if (puntos === 5) return "Fuerte";
  return "Muy fuerte";
}

/**
 * Formatea un número de teléfono de 10 dígitos al formato legible
 * "(XXX) XXX-XXXX", sin importar si el usuario escribió espacios, guiones
 * o paréntesis. Resuelve el problema de mostrar los teléfonos de forma
 * consistente en la interfaz, sin importar cómo los haya tecleado quien
 * llena el formulario.
 *
 * @param {string|number} numero - Número de teléfono (debe tener 10 dígitos).
 * @returns {string|null} Teléfono formateado, o null si no tiene exactamente
 *                         10 dígitos numéricos.
 *
 * @example
 * formatearTelefono("9511234567");     // "(951) 123-4567"
 * formatearTelefono("951-123-45-67");  // "(951) 123-4567"
 * formatearTelefono("12345");          // null
 */
function formatearTelefono(numero) {
  const digitos = String(numero).replace(/[^0-9]/g, "");
  if (digitos.length !== 10) return null;
  return `(${digitos.slice(0, 3)}) ${digitos.slice(3, 6)}-${digitos.slice(6)}`;
}

/* ------------------------------------------------------------------------ */
/*  EXPORTS                                                                  */
/* ------------------------------------------------------------------------ */

// Namespace opcional, para quien prefiera Utileria.funcion(...)
if (typeof window !== "undefined") {
  window.Utileria = {
    validarCorreo,
    soloLetras,
    validarLongitud,
    calcularEdad,
    esMayorDeEdad,
    validarPassword,
    calcularFuerzaPassword,
    formatearTelefono,
  };
}

// Soporte opcional para Node/CommonJS (útil para pruebas automatizadas)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validarCorreo,
    soloLetras,
    validarLongitud,
    calcularEdad,
    esMayorDeEdad,
    validarPassword,
    calcularFuerzaPassword,
    formatearTelefono,
  };
}
