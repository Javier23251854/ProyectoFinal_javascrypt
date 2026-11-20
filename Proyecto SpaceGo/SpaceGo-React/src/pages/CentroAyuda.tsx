
import { useMemo, useState, type FormEvent } from "react";
import "./CentroAyuda.css";

type Pregunta = {
  id: number;
  categoria: string;
  pregunta: string;
  respuesta: string;
};

const preguntas: Pregunta[] = [
  {
    id: 1,
    categoria: "Cuenta",
    pregunta: "¿Cómo puedo crear una cuenta en SpaceGo?",
    respuesta:
      "Ingresa a la página principal de SpaceGo, selecciona la opción de registro y completa tus datos personales. Después podrás iniciar sesión y utilizar las funcionalidades de la plataforma."
  },
  {
    id: 2,
    categoria: "Cuenta",
    pregunta: "¿Cómo puedo actualizar mis datos personales?",
    respuesta:
      "Ingresa a la sección Mi perfil. Allí podrás consultar y actualizar los datos personales que la plataforma tenga habilitados para tu cuenta."
  },
  {
    id: 3,
    categoria: "Alojamientos",
    pregunta: "¿Cómo puedo buscar un alojamiento?",
    respuesta:
      "Ingresa a Buscar alojamiento y utiliza los filtros disponibles para encontrar opciones según la ubicación, precio y características que necesites."
  },
  {
    id: 4,
    categoria: "Alojamientos",
    pregunta: "¿Puedo comparar varios alojamientos?",
    respuesta:
      "Sí. Utiliza la opción Comparar alojamientos para seleccionar diferentes publicaciones y revisar sus precios, ubicaciones, servicios y características."
  },
  {
    id: 5,
    categoria: "Solicitudes",
    pregunta: "¿Dónde puedo consultar mis solicitudes?",
    respuesta:
      "Entra a Mis solicitudes. Allí encontrarás las solicitudes de contacto o alquiler que hayas enviado y podrás consultar su estado."
  },
  {
    id: 6,
    categoria: "Solicitudes",
    pregunta: "¿Qué significan los estados de una solicitud?",
    respuesta:
      "Pendiente significa que todavía espera atención; En revisión indica que está siendo evaluada; Aceptada y Rechazada muestran la decisión del propietario; Cancelada indica que la solicitud fue anulada."
  },
  {
    id: 7,
    categoria: "Publicaciones",
    pregunta: "¿Cómo puedo administrar mis publicaciones?",
    respuesta:
      "Si eres propietario, ingresa a Administrar publicaciones para consultar y gestionar los alojamientos que hayas publicado."
  },
  {
    id: 8,
    categoria: "Publicaciones",
    pregunta: "¿Puedo editar o desactivar un alojamiento?",
    respuesta:
      "Sí. Desde Administrar publicaciones puedes utilizar las opciones de gestión disponibles para modificar o desactivar tus publicaciones."
  }
];

const categorias = [
  "Todas",
  "Cuenta",
  "Alojamientos",
  "Solicitudes",
  "Publicaciones"
];

function CentroAyuda() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [preguntaAbierta, setPreguntaAbierta] = useState<number | null>(1);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [tipoConsulta, setTipoConsulta] = useState("Problema con mi cuenta");
  const [mensaje, setMensaje] = useState("");

  const [error, setError] = useState("");
  const [confirmacion, setConfirmacion] = useState("");

  const preguntasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return preguntas.filter((item) => {
      const coincideCategoria =
        categoria === "Todas" || item.categoria === categoria;

      const coincideBusqueda =
        !termino ||
        item.pregunta.toLowerCase().includes(termino) ||
        item.respuesta.toLowerCase().includes(termino) ||
        item.categoria.toLowerCase().includes(termino);

      return coincideCategoria && coincideBusqueda;
    });
  }, [busqueda, categoria]);

  function enviarConsulta(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setConfirmacion("");

    if (!nombre.trim() || !correo.trim() || !mensaje.trim()) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    if (!correoValido) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    const consulta = {
      id: Date.now(),
      nombre: nombre.trim(),
      correo: correo.trim(),
      tipo: tipoConsulta,
      mensaje: mensaje.trim(),
      fecha: new Date().toISOString(),
      estado: "Pendiente"
    };

    try {
      const consultasGuardadas = JSON.parse(
        localStorage.getItem("spacego_consultas_ayuda") || "[]"
      );

      if (!Array.isArray(consultasGuardadas)) {
        throw new Error("Almacenamiento inválido");
      }

      consultasGuardadas.push(consulta);

      localStorage.setItem(
        "spacego_consultas_ayuda",
        JSON.stringify(consultasGuardadas)
      );

      setNombre("");
      setCorreo("");
      setTipoConsulta("Problema con mi cuenta");
      setMensaje("");

      setConfirmacion(
        "¡Consulta registrada correctamente! Gracias por comunicarte con SpaceGo."
      );
    } catch {
      setError(
        "No se pudo guardar tu consulta. Revisa el almacenamiento del navegador."
      );
    }
  }

  return (
    <section className="ayuda-pagina">
      <div className="ayuda-portada">
        <div className="ayuda-portada-contenido">
          <span className="ayuda-etiqueta">ESTAMOS PARA AYUDARTE</span>

          <h1>Centro de ayuda</h1>

          <p>
            Encuentra respuestas a tus preguntas y recibe orientación
            para disfrutar de una mejor experiencia en SpaceGo.
          </p>

          <div className="ayuda-buscador">
            <i
              className="fa-solid fa-magnifying-glass"
              aria-hidden="true"
            />

            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="¿Qué necesitas saber?"
              aria-label="Buscar preguntas frecuentes"
            />

            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda("")}
                aria-label="Limpiar búsqueda"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="ayuda-portada-icono">
          <i className="fa-solid fa-headset" aria-hidden="true" />
        </div>
      </div>

      <div className="ayuda-contenedor">
        <header className="ayuda-seccion-titulo">
          <span>PREGUNTAS FRECUENTES</span>
          <h2>¿En qué podemos ayudarte?</h2>
          <p>
            Selecciona una categoría o busca directamente tu pregunta.
          </p>
        </header>

        <div className="ayuda-categorias">
          {categorias.map((item) => (
            <button
              type="button"
              key={item}
              className={
                categoria === item
                  ? "ayuda-categoria activa"
                  : "ayuda-categoria"
              }
              onClick={() => {
                setCategoria(item);
                setPreguntaAbierta(null);
              }}
            >
              {item === "Todas" && (
                <i className="fa-solid fa-border-all" aria-hidden="true" />
              )}
              {item === "Cuenta" && (
                <i className="fa-solid fa-user" aria-hidden="true" />
              )}
              {item === "Alojamientos" && (
                <i className="fa-solid fa-house" aria-hidden="true" />
              )}
              {item === "Solicitudes" && (
                <i className="fa-solid fa-envelope" aria-hidden="true" />
              )}
              {item === "Publicaciones" && (
                <i className="fa-solid fa-building" aria-hidden="true" />
              )}
              {item}
            </button>
          ))}
        </div>

        <div className="ayuda-preguntas">
          {preguntasFiltradas.length === 0 ? (
            <div className="ayuda-sin-resultados">
              <i className="fa-solid fa-circle-question" />
              <h3>No encontramos resultados</h3>
              <p>
                Prueba con otra palabra o selecciona una categoría diferente.
              </p>
              <button
                type="button"
                onClick={() => {
                  setBusqueda("");
                  setCategoria("Todas");
                }}
              >
                Ver todas las preguntas
              </button>
            </div>
          ) : (
            preguntasFiltradas.map((item) => (
              <article className="ayuda-pregunta" key={item.id}>
                <button
                  type="button"
                  className="ayuda-pregunta-boton"
                  aria-expanded={preguntaAbierta === item.id}
                  onClick={() =>
                    setPreguntaAbierta(
                      preguntaAbierta === item.id ? null : item.id
                    )
                  }
                >
                  <span>
                    <small>{item.categoria}</small>
                    {item.pregunta}
                  </span>

                  <i
                    className={
                      preguntaAbierta === item.id
                        ? "fa-solid fa-chevron-up"
                        : "fa-solid fa-chevron-down"
                    }
                    aria-hidden="true"
                  />
                </button>

                {preguntaAbierta === item.id && (
                  <div className="ayuda-respuesta">
                    {item.respuesta}
                  </div>
                )}
              </article>
            ))
          )}
        </div>

        <div className="ayuda-contacto">
          <div className="ayuda-contacto-info">
            <span>ATENCIÓN AL USUARIO</span>
            <h2>¿No encontraste lo que buscabas?</h2>
            <p>
              Envíanos tu consulta mediante el siguiente formulario.
              Nuestro equipo podrá revisar tu solicitud.
            </p>

            <div className="ayuda-contacto-dato">
              <i className="fa-solid fa-headset" />
              <span>Estamos aquí para orientarte.</span>
            </div>

            <div className="ayuda-contacto-dato">
              <i className="fa-solid fa-shield-halved" />
              <span>Protegemos tus datos personales.</span>
            </div>
          </div>

          <form className="ayuda-formulario" onSubmit={enviarConsulta}>
            <h3>Envíanos tu consulta</h3>

            <p>Los campos marcados con * son obligatorios.</p>

            <label htmlFor="ayuda-nombre">Nombre completo *</label>
            <input
              id="ayuda-nombre"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ingresa tu nombre"
              maxLength={100}
              required
            />

            <label htmlFor="ayuda-correo">Correo electrónico *</label>
            <input
              id="ayuda-correo"
              type="email"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
              placeholder="ejemplo@correo.com"
              maxLength={150}
              required
            />

            <label htmlFor="ayuda-tipo">Tipo de consulta</label>
            <select
              id="ayuda-tipo"
              value={tipoConsulta}
              onChange={(event) => setTipoConsulta(event.target.value)}
            >
              <option>Problema con mi cuenta</option>
              <option>Consulta sobre alojamientos</option>
              <option>Problema con una solicitud</option>
              <option>Problema con una publicación</option>
              <option>Otro asunto</option>
            </select>

            <label htmlFor="ayuda-mensaje">Describe tu consulta *</label>
            <textarea
              id="ayuda-mensaje"
              value={mensaje}
              onChange={(event) => setMensaje(event.target.value)}
              placeholder="Escribe aquí cómo podemos ayudarte..."
              rows={5}
              maxLength={1000}
              required
            />

            <span className="ayuda-contador">
              {mensaje.length}/1000 caracteres
            </span>

            {error && (
              <div className="ayuda-mensaje-error" role="alert">
                <i className="fa-solid fa-circle-exclamation" />
                {error}
              </div>
            )}

            {confirmacion && (
              <div className="ayuda-mensaje-exito" role="status">
                <i className="fa-solid fa-circle-check" />
                {confirmacion}
              </div>
            )}

            <button type="submit" className="ayuda-enviar">
              <i className="fa-solid fa-paper-plane" />
              Enviar consulta
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CentroAyuda;
