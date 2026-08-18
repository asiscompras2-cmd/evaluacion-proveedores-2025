// ==========================================
// EXCEL.JS
// Parque Comercial El Tesoro P.H.
// Compatible con Supabase
// =========================================

// ==========================================
// OBTENER RESPUESTA
// Compatible con Supabase y versiones antiguas
// ==========================================

function obtenerValorRespuesta(ev, i) {

    const campo = `p${i + 1}`;

    if (ev[campo] !== undefined && ev[campo] !== null)
        return Number(ev[campo]);

    if (Array.isArray(ev.respuestas))
        return Number(ev.respuestas[i] || 0);

    if (typeof ev.respuestas === "object" && ev.respuestas !== null)
        return Number(ev.respuestas[`P${i + 1}`] || 0);

    return 0;

}

// ==========================================
// EXPORTAR DETALLE POR PROVEEDOR
// ==========================================

async function exportarProveedor(nombreProveedor) {

    await cargarHistorialDesdeNube();

    const historial = obtenerHistorial();

    const datos = historial.filter(e => e.proveedor === nombreProveedor);

    if (datos.length === 0) {
        alert("No hay evaluaciones para este proveedor.");
        return;
    }

    let filas = [];

    filas.push(["INFORME DE EVALUACIÓN DE PROVEEDOR"]);
    filas.push(["PARQUE COMERCIAL EL TESORO P.H."]);
    filas.push([]);
    filas.push(["Proveedor:", nombreProveedor]);
    filas.push(["Fecha de generación:", new Date().toLocaleDateString("es-CO")]);
    filas.push([]);

    filas.push([
        "Fecha",
        "Área",
        "CÉDULA EVALUADOR",
        "NOMBRE EVALUADOR",
        "P1","P2","P3","P4","P5","P6",
        "P7","P8","P9","P10","P11","P12",
        "Tiempo de respuesta (30%)",
        "Calidad (40%)",
        "Precio (20%)",
        "SST y requisitos legales (10%)",
        "PUNTAJE FINAL",
        "RESULTADO",
        "OBSERVACIÓN AUTOMÁTICA",
        "COMENTARIO DEL EVALUADOR"
    ]);

    datos.forEach(ev => {

        let fila = [
            ev.fecha || "",
            ev.area || "",
            ev.cedula || "",
            ev.nombre || ""
        ];

        let respuestas = [];
        let total = 0;

        for (let i = 0; i < 12; i++) {
            const valor = obtenerValorRespuesta(ev, i);
            respuestas.push(valor);
            fila.push(valor);
            total += valor * PESOS[i];
        }

        // Resultados por criterio
        const tiempo = (respuestas[0] + respuestas[1] + respuestas[2]) / 3;
        const calidad = (respuestas[3] + respuestas[4] + respuestas[5] + respuestas[6]) / 4;
        const precio = (respuestas[7] + respuestas[8] + respuestas[9]) / 3;
        const sst = (respuestas[10] + respuestas[11]) / 2;

        fila.push(Number(tiempo.toFixed(1)));
        fila.push(Number(calidad.toFixed(1)));
        fila.push(Number(precio.toFixed(1)));
        fila.push(Number(sst.toFixed(1)));

        const puntajeFinal = Number(total.toFixed(1));

        let resultado = "";
        if (puntajeFinal >= 4.5) resultado = "Proveedor Excelente";
        else if (puntajeFinal >= 4.0) resultado = "Proveedor Aprobado";
        else if (puntajeFinal >= 3.5) resultado = "Proveedor Aceptable";
        else resultado = "Requiere Plan de Mejora";

        fila.push(puntajeFinal);
        fila.push(resultado);
        fila.push(ev.observaciones || "");
        fila.push(obtenerComentarioEvaluador(ev));

        filas.push(fila);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(filas);

    ws["!cols"] = [
        { wch: 15 }, // Fecha
        { wch: 20 }, // Área
        { wch: 18 }, // Cédula
        { wch: 35 }, // Nombre
        ...Array(12).fill({ wch: 8 }),
        { wch: 18 }, // Tiempo
        { wch: 18 }, // Calidad
        { wch: 15 }, // Precio
        { wch: 20 }, // SST
        { wch: 15 }, // Puntaje
        { wch: 22 }, // Resultado
        { wch: 60 }, // Observación
        { wch: 60 }  // Comentario
    ];

    ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 24 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 24 } }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Detalle");

    XLSX.writeFile(wb, `Informe_${nombreProveedor}.xlsx`);
}
// ==========================================
// HOJA: PROMEDIO POR CRITERIO
// ==========================================

function crearHojaPromedioCriterios(wb, datos) {

    let filas = [];

    filas.push(["PROMEDIO POR CRITERIO"]);
    filas.push(["PARQUE COMERCIAL EL TESORO P.H."]);
    filas.push([]);

    filas.push([
        "Fecha",
        "Proveedor",
        "Área",
        "Cédula Evaluador",
        "Nombre Evaluador",
        "Tiempo de respuesta (30%)",
        "Calidad (40%)",
        "Precio (20%)",
        "SST y requisitos legales (10%)",
        "PUNTAJE FINAL",
        "RESULTADO",
        "COMENTARIOS DEL EVALUADOR"
    ]);

    datos.forEach(ev => {

        let respuestas = [];

        for (let i = 0; i < 12; i++) {
            respuestas.push(obtenerValorRespuesta(ev, i));
        }

        // Promedios por criterio
        const tiempo =
            (respuestas[0] + respuestas[1] + respuestas[2]) / 3;

        const calidad =
            (respuestas[3] + respuestas[4] + respuestas[5] + respuestas[6]) / 4;

        const precio =
            (respuestas[7] + respuestas[8] + respuestas[9]) / 3;

        const sst =
            (respuestas[10] + respuestas[11]) / 2;

        // Puntaje final ponderado
        let puntajeFinal = 0;

        for (let i = 0; i < 12; i++) {
            puntajeFinal += respuestas[i] * PESOS[i];
        }

        puntajeFinal = Number(puntajeFinal.toFixed(1));

        // Resultado
        let resultado = "";

        if (puntajeFinal >= 4.5)
            resultado = "Proveedor Excelente";
        else if (puntajeFinal >= 4.0)
            resultado = "Proveedor Aprobado";
        else if (puntajeFinal >= 3.5)
            resultado = "Proveedor Aceptable";
        else
            resultado = "Requiere Plan de Mejora";

        filas.push([
            ev.fecha || "",
            ev.proveedor || "",
            ev.area || "",
            ev.cedula || "",
            ev.nombre || "",

            Number(tiempo.toFixed(1)),
            Number(calidad.toFixed(1)),
            Number(precio.toFixed(1)),
            Number(sst.toFixed(1)),

            puntajeFinal,
            resultado,

            obtenerComentarioEvaluador(ev)
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(filas);

    ws["!cols"] = [
        { wch: 15 },
        { wch: 35 },
        { wch: 20 },
        { wch: 18 },
        { wch: 35 },
        { wch: 22 },
        { wch: 18 },
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 25 },
        { wch: 70 }
    ];

    ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 11 } }
    ];

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Promedio por Criterio"
    );
}
// ==========================================
// EXPORTAR CONSOLIDADO
// ==========================================

async function exportarReporteConsolidado() {

    await cargarHistorialDesdeNube();

    const historial = obtenerHistorial();

    if (historial.length === 0) {

        alert("No hay evaluaciones registradas.");

        return;

    }

    const proveedores = {};
        historial.forEach(ev => {

        if (!proveedores[ev.proveedor]) {

            proveedores[ev.proveedor] = {
                nit: ev.nit || "",
                cantidad: 0,
                total: Array(12).fill(0)
            };

        }

        proveedores[ev.proveedor].cantidad++;

        for (let i = 0; i < 12; i++) {

            proveedores[ev.proveedor].total[i] +=
                obtenerValorRespuesta(ev, i);

        }

    });

    let filas = [];

    filas.push(["REPORTE CONSOLIDADO DE PROVEEDORES"]);
    filas.push(["PARQUE COMERCIAL EL TESORO P.H."]);
    filas.push(["Fecha:", new Date().toLocaleDateString()]);
    filas.push([]);

    filas.push([
        "Proveedor",
        "NIT",
        "Evaluaciones",
        "P1","P2","P3","P4","P5","P6",
        "P7","P8","P9","P10","P11","P12",
        "PUNTAJE FINAL"
    ]);

    Object.keys(proveedores).forEach(nombre => {

        const p = proveedores[nombre];

        let fila = [
            nombre,
            p.nit,
            p.cantidad
        ];

        let puntaje = 0;

        for (let i = 0; i < 12; i++) {

            const promedio = p.total[i] / p.cantidad;

            fila.push(Number(promedio.toFixed(1)));

            puntaje += promedio * PESOS[i];

        }

        fila.push(Number(puntaje.toFixed(1)));

        filas.push(fila);

    });

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet(filas);

    ws["!cols"] = [
        { wch: 35 },
        { wch: 18 },
        { wch: 15 },
        ...Array(12).fill({ wch: 8 }),
        { wch: 18 }
    ];

    ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 15 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 15 } }
    ];

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Consolidado"
    );
// ==========================================
// SEGUNDA HOJA: PROMEDIO POR CRITERIO
// ==========================================

let filasCriterios = [];

filasCriterios.push([
    "PROMEDIO POR CRITERIO"
]);

filasCriterios.push([
    "PARQUE COMERCIAL EL TESORO P.H."
]);

filasCriterios.push([]);

filasCriterios.push([
    "Proveedor",
    "NIT",
    "Evaluaciones",
    "Tiempo de respuesta (30%)",
    "Calidad (40%)",
    "Precio (20%)",
    "SST y requisitos legales (10%)",
    "PUNTAJE FINAL",
    "RESULTADO"
]);

Object.keys(proveedores).forEach(nombre => {

    const p = proveedores[nombre];

    // Promedio de cada pregunta
    const promedios = [];

    for (let i = 0; i < 12; i++) {

        promedios.push(
            p.total[i] / p.cantidad
        );

    }

    // Promedio por criterio
    const tiempo =
        (promedios[0] +
         promedios[1] +
         promedios[2]) / 3;

    const calidad =
        (promedios[3] +
         promedios[4] +
         promedios[5] +
         promedios[6]) / 4;

    const precio =
        (promedios[7] +
         promedios[8] +
         promedios[9]) / 3;

    const sst =
        (promedios[10] +
         promedios[11]) / 2;

    // Puntaje final utilizando los PESOS actuales
    let puntajeFinal = 0;

    for (let i = 0; i < 12; i++) {

        puntajeFinal +=
            promedios[i] * PESOS[i];

    }

    puntajeFinal = Number(
        puntajeFinal.toFixed(1)
    );

    // Clasificación
    let resultado = "";

    if (puntajeFinal >= 4.5) {
        resultado = "EXCELENTE";
    }
    else if (puntajeFinal >= 4.0) {
        resultado = "BUENO";
    }
    else if (puntajeFinal >= 3.5) {
        resultado = "ACEPTABLE";
    }
    else {
        resultado = "INSUFICIENTE";
    }

    filasCriterios.push([

        nombre,

        p.nit,

        p.cantidad,

        Number(tiempo.toFixed(1)),

        Number(calidad.toFixed(1)),

        Number(precio.toFixed(1)),

        Number(sst.toFixed(1)),

        puntajeFinal,

        resultado

    ]);

});

// Crear segunda hoja
const wsCriterios =
    XLSX.utils.aoa_to_sheet(filasCriterios);

// Ancho de columnas
wsCriterios["!cols"] = [

    { wch: 35 }, // Proveedor
    { wch: 18 }, // NIT
    { wch: 15 }, // Evaluaciones
    { wch: 25 }, // Tiempo
    { wch: 20 }, // Calidad
    { wch: 20 }, // Precio
    { wch: 30 }, // SST
    { wch: 18 }, // Puntaje
    { wch: 18 }  // Resultado

];

// Combinar títulos
wsCriterios["!merges"] = [

    {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 8 }
    },

    {
        s: { r: 1, c: 0 },
        e: { r: 1, c: 8 }
    }

];

// Agregar segunda hoja al mismo archivo
XLSX.utils.book_append_sheet(
    wb,
    wsCriterios,
    "Promedio por Criterio"
);
    XLSX.writeFile(
        wb,
        "Reporte_Consolidado.xlsx"
    );

}

// ==========================================
// EXPORTACIÓN DESDE EL FORMULARIO
// ==========================================

function exportarExcel() {

    alert(
        "Guarde primero la evaluación y exporte desde la pestaña Historial."
    );

}
function obtenerComentarioEvaluador(ev) {
    return String(
        ev.comentario_evaluador ??
        ev.comentarioEvaluador ??
        ev.comentarios_evaluador ??
        ev.comentarios ??
        ev.comentario ??
        ""
    ).trim();
}
