# SpaceGo Angular

Esta aplicación Angular es la parte pública de SpaceGo: inicio, búsqueda de alojamientos, detalle, publicación, favoritos y acceso.

Forma parte del proyecto integrado. Para ejecutar SpaceGo completo, abre la carpeta principal `Proyecto SpaceGo` y sigue su `README.md`:

```bash
npm run preparar
npm start
```

Luego ingresa a `http://localhost:3000`. El servidor principal también publica las páginas React y la API compartida. No uses `ng serve` para la ejecución integrada, porque iniciaría Angular en otro puerto y dejaría fuera las páginas React y el servidor compartido.

Para compilar únicamente Angular desde esta carpeta puedes ejecutar `npm run build`.
