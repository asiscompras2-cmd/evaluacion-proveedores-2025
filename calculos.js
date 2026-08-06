// ==========================================
// CALCULOS.JS - VERSIÓN FINAL CORREGIDA
// Parque Comercial El Tesoro
// ==========================================

// 1. PESOS EXACTOS SEGÚN TABLA ISO (Valor descripción)
const PESOS = [
    0.100, 0.100, 0.100,        // Criterio 1: Tiempo de respuesta (30%)
    0.133, 0.133, 0.133, 0.133, // Criterio 2: Calidad del Producto/Servicio (40%)
    0.067, 0.067, 0.067,        // Criterio 3: Precio y Condiciones (20%)
    0.033, 0.033                // Criterio 4: Cumplimiento de SST y Legales (10%)
];

/**
 * Realiza el cálculo del puntaje final y promedios por criterio.
 */
function calcularPuntaje() {
    let respuestas = {};
    let todasRespondidas = true;

    // Capturar respuestas de las 12 preguntas (p1 a p12)
    for (let i = 1; i <= 12; i++) {
        const opciones = document.getElementsByName(`p${i}`);
        let valor = 0;
        for (const opt of opciones) {
            if (opt.checked) {
                valor = parseInt(opt.value);
                break;
            }
        }
        if (valor === 0) todasRespondidas = false;
        respuestas[i] = valor;
    }

    const divResultado = document.getElementById("resultado");
    if (!divResultado) return { todasRespondidas: false };

    if (!todasRespondidas) {
        divResultado.innerHTML = `
            <div class="alert alert-light border text-center">
                <p class="mb-0 text-muted">Responda todas las preguntas para obtener el puntaje final.</p>
            </div>
        `;
        return { todasRespondidas: false };
    }

    // --- CÁLCULOS POR CRITERIO (Para la tabla del PDF) ---
    
    // Criterio 1: Tiempo (P1-P3)
    const promTiempo = (respuestas[1] + respuestas[2] + respuestas[3]) / 3;
    const ponderadoTiempo = (respuestas[1] + respuestas[2] + respuestas[3]) * 0.100;

    // Criterio 2: Calidad (P4-P7)
    const promCalidad = (respuestas[4] + respuestas[5] + respuestas[6] + respuestas[7]) / 4;
    const ponderadoCalidad = (respuestas[4] + respuestas[5] + respuestas[6] + respuestas[7]) * 0.133;

    // Criterio 3: Precio (P8-P10)
    const promPrecio = (respuestas[8] + respuestas[9] + respuestas[10]) / 3;
    const ponderadoPrecio = (respuestas[8] + respuestas[9] + respuestas[10]) * 0.067;

    // Criterio 4: SST y Legales (P11-P12)
    const promSST = (respuestas[11] + respuestas[12]) / 2;
    const ponderadoSST = (respuestas[11] + respuestas[12]) * 0.033;

    // PUNTAJE FINAL (Suma de los 4 ponderados)
    const puntajeFinal = Number((ponderadoTiempo + ponderadoCalidad + ponderadoPrecio + ponderadoSST).toFixed(2));

    // Generar observación coherente automática
    const observacionAuto = generarObservacionCoherente(puntajeFinal);

    // Actualizar Interfaz de Usuario
    let colorClass = "alert-danger";
    if (puntajeFinal >= 4.5) colorClass = "alert-success";
    else if (puntajeFinal >= 3.5) colorClass = "alert-warning";

    divResultado.innerHTML = `
        <div class="alert ${colorClass} shadow-sm text-center">
            <h3 class="mb-1">PUNTAJE TOTAL: ${puntajeFinal.toFixed(2)} / 5.00</h3>
            <hr>
            <div class="row g-2">
                <div class="col-6 col-md-3"><strong>Tiempo:</strong>  
${promTiempo.toFixed(2)}</div>
                <div class="col-6 col-md-3"><strong>Calidad:</strong>  
${promCalidad.toFixed(2)}</div>
                <div class="col-6 col-md-3"><strong>Precio:</strong>  
${promPrecio.toFixed(2)}</div>
                <div class="col-6 col-md-3"><strong>SST/Leg:</strong>  
${promSST.toFixed(2)}</div>
            </div>
            <div class="mt-3 p-2 bg-white rounded border">
                <small class="text-muted d-block">Sugerencia de observación:</small>
                <span class="fst-italic">"${observacionAuto}"</span>
            </div>
        </div>
    `;

    return { 
        todasRespondidas: true, 
        puntaje: puntajeFinal, 
        respuestas,
        promedios: {
            tiempo: promTiempo,
            calidad: promCalidad,
            precio: promPrecio,
            sst: promSST
        },
        observacionSugerida: observacionAuto
    };
}

/**
 * Genera un comentario breve y coherente según el puntaje obtenido.
 */
function generarObservacionCoherente(puntaje) {
    if (puntaje >= 4.7) return "Proveedor excelente. Cumple con altos estándares de calidad y tiempos.";
    if (puntaje >= 4.0) return "Proveedor confiable con buen desempeño. Cumple los requisitos satisfactoriamente.";
    if (puntaje >= 3.5) return "Desempeño aceptable. Se sugiere seguimiento en los puntos de menor calificación.";
    if (puntaje >= 3.0) return "Nivel crítico. Requiere plan de mejora inmediato y supervisión estrecha.";
    return "Desempeño insuficiente. No cumple los estándares mínimos. Evaluar alternativas.";
}
