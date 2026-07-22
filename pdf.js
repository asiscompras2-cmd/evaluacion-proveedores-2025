// ==========================================
// PDF.JS - CARTA DE RESULTADOS OFICIAL
// Parque Comercial El Tesoro P.H.
// Formato: F-F-33
// Versión: 01
// ==========================================


// ==========================================
// GENERAR PDF DESDE EL HISTORIAL
// ==========================================

function generarPDFISOIndividual(index) {

    const historial = obtenerHistorial();
    const data = historial[index];

    if (!data) {
        mostrarModal("No se encontró la evaluación.");
        return;
    }

    ejecutarGeneracionPDF(data);
}


// ==========================================
// BOTÓN PDF GENERAL
// ==========================================

function generarPDFISO() {

    mostrarModal(
        "Por favor, guarde la evaluación primero y genérela desde la pestaña de Historial."
    );

}


// ==========================================
// FUNCIÓN PRINCIPAL
// ==========================================

function ejecutarGeneracionPDF(data) {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("p", "mm", "a4");

    // ==========================================
    // DATOS DE LA EVALUACIÓN
    // ==========================================

    const nombre = data.nombre || "";
    const cedula = data.cedula || "";
    const fecha = data.fecha || "";
    const area = data.area || "";
    const proveedor = data.proveedor || "";
    const nit = data.nit || "";
    const observaciones = data.observaciones || "";

    // IMPORTANTE:
    // En APP.JS el puntaje se guarda como "puntaje"
    const puntaje = Number(data.puntaje || 0);

    // Respuestas guardadas
    const respuestas = data.respuestas || {};

    // ==========================================
    // ENCABEZADO
    // ==========================================

    function dibujarEncabezado(d) {

        d.setDrawColor(130, 130, 130);
        d.setLineWidth(0.35);

        // Marco general
        d.rect(20, 15, 170, 20);

        // Divisiones
        d.line(70, 15, 70, 35);
        d.line(150, 15, 150, 35);

        d.line(150, 21.67, 190, 21.67);
        d.line(150, 28.33, 190, 28.33);

        // ------------------------------
        // LOGO / NOMBRE INSTITUCIONAL
        // ------------------------------

        d.setFont("helvetica", "bold");
        d.setFontSize(10);

        d.text(
            "EL TESORO",
            45,
            23,
            { align: "center" }
        );

        d.setFont("helvetica", "normal");
        d.setFontSize(6.5);

        d.text(
            "PARQUE COMERCIAL",
            45,
            28,
            { align: "center" }
        );

        // ------------------------------
        // TÍTULO CENTRAL
        // ------------------------------

        d.setFont("helvetica", "bold");
        d.setFontSize(9);

        d.text(
            "CARTA DE EVALUACIÓN DE PROVEEDORES",
            110,
            27,
            { align: "center" }
        );

        // ------------------------------
        // CONTROL DEL FORMATO
        // ------------------------------

        d.setFont("helvetica", "normal");
        d.setFontSize(7);

        d.text(
            "F-F-33",
            170,
            19,
            { align: "center" }
        );

        d.text(
            "Versión: 01",
            170,
            25,
            { align: "center" }
        );

        d.text(
            "Fecha: 28/12/2022",
            170,
            32,
            { align: "center" }
        );
    }


    dibujarEncabezado(doc);


    // ==========================================
    // FUNCIÓN PARA TEXTO JUSTIFICADO
    // ==========================================

    function escribirTextoJustificado(
        d,
        texto,
        x,
        y,
        ancho,
        altoLinea = 4.5
    ) {

        const lineas = d.splitTextToSize(texto, ancho);

        lineas.forEach((linea, index) => {

            const ultimaLinea =
                index === lineas.length - 1;

            const palabras = linea.split(" ");

            // La última línea se deja normal
            if (
                ultimaLinea ||
                palabras.length <= 1
            ) {

                d.text(
                    linea,
                    x,
                    y
                );

                y += altoLinea;

                return;
            }

            const anchoTexto =
                d.getTextWidth(linea);

            const espacioBase =
                d.getTextWidth(" ");

            const espacioExtra =
                (
                    ancho -
                    anchoTexto
                ) /
                (palabras.length - 1);

            let posicionX = x;

            palabras.forEach(
                (palabra, i) => {

                    d.text(
                        palabra,
                        posicionX,
                        y
                    );

                    posicionX +=
                        d.getTextWidth(palabra);

                    if (
                        i <
                        palabras.length - 1
                    ) {

                        posicionX +=
                            espacioBase +
                            espacioExtra;
                    }
                }
            );

            y += altoLinea;
        });

        return y;
    }


    // ==========================================
    // TÍTULO PRINCIPAL
    // ==========================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);

    doc.text(
        "CARTA DE RESULTADOS DE EVALUACIÓN DE DESEMPEÑO DE PROVEEDORES",
        105,
        47,
        {
            align: "center",
            maxWidth: 170
        }
    );


    // ==========================================
    // FECHA
    // ==========================================

    const fechaObj = new Date(fecha);

    const meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
    ];

    let fechaTexto = fecha;

    if (
        !isNaN(fechaObj.getTime())
    ) {

        fechaTexto =
            `${fechaObj.getDate()} de ` +
            `${meses[fechaObj.getMonth()]} de ` +
            `${fechaObj.getFullYear()}`;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
        `Fecha: ${fechaTexto}`,
        20,
        58
    );


    // ==========================================
    // DESTINATARIO
    // ==========================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text(
        "Señores",
        20,
        65
    );

    doc.text(
        proveedor.toUpperCase(),
        20,
        70
    );

    doc.setFont("helvetica", "normal");

    doc.text(
        "Ciudad",
        20,
        75
    );


    // ==========================================
    // ASUNTO
    // ==========================================

    doc.setFont("helvetica", "bold");

    doc.text(
        "Asunto: Resultado de la Evaluación de Desempeño de Proveedores",
        20,
        84
    );


    // ==========================================
    // INTRODUCCIÓN
    // ==========================================

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const parrafo1 =
        "Cordial saludo. Apreciado proveedor, el proceso de Compras e Inventarios del PARQUE COMERCIAL EL TESORO P.H., con el propósito de promover el mejoramiento continuo y fortalecer las relaciones comerciales con nuestros aliados estratégicos, se permite informar el resultado de la evaluación de desempeño realizada a su organización correspondiente al período evaluado.";

    let y = 94;

    y = escribirTextoJustificado(
        doc,
        parrafo1,
        20,
        y,
        170,
        4.5
    );


    // ==========================================
    // CRITERIOS EVALUADOS
    // ==========================================

    y += 3;

    const parrafo2 =
        "La evaluación fue efectuada considerando criterios relacionados con el tiempo de respuesta y cumplimiento de entregas, la calidad del producto o servicio suministrado, las condiciones comerciales y competitividad, así como el cumplimiento de requisitos legales, contractuales y de Seguridad y Salud en el Trabajo (SST).";

    y = escribirTextoJustificado(
        doc,
        parrafo2,
        20,
        y,
        170,
        4.5
    );


    // ==========================================
    // TABLA DE RESULTADOS
    // ==========================================

    y += 3;

    const resumenCriterios = [];

    if (
        window.criterios &&
        Array.isArray(window.criterios)
    ) {

        window.criterios.forEach(
            criterio => {

                let suma = 0;
                let cantidad = 0;

                criterio.preguntas.forEach(
                    pregunta => {

                        const valor =
                            Number(
                                respuestas[pregunta.id]
                            );

                        if (
                            !isNaN(valor) &&
                            valor > 0
                        ) {

                            suma += valor;
                            cantidad++;
                        }
                    }
                );

                const promedio =
                    cantidad > 0
                        ? (
                            suma /
                            cantidad
                        ).toFixed(2)
                        : "N/A";


                let nombreCriterio =
                    criterio.nombre;


                if (
                    criterio.nombre ===
                    "Cumplimiento"
                ) {

                    nombreCriterio =
                        "Tiempo de respuesta y cumplimiento de entregas";
                }


                if (
                    criterio.nombre ===
                    "Calidad"
                ) {

                    nombreCriterio =
                        "Calidad del producto o servicio";
                }


                if (
                    criterio.nombre ===
                    "Condiciones Comerciales"
                ) {

                    nombreCriterio =
                        "Condiciones comerciales y competitividad";
                }


                if (
                    criterio.nombre ===
                    "SST"
                ) {

                    nombreCriterio =
                        "Cumplimiento legal, contractual y SST";
                }


                resumenCriterios.push(
                    [
                        nombreCriterio,
                        `${promedio} / 5,00`
                    ]
                );
            }
        );
    }


    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text(
        "RESULTADOS POR CATEGORÍA DE EVALUACIÓN",
        20,
        y
    );


    doc.autoTable({

        startY: y + 3,

        head: [
            [
                "Categoría de evaluación",
                "Calificación"
            ]
        ],

        body: resumenCriterios,

        theme: "grid",

        margin: {
            left: 20,
            right: 20
        },

        tableWidth: 170,

        styles: {

            font: "helvetica",

            fontSize: 8,

            cellPadding: 2.5,

            lineColor: [
                190,
                190,
                190
            ],

            lineWidth: 0.25,

            textColor: [
                50,
                50,
                50
            ]
        },

        headStyles: {

            fontStyle: "bold",

            fontSize: 8,

            textColor: [
                255,
                255,
                255
            ],

            fillColor: [
                85,
                125,
                45
            ],

            halign: "center"
        },

        columnStyles: {

            0: {
                cellWidth: 125
            },

            1: {
                cellWidth: 45,
                halign: "center"
            }
        }
    });


    // ==========================================
    // CALIFICACIÓN FINAL
    // ==========================================

    let yResultado =
        doc.lastAutoTable.finalY + 6;


    doc.setDrawColor(
        170,
        170,
        170
    );

    doc.setLineWidth(
        0.3
    );


    doc.roundedRect(

        20,
        yResultado,

        170,
        16,

        2,
        2
    );


    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(
        9
    );


    doc.text(

        "CALIFICACIÓN FINAL",

        25,
        yResultado + 7
    );


    doc.setFontSize(
        12
    );


    doc.text(

        `${puntaje.toFixed(2)} / 5,00`,

        165,

        yResultado + 8,

        {
            align: "right"
        }
    );


    // ==========================================
    // CLASIFICACIÓN
    // ==========================================

    let clasificacion = "";

    if (
        puntaje >= 4.5
    ) {

        clasificacion =
            "Excelente";

    } else if (
        puntaje >= 4.0
    ) {

        clasificacion =
            "Satisfactorio";

    } else if (
        puntaje >= 3.5
    ) {

        clasificacion =
            "Aceptable con oportunidades de mejora";

    } else {

        clasificacion =
            "Requiere plan de mejoramiento";
    }


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(
        8.5
    );


    doc.text(

        `Clasificación: ${clasificacion}`,

        20,

        yResultado + 22
    );


    // ==========================================
    // OBSERVACIONES
    // ==========================================

    let yObservaciones =
        yResultado + 31;


    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(
        9
    );


    doc.text(

        "OBSERVACIONES",

        20,

        yObservaciones
    );


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(
        8.5
    );


    const textoObservaciones =
        observaciones ||
        "No se registraron observaciones.";


    const lineasObservaciones =
        doc.splitTextToSize(
            textoObservaciones,
            170
        );


    doc.text(

        lineasObservaciones,

        20,

        yObservaciones + 5
    );


    // ==========================================
    // CIERRE
    // ==========================================

    let yCierre =
        yObservaciones +
        5 +
        (
            lineasObservaciones.length *
            4
        ) +
        7;


    const cierre =
        "Agradecemos su compromiso y disposición para contribuir al cumplimiento de los estándares de calidad, servicio y cumplimiento requeridos con el Parque Comercial El Tesoro P.H.";


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(
        8.5
    );


    const lineasCierre =
        doc.splitTextToSize(
            cierre,
            170
        );


    doc.text(

        lineasCierre,

        20,

        yCierre
    );


    // ==========================================
    // FIRMA
    // ==========================================

    let yFirma =
        yCierre +
        (
            lineasCierre.length *
            4
        ) +
        10;


    doc.text(
        "Cordialmente,",
        20,
        yFirma
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        "María L. Osorno",
        20,
        yFirma + 14
    );


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.text(
        "JEFE DE COMPRAS E INVENTARIOS",
        20,
        yFirma + 19
    );


    doc.text(
        "PARQUE COMERCIAL EL TESORO P.H.",
        20,
        yFirma + 24
    );


    // ==========================================
    // PIE DE PÁGINA
    // ==========================================

    doc.setDrawColor(
        180,
        180,
        180
    );

    doc.setLineWidth(
        0.25
    );


    doc.line(
        20,
        285,
        190,
        285
    );


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(
        7
    );


    doc.text(
        "Parque Comercial El Tesoro P.H.",
        20,
        290
    );


    doc.text(
        "F-F-33 | Versión 01",
        190,
        290,
        {
            align: "right"
        }
    );


    // ==========================================
    // NOMBRE DEL ARCHIVO
    // ==========================================

    const nombreArchivo =
        proveedor
            .replace(
                /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g,
                ""
            )
            .replace(
                /\s+/g,
                "_"
            );


    doc.save(
        `Carta_Evaluacion_${nombreArchivo}.pdf`
    );

}
