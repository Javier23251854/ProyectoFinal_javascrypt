# Laboratorio 7 - Jorge Gutierrez

## Descripción

Implementación del Laboratorio 07 de JavaScript Avanzado utilizando Angular 22 y TypeScript.

El proyecto corresponde a un panel de seguimiento académico que permite visualizar estudiantes, consultar indicadores, filtrar por estado académico y reconocer estudiantes en riesgo.

## Tecnologías utilizadas

- Angular 22
- TypeScript
- Bootstrap 5.3.8
- Signals y computed
- Directivas de Angular
- Control de flujo moderno de Angular
- Vitest para pruebas

## Funcionalidades

- Visualización de 6 estudiantes.
- Resumen de indicadores académicos.
- Filtro de todos los estudiantes.
- Filtro de estudiantes aprobados.
- Filtro de estudiantes en riesgo.
- Estado de lista vacía.
- Restauración de los datos.
- Clasificación automática en Destacado, Aprobado y En riesgo.
- Barra de progreso según el promedio.

## Ejecución

Entrar a la carpeta del proyecto:

    cd "Guia de laboratorio 7/lab-semana-07"

Instalar dependencias:

    npm install

Iniciar la aplicación:

    npm start

La aplicación estará disponible en http://localhost:4200/

## Verificación

Para ejecutar las pruebas:

    npm run test:ci

Para comprobar compilación y pruebas:

    npm run verify
