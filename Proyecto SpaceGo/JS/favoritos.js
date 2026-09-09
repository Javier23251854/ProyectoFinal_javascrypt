/* =========================================================
   FAVORITOS - favoritos.js
   ========================================================= */

// 1. BASE DE DATOS FIJA (Catálogo inicial) - Solo 10 alojamientos
const catalogoBase = [
    {
        id: 1,
        titulo: "Habitación individual amoblada",
        tipo: "individual",
        precio: 650,
        ubicacion: "San Miguel, Lima",
        imagen: "../Imagenes/persona sola.jpg",
        descripcion: "Habitación privada con baño compartido, wifi y limpieza semanal.",
        fecha: "2026-08-25"
    },
    {
        id: 2,
        titulo: "Cuarto individual cerca a la universidad",
        tipo: "individual",
        precio: 480,
        ubicacion: "San Miguel, Lima",
        imagen: "../Imagenes/persona sola.jpg",
        descripcion: "Ideal para estudiantes, a 10 minutos caminando de la av. La Marina.",
        fecha: "2026-08-10"
    },
    {
        id: 3,
        titulo: "Habitación individual con balcón",
        tipo: "individual",
        precio: 790,
        ubicacion: "Pueblo Libre, Lima",
        imagen: "../Imagenes/persona sola.jpg",
        descripcion: "Espacio amplio, con balcón propio e internet de alta velocidad.",
        fecha: "2026-08-28"
    },
    {
        id: 4,
        titulo: "Espacio para pareja en San Miguel",
        tipo: "pareja",
        precio: 950,
        ubicacion: "San Miguel, Lima",
        imagen: "../Imagenes/cuarto pareja.jpg",
        descripcion: "Ambiente cómodo con baño propio, cocina compartida y cochera.",
        fecha: "2026-08-15"
    },
    {
        id: 5,
        titulo: "Cuarto matrimonial en Miraflores",
        tipo: "pareja",
        precio: 1300,
        ubicacion: "Miraflores, Lima",
        imagen: "../Imagenes/cuarto pareja.jpg",
        descripcion: "A pocas cuadras del malecón, incluye servicios básicos.",
        fecha: "2026-07-30"
    },
    {
        id: 6,
        titulo: "Minidepartamento independiente",
        tipo: "minidepa",
        precio: 1100,
        ubicacion: "San Miguel, Lima",
        imagen: "../Imagenes/minidepa.jpg",
        descripcion: "Sala-comedor, un dormitorio y cocina propia. Ingreso independiente.",
        fecha: "2026-08-22"
    },
    {
        id: 7,
        titulo: "Minidepartamento amoblado en Surco",
        tipo: "minidepa",
        precio: 1450,
        ubicacion: "Surco, Lima",
        imagen: "../Imagenes/minidepa.jpg",
        descripcion: "Totalmente amoblado, con seguridad las 24 horas.",
        fecha: "2026-08-05"
    },
    {
        id: 8,
        titulo: "Departamento de 2 habitaciones",
        tipo: "departamento",
        precio: 2200,
        ubicacion: "San Borja, Lima",
        imagen: "../Imagenes/departamento.jpg",
        descripcion: "Departamento completo, dos baños y cochera incluida.",
        fecha: "2026-08-18"
    },
    {
        id: 9,
        titulo: "Departamento familiar en Los Olivos",
        tipo: "departamento",
        precio: 1800,
        ubicacion: "Los Olivos, Lima",
        imagen: "../Imagenes/departamento.jpg",
        descripcion: "Tres dormitorios, ideal para compartir entre varias personas.",
        fecha: "2026-06-12"
    },
    {
        id: 10,
        titulo: "Habitación individual en Cercado",
        tipo: "individual",
        precio: 420,
        ubicacion: "Cercado, Arequipa",
        imagen: "../Imagenes/persona sola.jpg",
        descripcion: "Cerca a la plaza de armas, incluye agua y luz.",
        fecha: "2026-07-20"
    }
];


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


function obtenerFavoritosIds() {
    return JSON.parse(localStorage.getItem("favoritos") || "[]");
}


function cargarAlojamientosPublicados() {
    const publicados = JSON.parse(localStorage.getItem("alojamientosPublicados") || "[]");
    return publicados.map((item) => ({
        id: Number(item.id),
        titulo: item.titulo,
        tipo: item.tipo,
        precio: Number(item.precio),
        ubicacion: `${item.distrito}, ${item.provincia}`,
        imagen: item.imagen || "../Imagenes/alojamiento.jpg",
        descripcion: item.descripcion,
        fecha: item.fecha || new Date().toISOString().slice(0, 10)
    }));
}


function obtenerAlojamientosFavoritos() {
    const favoritosIds = obtenerFavoritosIds();
    const todosLosAlojamientos = [...catalogoBase, ...cargarAlojamientosPublicados()];
    return todosLosAlojamientos.filter(item => favoritosIds.includes(item.id));
}


const contenedorFavoritos = document.getElementById("contenedor-favoritos");
const contadorFavoritos = document.getElementById("contador-favoritos");
const mensajeVacio = document.getElementById("mensaje-vacio");

const selectOrden = document.getElementById("select-orden-fav");
const selectTipo = document.getElementById("select-tipo-fav");
const inputPrecio = document.getElementById("input-precio-fav");
const btnAplicar = document.getElementById("btn-aplicar-fav");
const btnLimpiar = document.getElementById("btn-limpiar-fav");


function filtrarFavoritos(lista) {
    const tipo = selectTipo.value;
    const precioMaximo = Number(inputPrecio.value) || Infinity;

    return lista.filter(item => {
        const coincideTipo = tipo === "todos" || item.tipo === tipo;
        const coincidePrecio = item.precio <= precioMaximo;
        return coincideTipo && coincidePrecio;
    });
}


function ordenarFavoritos(lista) {
    const criterio = selectOrden.value;
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


function crearCardHTML(alojamiento) {
    const icono = iconosTipo[alojamiento.tipo] || "fa-house";
    const etiqueta = etiquetasTipo[alojamiento.tipo] || alojamiento.tipo;

    return `
        <div class="col-12 col-md-6 col-lg-4">
            <article class="resultado-card" data-id="${alojamiento.id}">
                <div class="resultado-imagen">
                    <img src="${alojamiento.imagen}" alt="${alojamiento.titulo}">
                    <span class="badge-tipo"><i class="fa-solid ${icono}"></i> ${etiqueta}</span>
                    <span class="badge-favorito"><i class="fa-solid fa-star"></i> Favorito</span>
                </div>
                <div class="resultado-contenido">
                    <h3>${alojamiento.titulo}</h3>
                    <p class="resultado-ubicacion">
                        <i class="fa-solid fa-location-dot"></i>
                        ${alojamiento.ubicacion}
                    </p>
                    <p class="resultado-descripcion">${alojamiento.descripcion}</p>
                    <div class="resultado-footer">
                        <span class="resultado-precio">S/ ${alojamiento.precio}<small>/mes</small></span>
                        <div class="d-flex align-items-center gap-2">
                            <a href="../HTML/alojamiento.html?id=${alojamiento.id}" class="btn-ver">
                                Ver más <i class="fa-solid fa-arrow-right"></i>
                            </a>
                            <button class="btn-quitar-favorito" data-id="${alojamiento.id}" title="Quitar de favoritos">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    `;
}

function renderizarFavoritos() {
    const favoritos = obtenerAlojamientosFavoritos();
    const filtrados = filtrarFavoritos(favoritos);
    const ordenados = ordenarFavoritos(filtrados);

    contenedorFavoritos.innerHTML = "";

    contadorFavoritos.textContent =
        `${ordenados.length} alojamiento${ordenados.length === 1 ? "" : "s"} guardado${ordenados.length === 1 ? "" : "s"}`;

    if (ordenados.length === 0) {
        mensajeVacio.style.display = "block";
        return;
    }
    mensajeVacio.style.display = "none";

    const tarjetasHTML = ordenados.map((item) => crearCardHTML(item));
    let htmlFinal = "";
    for (let i = 0; i < tarjetasHTML.length; i++) {
        htmlFinal += tarjetasHTML[i];
    }
    contenedorFavoritos.innerHTML = htmlFinal;

    // Eventos para quitar de favoritos
    document.querySelectorAll(".btn-quitar-favorito").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = Number(btn.dataset.id);
            quitarDeFavoritos(id);
        });
    });

    
    document.querySelectorAll(".resultado-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            
            if (e.target.closest("a") || e.target.closest(".btn-quitar-favorito")) return;
            const id = card.dataset.id;
            if (id) {
                window.location.href = `../HTML/alojamiento.html?id=${id}`;
            }
        });
    });
}


function quitarDeFavoritos(id) {
    let favoritos = obtenerFavoritosIds();
    favoritos = favoritos.filter(favId => favId !== id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    renderizarFavoritos(); // Refrescar la lista
}


btnAplicar.addEventListener("click", renderizarFavoritos);
btnLimpiar.addEventListener("click", () => {
    selectOrden.value = "recientes";
    selectTipo.value = "todos";
    inputPrecio.value = "";
    renderizarFavoritos();
});
selectOrden.addEventListener("change", renderizarFavoritos);
selectTipo.addEventListener("change", renderizarFavoritos);
inputPrecio.addEventListener("input", renderizarFavoritos);


document.addEventListener("DOMContentLoaded", renderizarFavoritos);