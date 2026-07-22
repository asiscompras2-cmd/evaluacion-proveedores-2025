// ==========================================
// PDF.JS - CARTA DE RESULTADOS OFICIAL
// Parque Comercial El Tesoro P.H.
// Formato F-F-33 - Versión 01
// ==========================================


//==========================================
// GENERAR PDF DESDE EL HISTORIAL
//==========================================

function generarPDFISOIndividual(index) {

    const historial = obtenerHistorial();
    const data = historial[index];

    if (!data) return;

    ejecutarGeneracionPDF(data);
}


//==========================================
// BOTÓN PDF GENERAL
//==========================================

function generarPDFISO() {

    mostrarModal(
        "Por favor, guarde la evaluación primero y genérela desde la pestaña de Historial."
    );

}


//==========================================
// GENERAR CARTA PDF
//==========================================

function ejecutarGeneracionPDF(data) {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("p", "mm", "a4");

    //======================================
    // DATOS DE LA EVALUACIÓN
    //======================================

    const nombre = data.nombre || "";
    const cedula = data.cedula || "";
    const fecha = data.fecha || "";
    const area = data.area || "";
    const proveedor = data.proveedor || "PROVEEDOR";
    const nit = data.nit || "";

    const observaciones =
        data.observaciones ||
        "No se registraron observaciones.";

    // Compatible con ambos nombres
    const puntaje =
        Number(data.puntaje ?? data.puntaje_final ?? 0);

    //======================================
    // RESPUESTAS
    //======================================

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


    //======================================
    // ENCABEZADO
    //======================================

    const drawHeader = (d) => {

        d.setLineWidth(0.5);

        // Marco general
        d.rect(20, 15, 170, 20);

        // División logo / título
        d.line(70, 15, 70, 35);

        // División información derecha
        d.line(150, 15, 150, 35);

        d.line(150, 21.6, 190, 21.6);
        d.line(150, 28.3, 190, 28.3);


        // Logo institucional textual
        d.setFont("helvetica", "bold");
        d.setFontSize(10);

        d.text("El Tesoro", 30, 24);

        d.setFontSize(7);

        d.text(
            "PARQUE COMERCIAL",
            30,
            28
        );


        // Título central
        d.setFontSize(10);
        d.setFont("helvetica", "bold");

        d.text(
            "CARTA DE EVALUACIÓN DE PROVEEDORES",
            110,
            27,
            {
                align: "center"
            }
        );


        // Información del formato
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


    drawHeader(doc);


    //======================================
    // TÍTULO DE LA CARTA
    //======================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    doc.text(
        "CARTA DE RESULTADOS DE EVALUACIÓN DE DESEMPEÑO DE PROVEEDORES",
        105,
        47,
        {
            align: "center"
        }
    );


    //======================================
    // FECHA
    //======================================

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

    let fechaTexto = "";

    if (!isNaN(fechaObj.getTime())) {

        fechaTexto =
            `Fecha: ${fechaObj.getDate()} de ` +
            `${meses[fechaObj.getMonth()]} de ` +
            `${fechaObj.getFullYear()}`;

    } else {

        fechaTexto = `Fecha: ${fecha}`;

    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
        fechaTexto,
        20,
        57
    );


    //======================================
    // DESTINATARIO
    //======================================

    doc.setFont("helvetica", "bold");

    doc.text(
        "Señores",
        20,
        64
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
        76
    );


    //======================================
    // ASUNTO
    //======================================

    doc.setFont("helvetica", "bold");

    doc.text(
        "Asunto: Resultado de la Evaluación de Desempeño de Proveedores",
        20,
        86
    );


    //======================================
    // INTRODUCCIÓN
    //======================================

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);

    const parrafo1 =
        "Apreciado proveedor, el proceso de Compras e Inventarios del PARQUE COMERCIAL EL TESORO P.H., con el propósito de promover el mejoramiento continuo y fortalecer las relaciones comerciales con nuestros aliados estratégicos, se permite informar el resultado de la evaluación de desempeño realizada a su organización correspondiente al período evaluado.";

    const textoParrafo1 =
        doc.splitTextToSize(
            parrafo1,
            170
        );

    doc.text(
        textoParrafo1,
        20,
        96,
        {
            align: "justify",
            maxWidth: 170
        }
    );


    //======================================
    // EXPLICACIÓN DE LA EVALUACIÓN
    //======================================

    const parrafo2 =
        "La evaluación de desempeño fue realizada mediante la valoración de diferentes criterios relacionados con la gestión y el cumplimiento del proveedor. Cada criterio fue calificado en una escala de uno (1,00) a cinco (5,00), donde una calificación más alta representa un mayor nivel de cumplimiento y desempeño. Los aspectos evaluados fueron:";

    const textoParrafo2 =
        doc.splitTextToSize(
            parrafo2,
            170
        );

    let y = 111;

    doc.text(
        textoParrafo2,
        20,
        y,
        {
            align: "justify",
            maxWidth: 170
        }
    );


    y += textoParrafo2.length * 4.5 + 3;


    //======================================
    // CRITERIOS
    //======================================

    doc.text(
        "• Tiempo de respuesta y cumplimiento de entregas.",
        25,
        y
    );

    y += 5;

    doc.text(
        "• Calidad del producto y/o servicio suministrado.",
        25,
        y
    );

    y += 5;

    doc.text(
        "• Condiciones comerciales y competitividad.",
        25,
        y
    );

    y += 5;

    const criterioSST =
        "• Cumplimiento de requisitos legales, contractuales y de Seguridad y Salud en el Trabajo (SST).";

    const textoSST =
        doc.splitTextToSize(
            criterioSST,
            165
        );

    doc.text(
        textoSST,
        25,
        y
    );

    y += textoSST.length * 4.5 + 3;


    //======================================
    // ESCALA
    //======================================

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);

    doc.text(
        "Escala de calificación: 1 Inaceptable  |  2 Deficiente  |  3 Aceptable  |  4 Bueno  |  5 Excelente.",
        20,
        y
    );

    y += 7;


    //======================================
    // TÍTULO DE CRITERIOS
    //======================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(
        "Criterios evaluados y desempeño por categoría",
        20,
        y
    );

    y += 3;


    //======================================
    // CÁLCULO DE CRITERIOS
    //======================================

    const resumenCriterios = [];


    if (
        window.criterios &&
        Array.isArray(window.criterios)
    ) {

        window.criterios.forEach(c => {

            let suma = 0;
            let count = 0;


            c.preguntas.forEach(p => {

                const valor =
                    respuestas[p.id];

                if (
                    valor !== null &&
                    valor !== undefined &&
                    valor > 0
                ) {

                    suma += valor;
                    count++;

                }

            });


            const promedio =
                count > 0
                    ? (suma / count).toFixed(2)
                    : "N/A";


            let nombreCriterio =
                c.nombre;


            if (
                c.nombre === "Cumplimiento"
            ) {

                nombreCriterio =
                    "Tiempo de respuesta y cumplimiento de entregas";

            }


            if (
                c.nombre === "Calidad"
            ) {

                nombreCriterio =
                    "Calidad del producto y/o servicio suministrado";

            }


            if (
                c.nombre === "Condiciones Comerciales"
            ) {

                nombreCriterio =
                    "Condiciones comerciales y competitividad";

            }


            if (
                c.nombre === "SST"
            ) {

                nombreCriterio =
                    "Cumplimiento de requisitos legales, contractuales y de SST";

            }


            resumenCriterios.push(

                [
                    nombreCriterio,
                    `${promedio} / 5,00`
                ]

            );

        });

    }


    //======================================
    // TABLA DE RESULTADOS
    //======================================

    doc.autoTable({

        startY: y + 2,

        margin: {
            left: 20,
            right: 20
        },

        head: [

            [
                "Categoría de evaluación",
                "Calificación"
            ]

        ],

        body: resumenCriterios,

        theme: "grid",

        headStyles: {

            fillColor: [113, 176, 0],

            textColor: 255,

            fontStyle: "bold",

            halign: "center",

            fontSize: 8.5

        },

        bodyStyles: {

            fontSize: 8.5,

            cellPadding: 2.5

        },

        columnStyles: {

            0: {
                cellWidth: 135
            },

            1: {

                cellWidth: 35,

                halign: "center",

                fontStyle: "bold"

            }

        }

    });


    //======================================
    // RESULTADO FINAL
    //======================================

    y =
        doc.lastAutoTable.finalY + 7;


    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(
        "Calificación final obtenida:",
        20,
        y
    );


    doc.setFontSize(13);

    doc.text(
        `${puntaje.toFixed(2).replace(".", ",")} / 5,00`,
        90,
        y
    );


    //======================================
    // CLASIFICACIÓN
    //======================================

    let clasificacion = "";


    if (puntaje >= 4.5) {

        clasificacion =
            "Excelente";

    } else if (puntaje >= 4.0) {

        clasificacion =
            "Satisfactorio";

    } else if (puntaje >= 3.5) {

        clasificacion =
            "Aceptable con oportunidades de mejora";

    } else {

        clasificacion =
            "Requiere plan de mejoramiento";

    }


    doc.setFontSize(9);

    doc.text(
        `Clasificación: ${clasificacion}`,
        20,
        y + 6
    );


    //======================================
    // OBSERVACIONES
    //======================================

    y += 16;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(
        "Observaciones:",
        20,
        y
    );


    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);


    const splitObs =
        doc.splitTextToSize(
            observaciones,
            170
        );


    doc.text(
        splitObs,
        20,
        y + 6,
        {
            align: "justify",
            maxWidth: 170
        }
    );


    y +=
        splitObs.length * 4.5 + 15;


    //======================================
    // CIERRE
    //======================================

    const cierre =
        "Agradecemos su compromiso y disposición para contribuir al cumplimiento de los estándares de calidad, servicio y cumplimiento requeridos con el Parque Comercial El Tesoro P.H.";

    const textoCierre =
        doc.splitTextToSize(
            cierre,
            170
        );


    doc.text(
        textoCierre,
        20,
        y,
        {
            align: "justify",
            maxWidth: 170
        }
    );


    y +=
        textoCierre.length * 4.5 + 12;


    //======================================
    // FIRMA
    //======================================

    doc.text(
        "Cordialmente,",
        20,
        y
    );


    y += 14;


    doc.setFont("helvetica", "bold");

    doc.text(
        "María L. Osorno",
        20,
        y
    );


    doc.setFont("helvetica", "normal");

    doc.text(
        "JEFE DE COMPRAS E INVENTARIOS",
        20,
        y + 5
    );

    doc.text(
        "PARQUE COMERCIAL EL TESORO P.H.",
        20,
        y + 10
    );


    //======================================
    // PIE DE PÁGINA
    //======================================

    doc.setFontSize(7);
    doc.setTextColor(100);

    doc.text(
        "Documento generado como resultado del proceso de evaluación de desempeño de proveedores.",
        105,
        287,
        {
            align: "center"
        }
    );


    //======================================
    // GUARDAR PDF
    //======================================

    const nombreArchivo =
        proveedor
            .replace(/[^\w\s-]/gi, "")
            .replace(/\s+/g, "_");


    doc.save(
        `Carta_Evaluacion_${nombreArchivo}.pdf`
    );

}
