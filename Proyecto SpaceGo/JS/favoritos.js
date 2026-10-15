
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
        
        latitud: item.latitud == null || item.latitud === "" ? null : Number(item.latitud),
        longitud: item.longitud == null || item.longitud === "" ? null : Number(item.longitud),
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



const coordenadasCatalogoClima = {
    "San Miguel, Lima": { latitud: -12.0772, longitud: -77.0921 },
    "Pueblo Libre, Lima": { latitud: -12.0715, longitud: -77.0620 },
    "Miraflores, Lima": { latitud: -12.1220, longitud: -77.0305 },
    "Surco, Lima": { latitud: -12.1380, longitud: -76.9820 },
    "San Borja, Lima": { latitud: -12.1070, longitud: -77.0010 },
    "Los Olivos, Lima": { latitud: -11.9680, longitud: -77.0730 },
    "Cercado, Arequipa": { latitud: -16.3989, longitud: -71.5350 }
};

const cacheClima = new Map();
const DURACION_CACHE_CLIMA = 10 * 60 * 1000; 
let versionRenderizadoClima = 0;

function coordenadasDeAlojamiento(alojamiento) {
    // Usar primero las coordenadas reales guardadas al publicar.
    const tieneLatitud = alojamiento.latitud !== null &&
        alojamiento.latitud !== undefined && alojamiento.latitud !== "";
    const tieneLongitud = alojamiento.longitud !== null &&
        alojamiento.longitud !== undefined && alojamiento.longitud !== "";

    if (tieneLatitud && tieneLongitud) {
        const latitud = Number(alojamiento.latitud);
        const longitud = Number(alojamiento.longitud);
        if (Number.isFinite(latitud) && Number.isFinite(longitud) &&
            latitud >= -90 && latitud <= 90 && longitud >= -180 && longitud <= 180 &&
            !(latitud === 0 && longitud === 0)) {
            return { latitud, longitud };
        }
    }

    
    return coordenadasCatalogoClima[alojamiento.ubicacion] || null;
}

async function obtenerClima(latitud, longitud) {
    const parametros = new URLSearchParams({
        latitude: String(latitud),
        longitude: String(longitud),
        current: "temperature_2m,relative_humidity_2m,weather_code,is_day",
        timezone: "auto"
    });
    const url = `https://api.open-meteo.com/v1/forecast?${parametros}`;
    const respuesta = await fetch(url);

    if (!respuesta.ok) throw new Error("No se pudo consultar Open-Meteo");

    const datos = await respuesta.json();
    const actual = datos.current;
    if (!actual || !Number.isFinite(actual.temperature_2m) ||
        !Number.isFinite(actual.relative_humidity_2m)) {
        throw new Error("Open-Meteo devolvió datos incompletos");
    }
    return actual;
}

function obtenerClimaConCache(coordenadas) {
    const clave = `${coordenadas.latitud.toFixed(3)},${coordenadas.longitud.toFixed(3)}`;
    const guardado = cacheClima.get(clave);
    if (guardado && guardado.hasta > Date.now()) return guardado.promesa;

    const promesa = obtenerClima(coordenadas.latitud, coordenadas.longitud).catch((error) => {
        // Ante un error, permite reintentar en la próxima carga/filtro.
        cacheClima.delete(clave);
        throw error;
    });
    cacheClima.set(clave, { promesa, hasta: Date.now() + DURACION_CACHE_CLIMA });
    return promesa;
}

function interpretarClima(codigo, esDeDia) {
    const dia = esDeDia === 1;
    if (codigo === 0) return { texto: "Cielo despejado", icono: dia ? "fa-sun" : "fa-moon" };
    if (codigo === 1 || codigo === 2) return { texto: "Parcialmente nublado", icono: dia ? "fa-cloud-sun" : "fa-cloud-moon" };
    if (codigo === 3) return { texto: "Nublado", icono: "fa-cloud" };
    if (codigo === 45 || codigo === 48) return { texto: "Niebla", icono: "fa-smog" };
    if (codigo >= 51 && codigo <= 57) return { texto: "Llovizna", icono: "fa-cloud-rain" };
    if (codigo >= 61 && codigo <= 67) return { texto: "Lluvia", icono: "fa-cloud-rain" };
    if (codigo >= 71 && codigo <= 77) return { texto: "Nieve", icono: "fa-snowflake" };
    if (codigo >= 80 && codigo <= 82) return { texto: "Chubascos", icono: "fa-cloud-showers-heavy" };
    if (codigo === 85 || codigo === 86) return { texto: "Nevadas", icono: "fa-snowflake" };
    if (codigo >= 95 && codigo <= 99) return { texto: "Tormenta", icono: "fa-cloud-bolt" };
    return { texto: "Condición no disponible", icono: "fa-cloud" };
}

function cargarClimaEnTarjetas(lista, version) {
    lista.forEach((alojamiento) => {
        const panel = [...contenedorFavoritos.querySelectorAll(".clima-alojamiento")]
            .find((elemento) => Number(elemento.dataset.climaId) === Number(alojamiento.id));
        if (!panel) return;

        const coordenadas = coordenadasDeAlojamiento(alojamiento);
        if (!coordenadas) {
            panel.innerHTML = `
                <div class="clima-cabecera"><span class="clima-etiqueta">CLIMA DE LA ZONA</span></div>
                <div class="clima-sin-datos"><i class="fa-solid fa-circle-info" aria-hidden="true"></i>
                    No se dispone de coordenadas para mostrar el clima.</div>`;
            return;
        }

        obtenerClimaConCache(coordenadas).then((actual) => {
            // Si se quitaron favoritos o cambiaron los filtros, no pintar tarjetas antiguas.
            if (version !== versionRenderizadoClima || !panel.isConnected) return;
            const condicion = interpretarClima(actual.weather_code, actual.is_day);
            const temperatura = Math.round(actual.temperature_2m);
            const humedad = Math.round(actual.relative_humidity_2m);

            panel.innerHTML = `
                <div class="clima-cabecera">
                    <span class="clima-etiqueta">CLIMA DE LA ZONA</span>
                    <span class="clima-proveedor">Open-Meteo</span>
                </div>
                <div class="clima-contenido">
                    <div class="clima-icono"><i class="fa-solid ${condicion.icono}" aria-hidden="true"></i></div>
                    <div class="clima-datos">
                        <span class="clima-temperatura">${temperatura} °C</span>
                        <span class="clima-condicion">${condicion.texto}</span>
                    </div>
                    <div class="clima-humedad">
                        <strong><i class="fa-solid fa-droplet" aria-hidden="true"></i> ${humedad}%</strong>
                        <span>Humedad</span>
                    </div>
                </div>`;
        }).catch(() => {
            
            if (version !== versionRenderizadoClima || !panel.isConnected) return;
            panel.innerHTML = `
                <div class="clima-cabecera"><span class="clima-etiqueta">CLIMA DE LA ZONA</span></div>
                <div class="clima-sin-datos"><i class="fa-solid fa-cloud" aria-hidden="true"></i>
                    Clima no disponible por el momento.</div>`;
        });
    });
}

function crearCardHTML(alojamiento) {
    
    const icono = iconosTipo[alojamiento.tipo] || "fa-house";
    const etiqueta = etiquetasTipo[alojamiento.tipo] || alojamiento.tipo;

    return `
        <div class="col-12 col-md-6 col-lg-4">
            <article class="resultado-card" data-id="${alojamiento.id}">
                <div class="resultado-imagen">
                    <img src="${alojamiento.imagen}" alt="${alojamiento.titulo}" loading="lazy">
                    <span class="badge-tipo"><i class="fa-solid ${icono}" aria-hidden="true"></i> ${etiqueta}</span>
                    <span class="badge-favorito"><i class="fa-solid fa-heart" aria-hidden="true"></i> Guardado</span>
                </div>
                <div class="resultado-contenido">
                    <h3>${alojamiento.titulo}</h3>
                    <p class="resultado-ubicacion">
                        <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                        ${alojamiento.ubicacion}
                    </p>
                    <p class="resultado-descripcion">${alojamiento.descripcion}</p>
                    <!-- La API completará este panel una vez consultada la zona -->
                    <div class="clima-alojamiento" data-clima-id="${alojamiento.id}" aria-live="polite">
                        <div class="clima-cabecera"><span class="clima-etiqueta">CLIMA DE LA ZONA</span></div>
                        <div class="clima-cargando"><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                            Consultando el clima...</div>
                    </div>
                    <div class="resultado-footer">
                        <div class="precio-contenedor">
                            <span class="precio-etiqueta">PRECIO MENSUAL</span>
                            <span class="resultado-precio">S/ ${alojamiento.precio}<small>/mes</small></span>
                        </div>
                        <div class="resultado-acciones">
                            <a href="../HTML/alojamiento.html?id=${alojamiento.id}" class="btn-ver">
                                Ver detalles <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                            </a>
                            <button type="button" class="btn-quitar-favorito" data-id="${alojamiento.id}"
                                title="Quitar de favoritos" aria-label="Quitar ${alojamiento.titulo} de favoritos">
                                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    `;
}

function renderizarFavoritos() {
    
    const version = ++versionRenderizadoClima;
    const favoritos = obtenerAlojamientosFavoritos();
    const filtrados = filtrarFavoritos(favoritos);
    const ordenados = ordenarFavoritos(filtrados);

    contenedorFavoritos.innerHTML = "";

    contadorFavoritos.textContent =
        `${ordenados.length} alojamiento${ordenados.length === 1 ? "" : "s"} guardado${ordenados.length === 1 ? "" : "s"}`;

    const notaClima = document.getElementById("nota-clima-fav");
    if (notaClima) notaClima.hidden = ordenados.length === 0;

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

   
    cargarClimaEnTarjetas(ordenados, version);

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


const menuIconFavoritos = document.getElementById("boton-menu");
const menuFavoritos = document.getElementById("menu-principal");
if (menuIconFavoritos && menuFavoritos) {
    menuIconFavoritos.addEventListener("click", () => {
        const abierto = menuFavoritos.classList.toggle("activo");
        menuIconFavoritos.setAttribute("aria-expanded", String(abierto));
        menuIconFavoritos.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
}
