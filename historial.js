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

//=====================================
// RENDERIZAR HISTORIAL
//=====================================

function renderizarHistorial() {

    const cuerpo = document.getElementById("cuerpoHistorial");
    const sinDatos = document.getElementById("sinDatos");

    if (!cuerpo) return;

    cuerpo.innerHTML = "";

    if (cacheHistorial.length === 0) {

        if (sinDatos) {
            sinDatos.classList.remove("d-none");
        }

        return;
    }

    if (sinDatos) {
        sinDatos.classList.add("d-none");
    }

    cacheHistorial.forEach((e, index) => {

        let color = "text-danger";

        const puntaje = Number(e.puntaje_final || 0);

        if (puntaje >= 4.5)
            color = "text-success fw-bold";
        else if (puntaje >= 3.75)
            color = "text-primary fw-bold";
        else if (puntaje >= 3.0)
            color = "text-warning fw-bold";

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${e.fecha}</td>

            <td>
                <strong>${e.proveedor}</strong><br>
                <small class="text-muted">
                    NIT: ${e.nit}<br>
                    Evaluador: ${e.nombre}
                </small>
            </td>

            <td>${e.area}</td>

            <td class="${color}">
                ${puntaje.toFixed(2)} / 5.00
            </td>

            <td>
                <button
                    class="btn btn-sm btn-outline-danger"
                    onclick="generarPDFISOIndividual(${index})">
                    <i class="bi bi-file-earmark-pdf"></i>
                </button>
            </td>
        `;

        cuerpo.appendChild(fila);

    });

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
