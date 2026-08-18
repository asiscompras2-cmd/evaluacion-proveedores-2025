// ==========================================
// HISTORIAL.JS
// Parque Comercial El Tesoro
// Historial con Supabase
// ==========================================

let cacheHistorial = [];

//=====================================
// GUARDAR EN HISTORIAL
//=====================================
async function guardarEnHistorial(evaluacion) {

    console.log("Respuestas:", evaluacion.respuestas);

    const respuestas = evaluacion.respuestas || {};

    const datos = {
        fecha: evaluacion.fecha || "",
        nombre: evaluacion.nombre || "",
        cedula: evaluacion.cedula || "",
        area: evaluacion.area || "",
        proveedor: evaluacion.proveedor || "",
        nit: evaluacion.nit || "",
        observaciones: evaluacion.observaciones || "",

        // calculos.js guarda las respuestas como respuestas[1] ... respuestas[12]
        p1: Number(respuestas[1] || 0),
        p2: Number(respuestas[2] || 0),
        p3: Number(respuestas[3] || 0),
        p4: Number(respuestas[4] || 0),
        p5: Number(respuestas[5] || 0),
        p6: Number(respuestas[6] || 0),
        p7: Number(respuestas[7] || 0),
        p8: Number(respuestas[8] || 0),
        p9: Number(respuestas[9] || 0),
        p10: Number(respuestas[10] || 0),
        p11: Number(respuestas[11] || 0),
        p12: Number(respuestas[12] || 0),

        puntaje_final: Number(evaluacion.puntaje || 0),

        // Esta era la propiedad que faltaba enviar a Supabase.
        comentario_evaluador: String(
            evaluacion.comentario_evaluador || ""
        ).trim()
    };

    console.log("Enviando a Supabase:", datos);

    const { data, error } = await window.supabaseClient
        .from("evaluaciones")
        .insert([datos])
        .select();

    if (error) {
        console.error("Error guardando evaluación en Supabase:", error);
        mostrarModal("No fue posible guardar la evaluación. Revise la consola.");
        throw error;
    }

    console.log("Evaluación guardada correctamente:", data);
    return data;
}


//=====================================
// CARGAR HISTORIAL
//=====================================

async function cargarHistorialDesdeNube() {

    const { data, error } = await window.supabaseClient
        .from("evaluaciones")
        .select("*")
        .order("fecha", { ascending: false });

    if (error) {
        console.error("Error cargando historial:", error);
        return;
    }

    cacheHistorial = data || [];

    renderizarHistorial();

}

//=====================================
// OBTENER HISTORIAL
//=====================================

function obtenerHistorial() {
    return cacheHistorial;
}

//=========================================
// RENDERIZAR HISTORIAL CON FILTROS
//=========================================

function renderizarHistorial() {

    const historial = cacheHistorial || [];

    const cuerpo =
        document.getElementById("cuerpoHistorial");

    const sinDatos =
        document.getElementById("sinDatos");

    if (!cuerpo) return;

    const filtroProveedor =
        document.getElementById("filtroProveedor")?.value
        .toLowerCase()
        .trim() || "";

    const filtroArea =
        document.getElementById("filtroArea")?.value || "";

    const fechaDesde =
        document.getElementById("filtroFechaDesde")?.value || "";

    const fechaHasta =
        document.getElementById("filtroFechaHasta")?.value || "";


    const historialFiltrado =
        historial.filter(e => {

            const coincideProveedor =
                !filtroProveedor ||
                (e.proveedor || "")
                    .toLowerCase()
                    .includes(filtroProveedor);


            const coincideArea =
                !filtroArea ||
                e.area === filtroArea;


            const coincideDesde =
                !fechaDesde ||
                e.fecha >= fechaDesde;


            const coincideHasta =
                !fechaHasta ||
                e.fecha <= fechaHasta;


            return (

                coincideProveedor &&
                coincideArea &&
                coincideDesde &&
                coincideHasta

            );

        });


    cuerpo.innerHTML = "";


    if (historialFiltrado.length === 0) {

        sinDatos.classList.remove("d-none");

    } else {

        sinDatos.classList.add("d-none");

    }


    historialFiltrado.forEach((e) => {

        const indiceReal =
            historial.indexOf(e);


        const tr =
            document.createElement("tr");


     const puntaje =
    Number(e.puntaje_final || 0);   


        let colorPuntaje =
            "text-danger";


        if (puntaje >= 4.5) {

            colorPuntaje =
                "text-success fw-bold";

        }

        else if (puntaje >= 4.0) {

            colorPuntaje =
                "text-primary fw-bold";

        }

        else if (puntaje >= 3.5) {

            colorPuntaje =
                "text-warning fw-bold";

        }


        tr.innerHTML = `

            <td>
                ${e.fecha || ""}
            </td>


            <td>

                <strong>
                    ${e.proveedor || ""}
                </strong>

                <br>

                <small class="text-muted">

                    NIT:
                    ${e.nit || "N/A"}

                </small>

            </td>


            <td>
                ${e.area || "N/A"}
            </td>


            <td>
                ${e.nombre || "N/A"}
            </td>


            <td class="${colorPuntaje}">

                ${puntaje.toFixed(2)}
                / 5.00

            </td>


                <td>
                    <div class="btn-group btn-group-sm">

                        <!-- PDF individual del área -->
                        <button
                            class="btn btn-outline-danger"
                            onclick="generarPDFISOIndividual(${indiceReal})"
                            title="Generar PDF individual">
                            <i class="bi bi-file-earmark-pdf"></i>
                        </button>

                        <!-- PDF consolidado de todas las áreas -->
                        <button
                            class="btn btn-outline-success"
                            onclick="generarPDFISOConsolidado(${indiceReal})"
                            title="Generar PDF consolidado">
                            <i class="bi bi-files"></i>
                        </button>

                    </div>
                </td>


        `;


        cuerpo.appendChild(tr);

    });


    actualizarIndicadores(historialFiltrado);

}

//=====================================
// VALIDAR DUPLICADOS
//=====================================

async function existeEvaluacion(cedula, nit) {

    const { data, error } = await window.supabaseClient
        .from("evaluaciones")
        .select("id")
        .eq("cedula", cedula)
        .eq("nit", nit);

    if (error) {
        console.error("Error validando duplicado:", error);
        return false;
    }

    return data.length > 0;

}

//=====================================
// ESTADÍSTICAS
//=====================================

function obtenerEstadisticasProveedor(nit) {

    const evaluaciones = cacheHistorial.filter(

        e => String(e.nit) === String(nit)

    );

    if (evaluaciones.length === 0)
        return null;

    const promedio =

        evaluaciones.reduce(

            (suma, e) => suma + Number(e.puntaje_final),

            0

        ) / evaluaciones.length;

    return {

        conteo: evaluaciones.length,

        promedio,

        conceptos: evaluaciones.map(

            e => e.observaciones

        )

    };

}

//=====================================
// CONCEPTO AUTOMÁTICO
//=====================================

function generarConceptoAutomatico(stats, puntajeActual) {

    if (!stats || stats.conteo < 3) {

        return "Información histórica insuficiente para generar análisis de tendencia.";

    }

    const diferencia = puntajeActual - stats.promedio;

    let concepto = "";

    if (diferencia > 0.25)
        concepto += "Tendencia positiva. ";
    else if (diferencia < -0.25)
        concepto += "Tendencia negativa. ";
    else
        concepto += "Desempeño estable. ";

    const promedioFinal =

        ((stats.promedio * stats.conteo) + puntajeActual) /

        (stats.conteo + 1);

    if (promedioFinal >= 4.5)
        concepto += "Proveedor Excelente.";
    else if (promedioFinal >= 3.75)
        concepto += "Proveedor Aprobado.";
    else if (promedioFinal >= 3.0)
        concepto += "Proveedor Aceptable.";
    else
        concepto += "Requiere Plan de Mejora.";

    return concepto;

}
//=====================================
// INICIALIZAR
//=====================================

document.addEventListener("DOMContentLoaded", async () => {

    await cargarHistorialDesdeNube();

});
//=========================================
// ACTUALIZAR INDICADORES
//=========================================

function actualizarIndicadores(historial) {

    const total = historial.length;

    const promedio =
        total > 0
            ? historial.reduce(
                (suma, e) =>
                    suma + Number(e.puntaje_final || 0),
                0
            ) / total
            : 0;

    const proveedores =
        new Set(
            historial.map(e => e.nit)
        ).size;

    const requierenMejora =
        historial.filter(
            e => Number(e.puntaje_final || 0) < 3.5
        ).length;

    document.getElementById(
        "totalEvaluaciones"
    ).textContent = total;

    document.getElementById(
        "promedioGeneral"
    ).textContent = promedio.toFixed(2);

    document.getElementById(
        "proveedoresEvaluados"
    ).textContent = proveedores;

    document.getElementById(
        "proveedoresMejora"
    ).textContent = requierenMejora;

}
//=========================================
// ACTIVAR FILTROS
//=========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const filtroProveedor =
            document.getElementById(
                "filtroProveedor"
            );

        const filtroArea =
            document.getElementById(
                "filtroArea"
            );

        const filtroFechaDesde =
            document.getElementById(
                "filtroFechaDesde"
            );

        const filtroFechaHasta =
            document.getElementById(
                "filtroFechaHasta"
            );


        if (filtroProveedor) {

            filtroProveedor.addEventListener(
                "input",
                renderizarHistorial
            );

        }


        if (filtroArea) {

            filtroArea.addEventListener(
                "change",
                renderizarHistorial
            );

        }


        if (filtroFechaDesde) {

            filtroFechaDesde.addEventListener(
                "change",
                renderizarHistorial
            );

        }


        if (filtroFechaHasta) {

            filtroFechaHasta.addEventListener(
                "change",
                renderizarHistorial
            );

        }


        cargarAreasFiltro();

    }

);
//=========================================
// CARGAR ÁREAS EN EL FILTRO
//=========================================

function cargarAreasFiltro() {

    const select =
        document.getElementById("filtroArea");

    if (!select) return;


    const areas =
        [...new Set(
            cacheHistorial
                .map(e => e.area)
                .filter(Boolean)
        )];


    areas.forEach(area => {

        const option =
            document.createElement("option");

        option.value = area;

        option.textContent = area;

        select.appendChild(option);

    });

}
//=========================================
// LIMPIAR FILTROS
//=========================================

function limpiarFiltros() {

    document.getElementById(
        "filtroProveedor"
    ).value = "";


    document.getElementById(
        "filtroArea"
    ).value = "";


    document.getElementById(
        "filtroFechaDesde"
    ).value = "";


    document.getElementById(
        "filtroFechaHasta"
    ).value = "";


    renderizarHistorial();

}
//=========================================
// MIS EVALUACIONES (SOLO DEL EVALUADOR ACTUAL)
//=========================================
function renderizarMisEvaluaciones() {

    const cedulaEvaluador = document.getElementById("cedula")?.value.trim();

    if (!cedulaEvaluador) {
        alert("Primero identifique al evaluador.");
        return;
    }

    const historial = cacheHistorial || [];

    // Buscar por cualquiera de los posibles campos de cédula
    const misEvaluaciones = historial.filter(e => {
        const cedulaRegistro =
            e.cedula ||
            e.cedula_evaluador ||
            e.cedula_usuario ||
            e.documento ||
            "";

        return String(cedulaRegistro).trim() === String(cedulaEvaluador).trim();
    });

    const cuerpo = document.getElementById("cuerpoMisEvaluaciones");
    const sinDatos = document.getElementById("sinMisEvaluaciones");

    cuerpo.innerHTML = "";

    if (misEvaluaciones.length === 0) {
        sinDatos.classList.remove("d-none");
        return;
    }

    sinDatos.classList.add("d-none");

    misEvaluaciones.forEach(e => {

        const indiceReal = historial.indexOf(e);
        const puntaje = Number(e.puntaje_final || e.puntaje || 0);

        cuerpo.innerHTML += `
            <tr>
                <td>${formatearFechaCorta(e.fecha)}</td>
                <td><strong>${e.proveedor || ""}</strong></td>
                <td>${e.area || ""}</td>
                <td>${puntaje.toFixed(2)} / 5.00</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm"
                            onclick="generarPDFISOIndividual(${indiceReal})">
                        <i class="bi bi-file-earmark-pdf"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}
function formatearFechaCorta(fechaISO) {
    if (!fechaISO) return "";

    const fecha = new Date(fechaISO);

    return fecha.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).replace(".", "");
}
// =============================================================
// PDF CONSOLIDADO POR PROVEEDOR Y ÁREAS - PERÍODO 2025
// Parque Comercial El Tesoro P.H.
// =============================================================
// Esta función NO reemplaza generarPDFISOIndividual().
// Reutiliza ejecutarGeneracionPDF(), por lo que conserva el mismo
// formato, logo, distribución y espacio para firma del PDF actual.
// Solo lee el historial que ya está cargado.
// =============================================================

window.generarPDFISOConsolidado = function (indice) {
    const historial = obtenerHistorial() || [];
    const seleccionado = historial[indice];

    if (!seleccionado) {
        alert("No se encontró la evaluación seleccionada.");
        return;
    }

    const normalizar = valor => String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

    const nitSeleccionado = normalizar(seleccionado.nit);
    const proveedorSeleccionado = normalizar(seleccionado.proveedor);

    const esMismoProveedor = evaluacion => {
        const nitRegistro = normalizar(evaluacion.nit);
        const nombreRegistro = normalizar(evaluacion.proveedor);

        return (
            (nitSeleccionado && nitRegistro === nitSeleccionado) ||
            (proveedorSeleccionado && nombreRegistro === proveedorSeleccionado)
        );
    };

    const esPeriodo2025 = evaluacion => {
        const periodo = String(evaluacion.periodo ?? "").trim();
        if (periodo) return periodo === "2025";

        const fecha = String(evaluacion.fecha || "").trim();
        if (!fecha) return false;

        // Acepta 2025-01-15, 15/01/2025, 15-01-2025 y fechas con texto.
        if (/(^|[^0-9])2025([^0-9]|$)/.test(fecha)) return true;

        const fechaConvertida = new Date(fecha);
        return !Number.isNaN(fechaConvertida.getTime()) &&
            fechaConvertida.getFullYear() === 2025;
    };

    const evaluaciones = historial.filter(evaluacion =>
        esMismoProveedor(evaluacion) && esPeriodo2025(evaluacion)
    );

    if (evaluaciones.length === 0) {
        alert(
            "No se encontraron evaluaciones de " +
            (seleccionado.proveedor || "este proveedor") +
            " en el período 2025. Verifique que el historial esté cargado."
        );
        console.log("Registro seleccionado para consolidar:", seleccionado);
        console.log("Registros disponibles en historial:", historial);
        return;
    }

    const obtenerPuntaje = evaluacion => {
        const valor = Number(
            evaluacion.puntaje_final ?? evaluacion.puntaje ?? 0
        );
        return Number.isFinite(valor) ? valor : 0;
    };

    const porArea = {};

    evaluaciones.forEach(evaluacion => {
        const area = normalizar(evaluacion.area) || "sin area";
        if (!porArea[area]) porArea[area] = [];
        porArea[area].push(evaluacion);
    });

    // Promedio de cada área. Si un área tiene varias evaluaciones,
    // primero se promedian sus evaluaciones entre sí.
    const promediosAreas = Object.entries(porArea).map(([area, registros]) => {
        const suma = registros.reduce(
            (total, evaluacion) => total + obtenerPuntaje(evaluacion),
            0
        );

        return {
            area,
            promedio: suma / registros.length,
            cantidad: registros.length
        };
    });

    const nombreProveedor = normalizar(seleccionado.proveedor);

    // Solo estos dos proveedores tienen pesos especiales.
    const pesosEspeciales = {
        "g4s secure solutions colombia sa": {
            nombreMostrar: "G4S - Secure Solutions Colombia S.A.",
            pesos: {
                teatro: 20,
                mercadeo: 20,
                seguridad: 60
            }
        },
        "aseo y sostenimiento y compania s a": {
            nombreMostrar: "Aseo y Sostenimiento y Compañía S.A.",
            pesos: {
                operaciones: 60,
                comercial: 13.3333333333,
                teatro: 13.3333333333,
                mercadeo: 13.3333333333
            }
        }
    };

    const configuracion = pesosEspeciales[nombreProveedor];
    let promedioGlobal;
    let detalleAreas;

    if (configuracion) {
        const faltantes = Object.keys(configuracion.pesos)
            .filter(area => !porArea[area]);

        if (faltantes.length > 0) {
            alert(
                "Para generar el PDF consolidado de " +
                configuracion.nombreMostrar +
                " todavía faltan evaluaciones de: " +
                faltantes.join(", ") + "."
            );
            return;
        }

        const pesoTotal = Object.values(configuracion.pesos)
            .reduce((total, peso) => total + peso, 0);

        promedioGlobal = Object.entries(configuracion.pesos)
            .reduce((total, [area, peso]) => {
                const promedioArea = porArea[area].reduce(
                    (suma, evaluacion) => suma + obtenerPuntaje(evaluacion),
                    0
                ) / porArea[area].length;

                return total + promedioArea * (peso / pesoTotal);
            }, 0);

        detalleAreas = Object.entries(configuracion.pesos)
            .map(([area, peso]) => {
                const registros = porArea[area];
                const promedioArea = registros.reduce(
                    (suma, evaluacion) => suma + obtenerPuntaje(evaluacion),
                    0
                ) / registros.length;

                return `${area}: ${promedioArea.toFixed(2)} ` +
                    `(${peso.toFixed(2)}% - ${registros.length} eval.)`;
            })
            .join("; ");
    } else {
        // Los demás proveedores mantienen el promedio igualitario entre áreas.
        promedioGlobal = promediosAreas.reduce(
            (total, item) => total + item.promedio,
            0
        ) / promediosAreas.length;

        detalleAreas = promediosAreas.map(item =>
            `${item.area}: ${item.promedio.toFixed(2)} ` +
            `(${item.cantidad} eval.)`
        ).join("; ");
    }

    const promedioRedondeado = Number(promedioGlobal.toFixed(2));
    const fechaConsolidado = evaluaciones
        .map(evaluacion => String(evaluacion.fecha || ""))
        .sort()
        .slice(-1)[0] || seleccionado.fecha || "";

    const datosConsolidados = {
        ...seleccionado,
        fecha: fechaConsolidado,
        area: configuracion
            ? "Consolidado ponderado de áreas"
            : "Consolidado de todas las áreas",
        puntaje: promedioRedondeado,
        puntaje_final: promedioRedondeado,
        observaciones:
            `Resultado consolidado del período 2025. ` +
            `Promedios por área: ${detalleAreas}. ` +
            `Calificación global: ${promedioRedondeado.toFixed(2)} sobre 5.00.`,
        comentario_evaluador: ""
    };

    // Reutiliza el PDF actual. No se modifica su plantilla.
    ejecutarGeneracionPDF(datosConsolidados);
};
