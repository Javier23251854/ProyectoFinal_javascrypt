/* =========================================================
   3. DETALLE DE ALOJAMIENTO - alojamiento.js
   Cumple con los temas solicitados en la rúbrica:
   - Objetos, Arrays, Strings (slice, substring, charAt)
   - Interpolación (`${precio}`)
   - Funciones, Eventos (onClick, onMouseOver, onMouseOut)
   - innerHTML, if/else, find(), includes()
   ========================================================= */

// 1. BASE DE DATOS (Simulada con un Array de Objetos)
const listaAlojamientos = [
    {
        id: 1,
        titulo: "Habitación individual cómoda",
        tipo: "Cuarto individual",
        precio: 650,
        capacidad: "1 persona",
        ubicacion: "San Miguel, Lima",
        imagenes: [
            "../Imagenes/persona sola.jpg",
            "../Imagenes/cuarto pareja.jpg",
            "../Imagenes/alojamiento.jpg",
            "../Imagenes/baner-cuartos.png"
        ],
        incluye: ["Internet", "Agua", "Luz", "Baño privado"],
        noIncluye: ["Estacionamiento", "Cocina"],
        descripcion: "Habitación individual acogedora e independiente. Ubicada a pocos minutos de universidades y transporte público."
    },
    {
        id: 2,
        titulo: "Espacio moderno para parejas",
        tipo: "Cuarto para parejas",
        precio: 850,
        capacidad: "2 personas",
        ubicacion: "Miraflores, Lima",
        imagenes: [
            "../Imagenes/cuarto pareja.jpg",
            "../Imagenes/alojamiento.jpg",
            "../Imagenes/minidepa.jpg",
            "../Imagenes/persona sola.jpg"
        ],
        incluye: ["Internet", "Agua", "Luz", "Cocina", "Baño privado"],
        noIncluye: ["Estacionamiento"],
        descripcion: "Excelente espacio para parejas con amplia ventilación, acabados de primera y zona residencial tranquila."
    },
    {
        id: 3,
        titulo: "Mini departamento moderno",
        tipo: "Mini departamento",
        precio: 950,
        capacidad: "2 personas",
        ubicacion: "San Miguel, Lima",
        imagenes: [
            "../Imagenes/minidepa.jpg",
            "../Imagenes/alojamiento.jpg",
            "../Imagenes/departamento.jpg",
            "../Imagenes/baner-cuartos.png"
        ],
        incluye: ["Internet", "Agua", "Luz", "Cocina", "Baño privado"],
        noIncluye: ["Estacionamiento"],
        descripcion: "Mini departamento ubicado cerca de universidades, supermercados y avenidas principales."
    },
    {
        id: 4,
        titulo: "Departamento completo de estreno",
        tipo: "Departamento",
        precio: 1800,
        capacidad: "4 personas",
        ubicacion: "Surco, Lima",
        imagenes: [
            "../Imagenes/departamento.jpg",
            "../Imagenes/minidepa.jpg",
            "../Imagenes/alojamiento.jpg",
            "../Imagenes/baner-cuartos.png"
        ],
        incluye: ["Internet", "Agua", "Luz", "Cocina", "Baño privado", "Estacionamiento"],
        noIncluye: [],
        descripcion: "Departamento amplio con acabados de lujo, sala-comedor, cocina equipada y vista a la ciudad."
    }
];

// 2. OBTENER ID DE LA URL Y BUSCAR EL OBJETO CON find()
function obtenerIdURL() {
    const parametros = new URLSearchParams(window.location.search);
    const id = parseInt(parametros.get("id"));
    return isNaN(id) ? 3 : id; // Si no hay ID en la URL, carga el ID 3 por defecto
}

const idSeleccionado = obtenerIdURL();
const alojamientoActual = listaAlojamientos.find(item => item.id === idSeleccionado);

// 3. RENDERIZADO DINÁMICO
const contenedorDetalle = document.getElementById("contenedor-detalle");

if (alojamientoActual) {
    // Uso de Métodos de String exigidos (charAt, slice, substring)
    const tipoFormateado = alojamientoActual.tipo.charAt(0).toUpperCase() + alojamientoActual.tipo.slice(1);
    const resumenCaja = alojamientoActual.descripcion.substring(0, 30) + "...";

    // Interpolación de String para los elementos de las listas
    const listaIncluye = alojamientoActual.incluye.map(item => `<li><i class="fa-solid fa-check text-success me-2"></i>${item}</li>`).join("");
    const listaNoIncluye = alojamientoActual.noIncluye.map(item => `<li><i class="fa-solid fa-xmark text-danger me-2"></i>${item}</li>`).join("");

    // Inyección de HTML usando innerHTML
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
                <h3 class="text-primary fw-bold my-3">S/ ${alojamientoActual.precio} <small class="fs-6 text-muted">/ mes</small></h3>
                
                <hr>

                <p><strong>Tipo:</strong> ${tipoFormateado}</p>
                <p><strong>Capacidad:</strong> ${alojamientoActual.capacidad}</p>

                <!-- Incluye -->
                <h5 class="mt-3">Incluye</h5>
                <ul class="list-unstyled">
                    ${listaIncluye}
                </ul>

                <!-- No incluye -->
                ${alojamientoActual.noIncluye.length > 0 ? `
                    <h5>No incluye</h5>
                    <ul class="list-unstyled">
                        ${listaNoIncluye}
                    </ul>
                ` : ""}

                <!-- Descripción -->
                <h5 class="mt-3">Descripción</h5>
                <p class="text-secondary">${alojamientoActual.descripcion}</p>

                <!-- BOTONES DE ACCIÓN -->
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

    // 4. EVENTOS EN LA GALERÍA (onClick, onMouseOver, onMouseOut)
    const fotoPrincipal = document.getElementById("foto-principal");
    const miniaturas = document.querySelectorAll(".miniatura-img");

    miniaturas.forEach(miniatura => {
        // Evento onClick: Cambia la imagen principal
        miniatura.addEventListener("click", () => {
            fotoPrincipal.src = miniatura.src;
        });

        // Eventos para efectos visuales (onMouseOver & onMouseOut)
        miniatura.addEventListener("mouseover", () => {
            miniatura.style.opacity = "0.7";
            miniatura.style.transform = "scale(1.05)";
            miniatura.style.transition = "all 0.2s ease";
        });

        miniatura.addEventListener("mouseout", () => {
            miniatura.style.opacity = "1";
            miniatura.style.transform = "scale(1)";
        });
    });

    // 5. LÓGICA DE AGREGAR A FAVORITOS
    const btnFavoritos = document.getElementById("btn-favoritos");
    btnFavoritos.addEventListener("click", () => {
        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

        if (favoritos.includes(alojamientoActual.id)) {
            alert("Este alojamiento ya está en tus favoritos.");
        } else {
            favoritos.push(alojamientoActual.id);
            localStorage.setItem("favoritos", JSON.stringify(favoritos));
            btnFavoritos.classList.remove("btn-outline-danger");
            btnFavoritos.classList.add("btn-danger");
            btnFavoritos.innerHTML = '<i class="fa-solid fa-heart me-2"></i>Guardado en favoritos';
            alert("¡Alojamiento agregado a tus favoritos!");
        }
    });

    // Botón de Contacto
    document.getElementById("btn-contacto").addEventListener("click", () => {
        alert(`Te pondrás en contacto con el propietario del alojamiento: "${alojamientoActual.titulo}".`);
    });

} else {
    // Si el ID no existe en el Array
    contenedorDetalle.innerHTML = `
        <div class="col-12 text-center my-5">
            <h2>Alojamiento no encontrado</h2>
            <p>El inmueble que buscas no existe o fue retirado.</p>
            <a href="../HTML/buscar.html" class="btn btn-primary">Volver al buscador</a>
        </div>
    `;
}

// 6. MENÚ RESPONSIVE (Mantiene la funcionalidad global)
const menuIcon = document.querySelector(".menu-icon");
const menu = document.querySelector(".menu");
if (menuIcon && menu) {
    menuIcon.addEventListener("click", () => {
        menu.classList.toggle("activo");
    });
}