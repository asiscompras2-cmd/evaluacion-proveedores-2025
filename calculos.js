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
 * Realiza el cálculo del puntaje final y actualiza la interfaz premium.
 */
function calcularPuntaje() {
    let respuestas = {};
    let todasRespondidas = true;
    let totalPonderado = 0;

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
        
        // Sumamos al total ponderado usando los pesos definidos
        if (valor > 0) {
            totalPonderado += valor * PESOS[i - 1];
        }
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
    
    // Criterio 2: Calidad (P4-P7)
    const promCalidad = (respuestas[4] + respuestas[5] + respuestas[6] + respuestas[7]) / 4;

    // Criterio 3: Precio (P8-P10)
    const promPrecio = (respuestas[8] + respuestas[9] + respuestas[10]) / 3;

    // Criterio 4: SST y Legales (P11-P12)
    const promSST = (respuestas[11] + respuestas[12]) / 2;

    // PUNTAJE FINAL Y PORCENTAJE
    const puntajeFinal = Number(totalPonderado.toFixed(2));
    const porcentaje = (puntajeFinal / 5) * 100;

    // Clasificación y Color
    let clasificacion = "";
    let colorClase = "";
    if (puntajeFinal >= 4.5) { clasificacion = "EXCELENTE"; colorClase = "text-success"; }
    else if (puntajeFinal >= 4.0) { clasificacion = "BUENO"; colorClase = "text-primary"; }
    else if (puntajeFinal >= 3.5) { clasificacion = "ACEPTABLE"; colorClase = "text-warning"; }
    else { clasificacion = "INSUFICIENTE"; colorClase = "text-danger"; }

    // Generar observación coherente automática
    const observacionAuto = generarObservacionCoherente(puntajeFinal);

    // ACTUALIZACIÓN DE INTERFAZ PREMIUM
    divResultado.innerHTML = `
        <div class="resultado-premium shadow-sm border-0">
            <div class="resultado-header py-2" style="background-color: #6b8e23;">
                <h5 class="mb-0 text-white text-center"><i class="bi bi-trophy-fill"></i> RESULTADO DE LA EVALUACIÓN</h5>
            </div>
            <div class="card-body p-4 bg-white">
                <div class="row align-items-center text-center">
                    <div class="col-md-4">
                        <small class="text-muted d-block text-uppercase fw-bold">Puntaje</small>
                        <h2 class="display-4 fw-bold mb-0 ${colorClase}">${puntajeFinal.toFixed(1)}</h2>
                        <small class="text-muted">sobre 5.0</small>
                    </div>
                    <div class="col-md-4">
                        <small class="text-muted d-block text-uppercase fw-bold mb-2">Cumplimiento</small>
                        <div class="progress" style="height: 25px; border-radius: 12px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                                 role="progressbar" 
                                 style="width: ${porcentaje}%" 
                                 aria-valuenow="${porcentaje}" 
                                 aria-valuemin="0" 
                                 aria-valuemax="100">
                                 ${porcentaje.toFixed(0)}%
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <small class="text-muted d-block text-uppercase fw-bold">Clasificación</small>
                        <h3 class="fw-bold mb-0 ${colorClase}">${clasificacion}</h3>
                    </div>
                </div>
                <div class="mt-3 p-2 bg-light rounded border text-center">
                    <small class="text-muted d-block">Sugerencia de observación:</small>
                    <span class="fst-italic">"${observacionAuto}"</span>
                </div>
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
