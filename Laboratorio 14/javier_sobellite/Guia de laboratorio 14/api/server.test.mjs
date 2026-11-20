
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createLabServer } from './server.mjs';

let server;
let baseURL;

before(async () => {
  server = createLabServer();

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  baseURL = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
});

test('GET /api/talleres devuelve los tres talleres', async () => {
  const response = await fetch(`${baseURL}/api/talleres`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.length, 3);
  assert.deepEqual(
    data.map((taller) => taller.id),
    ['react', 'node', 'ux'],
  );
  assert.equal(data[0].title, 'Interfaces con React');
  assert.equal(typeof data[0].seats, 'number');
});

test('GET /api/talleres devuelve una lista vacía', async () => {
  const response = await fetch(
    `${baseURL}/api/talleres?modo=vacio`,
  );
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(data, []);
});

test('GET /api/talleres devuelve datos inválidos', async () => {
  const response = await fetch(
    `${baseURL}/api/talleres?modo=invalido`,
  );
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data[0].seats, 'dos');
  assert.equal(data[0].title, undefined);
});

test('GET /api/talleres devuelve error HTTP 503', async () => {
  const response = await fetch(
    `${baseURL}/api/talleres?modo=error`,
  );
  const data = await response.json();

  assert.equal(response.status, 503);
  assert.equal(data.message, 'Fallo simulado.');
});

test('POST /api/reservas registra una reserva correctamente', async () => {
  const response = await fetch(`${baseURL}/api/reservas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workshopId: 'react',
      seats: 1,
    }),
  });

  const data = await response.json();

  assert.equal(response.status, 201);
  assert.ok(data.id);
  assert.equal(data.workshopId, 'react');
  assert.equal(data.seats, 1);
  assert.equal(data.remaining, 1);
});

test('POST /api/reservas devuelve 409 si no hay cupos suficientes', async () => {
  const response = await fetch(`${baseURL}/api/reservas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workshopId: 'node',
      seats: 4,
    }),
  });

  const data = await response.json();

  assert.equal(response.status, 409);
  assert.equal(data.message, 'Cupos insuficientes.');

  const catalogResponse = await fetch(
    `${baseURL}/api/talleres`,
  );
  const catalog = await catalogResponse.json();

  assert.equal(
    catalog.find((taller) => taller.id === 'node').seats,
    3,
  );
});

test('POST /api/reservas devuelve 422 si los datos son inválidos', async () => {
  const response = await fetch(`${baseURL}/api/reservas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workshopId: 'react',
      seats: 'dos',
    }),
  });

  const data = await response.json();

  assert.equal(response.status, 422);
  assert.equal(
    data.message,
    'Los datos de la reserva no son válidos.',
  );
});

test('POST /api/reservas devuelve 404 si el taller no existe', async () => {
  const response = await fetch(`${baseURL}/api/reservas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workshopId: 'python',
      seats: 1,
    }),
  });

  const data = await response.json();

  assert.equal(response.status, 404);
  assert.equal(data.message, 'Taller no encontrado.');
});

test('Una ruta desconocida devuelve 404', async () => {
  const response = await fetch(`${baseURL}/api/desconocida`);
  const data = await response.json();

  assert.equal(response.status, 404);
  assert.equal(data.message, 'Ruta no encontrada.');
});
