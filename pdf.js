// ==========================================
// PDF.JS - CARTA DE RESULTADOS OFICIAL (DETALLADA)
// Parque Comercial El Tesoro P.H.
// ==========================================

function generarPDFISOIndividual(index) {
    const historial = obtenerHistorial();
    const data = historial[index];
    
    if (!data) return;

    ejecutarGeneracionPDF(data);
}

function generarPDFISO() {
    mostrarModal("Por favor, guarde la evaluación primero y genérela desde la pestaña de Historial.");
}

function ejecutarGeneracionPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

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
    
    // --- ENCABEZADO TÉCNICO (TABLA SUPERIOR) ---
    const drawHeader = (d) => {
        d.setLineWidth(0.5);
        d.rect(20, 15, 170, 20); 
        d.line(70, 15, 70, 35);  
        d.line(150, 15, 150, 35); 
        d.line(150, 21.6, 190, 21.6);
        d.line(150, 28.3, 190, 28.3);
        d.setFontSize(10);
        d.setFont("helvetica", "bold");
        d.text("El Tesoro", 30, 24);
        d.setFontSize(7);
        d.text("PARQUE COMERCIAL", 30, 28);
        d.setFontSize(11);
        d.text("CARTA DE EVALUACIÓN DE PROVEEDORES", 110, 27, { align: "center" });
        d.setFontSize(8);
        d.text("F-F-33", 170, 19, { align: "center" });
        d.text("Versión: 01", 170, 25, { align: "center" });
        d.text("Fecha: 28/12/2022", 170, 32, { align: "center" });
    };

    drawHeader(doc);

    // --- CUERPO DE LA CARTA ---
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("CARTA DE RESULTADOS DE EVALUACIÓN DE DESEMPEÑO DE PROVEEDORES", 105, 50, { align: "center" });

    doc.setFont("helvetica", "normal");
    const fechaObj = new Date(fecha);
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const fechaTexto = `Fecha: ${fechaObj.getDate()} de ${meses[fechaObj.getMonth()]} de ${fechaObj.getFullYear()}`;
    doc.text(fechaTexto, 20, 65);

    doc.setFont("helvetica", "bold");
    doc.text("Señores", 20, 70);
    doc.text(proveedor.toUpperCase(), 20, 75);
    doc.setFont("helvetica", "normal");
    doc.text("Ciudad", 20, 80);

    doc.setFont("helvetica", "bold");
    doc.text("Asunto: Resultado de la Evaluación de Desempeño de Proveedores", 20, 90);

    doc.setFont("helvetica", "normal");
    const parrafo1 = "Apreciado proveedor, el proceso de Compras e Inventarios del PARQUE COMERCIAL EL TESORO P.H Con el propósito de promover el mejoramiento continuo y fortalecer las relaciones comerciales con nuestros aliados estratégicos, nos permitimos informar el resultado de la evaluación de desempeño realizada a su organización correspondiente al período evaluado.";
    doc.text(doc.splitTextToSize(parrafo1, 170), 20, 100);

    const parrafo2 = "La evaluación fue efectuada considerando criterios relacionados con:";
    doc.text(parrafo2, 20, 120);
    
    doc.text("• Tiempo de respuesta y cumplimiento de entregas.", 25, 127);
    doc.text("• Calidad del producto y/o servicio suministrado.", 25, 133);
    doc.text("• Condiciones comerciales y competitividad.", 25, 139);
    doc.text("• Cumplimiento de requisitos legales, contractuales y de Seguridad y Salud en el Trabajo (SST).", 25, 145);

    doc.setFont("helvetica", "bold");
    doc.text("Criterios evaluados y Desempeño por Categoría", 20, 155);

    // --- CÁLCULO DE CRITERIOS REALES ---
    const resumenCriterios = [];
    if (respuestas && window.criterios) {
        window.criterios.forEach(c => {
            let suma = 0;
            let count = 0;
            c.preguntas.forEach(p => {
                if (respuestas[p.id]) {
                    suma += respuestas[p.id];
                    count++;
                }
            });
            const promedio = count > 0 ? (suma / count).toFixed(2) : "N/A";
            
            // Mapeo de nombres para que coincidan exactamente con la carta
            let nombreCriterio = c.nombre;
            if (c.nombre === "Cumplimiento") nombreCriterio = "Tiempo de respuesta y cumplimiento de entregas";
            if (c.nombre === "Calidad") nombreCriterio = "Calidad del producto y/o servicio suministrado";
            if (c.nombre === "Condiciones Comerciales") nombreCriterio = "Condiciones comerciales y competitividad";
            if (c.nombre === "SST") nombreCriterio = "Cumplimiento de requisitos legales, contractuales y de SST";

            resumenCriterios.push([nombreCriterio, `${promedio} / 5.0`]);
        });
    }

    doc.autoTable({
        startY: 160,
        head: [['Categoría de Evaluación', 'Calificación']],
        body: resumenCriterios,
        theme: 'striped',
        headStyles: { fillColor: [113, 176, 0] }, // Verde oficial
        styles: { fontSize: 9 }
    });

    let y = doc.lastAutoTable.finalY + 8;
    doc.setFont("helvetica", "bold");
    doc.text("Resultado obtenido", 20, y);
    doc.text("Calificación Final", 20, y + 8);
    
    doc.setFontSize(16);
    doc.text(`${Number(puntaje_final).toFixed(2)} / 5,00`, 20, y + 16);

    // Observaciones en la misma página
    y = doc.lastAutoTable.finalY + 5;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones Generales:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitObs = doc.splitTextToSize(observaciones, 170);
    doc.text(splitObs, 20, y + 7);

    y += (splitObs.length * 5) + 15;
    if (y > 240) { doc.addPage(); drawHeader(doc); y = 50; }

    doc.setFontSize(10);
    const cierre = "Confiamos en que esta retroalimentación contribuya al mejoramiento continuo de sus procesos y al cumplimiento de los estándares de calidad, servicio y oportunidad requeridos por el Parque Comercial El Tesoro P.H.";
    doc.text(doc.splitTextToSize(cierre, 170), 20, y);

    doc.text("Cordialmente,", 20, y + 18);
    doc.setFont("helvetica", "bold");
    doc.text("María L. Osorno", 20, y + 30);
    doc.text("Jefe de Compras e Inventarios", 20, y + 35);
    doc.text("Parque Comercial El Tesoro P.H.", 20, y + 40);

    doc.save(`Carta_Evaluacion_${proveedor.replace(/\s+/g, "_")}.pdf`);
}
