// ==========================================
// PDF.JS
// CARTA DE RESULTADOS DE EVALUACIÓN
// Parque Comercial El Tesoro P.H.
// Formato: F-F-33 | Versión: 01
// ==========================================


// ==========================================
// GENERAR PDF DESDE EL HISTORIAL
// ==========================================

function generarPDFISOIndividual(index) {

    const historial = obtenerHistorial();
    const data = historial[index];

    if (!data) {
        mostrarModal("No se encontró la evaluación seleccionada.");
        return;
    }

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
// GENERAR PDF
// ==========================================

function ejecutarGeneracionPDF(data) {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("p", "mm", "a4");

    // --------------------------------------
    // DATOS DE LA EVALUACIÓN
    // --------------------------------------

    const nombre = data.nombre || "";
    const cedula = data.cedula || "";
    const fecha = data.fecha || "";
    const area = data.area || "";
    const proveedor = data.proveedor || "Proveedor";
    const nit = data.nit || "";
    const observaciones = data.observaciones || "";

    // CORRECCIÓN IMPORTANTE:
    // En APP.JS se guarda como "puntaje"
    const puntaje = Number(data.puntaje || 0);

    // CORRECCIÓN IMPORTANTE:
    // Las respuestas se guardan dentro de data.respuestas
    const respuestas = data.respuestas || {};

    const margenIzquierdo = 20;
    const anchoContenido = 170;


    // ======================================
    // FUNCIONES AUXILIARES
    // ======================================

    function textoSeguro(texto) {

        if (texto === null || texto === undefined) {
            return "";
        }

        return String(texto);
    }


    function formatearPuntaje(valor) {

        return Number(valor)
            .toFixed(2)
            .replace(".", ",");
    }


    function obtenerClasificacion(puntaje) {

        if (puntaje >= 4.50) {
            return "EXCELENTE";
        }

        if (puntaje >= 4.00) {
            return "SATISFACTORIO";
        }

        if (puntaje >= 3.50) {
            return "ACEPTABLE CON OPORTUNIDADES DE MEJORA";
        }

        return "REQUIERE PLAN DE MEJORAMIENTO";
    }


    const clasificacion = obtenerClasificacion(puntaje);


    // ======================================
    // ENCABEZADO
    // ======================================

    function dibujarEncabezado() {

        doc.setLineWidth(0.4);

        // Marco principal del encabezado
        doc.rect(20, 15, 170, 25);

        // Divisiones
        doc.line(70, 15, 70, 40);
        doc.line(150, 15, 150, 40);

        doc.line(150, 23.3, 190, 23.3);
        doc.line(150, 31.6, 190, 31.6);


        // ----------------------------------
        // LOGO / IDENTIDAD
        // ----------------------------------

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);

        doc.text("El Tesoro", 45, 25, {
            align: "center"
        });

        doc.setFontSize(7);

        doc.text("PARQUE COMERCIAL", 45, 30, {
            align: "center"
        });


        // ----------------------------------
        // TÍTULO
        // ----------------------------------

        doc.setFontSize(10);

        doc.text(
            "CARTA DE EVALUACIÓN",
            110,
            25,
            {
                align: "center"
            }
        );

        doc.text(
            "DE PROVEEDORES",
            110,
            31,
            {
                align: "center"
            }
        );


        // ----------------------------------
        // CONTROL DEL FORMATO
        // ----------------------------------

        doc.setFontSize(7);

        doc.text(
            "F-F-33",
            170,
            20,
            {
                align: "center"
            }
        );

        doc.text(
            "Versión: 01",
            170,
            28,
            {
                align: "center"
            }
        );

        doc.text(
            "Fecha: 28/12/2022",
            170,
            36,
            {
                align: "center"
            }
        );

    }


    dibujarEncabezado();


    // ======================================
    // TÍTULO PRINCIPAL
    // ======================================

    let y = 52;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    doc.text(
        "CARTA DE RESULTADOS DE EVALUACIÓN",
        105,
        y,
        {
            align: "center"
        }
    );

    doc.text(
        "DE DESEMPEÑO DE PROVEEDORES",
        105,
        y + 6,
        {
            align: "center"
        }
    );


    // ======================================
    // FECHA Y DESTINATARIO
    // ======================================

    y += 20;

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

    doc.text(fechaTexto, margenIzquierdo, y);

    y += 10;

    doc.setFont("helvetica", "bold");

    doc.text("Señores", margenIzquierdo, y);

    y += 6;

    doc.text(
        proveedor.toUpperCase(),
        margenIzquierdo,
        y
    );

    y += 6;

    doc.setFont("helvetica", "normal");

    doc.text(
        `NIT: ${nit}`,
        margenIzquierdo,
        y
    );

    y += 6;

    doc.text(
        "Ciudad",
        margenIzquierdo,
        y
    );


    // ======================================
    // ASUNTO
    // ======================================

    y += 12;

    doc.setFont("helvetica", "bold");

    doc.text(
        "Asunto: Resultado de Evaluación de Desempeño de Proveedores",
        margenIzquierdo,
        y
    );


    // ======================================
    // SALUDO Y PRESENTACIÓN
    // ======================================

    y += 12;

    doc.setFont("helvetica", "normal");

    const parrafo1 =
        "Cordial saludo. Apreciado proveedor, el proceso de Compras e Inventarios del Parque Comercial El Tesoro P.H., con el propósito de promover el mejoramiento continuo y fortalecer las relaciones comerciales con nuestros aliados estratégicos, se permite informar el resultado de la evaluación de desempeño realizada a su organización correspondiente al período evaluado.";

    const textoParrafo1 =
        doc.splitTextToSize(
            parrafo1,
            anchoContenido
        );

    doc.text(
        textoParrafo1,
        margenIzquierdo,
        y
    );

    y += textoParrafo1.length * 5 + 8;


    // ======================================
    // CRITERIOS EVALUADOS
    // ======================================

    const parrafo2 =
        "La evaluación fue efectuada considerando criterios relacionados con:";

    doc.text(
        parrafo2,
        margenIzquierdo,
        y
    );

    y += 7;

    const criteriosTexto = [

        "Tiempo de respuesta y cumplimiento de entregas.",

        "Calidad del producto y/o servicio suministrado.",

        "Condiciones comerciales y competitividad.",

        "Cumplimiento de requisitos legales, contractuales y de Seguridad y Salud en el Trabajo (SST)."

    ];


    criteriosTexto.forEach((criterio) => {

        const linea =
            doc.splitTextToSize(
                "• " + criterio,
                160
            );

        doc.text(
            linea,
            25,
            y
        );

        y += linea.length * 5 + 1;

    });


    // ======================================
    // TABLA DE CRITERIOS
    // ======================================

    y += 5;

    doc.setFont("helvetica", "bold");

    doc.text(
        "Desempeño por categoría",
        margenIzquierdo,
        y
    );


    const resumenCriterios = [];


    if (
        window.criterios &&
        Array.isArray(window.criterios)
    ) {

        window.criterios.forEach((criterio) => {

            let suma = 0;

            let cantidad = 0;


            criterio.preguntas.forEach((pregunta) => {

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

            });


            const promedio =
                cantidad > 0
                    ? (suma / cantidad).toFixed(2)
                    : "N/A";


            let nombreCriterio =
                criterio.nombre;


            if (
                criterio.nombre === "Cumplimiento"
            ) {

                nombreCriterio =
                    "Tiempo de respuesta y cumplimiento de entregas";

            }


            if (
                criterio.nombre === "Calidad"
            ) {

                nombreCriterio =
                    "Calidad del producto y/o servicio suministrado";

            }


            if (
                criterio.nombre === "Condiciones Comerciales"
            ) {

                nombreCriterio =
                    "Condiciones comerciales y competitividad";

            }


            if (
                criterio.nombre === "SST"
            ) {

                nombreCriterio =
                    "Cumplimiento de requisitos legales, contractuales y de SST";

            }


            resumenCriterios.push([

                nombreCriterio,

                `${promedio} / 5,00`

            ]);

        });

    }


    doc.autoTable({

        startY: y + 5,

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

            fillColor: [107, 142, 35],

            textColor: 255,

            fontStyle: "bold",

            halign: "center"

        },

        bodyStyles: {

            fontSize: 8,

            cellPadding: 3

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


    y = doc.lastAutoTable.finalY + 12;


    // ======================================
    // RESULTADO FINAL
    // ======================================

    doc.setFont("helvetica", "bold");

    doc.setFontSize(11);

    doc.text(
        "RESULTADO DE LA EVALUACIÓN",
        105,
        y,
        {
            align: "center"
        }
    );

    y += 12;

    doc.setFontSize(20);

    doc.text(
        `${formatearPuntaje(puntaje)} / 5,00`,
        105,
        y,
        {
            align: "center"
        }
    );

    y += 8;

    doc.setFontSize(11);

    doc.text(
        clasificacion,
        105,
        y,
        {
            align: "center"
        }
    );


    // ======================================
    // OBSERVACIONES
    // ======================================

    y += 14;

    doc.setFontSize(10);

    doc.setFont("helvetica", "bold");

    doc.text(
        "OBSERVACIONES",
        margenIzquierdo,
        y
    );

    y += 7;

    doc.setFont("helvetica", "normal");

    const textoObservaciones =
        doc.splitTextToSize(
            textoSeguro(observaciones),
            anchoContenido
        );

    doc.text(
        textoObservaciones,
        margenIzquierdo,
        y
    );

    y +=
        textoObservaciones.length * 5 +
        15;


    // ======================================
    // CIERRE
    // ======================================

    const cierre =
        "Agradecemos su compromiso y disposición para contribuir al cumplimiento de los estándares de calidad, servicio y cumplimiento requeridos con el Parque Comercial El Tesoro P.H.";

    const textoCierre =
        doc.splitTextToSize(
            cierre,
            anchoContenido
        );

    doc.text(
        textoCierre,
        margenIzquierdo,
        y
    );

    y +=
        textoCierre.length * 5 +
        15;


    // ======================================
    // FIRMA
    // ======================================

    doc.text(
        "Cordialmente,",
        margenIzquierdo,
        y
    );

    y += 22;

    doc.setFont("helvetica", "bold");

    doc.text(
        "María L. Osorno",
        margenIzquierdo,
        y
    );

    y += 5;

    doc.setFont("helvetica", "normal");

    doc.text(
        "Jefe de Compras e Inventarios",
        margenIzquierdo,
        y
    );

    y += 5;

    doc.text(
        "Parque Comercial El Tesoro P.H.",
        margenIzquierdo,
        y
    );


    // ======================================
    // PIE DE PÁGINA
    // ======================================

    const totalPaginas =
        doc.internal.getNumberOfPages();


    for (
        let pagina = 1;
        pagina <= totalPaginas;
        pagina++
    ) {

        doc.setPage(pagina);

        doc.setFontSize(8);

        doc.setFont("helvetica", "normal");

        doc.text(
            `F-F-33 | Versión 01 | Página ${pagina} de ${totalPaginas}`,
            105,
            287,
            {
                align: "center"
            }
        );

    }


    // ======================================
    // GUARDAR ARCHIVO
    // ======================================

    const nombreArchivo =
        proveedor
            .replace(/[^\w\s-]/gi, "")
            .replace(/\s+/g, "_");


    doc.save(
        `Carta_Evaluacion_${nombreArchivo}.pdf`
    );

}
