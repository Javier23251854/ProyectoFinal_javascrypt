import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { once } from 'node:events';
import { crearServidor } from './index.mjs';

test('sesiones, propiedad de publicaciones y favoritos por cuenta', async t => {
  const directorio = mkdtempSync(join(tmpdir(), 'spacego-'));
  const archivoDatos = join(directorio, 'db.json');
  const servidor = await crearServidor({ archivoDatos });
  servidor.listen(0, '127.0.0.1');
  await once(servidor, 'listening');
  t.after(async () => {
    await new Promise(resolve => servidor.close(resolve));
    rmSync(directorio, { force: true, recursive: true });
  });

  const origin = 'http://127.0.0.1:' + servidor.address().port;
  const api = (ruta, { metodo = 'GET', cuerpo, cookie, origen = origin } = {}) => fetch(origin + '/api' + ruta, {
    method: metodo,
    headers: {
      Origin: origen,
      ...(cookie ? { Cookie: cookie } : {}),
      ...(cuerpo ? { 'Content-Type': 'application/json' } : {}),
    },
    body: cuerpo && JSON.stringify(cuerpo),
  });
  const registrar = email => api('/auth/registro', {
    metodo: 'POST', cuerpo: { name: 'Usuario de prueba', password: 'PruebaSpaceGo123', email },
  });
  const entrar = (email, password = 'PruebaSpaceGo123', remember = false) =>
    api('/auth/login', { metodo: 'POST', cuerpo: { email, password, remember } });
  const ana = 'ana@example.test';
  const luis = 'luis@example.test';

  assert.equal((await api('/alojamientos')).status, 200);
  assert.equal((await api('/favoritos')).status, 401);
  assert.equal((await api('/alojamientos', { metodo: 'POST', cuerpo: { titulo: 'Prueba' } })).status, 401);
  assert.equal((await api('/auth/perfil', { metodo: 'PATCH', cuerpo: { name: 'Otro' } })).status, 401);
  assert.deepEqual(await (await api('/auth/sesion?usuarioId=1')).json(), { usuario: null });
  assert.equal((await api('/auth/salir', { metodo: 'POST', origen: 'https://external.example' })).status, 403);

  const registro = await registrar(ana);
  assert.equal(registro.status, 201);
  const usuarioAna = await registro.json();
  assert.equal('passwordHash' in usuarioAna, false);
  assert.equal((await registrar(ana.toUpperCase())).status, 409);
  assert.equal((await registrar(luis)).status, 201);
  assert.equal((await entrar(ana, 'ClaveIncorrecta')).status, 401);

  const acceso = await entrar(ana, undefined, true);
  assert.equal(acceso.status, 200);
  const cookieCompleta = acceso.headers.get('set-cookie');
  for (const atributo of ['HttpOnly', 'SameSite=Strict', 'Max-Age=604800']) assert.ok(cookieCompleta.includes(atributo));
  const cookieAna = cookieCompleta.split(';')[0];
  const cookieLuis = (await entrar(luis)).headers.get('set-cookie').split(';')[0];
  const sesion = await (await api('/auth/sesion', { cookie: cookieAna })).json();
  assert.equal(sesion.usuario.id, usuarioAna.id);

  const editado = await api('/auth/perfil', {
    metodo: 'PATCH', cookie: cookieAna, cuerpo: { name: 'Ana editada', email: ana },
  });
  assert.equal((await editado.json()).name, 'Ana editada');

  const publicado = await api('/alojamientos', {
    metodo: 'POST', cookie: cookieAna, cuerpo: { titulo: 'Cuarto de prueba', precio: 450, propietarioId: 'ajeno' },
  });
  assert.equal(publicado.status, 201);
  const alojamiento = await publicado.json();
  assert.equal(alojamiento.propietarioId, usuarioAna.id);
  assert.deepEqual(await (await api('/alojamientos/mios', { cookie: cookieLuis })).json(), []);
  assert.equal((await api('/alojamientos/' + alojamiento.id, { metodo: 'DELETE', cookie: cookieLuis })).status, 404);

  const guardar = () => api('/favoritos', { metodo: 'POST', cookie: cookieAna, cuerpo: { alojamientoId: alojamiento.id } });
  const resultados = await Promise.all([guardar(), guardar()]);
  assert.deepEqual(resultados.map(item => item.status).sort(), [200, 201]);
  const [favorito] = await (await api('/favoritos', { cookie: cookieAna })).json();
  assert.equal(favorito.alojamientoId, alojamiento.id);
  assert.deepEqual(await (await api('/favoritos', { cookie: cookieLuis })).json(), []);
  assert.equal((await api('/favoritos/' + favorito.id, { metodo: 'DELETE', cookie: cookieLuis })).status, 404);

  const salida = await api('/auth/salir', { metodo: 'POST', cookie: cookieAna });
  assert.equal(salida.status, 204);
  assert.match(salida.headers.get('set-cookie'), /Max-Age=0/);
  assert.equal((await api('/favoritos', { cookie: cookieAna })).status, 401);
  const nuevoAcceso = await entrar(ana);
  const nuevaCookie = nuevoAcceso.headers.get('set-cookie').split(';')[0];
  assert.equal((await (await api('/auth/sesion', { cookie: nuevaCookie })).json()).usuario.name, 'Ana editada');
  assert.deepEqual(await (await api('/favoritos', { cookie: nuevaCookie })).json(), [favorito]);
  assert.ok(JSON.parse(readFileSync(archivoDatos)).usuarios.every(usuario => !('password' in usuario)));
});
