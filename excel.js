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
        fila.push(ev.comentario_evaluador || "");

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
