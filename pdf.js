// ==========================================
// PDF.JS - CARTA DE RESULTADOS OFICIAL (OPTIMIZADO)
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
    const GRIS_OSCURO = [70, 70, 70];
    const GRIS = [140, 140, 140];
    const GRIS_CLARO = [245, 245, 245];

    const nombre = data.nombre || "";
    const cedula = data.cedula || "";
    const fecha = data.fecha || "";
    const area = data.area || "";
    const proveedor = data.proveedor || "PROVEEDOR";
    const nit = data.nit || "";

    const observaciones =
        data.observaciones ||
        "No se registraron observaciones.";

    const puntaje =
    Number(data.puntaje ?? data.puntaje_final ?? 0);

    //-------------------------------------------------
    // ENCABEZADO CORPORATIVO CON LOGO
    //-------------------------------------------------

    function drawHeader(){

        // Franja superior
        doc.setFillColor(...GRIS_OSCURO);
        doc.rect(0,0,210,5,"F");

        // Marco
        doc.setDrawColor(180);
        doc.rect(15,8,180,22);

        // divisiones
       doc.setDrawColor(170);
       doc.setFillColor(245,245,245);

        // ======== LOGO ========
        // Convertir imagen a base64 o usar URL
        // Si tienes el logo en base64, reemplaza logoBase64 con tu valor
        
        try {

    const logoURL = "/logo.png";

    doc.addImage(
        logoURL,
        "PNG",
        18,
        10,
        28,
        16
    );

} catch (e) {

    console.warn("No se pudo cargar el logo:", e);

}
           

        // Título
        doc.setFontSize(10);
        doc.setTextColor(0);

        doc.text(
            "CARTA DE EVALUACIÓN\nDE DESEMPEÑO DE PROVEEDORES",
            108,
            16,
            {align:"center"}
        );

        // ISO
        doc.setFontSize(7);

        doc.text("Código", 166, 14);
        doc.text("F-F-33", 184, 14, {align:"center"});
        doc.line(160,16,195,16);

        doc.text("Versión", 166, 21);
        doc.text("01", 184, 21, {align:"center"});
        doc.line(160,23,195,23);

        doc.text("Fecha", 166, 28);
        doc.text("28/12/2022", 184, 28, {align:"center"});

    }

    drawHeader();

    //-------------------------------------------------
    // TITULO
    //-------------------------------------------------

    doc.setFont("times","bold");
    doc.setFontSize(13);

    doc.text(
        "RESULTADO DE LA EVALUACIÓN",
        105,
        42,
        {align:"center"}
    );

    //-------------------------------------------------
    // FECHA
    //-------------------------------------------------

    const fechaObj = new Date(fecha);

    const meses = [
        "enero","febrero","marzo","abril","mayo","junio",
        "julio","agosto","septiembre","octubre","noviembre","diciembre"
    ];

    let fechaTexto="";

    if(!isNaN(fechaObj)){

        fechaTexto=
        `${fechaObj.getDate()} de ${meses[fechaObj.getMonth()]} de ${fechaObj.getFullYear()}`;

    }else{

        fechaTexto=fecha;

    }

    doc.setFontSize(9);

    doc.text(
        `Fecha: ${fechaTexto}`,
        20,
        50
    );

    //-------------------------------------------------
    // DESTINATARIO (COMPACTO)
    //-------------------------------------------------

    doc.setFont("times","bold");
    doc.setFontSize(9);

    doc.text("Señores", 20, 57);

    doc.setFontSize(10);

    doc.text(
        proveedor.toUpperCase(),
        20,
        62
    );

    doc.setFont("times","normal");
    doc.setFontSize(8);

    doc.text("Ciudad", 20, 67);

    //-------------------------------------------------
    // ASUNTO
    //-------------------------------------------------

    doc.setFont("times","bold");
    doc.setFontSize(9);

    doc.text(
        "Asunto: Resultado de la Evaluación de Desempeño",
        20,
        74
    );

    //-------------------------------------------------
    // INTRODUCCIÓN (REDUCIDA)
    //-------------------------------------------------

    doc.setFont("times","normal");
    doc.setFontSize(9.5);

    const intro =
    "Apreciado proveedor, el proceso de Compras e Inventarios del Parque Comercial El Tesoro P.H., con el propósito de promover el mejoramiento continuo, se permite informar el resultado de la evaluación de desempeño realizada.";

    const textoIntro=
        doc.splitTextToSize(
            intro,
            170
        );

    let y = 80;

    doc.text(
        textoIntro,
        20,
        y,
        {
            align:"justify",
            maxWidth:170,
            lineHeightFactor: 1.3
        }
    );

    y += textoIntro.length * 5 + 4;

    //======================================
    // EXPLICACIÓN DE LA EVALUACIÓN (REDUCIDA)
    //======================================

    const parrafoResultado =
        "La evaluación fue realizada mediante la valoración de criterios relacionados con gestión y cumplimiento. Cada criterio fue calificado de 1 a 5, donde una calificación más alta representa mayor nivel de cumplimiento. Los aspectos evaluados fueron:";

    const textoResultadoSplit =
        doc.splitTextToSize(
            parrafoResultado,
            170
        );

    doc.setFont("times","normal");
    doc.setFontSize(9.5);

    doc.text(
        textoResultadoSplit,
        20,
        y,
        {
            align: "justify",
            maxWidth: 170,
            lineHeightFactor: 1.3
        }
    );

    y += textoResultadoSplit.length * 5 + 3;

    //--------------------------------------
    // MENSAJE
    //--------------------------------------

    doc.setFont("times","normal");
    doc.setFontSize(9.5);

    const mensaje = "Como resultado del proceso de evaluación, su organización obtuvo la siguiente calificación final:";

    //======================================
// RESULTADO POR CRITERIO
//======================================

doc.setFont("times","bold");
doc.setFontSize(10);

doc.text(
    "RESULTADO POR CRITERIO",
    105,
    y,
    { align: "center" }
);

y += 4;

const filasCriterios = [];

criterios.forEach(criterio => {

    let suma = 0;
    let cantidad = 0;

    criterio.preguntas.forEach(pregunta => {

        let valor = 0;

        if (data.respuestas) {
            valor = Number(data.respuestas[pregunta.id] || 0);
        } else {
            valor = Number(data["p" + pregunta.id] || 0);
        }

        suma += valor;
        cantidad++;

    });

    filasCriterios.push([
        criterio.criterio,
        (suma / cantidad).toFixed(1).replace(".", ",")
    ]);

});

doc.autoTable({

    startY: y,

    margin: {
        left: 35,
        right: 35
    },

    tableWidth: 140,

    head: [["CRITERIO", "RESULTADO"]],

    body: filasCriterios,

    theme: "grid",

    headStyles: {
        fillColor: [90,90,90],
        textColor: 255,
        halign: "center",
        fontStyle: "bold"
    },

    styles: {
        font: "times",
        fontSize: 8,
        cellPadding: 2,
        lineColor: [180,180,180]
    },

    columnStyles: {
        0: { cellWidth: 105 },
        1: { cellWidth: 35, halign: "center" }
    }

});

y = doc.lastAutoTable.finalY + 8;
    const splitMensaje = doc.splitTextToSize(mensaje, 170);

    doc.text(
        splitMensaje,
        20,
        y,
        {
            align:"justify",
            maxWidth:170,
            lineHeightFactor: 1.3
        }
    );

    y += 8;

    //=====================================================
    // CAJA RESULTADO (REDUCIDA)
    //=====================================================

doc.setDrawColor(90,90,90);
doc.setFillColor(245,245,245);

    doc.roundedRect(
        40,
        y,
        130,
        28,
        3,
        3,
        "FD"
    );

    doc.setFontSize(9);
    doc.setTextColor(100);

    doc.text(
        "RESULTADO DE LA EVALUACIÓN",
        105,
        y+5,
        {align:"center"}
    );

    doc.setFontSize(20);
    doc.setTextColor(60,60,60);
    doc.setFont("times","bold");

    doc.text(
        `${puntaje.toFixed(1).replace(".",",")} / 5,0`,
        105,
        y+17,
        {align:"center"}
    );

    //=========================================
    // CLASIFICACIÓN
    //=========================================

    let clasificacion="";

    if(puntaje>=4.5){
        clasificacion="EXCELENTE";
    }else if(puntaje>=4){
        clasificacion="SATISFACTORIO";
    }else if(puntaje>=3.5){
        clasificacion="ACEPTABLE";
    }else{
        clasificacion="REQUIERE PLAN DE MEJORAMIENTO";
    }

    doc.setFontSize(10);
    doc.setTextColor(0);

    doc.text(
        clasificacion,
        105,
        y+24,
        {align:"center"}
    );

    y += 35;
    //======================================
    // OBSERVACIONES (REDUCIDA)
    //======================================

    doc.setFont("times", "bold");
    doc.setFontSize(9);

    doc.text("OBSERVACIONES", 20, y);

    y += 4;

    // Recuadro de observaciones
    doc.setDrawColor(180);
    doc.setFillColor(250,250,250);

    const splitObs = doc.splitTextToSize(
        observaciones,
        160
    );

    const altoCaja = Math.max(18, splitObs.length * 4 + 6);

    doc.roundedRect(
        20,
        y,
        170,
        altoCaja,
        2,
        2,
        "FD"
    );

    doc.setFont("times","normal");
    doc.setFontSize(8.5);

    doc.text(
        splitObs,
        25,
        y + 5,
        {
            align:"justify",
            maxWidth:160
        }
    );

    y += altoCaja + 6;

    //-----------------------------------------------------
    // CIERRE (COMPACTO)
    //-----------------------------------------------------

    const cierre = "Agradecemos su compromiso para contribuir al cumplimiento de los estándares de calidad y mejoramiento continuo requeridos por el Parque Comercial El Tesoro P.H.";

    const textoCierre = doc.splitTextToSize(cierre, 165);

    doc.setFont("times","normal");
    doc.setFontSize(9);

    doc.text(
    textoCierre,
    20,
    y,
    {
        maxWidth: 170
    }
);

    y += textoCierre.length * 4.5 + 16;

    //-----------------------------------------------------
    // DESPEDIDA
    //-----------------------------------------------------

    doc.setFont("times","normal");
    doc.setFontSize(9);

    doc.text("Cordialmente,", 20, y);

    // Espacio para firma manuscrita
    y += 28;

    //-----------------------------------------------------
    // DATOS DE FIRMA
    //-----------------------------------------------------

    doc.setFont("times","bold");
    doc.setFontSize(9);

    doc.text("María L. Osorno", 20, y);

    doc.setFont("times","normal");
    doc.setFontSize(8);

    doc.text("Jefe de Compras e Inventarios", 20, y + 4);
    doc.text("Parque Comercial El Tesoro P.H.", 20, y + 8);

    //======================================
    // PIE DE PÁGINA
    //======================================

    doc.setFontSize(6.5);
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
