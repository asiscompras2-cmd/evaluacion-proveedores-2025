// ==========================================
// CALCULOS.JS - OBSERVACIONES DETALLADAS
// ==========================================

// 1. PESOS EXACTOS SEGÚN TABLA ISO
const PESOS = [
    0.100, 0.100, 0.100,        // Criterio 1: Tiempo de respuesta (30%)
    0.133, 0.133, 0.133, 0.133, // Criterio 2: Calidad (40%)
    0.067, 0.067, 0.067,        // Criterio 3: Precio (20%)
    0.033, 0.033                // Criterio 4: SST y Legales (10%)
];

/**
 * Función principal llamada por los botones de radio (onchange)
 */
function calcularResultado() {
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
        
        // Sumamos al total ponderado usando los pesos
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

    // --- CÁLCULOS POR CRITERIO ---
    const promTiempo = (respuestas[1] + respuestas[2] + respuestas[3]) / 3;
    const promCalidad = (respuestas[4] + respuestas[5] + respuestas[6] + respuestas[7]) / 4;
    const promPrecio = (respuestas[8] + respuestas[9] + respuestas[10]) / 3;
    const promSST = (respuestas[11] + respuestas[12]) / 2;

    const puntajeFinal = Number(totalPonderado.toFixed(2));
    const porcentaje = (puntajeFinal / 5) * 100;

    // Clasificación
    let clasificacion = "";
    let colorClase = "";
    if (puntajeFinal >= 4.5) { clasificacion = "EXCELENTE"; colorClase = "text-success"; }
    else if (puntajeFinal >= 4.0) { clasificacion = "BUENO"; colorClase = "text-primary"; }
    else if (puntajeFinal >= 3.5) { clasificacion = "ACEPTABLE"; colorClase = "text-warning"; }
    else { clasificacion = "INSUFICIENTE"; colorClase = "text-danger"; }

    // Generar observaciones detalladas por criterio
    const observacionAuto = generarObservacionDetallada(
        promTiempo, 
        promCalidad, 
        promPrecio, 
        promSST, 
        puntajeFinal
    );

    // Guardar observaciones en el campo oculto para guardar
    document.getElementById("observaciones").value = observacionAuto;

    // ACTUALIZACIÓN DE INTERFAZ
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
            </div>
        </div>
    `;

    return { 
        todasRespondidas: true, 
        puntaje: puntajeFinal, 
        respuestas,
        promedios: { tiempo: promTiempo, calidad: promCalidad, precio: promPrecio, sst: promSST }
    };
}

/**
 * OBSERVACIONES DETALLADAS POR CRITERIO
 * Genera análisis completo basado en puntajes de cada criterio
 */
function generarObservacionDetallada(promTiempo, promCalidad, promPrecio, promSST, puntajeFinal) {
    
    let observacion = "";

    // ========== TIEMPO DE RESPUESTA ==========
    if (promTiempo >= 4.5) {
        observacion += "• Tiempo de respuesta: Excelente oportunidad en entregas y capacidad de respuesta frente a requerimientos e imprevistos.\n\n";
    } else if (promTiempo >= 4.0) {
        observacion += "• Tiempo de respuesta: Buen desempeño en entregas y respuesta a requerimientos. Se recomienda mantener los estándares.\n\n";
    } else if (promTiempo >= 3.5) {
        observacion += "• Tiempo de respuesta: Desempeño aceptable. Se recomienda fortalecer la oportunidad en entregas y capacidad de respuesta.\n\n";
    } else {
        observacion += "• Tiempo de respuesta: Se evidencian retrasos en entregas y respuesta a requerimientos. Requiere mejora inmediata.\n\n";
    }

    // ========== CALIDAD DEL PRODUCTO/SERVICIO ==========
    if (promCalidad >= 4.5) {
        observacion += "• Calidad del producto o servicio: Se evidencia un excelente nivel de calidad, cumplimiento de especificaciones y adecuada atención a novedades y garantías.\n\n";
    } else if (promCalidad >= 4.0) {
        observacion += "• Calidad del producto o servicio: Buen nivel de calidad y cumplimiento de especificaciones. Atención adecuada a novedades.\n\n";
    } else if (promCalidad >= 3.5) {
        observacion += "• Calidad del producto o servicio: Calidad aceptable. Se recomienda fortalecer el cumplimiento de especificaciones y atención a garantías.\n\n";
    } else {
        observacion += "• Calidad del producto o servicio: Se evidencian deficiencias en calidad y especificaciones. Requiere plan de mejora.\n\n";
    }

    // ========== PRECIO Y CONDICIONES COMERCIALES ==========
    if (promPrecio >= 4.5) {
        observacion += "• Precio y condiciones comerciales: El proveedor ofrece condiciones comerciales altamente competitivas y favorables para el Parque Comercial.\n\n";
    } else if (promPrecio >= 4.0) {
        observacion += "• Precio y condiciones comerciales: Condiciones comerciales competitivas y favorables. Buena relación precio-calidad.\n\n";
    } else if (promPrecio >= 3.5) {
        observacion += "• Precio y condiciones comerciales: Condiciones comerciales aceptables. Se recomienda evaluar oportunidades de mejora en precios.\n\n";
    } else {
        observacion += "• Precio y condiciones comerciales: Condiciones comerciales no competitivas. Se requiere revisión de precios y términos.\n\n";
    }

    // ========== SST Y REQUISITOS LEGALES ==========
    if (promSST >= 4.5) {
        observacion += "• Cumplimiento de SST y requisitos legales: El proveedor demuestra un excelente cumplimiento de requisitos legales, documentales y de Seguridad y Salud en el Trabajo.\n\n";
    } else if (promSST >= 4.0) {
        observacion += "• Cumplimiento de SST y requisitos legales: Adecuado cumplimiento de requisitos legales y de Seguridad y Salud en el Trabajo.\n\n";
    } else if (promSST >= 3.5) {
        observacion += "• Cumplimiento de SST y requisitos legales: Cumplimiento básico de requisitos. Se recomienda fortalecer documentación y SST.\n\n";
    } else {
        observacion += "• Cumplimiento de SST y requisitos legales: Deficiencias en cumplimiento de requisitos legales y SST. Requiere atención inmediata.\n\n";
    }

    // ========== CONCLUSIÓN GENERAL ==========
    if (puntajeFinal >= 4.5) {
        observacion += "Conclusión: El proveedor obtuvo un desempeño excelente durante la evaluación. Se recomienda mantener las buenas prácticas evidenciadas y continuar fortaleciendo la relación comercial.";
    } else if (puntajeFinal >= 4.0) {
        observacion += "Conclusión: El proveedor obtuvo un buen desempeño. Se recomienda mantener los estándares actuales y continuar con la relación comercial.";
    } else if (puntajeFinal >= 3.5) {
        observacion += "Conclusión: El proveedor obtuvo un desempeño aceptable. Se recomienda seguimiento en los aspectos identificados para mejora.";
    } else if (puntajeFinal >= 3.0) {
        observacion += "Conclusión: El proveedor requiere plan de mejora inmediato. Se sugiere establecer cronograma de seguimiento y evaluación.";
    } else {
        observacion += "Conclusión: El desempeño es insuficiente. Se recomienda evaluar alternativas de proveedores.";
    }

    return observacion;
}
