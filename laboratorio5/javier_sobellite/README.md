# Laboratorio JavaScript Avanzado — Semana 5

## Panel de seguimiento académico

Aplicación modular con HTML, CSS y seis módulos JavaScript. Implementa registro, validación, promedio, estado académico, búsqueda, filtros, ordenamiento, eliminación, JSON y localStorage.

## Estructura

- `index.html`
- `css/styles.css`
- `js/modelos/Estudiante.js`
- `js/datos/datosIniciales.js`
- `js/utilidades/validadores.js`
- `js/servicios/EstudianteService.js`
- `js/app.js`

## Ejecución

Abrir la carpeta completa en Visual Studio Code y ejecutar mediante Live Server o con un servidor local.

Alternativa con Python:

```text
python -m http.server 5500
```

Luego abrir `http://localhost:5500`.

No abrir `index.html` con `file://` porque el proyecto utiliza módulos ES.

## Verificación inicial

Primera apertura:
- 4 estudiantes
- 2 aprobados
- 2 en riesgo
- promedio grupal 12.58

## Matriz de pruebas

| Caso | Resultado esperado | Resultado implementado |
|---|---|---|
| Inicio | 4 estudiantes, 2 aprobados, 2 en riesgo, 12.58 | Cumple |
| Registro válido | Sofía Ramos, 20/18/19, promedio 19.00 | Cumple |
| Código normalizado | `u20260006` se guarda como `U20260006` | Cumple |
| Código inválido | `A123` rechazado | Cumple |
| Duplicado | `U20260001` rechazado | Cumple |
| Nombre Unicode | `Ángela Núñez-Soto` aceptado | Cumple |
| Nota vacía | Rechazada y no convertida en cero | Cumple |
| Frontera 0 | 0/0/0 válido, En riesgo | Cumple |
| Frontera 20 | 20/20/20 válido, Aprobado | Cumple |
| Frontera 12 | 12/12/12 clasifica como Aprobado | Cumple |
| Búsqueda | `ana` encuentra a Ana | Cumple |
| Filtros | Programa + estado se combinan | Cumple |
| Orden | Mayor promedio sin mutar estado fuente | Cumple |
| Eliminar | Fila, métricas, Map y localStorage actualizados | Cumple |
| Exportar | JSON legible en textarea | Cumple |
| JSON roto | Error controlado y estado anterior conservado | Cumple |
| JSON duplicado | Importación rechazada de forma atómica | Cumple |
| Persistencia | Registro reaparece tras recargar | Cumple |

## Reflexión

1. La única fuente de verdad es el arreglo privado de estudiantes. El índice `Map`, programas, promedios, estados, filtros y métricas se derivan de él.

2. El `Map` se reconstruye después de agregar, eliminar o importar para mantener el índice sincronizado exactamente con el arreglo principal.

3. Separar responsabilidades permite probar el modelo, validadores y servicio sin depender del DOM, mientras `app.js` se concentra en eventos y presentación.

4. Normalizar transforma la entrada a una forma consistente; validar determina si esa entrada cumple las reglas de formato, rango, longitud y unicidad.

5. Un error de sintaxis JSON impide que `JSON.parse()` construya el valor. Un JSON válido con estructura incorrecta sí se analiza, pero falla al validar los datos esperados.

6. La importación valida todos los elementos antes de asignarlos al estado para evitar reemplazos parciales.

7. `textContent` inserta los datos como texto y no los interpreta como etiquetas HTML.

8. `localStorage` es síncrono, almacena texto y no está diseñado para información sensible ni grandes volúmenes.

9. La frontera de nota vacía demuestra la diferencia entre un valor ausente y el número cero: la entrada vacía debe rechazarse.

10. `toSorted()` devuelve un arreglo ordenado nuevo, por lo que el arreglo principal no cambia. El servicio conserva el estado fuente y solo presenta una copia ordenada.

## Ajustes mínimos para cumplir la matriz

La guía indica que una nota vacía debe rechazarse y que el programa debe tener entre 3 y 60 caracteres. Se implementan ambas reglas explícitamente en `validadores.js` para que los casos de prueba sean coherentes con los requisitos del laboratorio.
