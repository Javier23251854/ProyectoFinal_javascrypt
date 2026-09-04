/* ==================================================================
   BUSCAR ALOJAMIENTO — buscar.js
   Página encargada de mostrar, filtrar y ordenar los alojamientos
   a partir de un array de objetos (simulando una base de datos).
   ================================================================== */


/* ============ 1. UBICACIONES (Departamento > Provincia > Distrito) ============ */

const ubicaciones = {
    "Lima": {
        "Lima": ["San Miguel", "Miraflores", "San Borja", "Surco", "Los Olivos", "Pueblo Libre"]
    },
    "Arequipa": {
        "Arequipa": ["Cercado", "Yanahuara", "Cayma"]
    },
    "Cusco": {
        "Cusco": ["Cusco", "Wanchaq", "San Sebastián"]
    }
};

/* ============ 2. ETIQUETAS DE TIPO DE ALOJAMIENTO ============ */

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

/* ============ 3. ARRAY DE OBJETOS: ALOJAMIENTOS ============ */
/* Cada alojamiento es un objeto con sus propias propiedades.   */

let alojamientos = [
    {
        id: 1,
        titulo: "Habitación individual amoblada",
        tipo: "individual",
        precio: 650,
        departamento: "Lima",
        provincia: "Lima",
        distrito: "San Miguel",
        imagen: "../Imagenes/persona sola.jpg",
        descripcion: "Habitación privada con baño compartido, wifi y limpieza semanal.",
        fecha: "2026-08-25"
    },
    {
        id: 2,
        titulo: "Cuarto individual cerca a la universidad",
        tipo: "individual",
        precio: 480,
        departamento: "Lima",
        provincia: "Lima",
        distrito: "San Miguel",
        imagen: "../Imagenes/persona sola.jpg",
        descripcion: "Ideal para estudiantes, a 10 minutos caminando de la av. La Marina.",
        fecha: "2026-08-10"
    },
    {
        id: 3,
        titulo: "Habitación individual con balcón",
        tipo: "individual",
        precio: 790,
        departamento: "Lima",
        provincia: "Lima",
        distrito: "Pueblo Libre",
        imagen: "../Imagenes/persona sola.jpg",
        descripcion: "Espacio amplio, con balcón propio e internet de alta velocidad.",
        fecha: "2026-08-28"
    },
    {
        id: 4,
        titulo: "Espacio para pareja en San Miguel",
        tipo: "pareja",
        precio: 950,
        departamento: "Lima",
        provincia: "Lima",
        distrito: "San Miguel",
        imagen: "../Imagenes/cuarto pareja.jpg",
        descripcion: "Ambiente cómodo con baño propio, cocina compartida y cochera.",
        fecha: "2026-08-15"
    },
    {
        id: 5,
        titulo: "Cuarto matrimonial en Miraflores",
        tipo: "pareja",
        precio: 1300,
        departamento: "Lima",
        provincia: "Lima",
        distrito: "Miraflores",
        imagen: "../Imagenes/cuarto pareja.jpg",
        descripcion: "A pocas cuadras del malecón, incluye servicios básicos.",
        fecha: "2026-07-30"
    },
    {
        id: 6,
        titulo: "Minidepartamento independiente",
        tipo: "minidepa",
        precio: 1100,
        departamento: "Lima",
        provincia: "Lima",
        distrito: "San Miguel",
        imagen: "../Imagenes/minidepa.jpg",
        descripcion: "Sala-comedor, un dormitorio y cocina propia. Ingreso independiente.",
        fecha: "2026-08-22"
    },
    {
        id: 7,
        titulo: "Minidepartamento amoblado en Surco",
        tipo: "minidepa",
        precio: 1450,
        departamento: "Lima",
        provincia: "Lima",
        distrito: "Surco",
        imagen: "../Imagenes/minidepa.jpg",
        descripcion: "Totalmente amoblado, con seguridad las 24 horas.",
        fecha: "2026-08-05"
    },
    {
        id: 8,
        titulo: "Departamento de 2 habitaciones",
        tipo: "departamento",
        precio: 2200,
        departamento: "Lima",
        provincia: "Lima",
        distrito: "San Borja",
        imagen: "../Imagenes/departamento.jpg",
        descripcion: "Departamento completo, dos baños y cochera incluida.",
        fecha: "2026-08-18"
    },
    {
        id: 9,
        titulo: "Departamento familiar en Los Olivos",
        tipo: "departamento",
        precio: 1800,
        departamento: "Lima",
        provincia: "Lima",
        distrito: "Los Olivos",
        imagen: "../Imagenes/departamento.jpg",
        descripcion: "Tres dormitorios, ideal para compartir entre varias personas.",
        fecha: "2026-06-12"
    },
    {
        id: 10,
        titulo: "Habitación individual en Cercado",
        tipo: "individual",
        precio: 420,
        departamento: "Arequipa",
        provincia: "Arequipa",
        distrito: "Cercado",
        imagen: "../Imagenes/persona sola.jpg",
        descripcion: "Cerca a la plaza de armas, incluye agua y luz.",
        fecha: "2026-07-20"
    },
    {
        id: 11,
        titulo: "Minidepartamento en Yanahuara",
        tipo: "minidepa",
        precio: 980,
        departamento: "Arequipa",
        provincia: "Arequipa",
        distrito: "Yanahuara",
        imagen: "../Imagenes/minidepa.jpg",
        descripcion: "Vista a la campiña, cocina y baño propios.",
        fecha: "2026-08-01"
    },
    {
        id: 12,
        titulo: "Espacio para pareja en Wanchaq",
        tipo: "pareja",
        precio: 750,
        departamento: "Cusco",
        provincia: "Cusco",
        distrito: "Wanchaq",
        imagen: "../Imagenes/cuarto pareja.jpg",
        descripcion: "Habitación amplia con calefacción y baño privado.",
        fecha: "2026-06-28"
    },
    {
        id: 13,
        titulo: "Habitación individual en Cusco centro",
        tipo: "individual",
        precio: 560,
        departamento: "Cusco",
        provincia: "Cusco",
        distrito: "Cusco",
        imagen: "../Imagenes/persona sola.jpg",
        descripcion: "A dos cuadras de la plaza principal, agua caliente todo el día.",
        fecha: "2026-08-30"
    }
];

/* Con push() se podrían agregar nuevos alojamientos publicados
   por otros usuarios sin tocar el resto del código. */
// alojamientos.push({ id: 14, titulo: "...", ... });


/* ============ 4. ELEMENTOS DEL DOM ============ */

const inputBusqueda = document.getElementById("input-busqueda");
const selectDepartamento = document.getElementById("select-departamento");
const selectProvincia = document.getElementById("select-provincia");
const selectDistrito = document.getElementById("select-distrito");
const selectTipo = document.getElementById("select-tipo");
const inputPrecio = document.getElementById("input-precio");
const selectOrden = document.getElementById("select-orden");

const btnAplicar = document.getElementById("btn-aplicar");
const btnLimpiar = document.getElementById("btn-limpiar");

const contenedorResultados = document.getElementById("contenedor-resultados");
const contadorResultados = document.getElementById("contador-resultados");
const mensajeVacio = document.getElementById("mensaje-vacio");


/* ============ 5. LLENAR SELECTS DE UBICACIÓN (dinámico) ============ */

function llenarDepartamentos() {
    // for...of para recorrer las llaves del objeto "ubicaciones"
    for (const depto of Object.keys(ubicaciones)) {
        const opcion = document.createElement("option");
        opcion.value = depto;
        opcion.textContent = depto;
        selectDepartamento.appendChild(opcion);
    }
}

function llenarProvincias(departamento) {
    selectProvincia.innerHTML = '<option value="todas">Todas</option>';
    selectDistrito.innerHTML = '<option value="todos">Todos</option>';

    if (!departamento || departamento === "todos" || !ubicaciones[departamento]) {
        return;
    }

    const provincias = Object.keys(ubicaciones[departamento]);
    provincias.forEach((provincia) => {
        const opcion = document.createElement("option");
        opcion.value = provincia;
        opcion.textContent = provincia;
        selectProvincia.appendChild(opcion);
    });

    // Si solo hay una provincia, la seleccionamos automáticamente
    if (provincias.length === 1) {
        selectProvincia.value = provincias[0];
        llenarDistritos(departamento, provincias[0]);
    }
}

function llenarDistritos(departamento, provincia) {
    selectDistrito.innerHTML = '<option value="todos">Todos</option>';

    if (!departamento || !provincia || provincia === "todas") {
        return;
    }

    const distritos = ubicaciones[departamento]?.[provincia] || [];
    distritos.forEach((distrito) => {
        const opcion = document.createElement("option");
        opcion.value = distrito;
        opcion.textContent = distrito;
        selectDistrito.appendChild(opcion);
    });
}

llenarDepartamentos();

selectDepartamento.addEventListener("change", () => {
    llenarProvincias(selectDepartamento.value);
});

selectProvincia.addEventListener("change", () => {
    llenarDistritos(selectDepartamento.value, selectProvincia.value);
});


/* ============ 6. FUNCIÓN QUE ARMA EL OBJETO "FILTROS" ============ */

function obtenerFiltrosActuales() {
    return {
        texto: inputBusqueda.value.trim().toLowerCase(),
        departamento: selectDepartamento.value,
        provincia: selectProvincia.value,
        distrito: selectDistrito.value,
        tipo: selectTipo.value,
        precioMaximo: Number(inputPrecio.value) || Infinity
    };
}

/* ============ 7. FILTRAR ALOJAMIENTOS (FILTER + INCLUDES) ============ */

function filtrarAlojamientos(filtros) {
    return alojamientos.filter((alojamiento) => {

        // Condicional: si el precio supera el presupuesto, se descarta
        if (alojamiento.precio <= filtros.precioMaximo) {
            // se mantiene en la lista
        } else {
            return false; // se oculta
        }

        const coincideTexto =
            filtros.texto === "" ||
            alojamiento.titulo.toLowerCase().includes(filtros.texto) ||
            alojamiento.distrito.toLowerCase().includes(filtros.texto);

        const coincideDepartamento =
            filtros.departamento === "todos" ||
            alojamiento.departamento === filtros.departamento;

        const coincideProvincia =
            filtros.provincia === "todas" ||
            alojamiento.provincia === filtros.provincia;

        const coincideDistrito =
            filtros.distrito === "todos" ||
            alojamiento.distrito === filtros.distrito;

        const coincideTipo =
            filtros.tipo === "todos" ||
            alojamiento.tipo === filtros.tipo;

        return coincideTexto && coincideDepartamento && coincideProvincia
            && coincideDistrito && coincideTipo;
    });
}

/* ============ 8. ORDENAR RESULTADOS ============ */

function ordenarAlojamientos(lista, criterio) {
    const copia = [...lista];

    if (criterio === "precio-asc") {
        copia.sort((a, b) => a.precio - b.precio);
    } else if (criterio === "precio-desc") {
        copia.sort((a, b) => b.precio - a.precio);
    } else if (criterio === "recientes") {
        copia.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }

    return copia;
}

/* ============ 9. FIND: BUSCAR UN ALOJAMIENTO POR ID ============ */

function buscarAlojamientoPorId(id) {
    return alojamientos.find((alojamiento) => alojamiento.id === id);
}

/* ============ 10. CREAR LA CARD (HTML) DE UN ALOJAMIENTO ============ */

function crearCardHTML(alojamiento) {
    const icono = iconosTipo[alojamiento.tipo] || "fa-house";
    const etiqueta = etiquetasTipo[alojamiento.tipo] || alojamiento.tipo;

    return `
        <div class="col-12 col-md-6 col-lg-4">
            <article class="resultado-card" data-id="${alojamiento.id}">
                <div class="resultado-imagen">
                    <img src="${alojamiento.imagen}" alt="${alojamiento.titulo}">
                    <span><i class="fa-solid ${icono}"></i> ${etiqueta}</span>
                </div>
                <div class="resultado-contenido">
                    <h3>${alojamiento.titulo}</h3>
                    <p class="resultado-ubicacion">
                        <i class="fa-solid fa-location-dot"></i>
                        ${alojamiento.distrito}, ${alojamiento.provincia}
                    </p>
                    <p class="resultado-descripcion">${alojamiento.descripcion}</p>
                    <div class="resultado-footer">
                        <span class="resultado-precio">S/ ${alojamiento.precio}<small>/mes</small></span>
                        <a href="../HTML/alojamiento.html?id=${alojamiento.id}" class="btn-ver">
                            Ver más <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </article>
        </div>
    `;
}

/* ============ 11. RENDERIZAR RESULTADOS (FOR + MAP + FOREACH) ============ */

function renderizarResultados(lista) {
    contenedorResultados.innerHTML = "";

    // Actualiza el contador de resultados
    contadorResultados.textContent =
        `${lista.length} alojamiento${lista.length === 1 ? "" : "s"} encontrado${lista.length === 1 ? "" : "s"}`;

    // Si no hay resultados, mostramos el mensaje vacío
    if (lista.length === 0) {
        mensajeVacio.style.display = "block";
        return;
    }
    mensajeVacio.style.display = "none";

    // map() convierte cada objeto en su bloque HTML
    const tarjetasHTML = lista.map((alojamiento) => crearCardHTML(alojamiento));

    // for clásico para unir todo el HTML en un solo string
    let htmlFinal = "";
    for (let i = 0; i < tarjetasHTML.length; i++) {
        htmlFinal += tarjetasHTML[i];
    }
    contenedorResultados.innerHTML = htmlFinal;

    // forEach para asignar el evento de "favorito" a cada card generada
    const cards = contenedorResultados.querySelectorAll(".resultado-card");
    cards.forEach((card) => {
        card.addEventListener("click", (evento) => {
            if (evento.target.closest(".btn-ver")) return; // no interferir con el enlace
            const id = Number(card.dataset.id);
            const alojamiento = buscarAlojamientoPorId(id);
            if (alojamiento) {
                console.log("Alojamiento seleccionado:", alojamiento);
            }
        });
    });
}

/* ============ 12. FUNCIÓN PRINCIPAL: APLICAR FILTROS Y ORDEN ============ */

function actualizarBusqueda() {
    const filtros = obtenerFiltrosActuales();
    let resultados = filtrarAlojamientos(filtros);
    resultados = ordenarAlojamientos(resultados, selectOrden.value);
    renderizarResultados(resultados);
}

/* ============ 13. EVENTOS DE LOS FILTROS ============ */

btnAplicar.addEventListener("click", actualizarBusqueda);

btnLimpiar.addEventListener("click", () => {
    inputBusqueda.value = "";
    selectDepartamento.value = "todos";
    llenarProvincias("todos");
    selectTipo.value = "todos";
    inputPrecio.value = "";
    selectOrden.value = "recientes";
    actualizarBusqueda();
});

selectOrden.addEventListener("change", actualizarBusqueda);

inputBusqueda.addEventListener("keyup", (evento) => {
    if (evento.key === "Enter") {
        actualizarBusqueda();
    }
});

/* ============ 14. LEER PARÁMETRO ?tipo= DE LA URL (desde el inicio) ============ */

function aplicarFiltroDesdeURL() {
    const parametros = new URLSearchParams(window.location.search);
    const tipo = parametros.get("tipo");

    // includes() para validar que el valor recibido sea uno de los tipos válidos
    const tiposValidos = Object.keys(etiquetasTipo);
    if (tipo && tiposValidos.includes(tipo)) {
        selectTipo.value = tipo;
    }
}

/* ============ 15. INICIO ============ */

window.addEventListener("load", () => {
    aplicarFiltroDesdeURL();
    actualizarBusqueda();
});
