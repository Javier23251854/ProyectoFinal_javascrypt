import { randomBytes, randomUUID } from 'node:crypto';
import { guardarHash, validarHash } from './datos.mjs';

const NOMBRE_COOKIE = 'spacego_sesion';
const DURACION = 12 * 60 * 60;
const DURACION_RECORDAR = 7 * 24 * 60 * 60;
const camposAlojamiento = [
  'titulo', 'tipo', 'precio', 'departamento', 'provincia', 'distrito', 'imagen',
  'descripcion', 'fecha', 'imagenes', 'latitud', 'longitud', 'capacidad',
  'referencia', 'incluye', 'noIncluye', 'caracteristicas', 'contacto', 'activo',
];

class ErrorHttp extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

function comprobar(condicion, status, mensaje) {
  if (!condicion) throw new ErrorHttp(status, mensaje);
}

function responder(res, status, datos, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(datos === undefined ? undefined : JSON.stringify(datos));
}

async function leerJson(req) {
  comprobar(req.headers['content-type']?.split(';')[0] === 'application/json',
    415, 'Envía los datos como JSON.');
  const bloques = [];
  let bytes = 0;
  for await (const bloque of req.iterator({ destroyOnReturn: false })) {
    bytes += bloque.length;
    comprobar(bytes <= 64 * 1024, 413, 'La solicitud es demasiado grande.');
    bloques.push(bloque);
  }

  let datos;
  try {
    datos = JSON.parse(Buffer.concat(bloques).toString('utf8'));
  } catch {
    throw new ErrorHttp(400, 'JSON inválido.');
  }
  comprobar(datos && typeof datos === 'object' && !Array.isArray(datos), 400, 'Envía un objeto JSON.');
  return datos;
}

function perfil(usuario) {
  const { id, name, email, telefono, distrito } = usuario;
  return { id: String(id), name, email, telefono, distrito };
}

function datosDePerfil(datos) {
  const name = typeof datos.name === 'string' ? datos.name.trim() : '';
  const email = typeof datos.email === 'string' ? datos.email.trim().toLowerCase() : '';
  comprobar(name.length >= 3 && name.length <= 120, 400, 'Ingresa un nombre de 3 a 120 caracteres.');
  comprobar(email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    400, 'Ingresa un correo válido.');
  return { name, email };
}

function verificarCorreoDisponible(datos, correo, propio) {
  comprobar(!datos.usuarios.some(usuario => usuario.email === correo && String(usuario.id) !== propio),
    409, 'Este correo ya está registrado.');
}

export async function crearApi(almacen, { secure = false } = {}) {
  const sesiones = new Map();
  const hashDeReferencia = await guardarHash(randomBytes(32).toString('hex'));
  let verificaciones = 0;

  function cookie(valor, duracion) {
    return NOMBRE_COOKIE + '=' + valor + '; Path=/; HttpOnly; SameSite=Strict'
      + (duracion === undefined ? '' : '; Max-Age=' + duracion)
      + (secure ? '; Secure' : '');
  }

  function recuperarSesion(req) {
    const token = req.headers.cookie?.split(';').map(parte => parte.trim())
      .find(parte => parte.startsWith(NOMBRE_COOKIE + '='))?.slice(NOMBRE_COOKIE.length + 1);
    const sesion = sesiones.get(token);
    if (!sesion || sesion.expira <= Date.now()) {
      sesiones.delete(token);
      return { token };
    }
    return {
      token,
      usuario: almacen.datos.usuarios.find(usuario => String(usuario.id) === sesion.usuarioId),
    };
  }

  function exigirUsuario(req) {
    const { usuario } = recuperarSesion(req);
    comprobar(usuario, 401, 'Inicia sesión para continuar.');
    return String(usuario.id);
  }

  async function verificar(password, hash, registrar = false) {
    comprobar(verificaciones < 4, 429, 'Hay varias solicitudes de acceso. Inténtalo de nuevo.');
    verificaciones++;
    try {
      return registrar ? await guardarHash(password) : await validarHash(password, hash);
    } finally {
      verificaciones--;
    }
  }

  async function autenticacion(req, res, recurso) {
    const metodo = req.method;
    if (recurso === 'sesion' && metodo === 'GET') {
      const { usuario } = recuperarSesion(req);
      return responder(res, 200, { usuario: usuario ? perfil(usuario) : null });
    }
    if (recurso === 'salir' && metodo === 'POST') {
      sesiones.delete(recuperarSesion(req).token);
      return responder(res, 204, undefined, { 'Set-Cookie': cookie('', 0) });
    }
    if (recurso === 'perfil' && metodo === 'PATCH') {
      const usuarioId = exigirUsuario(req);
      const cuerpo = await leerJson(req);
      const datos = datosDePerfil(cuerpo);
      for (const campo of ['telefono', 'distrito']) {
        if (typeof cuerpo[campo] === 'string') datos[campo] = cuerpo[campo].trim().slice(0, 120);
      }
      const usuario = almacen.cambiar(db => {
        verificarCorreoDisponible(db, datos.email, usuarioId);
        return Object.assign(db.usuarios.find(item => String(item.id) === usuarioId), datos);
      });
      return responder(res, 200, perfil(usuario));
    }

    comprobar(metodo === 'POST' && ['registro', 'login'].includes(recurso), 404, 'Ruta no disponible.');
    const cuerpo = await leerJson(req);
    const { password } = cuerpo;
    comprobar(typeof password === 'string' && password.length >= 8 && password.length <= 128,
      400, 'Ingresa una contraseña de 8 a 128 caracteres.');

    if (recurso === 'registro') {
      const datos = datosDePerfil(cuerpo);
      verificarCorreoDisponible(almacen.datos, datos.email);
      const passwordHash = await verificar(password, undefined, true);
      const usuario = { id: randomUUID(), ...datos, passwordHash };
      almacen.cambiar(db => {
        verificarCorreoDisponible(db, datos.email);
        db.usuarios.push(usuario);
      });
      return responder(res, 201, perfil(usuario));
    }

    const email = typeof cuerpo.email === 'string' ? cuerpo.email.trim().toLowerCase() : '';
    const usuario = almacen.datos.usuarios.find(item => item.email === email);
    const valido = await verificar(password, usuario?.passwordHash ?? hashDeReferencia);
    comprobar(usuario && valido, 401, 'Correo o contraseña incorrectos.');

    sesiones.delete(recuperarSesion(req).token);
    for (const [token, sesion] of sesiones) {
      if (sesion.expira <= Date.now()) sesiones.delete(token);
    }
    const token = randomBytes(32).toString('hex');
    const recordar = cuerpo.remember === true;
    const expira = Date.now() + (recordar ? DURACION_RECORDAR : DURACION) * 1000;
    sesiones.set(token, { usuarioId: String(usuario.id), expira });
    return responder(res, 200, { usuario: perfil(usuario) },
      { 'Set-Cookie': cookie(token, recordar ? DURACION_RECORDAR : undefined) });
  }

  async function favoritos(req, res, id) {
    const usuarioId = exigirUsuario(req);
    const propio = favorito => String(favorito.usuarioId) === usuarioId;
    if (req.method === 'GET' && !id) {
      return responder(res, 200, almacen.datos.favoritos.filter(propio));
    }
    if (req.method === 'POST' && !id) {
      const { alojamientoId } = await leerJson(req);
      const alojamiento = almacen.datos.alojamientos.find(item =>
        String(item.id) === String(alojamientoId) && (item.activo !== false || String(item.propietarioId) === usuarioId));
      comprobar(alojamiento, 404, 'Alojamiento no encontrado.');
      const existente = almacen.datos.favoritos.find(item =>
        propio(item) && String(item.alojamientoId) === String(alojamiento.id));
      if (existente) return responder(res, 200, existente);
      const favorito = { id: randomUUID(), alojamientoId: alojamiento.id, usuarioId };
      almacen.cambiar(db => db.favoritos.push(favorito));
      return responder(res, 201, favorito);
    }
    if (req.method === 'DELETE' && id) {
      comprobar(almacen.datos.favoritos.some(item => propio(item) && String(item.id) === id),
        404, 'Favorito no encontrado.');
      almacen.cambiar(db => {
        db.favoritos = db.favoritos.filter(item => !(propio(item) && String(item.id) === id));
      });
      return responder(res, 204);
    }
    return responder(res, 404, { mensaje: 'Ruta no disponible.' });
  }

  async function alojamientos(req, res, id) {
    const metodo = req.method;
    const { alojamientos } = almacen.datos;
    const buscar = lista => lista.find(item => String(item.id) === id);
    const actual = buscar(alojamientos);
    if (metodo === 'GET') {
      if (id === 'mios') {
        const usuarioId = exigirUsuario(req);
        return responder(res, 200, alojamientos.filter(item => String(item.propietarioId) === usuarioId));
      }
      if (!id) return responder(res, 200, alojamientos.filter(item => item.activo !== false));
      const { usuario } = recuperarSesion(req);
      comprobar(actual && (actual.activo !== false ||
        (usuario && String(actual.propietarioId) === String(usuario.id))), 404, 'Alojamiento no encontrado.');
      return responder(res, 200, actual);
    }

    const usuarioId = exigirUsuario(req);
    if (!id && metodo === 'POST') {
      const cuerpo = await leerJson(req);
      const campos = Object.fromEntries(camposAlojamiento.filter(campo => campo in cuerpo)
        .map(campo => [campo, cuerpo[campo]]));
      comprobar(typeof campos.titulo === 'string' && campos.titulo.trim() &&
        Number.isFinite(campos.precio) && campos.precio > 0, 400, 'Ingresa un título y un precio válido.');
      const nuevo = { ...campos, id: randomUUID(), propietarioId: usuarioId, activo: true };
      almacen.cambiar(db => db.alojamientos.push(nuevo));
      return responder(res, 201, nuevo);
    }
    comprobar(actual && String(actual.propietarioId) === usuarioId, 404, 'Publicación no encontrada.');
    if (metodo === 'PATCH') {
      const cuerpo = await leerJson(req);
      const cambios = Object.fromEntries(camposAlojamiento.filter(campo => campo in cuerpo)
        .map(campo => [campo, cuerpo[campo]]));
      const resultado = almacen.cambiar(db => {
        const registro = buscar(db.alojamientos);
        comprobar(registro, 404, 'Publicación no encontrada.');
        return Object.assign(registro, cambios);
      });
      return responder(res, 200, resultado);
    }
    if (metodo === 'DELETE') {
      almacen.cambiar(db => {
        db.alojamientos = db.alojamientos.filter(item => String(item.id) !== id);
        db.favoritos = db.favoritos.filter(item => String(item.alojamientoId) !== id);
      });
      return responder(res, 204);
    }
    return responder(res, 404, { mensaje: 'Ruta no disponible.' });
  }

  return async function api(req, res, url) {
    try {
      comprobar(['GET', 'HEAD'].includes(req.method) || !req.headers.origin ||
        req.headers.origin === (secure ? 'https://' : 'http://') + req.headers.host,
      403, 'Origen de solicitud no permitido.');
      const [, , grupo, recurso, extra] = url.pathname.split('/');
      const id = recurso && decodeURIComponent(recurso);
      if (!extra && grupo === 'auth') return await autenticacion(req, res, id);
      if (!extra && grupo === 'favoritos') return await favoritos(req, res, id);
      if (!extra && grupo === 'alojamientos') return await alojamientos(req, res, id);
      return responder(res, 404, { mensaje: 'Ruta no disponible.' });
    } catch (error) {
      if (error instanceof ErrorHttp) return responder(res, error.status, { mensaje: error.message });
      if (error instanceof URIError) return responder(res, 400, { mensaje: 'URL inválida.' });
      console.error(error);
      return responder(res, 500, { mensaje: 'Ocurrió un error en el servidor.' });
    }
  };
}
