/* =========================================================
   DETALLE DE ALOJAMIENTO - alojamiento.js (Adaptado)
   ========================================================= */

// 1. BASE DE DATOS FIJA (Catalogo inicial)
const listaAlojamientos = [
    {
        id: 1,
        titulo: "Habitación individual amoblada",
        tipo: "Habitación individual",
        precio: 650,
        capacidad: "1 persona",
        ubicacion: "San Miguel, Lima",
        latitud: -12.0772,
        longitud: -77.0921,
        imagenes: [
            "../Imagenes/persona sola.jpg",
            "../Imagenes/alojamiento.jpg",
            "../Imagenes/cuarto pareja.jpg"
        ],
        incluye: ["Internet", "Agua", "Luz", "Baño privado"],
        noIncluye: ["Estacionamiento", "Cocina"],
        descripcion: "Habitación privada con baño compartido/privado, wifi de alta velocidad y servicio de limpieza semanal. Ubicada cerca de avenidas principales."
    },
    {
        id: 2,
        titulo: "Cuarto individual cerca a la universidad",
        tipo: "Habitación individual",
        precio: 480,
        capacidad: "1 persona",
        ubicacion: "San Miguel, Lima",
        latitud: -12.0750,
        longitud: -77.0890,
        imagenes: [
            "../Imagenes/persona sola.jpg",
            "../Imagenes/baner-cuartos.png"
        ],
        incluye: ["Internet", "Agua", "Luz"],
        noIncluye: ["Cocina", "Estacionamiento"],
        descripcion: "Ideal para estudiantes, a 10 minutos caminando de la av. La Marina. Ambiente tranquilo y seguro."
    },
    {
        id: 3,
        titulo: "Habitación individual con balcón",
        tipo: "Habitación individual",
        precio: 790,
        capacidad: "1 persona",
        ubicacion: "Pueblo Libre, Lima",
        latitud: -12.0715,
        longitud: -77.0620,
        imagenes: [
            "../Imagenes/persona sola.jpg",
            "../Imagenes/alojamiento.jpg"
        ],
        incluye: ["Internet", "Agua", "Luz", "Baño privado"],
        noIncluye: ["Estacionamiento"],
        descripcion: "Espacio amplio, con balcón propio e internet de alta velocidad. Vista exterior a parque."
    },
    {
        id: 4,
        titulo: "Espacio para pareja en San Miguel",
        tipo: "Espacio para pareja",
        precio: 950,
        capacidad: "2 personas",
        ubicacion: "San Miguel, Lima",
        latitud: -12.0810,
        longitud: -77.0950,
        imagenes: [
            "../Imagenes/cuarto pareja.jpg",
            "../Imagenes/alojamiento.jpg"
        ],
        incluye: ["Internet", "Agua", "Luz", "Cocina", "Baño privado"],
        noIncluye: ["Estacionamiento"],
        descripcion: "Ambiente cómodo con baño propio, acceso a cocina compartida y zona residencial tranquila."
    },
    {
        id: 5,
        titulo: "Cuarto matrimonial en Miraflores",
        tipo: "Espacio para pareja",
        precio: 1300,
        capacidad: "2 personas",
        ubicacion: "Miraflores, Lima",
        latitud: -12.1220,
        longitud: -77.0305,
        imagenes: [
            "../Imagenes/cuarto pareja.jpg",
            "../Imagenes/baner-cuartos.png"
        ],
        incluye: ["Internet", "Agua", "Luz", "Baño privado"],
        noIncluye: ["Estacionamiento"],
        descripcion: "A pocas cuadras del malecón de Miraflores. Incluye todos los servicios básicos y seguridad 24h."
    },
    {
        id: 6,
        titulo: "Minidepartamento independiente",
        tipo: "Minidepartamento",
        precio: 1100,
        capacidad: "2 a 3 personas",
        ubicacion: "San Miguel, Lima",
        latitud: -12.0790,
        longitud: -77.0870,
        imagenes: [
            "../Imagenes/minidepa.jpg",
            "../Imagenes/alojamiento.jpg"
        ],
        incluye: ["Internet", "Agua", "Luz", "Cocina", "Baño privado"],
        noIncluye: ["Estacionamiento"],
        descripcion: "Sala-comedor, un dormitorio y cocina propia. Ingreso totalmente independiente."
    },
    {
        id: 7,
        titulo: "Minidepartamento amoblado en Surco",
        tipo: "Minidepartamento",
        precio: 1450,
        capacidad: "2 personas",
        ubicacion: "Surco, Lima",
        latitud: -12.1380,
        longitud: -76.9820,
        imagenes: [
            "../Imagenes/minidepa.jpg",
            "../Imagenes/departamento.jpg"
        ],
        incluye: ["Internet", "Agua", "Luz", "Cocina", "Baño privado", "Amoblado"],
        noIncluye: ["Estacionamiento"],
        descripcion: "Totalmente amoblado con acabados modernos y excelente iluminación natural."
    },
    {
        id: 8,
        titulo: "Departamento de 2 habitaciones",
        tipo: "Departamento",
        precio: 2200,
        capacidad: "4 personas",
        ubicacion: "San Borja, Lima",
        latitud: -12.1070,
        longitud: -77.0010,
        imagenes: [
            "../Imagenes/departamento.jpg",
            "../Imagenes/minidepa.jpg"
        ],
        incluye: ["Internet", "Agua", "Luz", "Cocina", "Baño privado", "Estacionamiento"],
        noIncluye: [],
        descripcion: "Departamento completo con dos baños, área de lavandería y espacio de estacionamiento reservado."
    }
];

// 2. RECUPERAR ALOJAMIENTOS PUBLICADOS DESDE LOCALSTORAGE
function cargarAlojamientosPublicados() {
    const publicados = JSON.parse(localStorage.getItem("alojamientosPublicados") || "[]");
    return publicados.map((item) => ({
        id: Number(item.id),
        titulo: item.titulo,
        tipo: item.tipo,
        precio: Number(item.precio),
        capacidad: "Según requerimiento",
        ubicacion: `${item.distrito}, ${item.provincia}`,
        latitud: Number(item.latitud),
        longitud: Number(item.longitud),
        imagenes: [item.imagen || "../Imagenes/alojamiento.jpg"],
        incluye: item.caracteristicas || [],
        noIncluye: [],
        descripcion: item.descripcion
    }));
}

// Fusionar catálogo base con anuncios del usuario
listaAlojamientos.push(...cargarAlojamientosPublicados());

// 3. CAPTURAR ID DE LA URL
function obtenerIdURL() {
    const parametros = new URLSearchParams(window.location.search);
    const id = parseInt(parametros.get("id"));
    return isNaN(id) ? 1 : id; // Carga el ID 1 si no se envía un parámetro válido
}

const idSeleccionado = obtenerIdURL();
const alojamientoActual = listaAlojamientos.find(item => Number(item.id) === idSeleccionado);

// 4. RENDERIZADO DINÁMICO
const contenedorDetalle = document.getElementById("contenedor-detalle");

if (alojamientoActual) {
    const tipoFormateado = alojamientoActual.tipo.charAt(0).toUpperCase() + alojamientoActual.tipo.slice(1);
    const listaIncluye = alojamientoActual.incluye.map(item => `<li><i class="fa-solid fa-check text-success me-2"></i>${item}</li>`).join("");
    const listaNoIncluye = alojamientoActual.noIncluye.map(item => `<li><i class="fa-solid fa-xmark text-danger me-2"></i>${item}</li>`).join("");

    contenedorDetalle.innerHTML = `
        <!-- GALERÍA DE IMÁGENES -->
        <div class="col-12 col-lg-7">
            <div class="card p-3 shadow-sm border-0">
                <div class="mb-3 overflow-hidden rounded">
                    <img id="foto-principal" src="${alojamientoActual.imagenes[0]}" alt="${alojamientoActual.titulo}" class="img-fluid w-100 style-main-img" style="max-height: 400px; object-fit: cover;">
                </div>
                <div class="row g-2">
                    ${alojamientoActual.imagenes.map((img, index) => `
                        <div class="col-3">
                            <img src="${img}" alt="Miniatura ${index + 1}" class="img-thumbnail miniatura-img cursor-pointer" style="height: 80px; width: 100%; object-fit: cover;">
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>

        <!-- INFORMACIÓN DEL ALOJAMIENTO -->
        <div class="col-12 col-lg-5">
            <div class="card p-4 shadow-sm border-0">
                <h2>🏠 ${alojamientoActual.titulo}</h2>
                <p class="text-muted mb-2"><i class="fa-solid fa-location-dot text-danger me-1"></i>${alojamientoActual.ubicacion}</p>
                
                ${Number.isFinite(alojamientoActual.latitud) && Number.isFinite(alojamientoActual.longitud) ? `
                    <div id="mapa-detalle" class="mt-3" style="height: 220px; border-radius: 10px; overflow: hidden;"></div>
                    <p class="small text-muted mt-2">Ubicación exacta del alojamiento</p>
                ` : ""}

                <h3 class="text-primary fw-bold my-3">S/ ${alojamientoActual.precio} <small class="fs-6 text-muted">/ mes</small></h3>
                <hr>

                <p><strong>Tipo:</strong> ${tipoFormateado}</p>
                <p><strong>Capacidad:</strong> ${alojamientoActual.capacidad}</p>

                ${alojamientoActual.incluye.length > 0 ? `
                    <h5 class="mt-3">Incluye</h5>
                    <ul class="list-unstyled">${listaIncluye}</ul>
                ` : ""}

                ${alojamientoActual.noIncluye.length > 0 ? `
                    <h5>No incluye</h5>
                    <ul class="list-unstyled">${listaNoIncluye}</ul>
                ` : ""}

                <h5 class="mt-3">Descripción</h5>
                <p class="text-secondary">${alojamientoActual.descripcion}</p>

                <div class="d-grid gap-2 mt-4">
                    <button id="btn-favoritos" class="btn btn-outline-danger">
                        <i class="fa-regular fa-heart me-2"></i>Agregar a favoritos
                    </button>
                    <button id="btn-contacto" class="btn btn-success">
                        <i class="fa-solid fa-phone me-2"></i>Contactar propietario
                    </button>
                </div>
            </div>
        </div>
    `;

    // 5. CARGAR MAPA LEAFLET SI TIENE COORDENADAS VÁLIDAS
    if (Number.isFinite(alojamientoActual.latitud) && Number.isFinite(alojamientoActual.longitud)) {
        setTimeout(() => {
            const mapaDetalle = L.map("mapa-detalle", {
                zoomControl: true,
                scrollWheelZoom: false
            }).setView([alojamientoActual.latitud, alojamientoActual.longitud], 15);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors"
            }).addTo(mapaDetalle);

            L.marker([alojamientoActual.latitud, alojamientoActual.longitud])
                .addTo(mapaDetalle)
                .bindPopup(alojamientoActual.titulo)
                .openPopup();
        }, 100);
    }

    // 6. INTERACCIÓN DE GALERÍA DE FOTOS
    const fotoPrincipal = document.getElementById("foto-principal");
    const miniaturas = document.querySelectorAll(".miniatura-img");

    miniaturas.forEach(miniatura => {
        miniatura.addEventListener("click", () => {
            fotoPrincipal.src = miniatura.src;
        });
    });

    // 7. BOTÓN FAVORITOS Y CONTACTO
    const btnFavoritos = document.getElementById("btn-favoritos");
    btnFavoritos.addEventListener("click", () => {
        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        if (favoritos.includes(alojamientoActual.id)) {
            alert("Este alojamiento ya está en tus favoritos.");
        } else {
            favoritos.push(alojamientoActual.id);
            localStorage.setItem("favoritos", JSON.stringify(favoritos));
            btnFavoritos.className = "btn btn-danger";
            btnFavoritos.innerHTML = '<i class="fa-solid fa-heart me-2"></i>Guardado en favoritos';
            alert("¡Alojamiento agregado a tus favoritos!");
        }
    });

    document.getElementById("btn-contacto").addEventListener("click", () => {
        alert(`Te pondrás en contacto con el propietario de: "${alojamientoActual.titulo}".`);
    });

} else {
    contenedorDetalle.innerHTML = `
        <div class="col-12 text-center my-5">
            <h2>Alojamiento no encontrado</h2>
            <p>El inmueble solicitado no existe o fue retirado.</p>
            <a href="../HTML/buscar.html" class="btn btn-primary">Volver al buscador</a>
        </div>
    `;
}