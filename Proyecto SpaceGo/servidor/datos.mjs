import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { promisify } from 'node:util';

const derivar = promisify(scrypt);
const opciones = { N: 2 ** 17, r: 8, p: 1, maxmem: 192 * 1024 * 1024 };

export async function guardarHash(password, sal = randomBytes(16).toString('hex')) {
  const clave = await derivar(password, sal, 64, opciones);
  return sal + ':' + clave.toString('hex');
}

export async function validarHash(password, hash) {
  const [sal] = hash.split(':');
  const calculado = await guardarHash(password, sal);
  return timingSafeEqual(Buffer.from(hash), Buffer.from(calculado));
}

export async function abrirDatos(archivo, semilla) {
  const datos = JSON.parse(readFileSync(existsSync(archivo) ? archivo : semilla, 'utf8'));
  let guardar = !existsSync(archivo);

  for (const usuario of datos.usuarios) {
    usuario.email = usuario.email.trim().toLowerCase();
    if (typeof usuario.password === 'string') {
      usuario.passwordHash = await guardarHash(usuario.password);
      delete usuario.password;
      guardar = true;
    }
  }

  // La base original tenía una sola cuenta. Solo en ese caso se pueden
  // conservar sus favoritos antiguos, que no registraban propietario.
  if (datos.usuarios.length === 1) {
    for (const favorito of datos.favoritos.filter(favorito => favorito.usuarioId == null)) {
      favorito.usuarioId = String(datos.usuarios[0].id);
      guardar = true;
    }
  }

  function escribir(contenido) {
    mkdirSync(dirname(archivo), { recursive: true });
    const temporal = archivo + '.tmp';
    writeFileSync(temporal, JSON.stringify(contenido, null, 2), { mode: 0o600 });
    renameSync(temporal, archivo);
  }

  if (guardar) escribir(datos);

  let actual = datos;
  return {
    get datos() { return actual; },
    cambiar(mutacion) {
      const copia = structuredClone(actual);
      const resultado = mutacion(copia);
      escribir(copia);
      actual = copia;
      return resultado;
    }
  };
}
