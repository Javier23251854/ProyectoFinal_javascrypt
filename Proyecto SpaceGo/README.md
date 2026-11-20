# SpaceGo

Aplicación académica de búsqueda y publicación de alojamientos. Angular gestiona Inicio, búsqueda, detalle de alojamientos, publicación, favoritos y acceso. React gestiona Mi perfil, administración de publicaciones, Centro de ayuda, Comparar alojamientos y Mis solicitudes. Un servidor Node.js entrega ambas aplicaciones y comparte la API y la sesión.

## Iniciar SpaceGo en un solo localhost

Requisitos: Node.js 24.15 o posterior de la serie 24, o Node.js 26 o posterior. Comprueba la versión con `node -v`.

1. Abre en VS Code la carpeta principal `Proyecto SpaceGo`, donde se encuentra este `package.json`.
2. La primera vez, o después de eliminar `node_modules`, ejecuta: `npm run preparar`.
3. Para iniciar la aplicación ejecuta: `npm start`. Este comando compila automáticamente Angular y React antes de levantar el servidor integrado.
4. Abre `http://localhost:3000`.

No ejecutes `npm run api`, `ng serve` ni `npm run dev` para esta modalidad integrada. No necesitas abrir tres terminales. Mantén abierta solamente la terminal donde se ejecuta `npm start`.

Cuando modifiques archivos de Angular o React, detén el servidor con Ctrl+C y vuelve a ejecutar `npm start`; las dos aplicaciones se compilan de nuevo antes de iniciar.

## Páginas y navegación

- Angular: Inicio, Buscar alojamiento, detalle, Login/Registro, Publicar alojamiento y Favoritos.
- React: Mi perfil, Administrar publicaciones, Centro de ayuda, Comparar alojamientos y Mis solicitudes.
- Las páginas de React se abren desde los enlaces del footer. El header principal conserva los enlaces originales de SpaceGo.
- Centro de ayuda y Mis solicitudes requieren una sesión iniciada. Las consultas del Centro de ayuda se guardan como solicitudes y aparecen en Mis solicitudes.

## Datos y sesión

El servidor utiliza `datos/db.json` para guardar los usuarios, alojamientos, favoritos y solicitudes. El archivo se crea a partir de `SpaceGo-Angular/db.json` si todavía no existe. No borres `datos/db.json` si deseas conservar los registros que has creado localmente.

La sesión se administra desde el servidor mediante una cookie HttpOnly. Las sesiones se mantienen en memoria: al reiniciar el servidor, los usuarios deben volver a iniciar sesión.

## Pruebas

Desde la carpeta principal puedes ejecutar `npm test` para comprobar autenticación, autorización, publicaciones y favoritos de la API.
