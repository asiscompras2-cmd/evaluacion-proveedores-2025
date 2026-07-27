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

    const VERDE = [103, 153, 0];
    const GRIS = [120, 120, 120];

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
    // ENCABEZADO CORPORATIVO
    //-------------------------------------------------

    function drawHeader(){

        // Franja superior
        doc.setFillColor(...VERDE);
        doc.rect(0,0,210,6,"F");

        // Marco
        doc.setDrawColor(180);
        doc.rect(15,10,180,26);

        // divisiones
        doc.line(55,10,55,36);
        doc.line(160,10,160,36);

        // ======== LOGO ========

        /*
        Reemplazar por:

        doc.addImage(
             logoTesoro,
             'PNG',
             19,
             13,
             30,
             18
        );

        */

        doc.setFont("helvetica","bold");
        doc.setFontSize(11);
        doc.setTextColor(...VERDE);

        doc.text(
            "EL TESORO",
            35,
            21,
            {align:"center"}
        );

        doc.setFontSize(7);

        doc.setTextColor(70);

        doc.text(
            "PARQUE COMERCIAL",
            35,
            26,
            {align:"center"}
        );

        // Título

        doc.setFontSize(11);
        doc.setTextColor(0);

        doc.text(
            "CARTA DE EVALUACIÓN\nDE DESEMPEÑO DE PROVEEDORES",
            108,
            20,
            {align:"center"}
        );

        // ISO

        doc.setFontSize(8);

        doc.text(
            "Código",
            166,
            16
        );

        doc.text(
            "F-F-33",
            184,
            16,
            {align:"center"}
        );

        doc.line(160,18,195,18);

        doc.text(
            "Versión",
            166,
            24
        );

        doc.text(
            "01",
            184,
            24,
            {align:"center"}
        );

        doc.line(160,26,195,26);

        doc.text(
            "Fecha",
            166,
            32
        );

        doc.text(
            "28/12/2022",
            184,
            32,
            {align:"center"}
        );

    }

    drawHeader();

    //-------------------------------------------------
    // TITULO
    //-------------------------------------------------

    doc.setFont("helvetica","bold");
    doc.setFontSize(15);

    doc.text(
        "RESULTADO DE LA EVALUACIÓN",
        105,
        48,
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

    doc.setFontSize(10);

    doc.text(
        `Fecha: ${fechaTexto}`,
        20,
        60
    );

    //-------------------------------------------------
    // DESTINATARIO
    //-------------------------------------------------

    doc.setFont("helvetica","bold");

    doc.text("Señores",20,70);

    doc.setFontSize(11);

    doc.text(
        proveedor.toUpperCase(),
        20,
        77
    );

    doc.setFont("helvetica","normal");

    doc.text(
        "Ciudad",
        20,
        84
    );

    //-------------------------------------------------
    // ASUNTO
    //-------------------------------------------------

    doc.setFont("helvetica","bold");

    doc.text(
        "Asunto: Resultado de la Evaluación de Desempeño",
        20,
        94
    );

    //-------------------------------------------------
    // INTRODUCCIÓN
    //-------------------------------------------------

    doc.setFont("helvetica","normal");
    doc.setFontSize(9.5);

    const intro =
    "Apreciado proveedor, el proceso de Compras e Inventarios del Parque Comercial El Tesoro P.H., con el propósito de promover el mejoramiento continuo y fortalecer las relaciones comerciales con nuestros aliados estratégicos, se permite informar el resultado obtenido en la evaluación de desempeño realizada durante el período evaluado.";

    const textoIntro=
        doc.splitTextToSize(
            intro,
            170
        );

    doc.text(
        textoIntro,
        20,
        103,
        {
            align:"justify",
            maxWidth:170
        }
    );

   y += 14;
    //======================================
    // EXPLICACIÓN DE LA EVALUACIÓN
    //======================================

    const parrafoResultado =
        "La evaluación de desempeño fue realizada mediante la valoración de diferentes criterios relacionados con la gestión y el cumplimiento del proveedor. Cada criterio fue calificado en una escala de uno (1,00) a cinco (5,00), donde una calificación más alta representa un mayor nivel de cumplimiento y desempeño. Los aspectos evaluados fueron:";

  const textoResultado =
doc.splitTextToSize(
    parrafoResultado,
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
    // TÍTULO DE CRITERIOS
    //======================================

    //-----------------------------------------------------
// ASPECTOS EVALUADOS
//-----------------------------------------------------

const parrafo2 =
"La evaluación se realizó teniendo en cuenta diferentes criterios relacionados con el desempeño del proveedor. Los aspectos evaluados fueron:";

const textoResultado =
doc.splitTextToSize(
    parrafoResultado,

doc.setFont("helvetica","normal");
doc.setFontSize(9.5);

doc.text(
    textoResultado,,
    20,
    y,
    {
        align:"justify",
        maxWidth:170
    }
);

y += textoResultado.length * 4.8 + 5;


//--------------------------------------
// LISTA DE ASPECTOS
//--------------------------------------

doc.setFont("helvetica","bold");

doc.text(
"✓ Tiempo de respuesta y cumplimiento de entregas.",
25,
y
);

y+=7;

doc.text(
"✓ Calidad del producto y/o servicio suministrado.",
25,
y
);

y+=7;

doc.text(
"✓ Condiciones comerciales y competitividad.",
25,
y
);

y+=7;

const sst =
"✓ Cumplimiento de requisitos legales, contractuales y de Seguridad y Salud en el Trabajo (SST).";

const splitSST=
doc.splitTextToSize(
sst,
160
);

doc.text(
splitSST,
25,
y
);

y+=splitSST.length*5+8;


//--------------------------------------
// MENSAJE
//--------------------------------------

doc.setFont("helvetica","normal");

const mensaje =
"Como resultado del proceso de evaluación, su organización obtuvo la siguiente calificación final:";

const splitMensaje =
doc.splitTextToSize(
mensaje,
170
);

doc.text(
splitMensaje,
20,
y,
{
align:"justify",
maxWidth:170
}
);

y+=14;


//=====================================================
// CAJA RESULTADO
//=====================================================

doc.setDrawColor(103,153,0);

doc.setFillColor(247,250,244);

doc.roundedRect(
30,
y,
150,
38,
3,
3,
"FD"
);

doc.setFontSize(10);

doc.setTextColor(100);

doc.text(
"RESULTADO DE LA EVALUACIÓN",
105,
y+8,
{
align:"center"
}
);

doc.setFontSize(24);

doc.setTextColor(103,153,0);

doc.setFont("helvetica","bold");

doc.text(
`${puntaje.toFixed(2).replace(".",",")} / 5,00`,
105,
y+22,
{
align:"center"
}
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

doc.setFontSize(12);

doc.setTextColor(0);

doc.text(
clasificacion,
105,
y+31,
{
align:"center"
}
);

y+=50;

doc.setTextColor(0);

    //======================================
    // OBSERVACIONES
    //======================================
//-----------------------------------------------------
// OBSERVACIONES
//-----------------------------------------------------

doc.setFont("helvetica", "bold");
doc.setFontSize(11);

doc.text(
    "OBSERVACIONES",
    20,
    y
);

y += 5;

// Recuadro de observaciones
doc.setDrawColor(180);
doc.setFillColor(250,250,250);

const splitObs = doc.splitTextToSize(
    observaciones,
    160
);

const altoCaja =
    Math.max(
        28,
        splitObs.length * 5 + 10
    );

doc.roundedRect(
    20,
    y,
    170,
    altoCaja,
    2,
    2,
    "FD"
);

doc.setFont("helvetica","normal");
doc.setFontSize(9.5);

doc.text(
    splitObs,
    25,
    y + 8,
    {
        align:"justify",
        maxWidth:160
    }
);

y += altoCaja + 10;


//-----------------------------------------------------
// CIERRE
//-----------------------------------------------------

const cierre =
"Agradecemos su compromiso y disposición para contribuir al cumplimiento de los estándares de calidad, servicio y mejoramiento continuo requeridos por el Parque Comercial El Tesoro P.H. Esperamos continuar fortaleciendo nuestra relación comercial y seguir construyendo alianzas estratégicas de beneficio mutuo.";

const textoCierre =
doc.splitTextToSize(
    cierre,
    170
);

doc.setFont("helvetica","normal");

doc.text(
    textoCierre,
    20,
    y,
    {
        align:"justify",
        maxWidth:170
    }
);

y += textoCierre.length * 5 + 10;


//-----------------------------------------------------
// DESPEDIDA
//-----------------------------------------------------

doc.setFont("helvetica","normal");

doc.text(
    "Cordialmente,",
    20,
    y
);

y += 18;


//-----------------------------------------------------
// LÍNEA DE FIRMA
//-----------------------------------------------------

doc.setDrawColor(120);

doc.line(
    20,
    y,
    80,
    y
);

y += 6;


//-----------------------------------------------------
// FIRMA
//-----------------------------------------------------

doc.setFont("helvetica","bold");
doc.setFontSize(10);

doc.text(
    "María L. Osorno",
    20,
    y
);

doc.setFont("helvetica","normal");
doc.setFontSize(9);

doc.text(
    "Jefe de Compras e Inventarios",
    20,
    y + 5
);

doc.text(
    "Parque Comercial El Tesoro P.H.",
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
