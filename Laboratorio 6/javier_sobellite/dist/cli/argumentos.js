function valorSiguiente(argumentos, indice, opcion) {
    const valor = argumentos[indice + 1];
    if (valor === undefined || valor.startsWith("--")) {
        throw new TypeError(`Falta el valor de ${opcion}.`);
    }
    return valor;
}
export function analizarArgumentos(argumentos) {
    let archivo = "data/estudiantes.json";
    let ayuda = false;
    const filtros = {};
    for (let indice = 0; indice < argumentos.length; indice += 1) {
        const argumento = argumentos[indice];
        if (argumento === undefined)
            continue;
        switch (argumento) {
            case "--archivo":
                archivo = valorSiguiente(argumentos, indice, argumento);
                indice += 1;
                break;
            case "--estado": {
                const estado = valorSiguiente(argumentos, indice, argumento).toLocaleLowerCase("es-PE");
                if (estado !== "aprobado" &&
                    estado !== "riesgo") {
                    throw new TypeError("--estado debe ser aprobado o riesgo.");
                }
                filtros.estado =
                    estado;
                indice += 1;
                break;
            }
            case "--programa":
                filtros.programa = valorSiguiente(argumentos, indice, argumento);
                indice += 1;
                break;
            case "--top": {
                const top = Number(valorSiguiente(argumentos, indice, argumento));
                if (!Number.isInteger(top) || top <= 0) {
                    throw new TypeError("--top debe ser un entero positivo.");
                }
                filtros.top = top;
                indice += 1;
                break;
            }
            case "--ayuda":
            case "-h":
                ayuda = true;
                break;
            default:
                throw new TypeError(`Opción desconocida: ${argumento}.`);
        }
    }
    return {
        archivo,
        ayuda,
        filtros
    };
}
export function obtenerAyuda() {
    return `Analizador académico

Uso:
npm start -- [opciones]

Opciones:
--archivo <ruta>       Archivo JSON de entrada
--estado <valor>       aprobado | riesgo
--programa <texto>     Coincidencia parcial de programa
--top <cantidad>       Limita resultados ya ordenados
--ayuda, -h            Muestra esta ayuda

Ejemplos:
npm start
npm start -- --estado riesgo
npm start -- --programa "Ingeniería de Software" --top 2`;
}
//# sourceMappingURL=argumentos.js.map