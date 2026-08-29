/* ========== 1. VARIABLES Y CONSTANTES ================ */

const nombreWeb = "SpaceGo";
let visitas = 0;
const tiposAlojamiento = [
    "Cuarto individual",
    "Cuarto para parejas",
    "Minidepartamento",
    "Departamento"
];

/* ============= 2. OBJETO ============== */

const usuario = {
    nombre: "Visitante",
    tipo: "buscador",
    registrado: false
};

/* ================ 3. FUNCIÓN =============== */

function mostrarBienvenida(nombre) {
    return `¡Bienvenido a ${nombreWeb}, ${nombre}!`;
}

/* ============= 4. EVENTO AL CARGAR LA PÁGINA ============ */

window.addEventListener("load", () => {
    console.log(mostrarBienvenida(usuario.nombre));
    visitas++;
    console.log(`Visita número: ${visitas}`);
});

/* =========== 5. MENÚ RESPONSIVE =================== */

const menuIcon = document.querySelector(".menu-icon");
const menu = document.querySelector(".menu");
if (menuIcon && menu) {
    menuIcon.addEventListener("click", () => {
        menu.classList.toggle("activo");
    });

}

/* ================ 6. EVENTOS EN LAS TARJETAS =================== */

const tarjetas = document.querySelectorAll(".tipo-card");
tarjetas.forEach((tarjeta, indice) => {
    tarjeta.addEventListener("click", () => {
        const tipo = tiposAlojamiento[indice];
        console.log(`Seleccionaste: ${tipo}`);
    });
});

/* ===============7. BOTONES "CONOCER MÁS" ==================== */

const enlaces = document.querySelectorAll(".tipo-contenido a");
enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
        evento.preventDefault();
        const texto = enlace.parentElement.querySelector("h3").textContent;
        alert(`Próximamente podrás buscar ${texto.toLowerCase()}.`);
    });
});

/* ================== 8. FAQ ================ */

const preguntas = document.querySelectorAll(".faq-pregunta");
preguntas.forEach((pregunta) => {
    pregunta.addEventListener("click", () => {
        const item = pregunta.parentElement;
        item.classList.toggle("activo");
    });
});

/* =============== 9. FUNCIÓN CON CONDICIONAL ==================== */

function verificarNombre(nombre) {
    if (nombre.length >= 3) {
        return true;
    } else {
        return false;
    }
}

/* ================ 10. REGEX PARA VALIDAR CORREO ================ */

function validarCorreo(correo) {
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(correo);
}

/* ============== 11. PROMPT ================ */

function solicitarNombre() {
    const nombre = prompt("¿Cuál es tu nombre?");
    if (nombre && verificarNombre(nombre)) {
        alert(`Hola ${nombre}, esperamos ayudarte a encontrar tu espacio.`);
        console.log(`Usuario: ${nombre}`);
    } else {
        alert("Ingresa un nombre válido.");
    }
}

/* ============= 12. ARRAY Y MÉTODOS ==================== */

let alojamientos = [
    "Cuarto individual",
    "Cuarto para parejas",
    "Minidepartamento",
    "Departamento"
];

alojamientos.push("Habitación amoblada");
console.log("Cantidad:", alojamientos.length);
console.log(
    alojamientos.includes("Departamento")
);

/* ================= 13. FILTER ===================== */

const alojamientosCortos = alojamientos.filter(
    alojamiento => alojamiento.length < 20
);

console.log(alojamientosCortos);

/* ============ 14. MAP ================= */

const nombresMayuscula = alojamientos.map(
    alojamiento => alojamiento.toUpperCase()
);

console.log(nombresMayuscula);

/* =========== 15. REDUCE ================ */

const totalCaracteres = alojamientos.reduce(
    (total, alojamiento) => total + alojamiento.length,
    0
);

console.log(`Caracteres totales: ${totalCaracteres}`);

/* ============ 16. FOR...OF ============= */

for (const alojamiento of alojamientos) {
    console.log(`Disponible: ${alojamiento}`);
}

/* ======== 17. CLASE ============== */

class Alojamiento {
    constructor(tipo, precio) {
        this.tipo = tipo;
        this.precio = precio;
    }

    mostrarInfo() {
        return `${this.tipo} - S/ ${this.precio}`;
    }
}

const habitacion = new Alojamiento(
    "Cuarto individual",
    500
);
console.log(habitacion.mostrarInfo());

/* ============ 18. JSON ============= */

const datosUsuario = {
    nombre: usuario.nombre,
    tipo: usuario.tipo
};
const usuarioJSON = JSON.stringify(datosUsuario);
console.log(usuarioJSON);

/* ============= 19. MAP Y SET ========================= */

const precios = new Map();
precios.set("Cuarto", 500);
precios.set("Pareja", 700);
precios.set("Minidepa", 1000);
console.log(precios.get("Cuarto"));
const zonas = new Set([
    "Lima",
    "Arequipa",
    "Cusco",
    "Lima"
]);

console.log(zonas);

/* ============= 20. MATH Y OPERADORES =================== */

const precioMinimo = Math.min(500, 700, 1000);
const numeroAleatorio = Math.floor(
    Math.random() * 100
);
console.log(`Precio mínimo: S/ ${precioMinimo}`);
console.log(`Código generado: ${numeroAleatorio}`);

/* ============ 21. STRING ======================= */

const mensaje = "Encuentra tu espacio ideal";
console.log(mensaje.length);
console.log(mensaje.slice(0, 12));

/* ============== 22. BOTÓN DE BIENVENIDA ===================== */

const botonBienvenida = document.querySelector(
    ".hero .btn-principal"
);

if (botonBienvenida) {
    botonBienvenida.addEventListener("click", () => {
        solicitarNombre();
    });
}