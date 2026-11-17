
import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const talleresIniciales = [
  {
    id: 'react',
    title: 'Interfaces con React',
    seats: 2,
  },
  {
    id: 'node',
    title: 'Servicios con Node.js',
    seats: 3,
  },
  {
    id: 'ux',
    title: 'Diseño de interfaces UX',
    seats: 4,
  },
];

function enviarJSON(res, status, data, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });

  res.end(JSON.stringify(data));
}

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function leerBody(req) {
  let contenido = '';

  for await (const fragmento of req) {
    contenido += fragmento;
  }

  try {
    return JSON.parse(contenido);
  } catch {
    return null;
  }
}

export function createLabServer() {
  const talleres = talleresIniciales.map((taller) => ({ ...taller }));

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const { pathname } = url;

    try {
      if (pathname === '/api/talleres' && req.method === 'GET') {
        const modo = url.searchParams.get('modo') || 'normal';

        if (modo === 'vacio') {
          return enviarJSON(res, 200, []);
        }

        if (modo === 'lento') {
          await esperar(1600);
        }

        if (modo === 'timeout') {
          await esperar(4700);
        }

        if (modo === 'error') {
          return enviarJSON(res, 503, {
            message: 'Fallo simulado.',
          });
        }

        if (modo === 'invalido') {
          return enviarJSON(res, 200, [
            {
              id: 'react',
              seats: 'dos',
            },
          ]);
        }

        return enviarJSON(res, 200, talleres);
      }

      if (pathname === '/api/reservas') {
        if (req.method !== 'POST') {
          return enviarJSON(
            res,
            405,
            { message: 'Método no permitido.' },
            { Allow: 'POST' },
          );
        }

        const contentType = req.headers['content-type'] || '';

        if (!contentType.includes('application/json')) {
          return enviarJSON(res, 415, {
            message: 'Tipo de contenido no admitido.',
          });
        }

        const body = await leerBody(req);

        if (body === null) {
          return enviarJSON(res, 400, {
            message: 'El JSON enviado no es válido.',
          });
        }

        const { workshopId, seats } = body;

        if (
          typeof workshopId !== 'string' ||
          !Number.isInteger(seats) ||
          seats < 1 ||
          seats > 4
        ) {
          return enviarJSON(res, 422, {
            message: 'Los datos de la reserva no son válidos.',
          });
        }

        const taller = talleres.find(
          (item) => item.id === workshopId,
        );

        if (!taller) {
          return enviarJSON(res, 404, {
            message: 'Taller no encontrado.',
          });
        }

        if (taller.seats < seats) {
          return enviarJSON(res, 409, {
            message: 'Cupos insuficientes.',
          });
        }

        taller.seats -= seats;

        const recibo = {
          id: randomUUID(),
          workshopId,
          seats,
          remaining: taller.seats,
        };

        return enviarJSON(res, 201, recibo);
      }

      return enviarJSON(res, 404, {
        message: 'Ruta no encontrada.',
      });
    } catch (error) {
      console.error('Error en el servidor:', error);

      return enviarJSON(res, 500, {
        message: 'Error interno del servidor.',
      });
    }
  });
}

const ejecutadoDirectamente =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (ejecutadoDirectamente) {
  const PORT = Number(process.env.PORT) || 3001;
  const server = createLabServer();

  server.listen(PORT, '127.0.0.1', () => {
    const address = server.address();
    console.log(
      `API disponible en http://127.0.0.1:${address.port}`,
    );
  });
}
