"use strict";


/* ==================================================
   REGLAS DEL NEGOCIO
   ================================================== */

const REGLAS_BASE = Object.freeze({

    igvPorcentaje: 18,

    descuentoClienteFrecuente: 5,

    descuentoMaximo: 50,

    envioExpresCentimos: 1500,

    instalacionTecnicaCentimos: 3500,

    envioGratuitoDesdeCentimos: 50000

});



/* ==================================================
   BANDERAS DE OPCIONES
   ================================================== */

const OPCION_CLIENTE_FRECUENTE =
    1 << 0;


const OPCION_ENVIO_EXPRES =
    1 << 1;


const OPCION_INSTALACION =
    1 << 2;



/* ==================================================
   REFERENCIAS DOM
   ================================================== */

const formulario =
    document.querySelector(
        "#formCotizacion"
    );


const inputProducto =
    document.querySelector(
        "#producto"
    );


const inputPrecio =
    document.querySelector(
        "#precio"
    );


const inputCantidad =
    document.querySelector(
        "#cantidad"
    );


const inputDescuento =
    document.querySelector(
        "#descuento"
    );


const inputClienteFrecuente =
    document.querySelector(
        "#clienteFrecuente"
    );


const inputEnvioExpres =
    document.querySelector(
        "#envioExpres"
    );


const inputInstalacion =
    document.querySelector(
        "#instalacionTecnica"
    );


const mensajeError =
    document.querySelector(
        "#mensajeError"
    );


const panelResultado =
    document.querySelector(
        "#panelResultado"
    );


const salidas = {

    id:
        document.querySelector(
            "#idOperacion"
        ),

    producto:
        document.querySelector(
            "#productoResultado"
        ),

    subtotal:
        document.querySelector(
            "#subtotalResultado"
        ),

    descuento:
        document.querySelector(
            "#descuentoResultado"
        ),

    base:
        document.querySelector(
            "#baseResultado"
        ),

    igv:
        document.querySelector(
            "#igvResultado"
        ),

    envio:
        document.querySelector(
            "#envioResultado"
        ),

    instalacion:
        document.querySelector(
            "#instalacionResultado"
        ),

    envioGratuito:
        document.querySelector(
            "#envioGratuitoResultado"
        ),

    total:
        document.querySelector(
            "#totalResultado"
        ),

    banderas:
        document.querySelector(
            "#explicacionBanderas"
        ),

    mensajeEnvioGratuito:
        document.querySelector(
            "#mensajeEnvioGratuito"
        ),

    mensajeMedia:
        document.querySelector(
            "#mensajeMedia"
        )

};



/* ==================================================
   FORMATEADOR DE MONEDA
   ================================================== */

const formateadorMoneda =
    new Intl.NumberFormat(
        "es-PE",
        {
            style: "currency",
            currency: "PEN",
            minimumFractionDigits: 2
        }
    );



/* ==================================================
   BIGINT
   ================================================== */

let correlativo = 0n;


function crearIdOperacion() {

    correlativo += 1n;

    return (
        BigInt(Date.now()) *
        1_000_000n
    ) + correlativo;

}



/* ==================================================
   CONVERTIR PRECIO A CÉNTIMOS
   ================================================== */

function convertirImporteACentimos(
    texto
) {

    const limpio =
        texto.trim();


    const partes =
        limpio.split(".");


    if (
        limpio === "" ||
        partes.length > 2
    ) {

        throw new TypeError(
            "Ingresa un precio válido con punto decimal."
        );

    }


    const parteEntera =
        partes[0];


    const parteDecimal =
        partes[1] ?? "";


    if (
        parteEntera === "" ||
        parteDecimal.length > 2
    ) {

        throw new RangeError(
            "El precio admite como máximo dos decimales."
        );

    }


    const enteros =
        Number(parteEntera);


    const decimales =
        Number(
            parteDecimal.padEnd(
                2,
                "0"
            ) || "0"
        );


    if (
        !Number.isInteger(
            enteros
        ) ||
        enteros < 0 ||

        !Number.isInteger(
            decimales
        ) ||
        decimales < 0 ||
        decimales > 99
    ) {

        throw new TypeError(
            "El precio contiene caracteres o signos no válidos."
        );

    }


    const centimos =
        enteros * 100 +
        decimales;


    if (
        !Number.isSafeInteger(
            centimos
        ) ||
        centimos <= 0
    ) {

        throw new RangeError(
            "El precio debe ser mayor que 0 y estar dentro del rango permitido."
        );

    }


    return centimos;

}



/* ==================================================
   LEER ENTERO
   ================================================== */

function leerEntero(
    input,
    nombre,
    minimo,
    maximo
) {

    const valor =
        Number(input.value);


    if (
        !Number.isInteger(
            valor
        ) ||
        valor < minimo ||
        valor > maximo
    ) {

        throw new RangeError(
            `${nombre} debe ser un entero ` +
            `entre ${minimo} y ${maximo}.`
        );

    }


    return valor;

}



/* ==================================================
   CREAR BANDERAS
   ================================================== */

function crearBanderas({

    clienteFrecuente,

    envioExpres,

    instalacionTecnica

}) {

    let banderas = 0;


    if (
        clienteFrecuente
    ) {

        banderas |=
            OPCION_CLIENTE_FRECUENTE;

    }


    if (
        envioExpres
    ) {

        banderas |=
            OPCION_ENVIO_EXPRES;

    }


    if (
        instalacionTecnica
    ) {

        banderas |=
            OPCION_INSTALACION;

    }


    return banderas;

}



/* ==================================================
   CONSULTAR BANDERA
   ================================================== */

function tieneOpcion(
    banderas,
    opcion
) {

    return (
        (banderas & opcion) !== 0
    );

}



/* ==================================================
   REST
   ================================================== */

function sumarCentimos(
    ...valores
) {

    let total = 0;


    for (
        const valor of valores
    ) {

        total += valor;

    }


    return total;

}



/* ==================================================
   RETO: FUNCIÓN MEDIA
   ================================================== */

function calcularMedia(
    ...valores
) {

    if (
        valores.length === 0
    ) {

        return 0;

    }


    const suma =
        sumarCentimos(
            ...valores
        );


    return suma / valores.length;

}



/* ==================================================
   RETO: CONFIGURACIÓN FLEXIBLE
   ================================================== */

function calcularCotizacion(
    datos,
    opciones = {}
) {

    const reglas = {

        ...REGLAS_BASE,

        ...opciones

    };


    const banderas =
        reglas.banderas ?? 0;



    /* ==============================================
       SUBTOTAL
       ============================================== */

    const subtotalCentimos =
        datos.precioCentimos *
        datos.cantidad;


    if (
        !Number.isSafeInteger(
            subtotalCentimos
        )
    ) {

        throw new RangeError(
            "El subtotal excede el rango de enteros seguros."
        );

    }



    /* ==============================================
       OPCIONES
       ============================================== */

    const esFrecuente =
        tieneOpcion(
            banderas,
            OPCION_CLIENTE_FRECUENTE
        );


    const esExpress =
        tieneOpcion(
            banderas,
            OPCION_ENVIO_EXPRES
        );


    const tieneInstalacion =
        tieneOpcion(
            banderas,
            OPCION_INSTALACION
        );



    /* ==============================================
       DESCUENTO
       ============================================== */

    const descuentoMinimo =
        esFrecuente
            ? reglas.descuentoClienteFrecuente
            : 0;


    const descuentoAplicado =
        Math.min(

            Math.max(
                datos.descuento,
                descuentoMinimo
            ),

            reglas.descuentoMaximo

        );


    const descuentoCentimos =
        Math.round(

            subtotalCentimos *
            descuentoAplicado /
            100

        );



    /* ==============================================
       BASE IMPONIBLE
       ============================================== */

    const baseImponibleCentimos =
        subtotalCentimos -
        descuentoCentimos;



    /* ==============================================
       IGV
       ============================================== */

    const igvCentimos =
        Math.round(

            baseImponibleCentimos *
            reglas.igvPorcentaje /
            100

        );



    /* ==============================================
       ENVÍO EXPRESS
       ============================================== */

    const envioExpressCentimos =
        esExpress
            ? reglas.envioExpresCentimos
            : 0;



    /* ==============================================
       ENVÍO GRATUITO
       ============================================== */

    const aplicaEnvioGratuito =
        baseImponibleCentimos >=
            reglas.envioGratuitoDesdeCentimos &&
        !esExpress;



    const envioCentimos =
        aplicaEnvioGratuito
            ? 0
            : envioExpressCentimos;



    /* ==============================================
       INSTALACIÓN
       ============================================== */

    const instalacionCentimos =
        tieneInstalacion
            ? reglas.instalacionTecnicaCentimos
            : 0;



    /* ==============================================
       TOTAL
       ============================================== */

    const componentes = [

        baseImponibleCentimos,

        igvCentimos,

        envioCentimos,

        instalacionCentimos

    ];


    const totalCentimos =
        sumarCentimos(
            ...componentes
        );



    /* ==============================================
       DISTANCIA AL ENVÍO GRATUITO
       ============================================== */

    const faltaParaEnvioGratuito =

        Math.max(

            0,

            reglas.envioGratuitoDesdeCentimos -
            baseImponibleCentimos

        );



    /* ==============================================
       DEVOLVER RESULTADO
       ============================================== */

    return {

        ...datos,

        banderas,

        descuentoAplicado,

        subtotalCentimos,

        descuentoCentimos,

        baseImponibleCentimos,

        igvCentimos,

        envioExpressCentimos,

        envioCentimos,

        instalacionCentimos,

        aplicaEnvioGratuito,

        faltaParaEnvioGratuito,

        totalCentimos

    };

}



/* ==================================================
   FORMATEAR CÉNTIMOS
   ================================================== */

function formatearCentimos(
    centimos
) {

    return formateadorMoneda.format(
        centimos / 100
    );

}



/* ==================================================
   LIMPIAR ERROR
   ================================================== */

function limpiarError() {

    mensajeError.textContent = "";

    mensajeError.hidden = true;

}



/* ==================================================
   MOSTRAR ERROR
   ================================================== */

function mostrarError(
    mensaje
) {

    mensajeError.textContent =
        mensaje;

    mensajeError.hidden = false;

}



/* ==================================================
   MOSTRAR RESULTADO
   ================================================== */

function mostrarResultado(
    resultado
) {


    /* ==============================================
       ID
       ============================================== */

    salidas.id.value =
        crearIdOperacion()
            .toString();



    /* ==============================================
       PRODUCTO
       ============================================== */

    salidas.producto.textContent =

        `${resultado.producto} × ` +
        `${resultado.cantidad}`;



    /* ==============================================
       IMPORTES
       ============================================== */

    salidas.subtotal.value =
        formatearCentimos(
            resultado.subtotalCentimos
        );


    salidas.descuento.value =

        `-${formatearCentimos(
            resultado.descuentoCentimos
        )} ` +
        `(${resultado.descuentoAplicado} %)`;



    salidas.base.value =
        formatearCentimos(
            resultado.baseImponibleCentimos
        );


    salidas.igv.value =
        formatearCentimos(
            resultado.igvCentimos
        );


    salidas.envio.value =
        formatearCentimos(
            resultado.envioCentimos
        );


    salidas.instalacion.value =
        formatearCentimos(
            resultado.instalacionCentimos
        );


    salidas.envioGratuito.value =
        resultado.aplicaEnvioGratuito
            ? "Sí"
            : "No";


    salidas.total.value =
        formatearCentimos(
            resultado.totalCentimos
        );



    /* ==============================================
       BANDERAS
       ============================================== */

    const frecuente =
        tieneOpcion(
            resultado.banderas,
            OPCION_CLIENTE_FRECUENTE
        );


    const expres =
        tieneOpcion(
            resultado.banderas,
            OPCION_ENVIO_EXPRES
        );


    const instalacion =
        tieneOpcion(
            resultado.banderas,
            OPCION_INSTALACION
        );


    salidas.banderas.textContent =

        `Banderas ${
            resultado.banderas
                .toString(2)
                .padStart(3, "0")
        }: ` +

        `cliente frecuente ${
            frecuente
                ? "sí"
                : "no"
        }; ` +

        `envío express ${
            expres
                ? "sí"
                : "no"
        }; ` +

        `instalación ${
            instalacion
                ? "sí"
                : "no"
        }.`;



    /* ==============================================
       MENSAJE ENVÍO GRATUITO
       ============================================== */

    if (
        resultado.aplicaEnvioGratuito
    ) {

        salidas.mensajeEnvioGratuito.textContent =

            "Se aplicó envío gratuito porque " +
            "la base imponible alcanza S/ 500.00 " +
            "y no seleccionaste express.";

    }

    else if (
        resultado.faltaParaEnvioGratuito > 0 &&
        !expres
    ) {

        salidas.mensajeEnvioGratuito.textContent =

            `Faltan ${
                formatearCentimos(
                    resultado.faltaParaEnvioGratuito
                )
            } para alcanzar el envío gratuito.`;

    }

    else {

        salidas.mensajeEnvioGratuito.textContent =
            expres
                ? "El envío express tiene un costo de S/ 15.00."
                : "";

    }



    /* ==============================================
       MEDIA DIDÁCTICA
       ============================================== */

    const mediaComponentes =
        calcularMedia(
            resultado.baseImponibleCentimos,
            resultado.igvCentimos,
            resultado.envioCentimos,
            resultado.instalacionCentimos
        );


    salidas.mensajeMedia.textContent =

        `Media de los componentes monetarios: ${
            formatearCentimos(
                mediaComponentes
            )
        }.`;



    /* ==============================================
       MOSTRAR
       ============================================== */

    panelResultado.hidden = false;

}



/* ==================================================
   ENVÍO DEL FORMULARIO
   ================================================== */

function manejarEnvio(
    evento
) {

    evento.preventDefault();

    limpiarError();


    try {


        /* ==========================================
           PRODUCTO
           ========================================== */

        const producto =
            inputProducto.value.trim();


        if (
            producto === ""
        ) {

            throw new TypeError(
                "Escribe el nombre del producto o servicio."
            );

        }



        /* ==========================================
           PRECIO
           ========================================== */

        const precioCentimos =
            convertirImporteACentimos(
                inputPrecio.value
            );



        /* ==========================================
           CANTIDAD
           ========================================== */

        const cantidad =
            leerEntero(
                inputCantidad,
                "La cantidad",
                1,
                10000
            );



        /* ==========================================
           DESCUENTO
           ========================================== */

        const descuento =
            leerEntero(
                inputDescuento,
                "El descuento",
                0,
                50
            );



        /* ==========================================
           BANDERAS
           ========================================== */

        const banderas =
            crearBanderas({

                clienteFrecuente:
                    inputClienteFrecuente.checked,

                envioExpres:
                    inputEnvioExpres.checked,

                instalacionTecnica:
                    inputInstalacion.checked

            });



        /* ==========================================
           DATOS
           ========================================== */

        const datos = {

            producto,

            precioCentimos,

            cantidad,

            descuento

        };



        /* ==========================================
           CÁLCULO
           ========================================== */

        const resultado =
            calcularCotizacion(

                datos,

                { banderas }

            );



        /* ==========================================
           MOSTRAR
           ========================================== */

        mostrarResultado(
            resultado
        );


    }

    catch (error) {

        panelResultado.hidden = true;


        mostrarError(

            error instanceof Error
                ? error.message
                : "Ocurrió un error inesperado."

        );

    }

}



/* ==================================================
   REINICIO
   ================================================== */

function manejarReinicio() {

    limpiarError();

    panelResultado.hidden = true;


    queueMicrotask(
        () => {

            inputProducto.focus();

        }
    );

}



/* ==================================================
   EVENTOS
   ================================================== */

formulario.addEventListener(
    "submit",
    manejarEnvio
);


formulario.addEventListener(
    "reset",
    manejarReinicio
);


inputProducto.focus();