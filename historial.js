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

    const datos = {

        fecha: evaluacion.fecha,
        nombre: evaluacion.nombre,
        cedula: evaluacion.cedula,
        area: evaluacion.area,
        proveedor: evaluacion.proveedor,
        nit: evaluacion.nit,
        observaciones: evaluacion.observaciones,

        p1: evaluacion.respuestas[1],
        p2: evaluacion.respuestas[2],
        p3: evaluacion.respuestas[3],
        p4: evaluacion.respuestas[4],
        p5: evaluacion.respuestas[5],
        p6: evaluacion.respuestas[6],
        p7: evaluacion.respuestas[7],
        p8: evaluacion.respuestas[8],
        p9: evaluacion.respuestas[9],
        p10: evaluacion.respuestas[10],
        p11: evaluacion.respuestas[11],
        p12: evaluacion.respuestas[12],

        puntaje_final: evaluacion.puntaje

    };

    console.log("Enviando a Supabase:", datos);

    const { data, error } = await window.supabaseClient
        .from("evaluaciones")
        .insert([datos]);

    if (error) {
        console.error(error);
        return;
    }
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

                    <button
                        class="btn btn-outline-danger"
                        onclick="generarPDFISOIndividual(${indiceReal})"
                        title="Generar PDF">

                        <i class="bi bi-file-earmark-pdf"></i>

                    </button>

                    <button
                        class="btn btn-outline-success"
                        onclick="exportarExcelIndividual(${indiceReal})"
                        title="Exportar Excel">

                        <i class="bi bi-file-earmark-excel"></i>

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
