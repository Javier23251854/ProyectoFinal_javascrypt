
import {
  createReadStream,
  existsSync,
  statSync,
} from 'node:fs';

import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { crearApi } from './api.mjs';
import { abrirDatos } from './datos.mjs';

const raiz = fileURLToPath(new URL('../', import.meta.url));

const angular = resolve(
  raiz,
  'SpaceGo-Angular/dist/SpaceGo-Angular/browser'
);

const react = resolve(
  raiz,
  'SpaceGo-React/dist'
);

const uploads = resolve(
  raiz,
  'servidor/uploads'
);

const rutasReact = new Set([
  '/mi-perfil',
  '/administrar-publicaciones',
  '/centro-ayuda',
  '/comparar-alojamientos',
  '/mis-solicitudes',
]);

const formatos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function servirArchivo(req, res, directorio, ruta, opciones = {}) {
  const base = resolve(directorio);
  const archivo = resolve(base, ruta.replace(/^\/+/, ''));

  // Evita acceder a archivos fuera del directorio permitido.
  if (
    !archivo.startsWith(base + sep) ||
    !existsSync(archivo) ||
    !statSync(archivo).isFile()
  ) {
    return false;
  }

  const informacion = statSync(archivo);

  res.writeHead(200, {
    'Content-Type':
      formatos[extname(archivo).toLowerCase()] ??
      'application/octet-stream',

    'Content-Length': informacion.size,

    'Cache-Control':
      opciones.cache ??
      'no-cache',

    'X-Content-Type-Options': 'nosniff',
  });

  if (req.method === 'HEAD') {
    res.end();
  } else {
    createReadStream(archivo)
      .on('error', () => res.destroy())
      .pipe(res);
  }

  return true;
}

export async function crearServidor({
  archivoDatos = resolve(raiz, 'datos/db.json'),
  secure = false,
  directorioUploads = uploads,
} = {}) {
  const datos = await abrirDatos(
    archivoDatos,
    resolve(raiz, 'SpaceGo-Angular/db.json')
  );

  const api = await crearApi(datos, {
    secure,
    directorioUploads,
  });

  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');

      // API de SpaceGo.
      if (url.pathname.startsWith('/api/')) {
        return await api(req, res, url);
      }

      // Solo se permiten solicitudes GET y HEAD para archivos.
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, {
          Allow: 'GET, HEAD',
        }).end();

        return;
      }

      const ruta = decodeURIComponent(url.pathname);

      // Imágenes subidas por los usuarios.
      if (ruta.startsWith('/uploads/')) {
        const encontrada = servirArchivo(
          req,
          res,
          directorioUploads,
          ruta.slice('/uploads'.length),
          {
            cache: 'public, max-age=31536000, immutable',
          }
        );

        if (encontrada) return;

        res.writeHead(404).end('Imagen no encontrada.');
        return;
      }

      // Recursos compilados de React.
      if (ruta.startsWith('/react-assets/')) {
        const encontrada = servirArchivo(
          req,
          res,
          react,
          ruta.slice('/react-assets'.length)
        );

        if (encontrada) return;

        res.writeHead(404).end('Recurso no encontrado.');
        return;
      }

      // Archivos estáticos de Angular.
      if (servirArchivo(req, res, angular, ruta)) {
        return;
      }

      // Imágenes utilizadas por React.
      if (
        ruta.startsWith('/Imagenes/') &&
        servirArchivo(req, res, react, ruta)
      ) {
        return;
      }

      // Determina qué aplicación debe recibir la ruta.
      const paginaReact = rutasReact.has(
        ruta.replace(/\/$/, '')
      );

      // Rutas internas de Angular y React.
      if (!extname(ruta)) {
        const directorio = paginaReact ? react : angular;

        if (
          servirArchivo(
            req,
            res,
            directorio,
            '/index.html'
          )
        ) {
          return;
        }
      }

      res.writeHead(404).end(
        'Página o archivo no encontrado.'
      );
    } catch (error) {
      if (!(error instanceof URIError)) {
        console.error(error);
      }

      if (!res.headersSent) {
        res.writeHead(
          error instanceof URIError ? 400 : 500
        );
      }

      res.end();
    }
  });
}

// Inicio del servidor cuando se ejecuta directamente.
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  if (
    ![angular, react].every(
      directorio => existsSync(resolve(directorio, 'index.html'))
    )
  ) {
    console.error(
      'Compila Angular y React primero con npm run preparar.'
    );

    process.exitCode = 1;
  } else {
    const port = Number(process.env.PORT ?? 3000);

    const servidor = await crearServidor({
      secure: process.env.COOKIE_SECURE === 'true',
    });

    servidor.listen(port, '127.0.0.1', () => {
      console.log(
        'SpaceGo disponible en http://localhost:' + port
      );
    });
  }
}
