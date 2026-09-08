
 
/* 1. TIPOS DE DATOS, VARIABLES Y CONSTANTES*/
 
const NOMBRE_PLATAFORMA = "SpaceGo";      // string
const MAX_FOTOS = 3;                      // number
let borrador = true;                      // boolean: el formulario aún no se publicó
let ultimoCodigoGenerado;                 // undefined hasta que se publique un anuncio
const sinUbicacionSeleccionada = null;    // null: representa "todavía no elegido"
const idInternoFormulario = Symbol("formulario-publicar"); // symbol: identificador único interno
const limiteSeguroDeNumero = 9007199254740993n; // bigint: entero mayor al límite seguro de Number
 
console.log("Tipos de datos de ejemplo:", {
    NOMBRE_PLATAFORMA, tipo1: typeof NOMBRE_PLATAFORMA,
    MAX_FOTOS, tipo2: typeof MAX_FOTOS,
    borrador, tipo3: typeof borrador,
    sinUbicacionSeleccionada, tipo4: typeof sinUbicacionSeleccionada,
    idInternoFormulario, tipo5: typeof idInternoFormulario,
    limiteSeguroDeNumero, tipo6: typeof limiteSeguroDeNumero
});
 
 
/*  2. UBICACIONES (mismo dataset que buscar.js para no hacer tana vueltas :V) */
 
const ubicaciones = {
    "Lima": {
        "Lima": [
            "Lima", "Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo",
            "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María",
            "La Molina", "La Victoria", "Lince", "Los Olivos", "Lurigancho", "Lurín",
            "Magdalena del Mar", "Pueblo Libre", "Miraflores", "Pachacámac", "Pucusana",
            "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo",
            "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores",
            "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita", "Santa María del Mar",
            "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa María del Triunfo",
            "Surco"
        ]
    },
    "Arequipa": {
        "Arequipa": ["Cercado", "Yanahuara", "Cayma"]
    },
    "Cusco": {
        "Cusco": ["Cusco", "Wanchaq", "San Sebastián"]
    },
    "La Libertad": {
        "Trujillo": ["Trujillo", "Víctor Larco Herrera", "Huanchaco", "La Esperanza", "El Porvenir"]
    },
    "Piura": {
        "Piura": ["Piura", "Castilla", "Veintiséis de Octubre", "Catacaos"]
    },
    "Lambayeque": {
        "Chiclayo": ["Chiclayo", "José Leonardo Ortiz", "La Victoria", "Pimentel"]
    },
    "Junín": {
        "Huancayo": ["Huancayo", "El Tambo", "Chilca", "San Agustín"]
    },
    "Ica": {
        "Ica": ["Ica", "La Tinguiña", "Parcona", "Subtanjalla"]
    },
    "Tacna": {
        "Tacna": ["Tacna", "Alto de la Alianza", "Ciudad Nueva", "Pocollay"]
    },
    "Puno": {
        "Puno": ["Puno", "Acora", "Chucuito", "Capachica"],
        "San Román": ["Juliaca", "Cabana", "Caracoto"]
    },
    "Áncash": {
        "Huaraz": ["Huaraz", "Independencia", "Olleros", "Taricá"]
    }
};
 
/*  3. ETIQUETAS E ICONOS DE TIPO */
 
const etiquetasTipo = {
    individual: "Habitación individual",
    pareja: "Espacio para pareja",
    minidepa: "Minidepartamento",
    departamento: "Departamento"
};
 
const iconosTipo = {
    individual: "fa-bed",
    pareja: "fa-heart",
    minidepa: "fa-house",
    departamento: "fa-building"
};
 
/*   4. EXPRESIONES REGULARES Y COLECCIONE  */
 
const regexValidacion = {
    texto: /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ0-9\s.,'’()\-/#+°]+$/,
    correo: /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/,
    telefono: /^9\d{8}$/,
    precio: /^\d+(\.\d{1,2})?$/
};
 
// Set: colección de valores únicos, sin duplicados
const extensionesPermitidas = new Set([".jpg", ".jpeg", ".png", ".webp"]);
 
 
/* 5. CLASE Alojamiento */
 
class Alojamiento {
    constructor(datos) {
        this.id = datos.id;
        this.codigo = datos.codigo;
        this.titulo = datos.titulo;
        this.tipo = datos.tipo;
        this.precio = datos.precio;
        this.departamento = datos.departamento;
        this.provincia = datos.provincia;
        this.distrito = datos.distrito;
        this.referencia = datos.referencia;
        this.descripcion = datos.descripcion;
        this.contacto = datos.contacto;
        this.caracteristicas = datos.caracteristicas;
        this.imagen = datos.imagen;
        this.fecha = datos.fecha;
    }
 
    // Método de la clase: arma la ubicación completa como una sola cadena
    obtenerUbicacionCompleta() {
        return `${this.distrito}, ${this.provincia}, ${this.departamento}`;
    }
 
    // Método que convierte la instancia en un objeto plano (para guardar como JSON)
    aObjetoPlano() {
        return { ...this }; 
    }
}
 
 
/*  6. ESTADO DEL FORMULARIO */
 
const estadoFormulario = {
    pasoActual: 1,
    totalPasos: 5,
    pasoMaximo: 1,
    fotos: [null, null, null] // arreglo lineal de hasta 3 fotos
};
 
 
/*  7. ELEMENTOS DEL DOM (salida: document)*/
 
const formPublicar = document.getElementById("form-publicar");
const itemsPaso = Array.from(document.querySelectorAll(".paso-item"));
const panelesPaso = Array.from(document.querySelectorAll(".paso-panel"));
const btnSiguiente = document.getElementById("btn-siguiente");
const btnAtras = document.getElementById("btn-atras");
const btnPublicar = document.getElementById("btn-publicar");
const mensajeValidacion = document.getElementById("mensaje-validacion");
 
const campo = {
    titulo: document.getElementById("titulo"),
    tipo: document.getElementById("tipo"),
    precio: document.getElementById("precio"),
    descripcion: document.getElementById("descripcion"),
    correo: document.getElementById("correo"),
    telefono: document.getElementById("telefono"),
    departamento: document.getElementById("departamento"),
    provincia: document.getElementById("provincia"),
    distrito: document.getElementById("distrito"),
    referencia: document.getElementById("referencia"),
    fotos: document.getElementById("fotos")
};
 
 
/*  8. UTILIDADES DE VALIDACIÓN */
 
function mostrarError(idCampo, mensaje) {
    const spanError = document.getElementById("error-" + idCampo);
    const inputRelacionado = document.getElementById(idCampo);
    if (spanError) spanError.textContent = mensaje || "";
    if (inputRelacionado) inputRelacionado.classList.toggle("campo-invalido", Boolean(mensaje));
    return !mensaje;
}
 
function esObligatorio(valor, idCampo, mensaje) {
    // .length permite comprobar que el campo no esté vacío
    const valido = valor.trim().length > 0;
    mostrarError(idCampo, valido ? "" : mensaje);
    return valido;
}
 
 
/*  9. PASO 1: VALIDAR INFORMACIÓN*/
 
function validarPaso1() {
    let valido = true;
    const titulo = campo.titulo.value.trim();
    const descripcion = campo.descripcion.value.trim();
 
    valido = esObligatorio(campo.titulo.value, "titulo", "Escribe un título para tu anuncio.") && valido;
    if (titulo.length > 0 && titulo.length < 10) {
        mostrarError("titulo", "El título es muy corto, agrega un poco más de detalle.");
        valido = false;
    } else if (titulo.length > 0 && !regexValidacion.texto.test(titulo)) {
        mostrarError("titulo", "Usa letras, números, espacios y puntuación básica.");
        valido = false;
    }
 
    valido = esObligatorio(campo.tipo.value, "tipo", "Selecciona el tipo de alojamiento.") && valido;
 
    const precio = campo.precio.value.trim();
    if (precio.length === 0) {
        mostrarError("precio", "Indica el precio mensual.");
        valido = false;
    } else if (!regexValidacion.precio.test(precio)) {
        mostrarError("precio", "Usa solo números, por ejemplo 650 o 650.50.");
        valido = false;
    } else if (Number(precio) <= 0) {
        mostrarError("precio", "El precio debe ser mayor a 0.");
        valido = false;
    } else {
        mostrarError("precio", "");
    }
 
    valido = esObligatorio(descripcion, "descripcion", "Cuenta un poco sobre el ambiente.") && valido;
    if (descripcion.length > 0 && descripcion.length < 20) {
        mostrarError("descripcion", "Agrega un poco más de descripción (mínimo 20 caracteres).");
        valido = false;
    } else if (descripcion.length > 0 && !regexValidacion.texto.test(descripcion)) {
        mostrarError("descripcion", "Usa letras, números, espacios y puntuación básica.");
        valido = false;
    }
 
    const correo = campo.correo.value.trim();
    if (correo.length === 0) {
        mostrarError("correo", "Escribe un correo de contacto.");
        valido = false;
    } else if (!regexValidacion.correo.test(correo)) {
        mostrarError("correo", "Ese correo no parece válido. Ejemplo: usuario@gmail.com");
        valido = false;
    } else {
        mostrarError("correo", "");
    }
 
    const telefono = campo.telefono.value.trim();
    if (telefono.length === 0) {
        mostrarError("telefono", "Escribe un teléfono de contacto.");
        valido = false;
    } else if (!regexValidacion.telefono.test(telefono)) {
        mostrarError("telefono", "Debe tener 9 dígitos y empezar con 9. Ejemplo: 987654321");
        valido = false;
    } else {
        mostrarError("telefono", "");
    }

    if (campo.tipo.value && !Object.prototype.hasOwnProperty.call(etiquetasTipo, campo.tipo.value)) {
        mostrarError("tipo", "Selecciona un tipo de alojamiento válido.");
        valido = false;
    }
 
    return valido;
}
 
// Contadores de caracteres usando .length
function actualizarContador(input, contadorEl, maximo) {
    contadorEl.textContent = input.value.length + "/" + maximo;
}
 
campo.titulo.addEventListener("input", () => {
    actualizarContador(campo.titulo, document.getElementById("contador-titulo"), 60);
});
 
campo.descripcion.addEventListener("input", () => {
    actualizarContador(campo.descripcion, document.getElementById("contador-descripcion"), 300);
});
 
// onFocus: limpia el error al entrar al campo
// onBlur: valida el paso al salir del campo
[campo.titulo, campo.tipo, campo.precio, campo.descripcion, campo.correo, campo.telefono].forEach((elemento) => {
    elemento.addEventListener("focus", () => mostrarError(elemento.id, ""));
    elemento.addEventListener("blur", () => validarPaso1());
});
 
/* 9.1 ESTRUCTURA del switch q recomendación según el tipo */
 
function obtenerRecomendacionPorTipo(tipo) {
    let mensaje = "";
 
    switch (tipo) {
        case "individual":
            mensaje = "Tip: los espacios individuales se alquilan más rápido si mencionas la cercanía a universidades.";
            break;
        case "pareja":
            mensaje = "Tip: aclarar si aceptan visitas o mascotas ayuda a filtrar mejor a los interesados.";
            break;
        case "minidepa":
            mensaje = "Tip: detallar los servicios incluidos (cocina, lavandería) genera más confianza.";
            break;
        case "departamento":
            mensaje = "Tip: los departamentos completos se publican mejor con fotos de cada ambiente.";
            break;
        default:
            mensaje = "";
    }
 
    return mensaje;
}
 

campo.tipo.addEventListener("change", () => {
    document.getElementById("recomendacion-tipo").textContent = obtenerRecomendacionPorTipo(campo.tipo.value);
    if (estadoFormulario.pasoActual === 5) actualizarVistaPrevia();
});
 
/*  10. PASO 2: UBICACIÓN EN CASCADA  */
 
function llenarSelect(select, opciones, textoPlaceholder) {
    select.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = textoPlaceholder;
    select.appendChild(placeholder);
 
    
    for (const opcion of opciones) {
        const option = document.createElement("option");
        option.value = opcion;
        option.textContent = opcion;
        select.appendChild(option);
    }
}
 
function inicializarUbicaciones() {
    llenarSelect(campo.departamento, Object.keys(ubicaciones), "Selecciona");
}
 
campo.departamento.addEventListener("change", () => {
    const depto = campo.departamento.value;
    mostrarError("ubicacion", "");
 
    if (depto && ubicaciones[depto]) {
        llenarSelect(campo.provincia, Object.keys(ubicaciones[depto]), "Selecciona");
        campo.provincia.disabled = false;
    } else {
        llenarSelect(campo.provincia, [], "Elige un departamento primero");
        campo.provincia.disabled = true;
    }
    llenarSelect(campo.distrito, [], "Elige una provincia primero");
    campo.distrito.disabled = true;
});
 
campo.provincia.addEventListener("change", () => {
    const depto = campo.departamento.value;
    const provincia = campo.provincia.value;
    mostrarError("ubicacion", "");
 
    if (depto && provincia && ubicaciones[depto][provincia]) {
        llenarSelect(campo.distrito, ubicaciones[depto][provincia], "Selecciona");
        campo.distrito.disabled = false;
    } else {
        llenarSelect(campo.distrito, [], "Elige una provincia primero");
        campo.distrito.disabled = true;
    }
});
 
campo.distrito.addEventListener("change", () => mostrarError("ubicacion", ""));
 
campo.referencia.addEventListener("focus", () => mostrarError("referencia", ""));
campo.referencia.addEventListener("blur", () => validarPaso2());
 
function validarPaso2() {
    let valido = true;
    const departamentoValido = Object.prototype.hasOwnProperty.call(ubicaciones, campo.departamento.value);
    const provinciaValida = departamentoValido && Object.prototype.hasOwnProperty.call(ubicaciones[campo.departamento.value], campo.provincia.value);
    const distritoValido = provinciaValida && ubicaciones[campo.departamento.value][campo.provincia.value].includes(campo.distrito.value);
 
    if (!departamentoValido || !provinciaValida || !distritoValido) {
        mostrarError("ubicacion", "Selecciona departamento, provincia y distrito.");
        valido = false;
    } else {
        mostrarError("ubicacion", "");
    }
 
    const referencia = campo.referencia.value.trim();
    valido = esObligatorio(referencia, "referencia", "Agrega una referencia para ubicarlo más fácil.") && valido;
    if (referencia.length > 0 && !regexValidacion.texto.test(referencia)) {
        mostrarError("referencia", "Usa letras, números, espacios y puntuación básica.");
        valido = false;
    }
    return valido;
}
 
/* 11. PASO 3: CARACTERÍSTICAS */
 
function validarPaso3() {
    const permitidas = new Set(["Internet", "Agua", "Luz", "Cocina", "Baño privado", "Lavandería", "Estacionamiento", "Amoblado"]);
    const seleccionadas = obtenerCaracteristicas();
    return seleccionadas.every((caracteristica) => permitidas.has(caracteristica));
}
 
function obtenerCaracteristicas() {
    const seleccionadas = Array.from(document.querySelectorAll('input[name="caracteristicas"]:checked'))
        .map((input) => input.value);
 
    // Set: garantiza que no se guarden características repetidas
    const sinDuplicados = new Set(seleccionadas);
    return [...sinDuplicados]; // Spread: convierte el Set de vuelta a un arreglo
}
 
/* 12. PASO 4: FOTOS  */
 

function contarFotosSubidas() {
    let contador = 0;
    for (let i = 0; i < estadoFormulario.fotos.length; i++) {
        if (estadoFormulario.fotos[i] !== null) contador++;
    }
    return contador;
}
 

function obtenerSiguienteSlotVacio() {
    let indice = 0;
    while (indice < estadoFormulario.fotos.length && estadoFormulario.fotos[indice] !== null) {
        indice++;
    }
    return indice < estadoFormulario.fotos.length ? indice : -1;
}
 
campo.fotos.addEventListener("change", (evento) => {
    mostrarError("fotos", "");
    const archivos = Array.from(evento.target.files);
 
    archivos.forEach((archivo) => {
        try {
            if (contarFotosSubidas() >= MAX_FOTOS) {
                mostrarError("fotos", "Ya subiste el máximo de " + MAX_FOTOS + " fotos.");
                return;
            }
 
            const nombre = archivo.name.toLowerCase();
            const extension = nombre.slice(nombre.lastIndexOf("."));
 
           
            if (!archivo.type.includes("image/") || !extensionesPermitidas.has(extension)) {
                mostrarError("fotos", "Solo se aceptan imágenes JPG, PNG o WEBP.");
                return;
            }

            if (archivo.size > 5 * 1024 * 1024) {
                mostrarError("fotos", "Cada imagen debe pesar como máximo 5 MB.");
                return;
            }
 
            const indiceDestino = obtenerSiguienteSlotVacio();
            if (indiceDestino === -1) return;
 
            const lector = new FileReader();
 
            lector.onload = (eventoLectura) => {
                try {
                    estadoFormulario.fotos[indiceDestino] = eventoLectura.target.result;
                    pintarFotoSlot(indiceDestino, eventoLectura.target.result);
                    if (estadoFormulario.pasoActual === 5) actualizarVistaPrevia();
                } catch (error) {
                    console.error("Error al mostrar la imagen:", error);
                }
            };
 
            lector.onerror = () => {
                mostrarError("fotos", "No se pudo leer esa imagen, intenta con otra.");
            };
 
            lector.readAsDataURL(archivo);
 
        } catch (error) {
        
            console.error("Error procesando la imagen:", error);
            mostrarError("fotos", "Ocurrió un problema al procesar una de las imágenes.");
        }
    });
 
    campo.fotos.value = ""; 
});
 
function pintarFotoSlot(indice, dataUrl) {
    const slot = document.getElementById("slot-" + indice);
    slot.classList.add("tiene-imagen");
    slot.innerHTML =
        '<img src="' + dataUrl + '" alt="Foto ' + (indice + 1) + ' del alojamiento">' +
        '<button type="button" class="foto-quitar" data-slot="' + indice + '" aria-label="Quitar foto">&times;</button>' +
        '<span class="foto-slot-label">Foto ' + (indice + 1) + "</span>";
}
 
document.querySelectorAll(".foto-slots").forEach((contenedor) => {
    contenedor.addEventListener("click", (evento) => {
        const boton = evento.target.closest(".foto-quitar");
        if (!boton) return;
 
        const indice = Number(boton.dataset.slot);
        estadoFormulario.fotos[indice] = null;
 
        const slot = document.getElementById("slot-" + indice);
        slot.classList.remove("tiene-imagen");
        slot.innerHTML = '<span class="foto-slot-label">Foto ' + (indice + 1) + "</span>";
 
        if (estadoFormulario.pasoActual === 5) actualizarVistaPrevia();
    });
});
 
function validarPaso4() {
    return contarFotosSubidas() <= MAX_FOTOS;
}
 
/* 13. PASO 5: RESUMEN  Y VISTA PREVIA  */
 
// Arreglo bidimensional: cada fila es un par [etiqueta, valor]
function construirResumenBidimensional() {
    const ubicacionTexto = [campo.distrito.value, campo.provincia.value, campo.departamento.value]
        .filter(Boolean)
        .join(", ");
 
    return [
        ["Título", campo.titulo.value.trim() || "—"],
        ["Tipo", etiquetasTipo[campo.tipo.value] || "—"],
        ["Precio", campo.precio.value.trim() ? "S/ " + campo.precio.value.trim() : "—"],
        ["Ubicación", ubicacionTexto || "—"],
        ["Características", obtenerCaracteristicas().join(", ") || "Ninguna"]
    ];
}
 
function renderizarResumen() {
    const filas = construirResumenBidimensional();
    const mapaResumen = new Map(filas); 
    const contenedor = document.getElementById("resumen-campos");
    contenedor.innerHTML = "";
 
   
    for (const [etiqueta, valor] of mapaResumen) {
        const fila = document.createElement("div");
        fila.className = "resumen-fila";
        fila.innerHTML = `<strong>${etiqueta}:</strong> <span>${valor}</span>`;
        contenedor.appendChild(fila);
    }
}
 
function actualizarVistaPrevia() {
    const precio = campo.precio.value.trim();
    document.getElementById("vista-previa-precio").innerHTML =
        (precio ? "S/ " + precio : "S/ —") + " <small>/ mes</small>";
 
    document.getElementById("vista-previa-titulo").textContent =
        campo.titulo.value.trim() || "Título del alojamiento";
 
    const icono = iconosTipo[campo.tipo.value] || "fa-house";
    const etiqueta = etiquetasTipo[campo.tipo.value] || "Tipo de alojamiento";
    document.getElementById("vista-previa-tipo").innerHTML = `<i class="fa-solid ${icono}"></i> ${etiqueta}`;
 
    const partesUbicacion = [campo.distrito.value, campo.provincia.value, campo.departamento.value].filter(Boolean);
    document.getElementById("vista-previa-ubicacion").innerHTML =
        '<i class="fa-solid fa-location-dot"></i> ' +
        (partesUbicacion.length ? partesUbicacion.join(", ") : "Ubicación por definir");
 
    const descripcion = campo.descripcion.value.trim();
    
    document.getElementById("vista-previa-descripcion").textContent =
        descripcion ? (descripcion.length > 120 ? descripcion.slice(0, 120) + "…" : descripcion)
                    : "La descripción de tu alojamiento aparecerá aquí.";
 
    const listaTags = document.getElementById("vista-previa-caracteristicas");
    listaTags.innerHTML = "";
    obtenerCaracteristicas().forEach((valor) => {
        const li = document.createElement("li");
        li.textContent = valor;
        listaTags.appendChild(li);
    });
 
    const fotoPrincipal = estadoFormulario.fotos.find((foto) => foto);
    document.getElementById("vista-previa-foto").innerHTML = fotoPrincipal
        ? '<img src="' + fotoPrincipal + '" alt="Foto del alojamiento">'
        : "<span>Sin foto todavía</span>";
 
    renderizarResumen();
}
 
/* 14. NAVEGACIÓN ENTRE PASOS  */
 

const validadoresPorPaso = new Map([
    [1, validarPaso1],
    [2, validarPaso2],
    [3, validarPaso3],
    [4, validarPaso4]
]);
 
function irAlPaso(numero) {
    estadoFormulario.pasoActual = numero;
    mensajeValidacion.hidden = true;
    mensajeValidacion.textContent = "";
 
    panelesPaso.forEach((panel) => {
        const esActual = Number(panel.dataset.paso) === numero;
        panel.hidden = !esActual;
        panel.classList.toggle("is-activo", esActual);
    });
 
    itemsPaso.forEach((item) => {
        const n = Number(item.dataset.paso);
        item.classList.toggle("is-activo", n === numero);
        item.classList.toggle("is-completo", n < numero || (n < estadoFormulario.pasoMaximo && n !== numero));
    });
 
    btnAtras.hidden = numero === 1;
    btnSiguiente.hidden = numero === estadoFormulario.totalPasos;
    btnPublicar.hidden = numero !== estadoFormulario.totalPasos;
 
    if (numero === estadoFormulario.totalPasos) actualizarVistaPrevia();
 
    document.getElementById("estado-publicacion").hidden = true;
}
 

btnSiguiente.addEventListener("click", () => {
    const validador = validadoresPorPaso.get(estadoFormulario.pasoActual);
    if (validador && !validador()) {
        const panelActual = panelesPaso.find(
            (panel) => Number(panel.dataset.paso) === estadoFormulario.pasoActual
        );
        const primerCampoInvalido = panelActual?.querySelector(".campo-invalido");
        const errores = Array.from(panelActual?.querySelectorAll(".campo-error") || [])
            .map((error) => error.textContent.trim())
            .filter(Boolean);

        mensajeValidacion.textContent = "Revisa estos datos: " + [...new Set(errores)].join(" ");
        mensajeValidacion.hidden = false;

        if (primerCampoInvalido) {
            primerCampoInvalido.focus();
            primerCampoInvalido.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        return;
    }
 
    estadoFormulario.pasoMaximo = Math.max(estadoFormulario.pasoMaximo, estadoFormulario.pasoActual + 1);
    irAlPaso(Math.min(estadoFormulario.pasoActual + 1, estadoFormulario.totalPasos));
});
 
btnAtras.addEventListener("click", () => {
    irAlPaso(Math.max(estadoFormulario.pasoActual - 1, 1));
});
 
// Evento onClick: ir directo a un paso ya visitado desde el stepper
itemsPaso.forEach((item) => {
    item.querySelector(".paso-btn").addEventListener("click", () => {
        const destino = Number(item.dataset.paso);
        if (destino <= estadoFormulario.pasoMaximo) irAlPaso(destino);
    });
});
 
/* 15. NÚMEROS */
 

function normalizarPrecio(precioTexto) {
    return Number(Number(precioTexto).toFixed(2));
}
 

function generarCodigoAnuncio() {
    const marcaDeTiempo = BigInt(Date.now());
    const aleatorio = BigInt(Math.floor(Math.random() * 1000));
    return (marcaDeTiempo * 1000n + aleatorio).toString();
}
 

function generarCodigoCorto(id) {
    const truncado = (id | 0) >>> 0;   
    const reducido = truncado >> 4;    
    return reducido.toString(16).toUpperCase();
}
 
/*  VALIDAR TODO Y GUARDAR */
 
function guardarAlojamiento(objetoPlano) {
    try {
        const guardados = JSON.parse(localStorage.getItem("alojamientosPublicados") || "[]");
        guardados.push(objetoPlano);
        localStorage.setItem("alojamientosPublicados", JSON.stringify(guardados));
        return guardados;
    } catch (error) {
       
        console.error("No se pudo guardar el alojamiento:", error);
        alert("Ocurrió un problema al guardar tu alojamiento. Intenta nuevamente.");
        return null;
    }
}
 
formPublicar.addEventListener("submit", (evento) => {
    evento.preventDefault();
 
    const paso1Valido = validarPaso1();
    const paso2Valido = validarPaso2();
    const paso3Valido = validarPaso3();
    const paso4Valido = validarPaso4();
 
    if (!paso1Valido) { irAlPaso(1); return; }
    if (!paso2Valido) { irAlPaso(2); return; }
    if (!paso3Valido) { irAlPaso(3); return; }
    if (!paso4Valido) { irAlPaso(4); return; }
 
    const id = Date.now();
    const codigo = generarCodigoAnuncio();
 
    const nuevoAlojamiento = new Alojamiento({
        id,
        codigo,
        titulo: campo.titulo.value.trim(),
        tipo: campo.tipo.value,
        precio: normalizarPrecio(campo.precio.value.trim()),
        departamento: campo.departamento.value,
        provincia: campo.provincia.value,
        distrito: campo.distrito.value,
        referencia: campo.referencia.value.trim(),
        descripcion: campo.descripcion.value.trim(),
        contacto: {
            correo: campo.correo.value.trim(),
            telefono: campo.telefono.value.trim()
        },
        caracteristicas: obtenerCaracteristicas(),
        imagen: estadoFormulario.fotos.find((foto) => foto) || null,
        fecha: new Date().toISOString().slice(0, 10)
    });
 
    const guardados = guardarAlojamiento(nuevoAlojamiento.aObjetoPlano());
    if (!guardados) return;
 
    ultimoCodigoGenerado = generarCodigoCorto(id);
    borrador = false;
 
    const estadoPublicacion = document.getElementById("estado-publicacion");
    estadoPublicacion.hidden = false;
    estadoPublicacion.classList.remove("es-error");
    estadoPublicacion.textContent =
        `¡Publicado en ${nuevoAlojamiento.obtenerUbicacionCompleta()}! ` +
        `Código de tu anuncio: ${ultimoCodigoGenerado}. ` +
        `Ya tienes ${guardados.length} alojamiento(s) guardado(s) en este navegador.`;
 
    // Salidas: alert y console
    alert("¡Tu alojamiento se publicó correctamente! Código: " + ultimoCodigoGenerado);
    console.log("Alojamiento guardado (instancia de la clase):", nuevoAlojamiento);
    console.log("Alojamiento guardado como JSON:", JSON.stringify(nuevoAlojamiento.aObjetoPlano(), null, 2));
    console.log("Todos los alojamientos publicados (JSON.parse):", guardados);
});
 
/* 17. INICIO */
 
inicializarUbicaciones();
irAlPaso(1);
 
/* 18. MENÚ RESPONSIVE  */
 
const menuIcon = document.querySelector(".menu-icon");
const menu = document.querySelector(".menu");
if (menuIcon && menu) {
    menuIcon.addEventListener("click", () => {
        menu.classList.toggle("activo");
    });
}
 
/*
   19. DEMOSTRACIÓN ADICIONAL DE OPERADORES Y SINTAXIS
   (bloque independiente, no altera el formulario; queda
   registrado en la consola para fines del curso)
   */
 

const numeroA = 10;
const numeroB = 3;
console.log("Suma:", numeroA + numeroB);
console.log("Resta:", numeroA - numeroB);
console.log("Multiplicación:", numeroA * numeroB);
console.log("División:", numeroA / numeroB);
console.log("Módulo:", numeroA % numeroB);
console.log("Potencia:", numeroA ** numeroB);
 
let contadorDemo = 0;
contadorDemo += 5;   
contadorDemo *= 2;   
console.log("Contador con operadores de asignación:", contadorDemo);
 

console.log("AND lógico:", true && false);
console.log("OR lógico:", true || false);
console.log("NOT lógico:", !true);
 

console.log("Desplazamiento a la izquierda (2 << 1):", 2 << 1);
console.log("Desplazamiento a la derecha (8 >> 2):", 8 >> 2);
console.log("AND bit a bit (6 & 3):", 6 & 3);
console.log("OR bit a bit (6 | 3):", 6 | 3);
 

const caracteristicasBase = ["Wifi de cortesía"];
const caracteristicasCompletas = [...caracteristicasBase, ...obtenerCaracteristicas()];
console.log("Características completas (spread):", caracteristicasCompletas);
 
// ---- Math: métodos y propiedades ----
console.log("Math.PI:", Math.PI);
console.log("Math.round(649.6):", Math.round(649.6));
console.log("Math.max(0, 100, 650):", Math.max(0, 100, 650));
console.log("Math.abs(-25):", Math.abs(-25));
 

const comillaSimple = 'Alojamiento cómodo';
const comillaDoble = "Cerca de la universidad";
const plantilla = `Aviso: ${comillaSimple} - ${comillaDoble}`;
const textoMultilinea = `Primera línea del anuncio.
Segunda línea del anuncio.`;
console.log(plantilla);
console.log(textoMultilinea);
console.log("Concatenación con +:", comillaSimple + " / " + comillaDoble);
console.log("Búsqueda con indexOf:", plantilla.indexOf("universidad"));
 

const preciosEjemplo = [650, 950, 480, 1800];
const preciosConDescuento = preciosEjemplo.map((precio) => precio * 0.9);
const preciosAccesibles = preciosEjemplo.filter((precio) => precio < 1000);
const totalPrecios = preciosEjemplo.reduce((acumulado, precio) => acumulado + precio, 0);
console.log("Precios con descuento:", preciosConDescuento);
console.log("Precios accesibles:", preciosAccesibles);
console.log("Suma total:", totalPrecios);
 

for (const departamentoClave in ubicaciones) {
    console.log("Departamento disponible:", departamentoClave);
}
 