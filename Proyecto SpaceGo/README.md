# SpaceGo

Aplicación académica de búsqueda y publicación de alojamientos. Angular gestiona el catálogo y el ingreso. React gestiona Mi perfil y las demás páginas de la cuenta. Un servidor Node.js entrega ambas aplicaciones y valida el acceso.

## Cómo ejecutarlo en VS Code

1. Descomprime el ZIP y abre la carpeta `SpaceGo`, que contiene el `package.json` principal.
2. Instala **Node.js 24 LTS, versión 24.15 o posterior de la serie 24**, si aún no lo tienes. Comprueba la versión con `node -v`.
3. Ejecuta lo siguiente desde la terminal de esa carpeta.

```bash
npm run preparar
npm start
```

4. Abre [http://localhost:3000](http://localhost:3000). Crea una cuenta desde **Iniciar sesión → Registrarse**.

`npm run preparar` instala las dependencias de ambos proyectos y los compila. Para volver a ejecutar la aplicación basta con `npm start`. Después de modificar el código, vuelve a compilar con `npm run build`. Si el puerto está ocupado, puedes elegir otro con la variable de entorno `PORT`.

## Comportamiento esperado

| Estado | Navegación principal |
| --- | --- |
| Visitante | Inicio · Buscar alojamiento · Iniciar sesión |
| Cuenta autenticada | Inicio · Buscar alojamiento · Publicar alojamiento · Favoritos · Mi perfil · Cerrar sesión |

Un visitante puede abrir el detalle de un alojamiento desde el catálogo. Si intenta entrar en una ruta privada, SpaceGo lo lleva al formulario y lo devuelve al destino después de iniciar sesión. Desde el perfil se pueden administrar las publicaciones de la cuenta.

Para probar la recuperación de datos, guarda un favorito, actualiza tu nombre en Mi perfil y publica un alojamiento. Recarga, cierra sesión y vuelve a entrar. Los datos se guardan en `datos/db.json`, que se crea automáticamente a partir del catálogo y los datos de ejemplo de `SpaceGo-Angular/db.json`. El servidor guarda las sesiones activas en memoria. Al reiniciarlo tendrás que volver a iniciar sesión. **Recordarme** conserva la sesión hasta siete días mientras el servidor siga activo.

## Qué se implementó

| Tema | Dónde revisarlo | Cómo se usa |
| --- | --- | --- |
| Formularios reactivos | `SpaceGo-Angular/src/app/login/login.ts` | Angular valida correo y contraseña, envía el formulario y muestra los errores de la API. |
| Autenticación y sesión compartida | `servidor/api.mjs` y `servidor/datos.mjs` | El servidor verifica la contraseña con scrypt y emite un identificador de sesión aleatorio en una cookie `HttpOnly`. Al salir invalida la sesión y borra la cookie. |
| Autorización y navegación | `SpaceGo-Angular/src/app/core/sesion.guard.ts`, `app.html` y `SpaceGo-React/src/App.tsx` | Angular protege sus rutas privadas con `canActivate`. React consulta la sesión antes de mostrar sus páginas. La API valida el acceso a sus operaciones privadas. |
| Integración entre frameworks | `servidor/index.mjs` y `SpaceGo-React/src/services/usuarioService.ts` | Ambas aplicaciones usan el mismo origen. React consulta `GET /api/auth/sesion` para recibir la identidad y los datos de perfil de la cuenta activa. |
| Propiedad y persistencia | `servidor/api.mjs` y `SpaceGo-React/src/hooks/usePublicaciones.ts` | El servidor asigna el propietario al publicar y filtra los favoritos por la cuenta de la sesión. React consulta las publicaciones propias para administrarlas. |
| Comparación de alojamientos | `SpaceGo-React/src/pages/CompararAlojamientos.tsx` y `SpaceGo-React/src/services/alojamientoService.ts` | React obtiene los alojamientos activos desde la API compartida y permite seleccionar hasta tres para comparar sus características. La ruta requiere sesión iniciada. |

El servidor está configurado para ejecución local. El formulario de publicación conserva la imagen predeterminada del proyecto original. Los enlaces de acceso social y recuperación de contraseña del formulario original se retiraron porque eran controles sin servicio asociado.

## Verificación automatizada

```bash
npm test
npm test --prefix SpaceGo-Angular -- --watch=false
npm run lint --prefix SpaceGo-React
```

La prueba del servidor crea dos cuentas temporales. Comprueba credenciales incorrectas, rechazo de operaciones privadas sin sesión, aislamiento de favoritos y publicaciones, cierre de sesión y recuperación de datos.
