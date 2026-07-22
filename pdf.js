// ==========================================
// PDF.JS - CARTA DE RESULTADOS OFICIAL
// Parque Comercial El Tesoro P.H.
// Formato: F-F-33
// ==========================================


// ==========================================
// GENERAR PDF DESDE HISTORIAL
// ==========================================

function generarPDFISOIndividual(index) {

    const historial = obtenerHistorial();
    const data = historial[index];

    if (!data) return;

    ejecutarGeneracionPDF(data);

}


// ==========================================
// BOTÓN PDF PRINCIPAL
// ==========================================

function generarPDFISO() {

    mostrarModal(
        "Por favor, guarde la evaluación primero y genérela desde la pestaña de Historial."
    );

}


// ==========================================
// EJECUTAR GENERACIÓN DEL PDF
// ==========================================

function ejecutarGeneracionPDF(data) {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF(
        "p",
        "mm",
        "a4"
    );


    // ==========================================
    // DATOS DE LA EVALUACIÓN
    // ==========================================

    const {

        nombre,
        cedula,
        fecha,
        area,
        proveedor,
        nit,
        puntaje_final,
        observaciones

    } = data;


    // ==========================================
    // RESPUESTAS
    // ==========================================

    const respuestas = {

        P1: Number(data.p1 || 0),
        P2: Number(data.p2 || 0),
        P3: Number(data.p3 || 0),
        P4: Number(data.p4 || 0),
        P5: Number(data.p5 || 0),
        P6: Number(data.p6 || 0),
        P7: Number(data.p7 || 0),
        P8: Number(data.p8 || 0),
        P9: Number(data.p9 || 0),
        P10: Number(data.p10 || 0),
        P11: Number(data.p11 || 0),
        P12: Number(data.p12 || 0)

    };


    // ==========================================
    // ENCABEZADO F-F-33
    // ==========================================

    const drawHeader = (d) => {


        // Marco principal
        d.setLineWidth(0.5);

        d.setDrawColor(
            100,
            100,
            100
        );

        d.rect(
            20,
            15,
            170,
            20
        );


        // Divisiones verticales

        d.line(
            70,
            15,
            70,
            35
        );

        d.line(
            150,
            15,
            150,
            35
        );


        // Divisiones del bloque derecho

        d.line(
            150,
            21.6,
            190,
            21.6
        );

        d.line(
            150,
            28.3,
            190,
            28.3
        );


        // ==========================================
        // LOGO OFICIAL
        // ==========================================

        const logo = new Image();

        logo.src = "logo.png";


        // Intentar cargar el logo
        // El logo reemplaza el texto
        // "El Tesoro / PARQUE COMERCIAL"

        try {

            d.addImage(

                logo,
                "PNG",

                24,
                17,

                42,
                16

            );

        } catch (error) {

            console.warn(
                "No se pudo cargar el logo:",
                error
            );

            // Respaldo de texto
            d.setFontSize(10);

            d.setFont(
                "helvetica",
                "bold"
            );

            d.text(
                "El Tesoro",
                30,
                24
            );

            d.setFontSize(7);

            d.text(
                "PARQUE COMERCIAL",
                30,
                28
            );

        }


        // ==========================================
        // TÍTULO DEL FORMATO
        // ==========================================

        d.setFontSize(11);

        d.setFont(
            "helvetica",
            "bold"
        );

        d.setTextColor(
            0,
            0,
            0
        );

        d.text(

            "CARTA DE EVALUACIÓN DE PROVEEDORES",

            110,
            27,

            {
                align: "center"
            }

        );


        // ==========================================
        // INFORMACIÓN DEL FORMATO
        // ==========================================

        d.setFontSize(8);


        d.text(

            "F-F-33",

            170,
            19,

            {
                align: "center"
            }

        );


        d.text(

            "Versión: 01",

            170,
            25,

            {
                align: "center"
            }

        );


        d.text(

            "Fecha: 28/12/2022",

            170,
            32,

            {
                align: "center"
            }

        );

    };


    // Dibujar encabezado

    drawHeader(doc);


    // ==========================================
    // TÍTULO PRINCIPAL
    // ==========================================

    doc.setFontSize(11);

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(

        "CARTA DE RESULTADOS DE EVALUACIÓN DE DESEMPEÑO DE PROVEEDORES",

        105,
        50,

        {
            align: "center"
        }

    );


    // ==========================================
    // FECHA
    // ==========================================

    doc.setFont(
        "helvetica",
        "normal"
    );

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


    const fechaTexto =

        `Fecha: ${fechaObj.getDate()} de ` +
        `${meses[fechaObj.getMonth()]} de ` +
        `${fechaObj.getFullYear()}`;


    doc.text(

        fechaTexto,

        20,
        65

    );


    // ==========================================
    // DESTINATARIO
    // ==========================================

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(
        "Señores",
        20,
        70
    );


    doc.text(

        String(proveedor || "").toUpperCase(),

        20,
        75

    );


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        "Ciudad",
        20,
        80
    );


    // ==========================================
    // ASUNTO
    // ==========================================

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(

        "Asunto: Resultado de la Evaluación de Desempeño de Proveedores",

        20,
        90

    );


    // ==========================================
    // INTRODUCCIÓN
    // ==========================================

    doc.setFont(
        "helvetica",
        "normal"
    );


    const parrafo1 =

        "Apreciado proveedor, el proceso de Compras e Inventarios del PARQUE COMERCIAL EL TESORO P.H., con el propósito de promover el mejoramiento continuo y fortalecer las relaciones comerciales con nuestros aliados estratégicos, se permite informar el resultado de la evaluación de desempeño realizada a su organización correspondiente al período evaluado.";


    const textoParrafo1 = doc.splitTextToSize(

        parrafo1,

        170

    );


    doc.text(

        textoParrafo1,

        20,
        100

    );


    // ==========================================
    // EXPLICACIÓN DE LA EVALUACIÓN
    // ==========================================

    const parrafo2 =

        "La evaluación fue realizada mediante una escala de calificación de uno (1) a cinco (5), donde 1 corresponde a un desempeño inaceptable y 5 corresponde a un desempeño excelente. Los criterios evaluados fueron:";


    doc.text(

        doc.splitTextToSize(

            parrafo2,

            170

        ),

        20,
        120

    );


    // ==========================================
    // CRITERIOS
    // ==========================================

    doc.text(

        "• Tiempo de respuesta y cumplimiento de entregas.",

        25,
        130

    );


    doc.text(

        "• Calidad del producto y/o servicio suministrado.",

        25,
        136

    );


    doc.text(

        "• Condiciones comerciales y competitividad.",

        25,
        142

    );


    doc.text(

        "• Cumplimiento de requisitos legales, contractuales y de SST.",

        25,
        148

    );


    // ==========================================
    // TÍTULO DE TABLA
    // ==========================================

    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(

        "Criterios evaluados y desempeño por categoría",

        20,
        158

    );


    // ==========================================
    // CÁLCULO DE CRITERIOS
    // ==========================================

    const resumenCriterios = [];


    if (

        respuestas &&
        window.criterios

    ) {


        window.criterios.forEach(

            criterio => {


                let suma = 0;

                let count = 0;


                criterio.preguntas.forEach(

                    pregunta => {


                        const valor =

                            respuestas[pregunta.id];


                        if (

                            valor !== null &&
                            valor !== undefined &&
                            valor !== 0

                        ) {

                            suma += valor;

                            count++;

                        }

                    }

                );


                const promedio =

                    count > 0

                        ? (suma / count).toFixed(2)

                        : "N/A";


                let nombreCriterio =

                    criterio.nombre ||
                    criterio.criterio;


                if (

                    nombreCriterio ===

                    "Cumplimiento"

                ) {

                    nombreCriterio =

                        "Tiempo de respuesta y cumplimiento de entregas";

                }


                if (

                    nombreCriterio ===

                    "Calidad"

                ) {

                    nombreCriterio =

                        "Calidad del producto y/o servicio suministrado";

                }


                if (

                    nombreCriterio ===

                    "Condiciones Comerciales"

                ) {

                    nombreCriterio =

                        "Condiciones comerciales y competitividad";

                }


                if (

                    nombreCriterio ===

                    "SST"

                ) {

                    nombreCriterio =

                        "Cumplimiento de requisitos legales, contractuales y de SST";

                }


                resumenCriterios.push([

                    nombreCriterio,

                    `${promedio} / 5.0`

                ]);

            }

        );

    }


    // ==========================================
    // TABLA DE RESULTADOS
    // ==========================================

    doc.autoTable({

        startY: 163,

        head: [

            [

                "Categoría de Evaluación",

                "Calificación"

            ]

        ],

        body: resumenCriterios,

        theme: "striped",


        headStyles: {

            fillColor: [

                113,
                176,
                0

            ],

            textColor: 255,

            fontStyle: "bold"

        },


        styles: {

            fontSize: 8.5,

            cellPadding: 2.5,

            lineColor: [

                210,
                210,
                210

            ],

            lineWidth: 0.2

        },


        columnStyles: {

            0: {

                cellWidth: 135

            },

            1: {

                cellWidth: 35,

                halign: "center"

            }

        }

    });


    // ==========================================
    // RESULTADO
    // ==========================================

    let y =

        doc.lastAutoTable.finalY + 7;


    doc.setFontSize(10);

    doc.setFont(

        "helvetica",
        "bold"

    );


    doc.text(

        "Resultado obtenido",

        20,
        y

    );


    doc.text(

        "Calificación Final",

        20,
        y + 7

    );


    doc.setFontSize(14);


    const puntaje = Number(

        puntaje_final || 0

    );


    doc.text(

        `${puntaje.toFixed(2)} / 5,00`,

        20,
        y + 15

    );


    // ==========================================
    // OBSERVACIONES
    // ==========================================

    y =

        doc.lastAutoTable.finalY + 5;


    doc.setFontSize(10);

    doc.setFont(

        "helvetica",
        "bold"

    );


    doc.text(

        "Observaciones Generales:",

        20,
        y

    );


    doc.setFont(

        "helvetica",
        "normal"

    );


    doc.setFontSize(9);


    const textoObservaciones =

        observaciones ||

        "Sin observaciones adicionales.";


    const splitObs =

        doc.splitTextToSize(

            textoObservaciones,

            170

        );


    doc.text(

        splitObs,

        20,
        y + 6

    );


    // ==========================================
    // CIERRE
    // ==========================================

    y +=

        (splitObs.length * 4.5) + 14;


    if (

        y > 240

    ) {


        doc.addPage();


        drawHeader(doc);


        y = 50;

    }


    doc.setFontSize(9.5);


    const cierre =

        "Confiamos en que esta retroalimentación contribuya al mejoramiento continuo de sus procesos y al cumplimiento de los estándares de calidad, servicio y oportunidad requeridos por el Parque Comercial El Tesoro P.H.";


    doc.text(

        doc.splitTextToSize(

            cierre,

            170

        ),

        20,
        y

    );


    // ==========================================
    // FIRMA
    // ==========================================

    doc.text(

        "Cordialmente,",

        20,
        y + 18

    );


    doc.setFont(

        "helvetica",
        "bold"

    );


    doc.text(

        "María L. Osorno",

        20,
        y + 30

    );


    doc.text(

        "Jefe de Compras e Inventarios",

        20,
        y + 35

    );


    doc.text(

        "Parque Comercial El Tesoro P.H.",

        20,
        y + 40

    );


    // ==========================================
    // GUARDAR PDF
    // ==========================================

    const nombreArchivo =

        String(

            proveedor ||

            "Proveedor"

        )

        .replace(

            /\s+/g,

            "_"

        );


    doc.save(

        `Carta_Evaluacion_${nombreArchivo}.pdf`

    );

}
