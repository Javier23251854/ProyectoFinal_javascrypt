const PATRON_CODIGO = /^U\d{8}$/u;
const PATRON_NOMBRE = /^[\p{L}\p{M}]+(?:[ '\-][\p{L}\p{M}]+)*$/u;
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

export function normalizarTexto(texto) {
return String(texto).trim().replace(/\s+/gu, " ");
}

export function normalizarDatos(datos) {
return {
codigo: normalizarTexto(datos.codigo).toUpperCase(),
nombre: normalizarTexto(datos.nombre),
correo: normalizarTexto(datos.correo).toLocaleLowerCase("es-PE"),
programa: normalizarTexto(datos.programa),
notas: datos.notas.map(nota => typeof nota === "string" && nota.trim() === "" ? NaN : Number(nota))
};
}

export function validarDatosEstudiante(datos) {
const errores = [];
if (!PATRON_CODIGO.test(datos.codigo)) {
errores.push("El código debe tener el formato U seguido de 8 dígitos.");
}
if (!PATRON_NOMBRE.test(datos.nombre)) {
errores.push("El nombre solo puede contener letras, espacios, apóstrofes o guiones.");
}
if (!PATRON_CORREO.test(datos.correo)) {
errores.push("El correo no tiene una estructura válida.");
}
if (datos.programa.length < 3 || datos.programa.length > 60) {
errores.push("El programa debe tener entre 3 y 60 caracteres.");
}
if (!Array.isArray(datos.notas) || datos.notas.length !== 3) {
errores.push("Se requieren exactamente 3 notas.");
} else if (datos.notas.some(nota => !Number.isFinite(nota) || nota < 0 || nota > 20)) {
errores.push("Cada nota debe ser un número entre 0 y 20.");
}
return errores;
}
