async function exportarProveedoresPendientes() {
    try {
        // 1. Cargar el historial actualizado desde Supabase
        await cargarHistorialDesdeNube();
        const historial = obtenerHistorial();

        // 2. Obtener la lista completa de proveedores desde el archivo JSON
        const respuesta = await fetch('proveedores.json');
        const todosLosProveedores = await respuesta.json();

        // 3. Identificar los NITs de los proveedores ya evaluados
        const nitsEvaluados = new Set(
            historial.map(ev => String(ev.nit || ev.NIT).trim())
        );

        // 4. Filtrar los proveedores que NO están en el historial
        const pendientes = todosLosProveedores.filter(p => {
            const nitProveedor = String(p.NIT || p.nit).trim();
            return !nitsEvaluados.has(nitProveedor);
        });

        if (pendientes.length === 0) {
            alert("¡Excelente! Todos los proveedores han sido evaluados.");
            return;
        }

        // 5. Preparar los datos para el Excel
        let filas = [
            ["INFORME DE PROVEEDORES PENDIENTES DE EVALUAR"],
            ["PARQUE COMERCIAL EL TESORO P.H."],
            ["Fecha de generación:", new Date().toLocaleDateString()],
            ["Total pendientes:", pendientes.length],
            [],
            ["NIT", "NOMBRE DEL PROVEEDOR", "ÁREA", "BIEN O SERVICIO PRESTADO"]
        ];

        pendientes.forEach(p => {
            filas.push([
                p.NIT || "",
                p["NOMBRE DE PROVEEDOR"] || "",
                p.AREA || "",
                p["BIEN O SERVICIO PRESTADO"] || ""
            ]);
        });

        // 6. Generar el archivo Excel
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(filas);
        ws["!cols"] = [{ wch: 15 }, { wch: 50 }, { wch: 20 }, { wch: 60 }];
        XLSX.utils.book_append_sheet(wb, ws, "Pendientes");
        XLSX.writeFile(wb, `Proveedores_Pendientes_${new Date().toISOString().slice(0,10)}.xlsx`);

    } catch (error) {
        console.error("Error:", error);
        alert("Error al generar el informe. Revisa la consola.");
    }
}
