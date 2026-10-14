# Laboratorio 6 - Desarrollo con Node y TypeScript

**Estudiante:** Jorge Gutierrez
**Curso:** JavaScript Avanzado
**Laboratorio:** Guía de Laboratorio 6

## Descripción

Este laboratorio desarrolla una aplicación de consola utilizando Node.js y TypeScript.

La aplicación implementa un analizador académico que permite cargar información de estudiantes desde un archivo JSON, validar los datos y generar resultados según diferentes filtros.

## Tecnologías utilizadas

- Node.js
- TypeScript
- npm
- Node Test Runner
- ES Modules
- JSON

## Funcionalidades

- Cargar estudiantes desde un archivo JSON.
- Validar los datos de entrada.
- Calcular promedios.
- Determinar el estado académico.
- Filtrar por estado.
- Filtrar por programa.
- Limitar resultados mediante --top.
- Combinar diferentes filtros.
- Validar argumentos de la línea de comandos.
- Manejar errores de archivos y datos inválidos.
- Ejecutar pruebas automáticas.

## Ejecución

Instalar dependencias:

    npm install

Verificar tipos:

    npm run typecheck

Construir el proyecto:

    npm run build

Ejecutar la aplicación:

    npm start

Ejecutar las pruebas:

    npm test

Ejecutar la verificación completa:

    npm run verify

## Ejemplos

    npm start

    npm start -- --estado riesgo

    npm start -- --programa "Ingeniería de Software"

    npm start -- --programa "Ingeniería de Software" --top 2

## Pruebas

El proyecto cuenta con pruebas automáticas utilizando Node Test Runner.

Resultado final de la verificación:

- TypeScript: correcto
- Build: correcto
- Pruebas: 4/4 aprobadas
- Fallos: 0

## Estructura

```text
Jorge_Gutierrez/
├── data/
│   └── estudiantes.json
├── src/
│   ├── cli/
│   ├── infraestructura/
│   ├── modelos/
│   ├── pruebas/
│   ├── servicios/
│   ├── utilidades/
│   ├── tipos.ts
│   └── index.ts
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```
