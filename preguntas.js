// ==========================================
// PREGUNTAS.JS - VERSIÓN PREMIUM INTEGRADA
// Parque Comercial El Tesoro
// ==========================================

let criterios = [];

//===============================
// CARGAR PREGUNTAS
//===============================
async function cargarPreguntas() {
    try {
        const respuesta = await fetch("preguntas.json");
        if (!respuesta.ok) {
            throw new Error("No fue posible leer preguntas.json");
        }
        criterios = await respuesta.json();
        renderizarPreguntas();
    } catch (error) {
        console.error(error);
        alert("No fue posible cargar las preguntas de evaluación.");
    }
}

//===============================
// RENDERIZAR PREGUNTAS (DISEÑO PREMIUM)
//===============================
function renderizarPreguntas() {
    const contenedor = document.getElementById("contenedorPreguntas");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    criterios.forEach(criterio => {
        // Fila de Categoría (Criterio)
        const filaCategoria = document.createElement("tr");
        filaCategoria.innerHTML = `
            <td colspan="6" style="background-color: #f1f5f9; font-weight: bold; color: #475569; padding: 12px 15px;">
                <i class="bi bi-bookmark-fill me-2"></i> ${criterio.criterio} (Peso: ${criterio.peso}%)
            </td>
        `;
        contenedor.appendChild(filaCategoria);

        // Filas de Preguntas
        criterio.preguntas.forEach(pregunta => {
            const filaPregunta = document.createElement("tr");
            
            filaPregunta.innerHTML = `
                <td>${pregunta.id}. ${pregunta.texto}</td>
                <td>
                    <label class="option-label">
                        <input type="radio" name="p${pregunta.id}" value="1" class="radio-input val-1" onchange="calcularResultado(); generarObservacionesAutomaticas()">
                        <span class="custom-radio"></span>
                    </label>
                </td>
                <td>
                    <label class="option-label">
                        <input type="radio" name="p${pregunta.id}" value="2" class="radio-input val-2" onchange="calcularResultado(); generarObservacionesAutomaticas()">
                        <span class="custom-radio"></span>
                    </label>
                </td>
                <td>
                    <label class="option-label">
                        <input type="radio" name="p${pregunta.id}" value="3" class="radio-input val-3" onchange="calcularResultado(); generarObservacionesAutomaticas()">
                        <span class="custom-radio"></span>
                    </label>
                </td>
                <td>
                    <label class="option-label">
                        <input type="radio" name="p${pregunta.id}" value="4" class="radio-input val-4" onchange="calcularResultado(); generarObservacionesAutomaticas()">
                        <span class="custom-radio"></span>
                    </label>
                </td>
                <td>
                    <label class="option-label">
                        <input type="radio" name="p${pregunta.id}" value="5" class="radio-input val-5" onchange="calcularResultado(); generarObservacionesAutomaticas()">
                        <span class="custom-radio"></span>
                    </label>
                </td>
            `;
            contenedor.appendChild(filaPregunta);
        });
    });
}

//===============================
// OBTENER RESPUESTAS
//===============================
function obtenerRespuestas() {
    const respuestas = {};
    criterios.forEach(criterio => {
        criterio.preguntas.forEach(pregunta => {
            const seleccionado = document.querySelector(`input[name="p${pregunta.id}"]:checked`);
            respuestas[pregunta.id] = seleccionado ? parseInt(seleccionado.value) : null;
        });
    });
    return respuestas;
}

//=========================================
// GENERAR OBSERVACIONES AUTOMÁTICAS
//=========================================
function generarObservacionesAutomaticas() {

    const campoObservaciones = document.getElementById("observaciones");

    if (!campoObservaciones) return;

    const respuestas = obtenerRespuestas();

    const respondidas = Object.values(respuestas).filter(v => v !== null).length;

    if (respondidas === 0) {
        campoObservaciones.value = "";
        return;
    }

    let observaciones = [];
    let promedioGeneral = 0;
    let totalPreguntas = 0;

    criterios.forEach(criterio => {

        let suma = 0;

        criterio.preguntas.forEach(pregunta => {
            const valor = respuestas[pregunta.id];

            if (valor != null) {
                suma += valor;
                promedioGeneral += valor;
                totalPreguntas++;
            }
        });

        const promedio = suma / criterio.preguntas.length;

        switch (criterio.criterio) {

            //====================================
            // TIEMPO DE RESPUESTA
            //====================================

            case "TIEMPO DE RESPUESTA":

                if (promedio >= 4.5) {

                    observaciones.push(
                        "• Tiempo de respuesta: Se evidencia un excelente cumplimiento en los tiempos de entrega, capacidad de reacción y atención oportuna de los requerimientos del Parque Comercial."
                    );

                } else if (promedio >= 4) {

                    observaciones.push(
                        "• Tiempo de respuesta: El proveedor cumple satisfactoriamente con los tiempos de respuesta y entrega, presentando únicamente oportunidades menores de mejora."
                    );

                } else if (promedio >= 3.5) {

                    observaciones.push(
                        "• Tiempo de respuesta: Se recomienda fortalecer la oportunidad en las entregas y la capacidad de respuesta frente a requerimientos e imprevistos."
                    );

                } else {

                    observaciones.push(
                        "• Tiempo de respuesta: Se identifican incumplimientos en los tiempos de entrega y respuesta que requieren acciones de mejora inmediata."
                    );

                }

                break;

            //====================================
            // CALIDAD
            //====================================

            case "CALIDAD DEL PRODUCTO / SERVICIO":

                if (promedio >= 4.5) {

                    observaciones.push(
                        "• Calidad del producto o servicio: Se evidencia un excelente nivel de calidad, cumplimiento de especificaciones y adecuada atención a novedades y garantías."
                    );

                } else if (promedio >= 4) {

                    observaciones.push(
                        "• Calidad del producto o servicio: La calidad suministrada cumple satisfactoriamente con los estándares definidos por el Parque Comercial."
                    );

                } else if (promedio >= 3.5) {

                    observaciones.push(
                        "• Calidad del producto o servicio: Se identifican oportunidades de mejora relacionadas con la calidad del servicio y la atención de reclamaciones."
                    );

                } else {

                    observaciones.push(
                        "• Calidad del producto o servicio: Se presentan deficiencias importantes en la calidad suministrada, por lo que se recomienda implementar acciones correctivas."
                    );

                }

                break;

            //====================================
            // PRECIO Y CONDICIONES
            //====================================

            case "PRECIO Y CONDICIONES":

                if (promedio >= 4.5) {

                    observaciones.push(
                        "• Precio y condiciones comerciales: El proveedor ofrece condiciones comerciales altamente competitivas y favorables para el Parque Comercial."
                    );

                } else if (promedio >= 4) {

                    observaciones.push(
                        "• Precio y condiciones comerciales: Las condiciones comerciales ofrecidas son satisfactorias y acordes con las necesidades de la organización."
                    );

                } else if (promedio >= 3.5) {

                    observaciones.push(
                        "• Precio y condiciones comerciales: Se recomienda revisar oportunidades de mejora relacionadas con precios, negociación y flexibilidad comercial."
                    );

                } else {

                    observaciones.push(
                        "• Precio y condiciones comerciales: Las condiciones comerciales requieren ser revisadas para incrementar la competitividad y el beneficio para ambas partes."
                    );

                }

                break;

            //====================================
            // SST
            //====================================

            case "CUMPLIMIENTO DE SST Y REQUISITOS LEGALES":

                if (promedio >= 4.5) {

                    observaciones.push(
                        "• Cumplimiento de SST y requisitos legales: El proveedor demuestra un adecuado cumplimiento de los requisitos legales, documentales y de Seguridad y Salud en el Trabajo."
                    );

                } else if (promedio >= 4) {

                    observaciones.push(
                        "• Cumplimiento de SST y requisitos legales: El cumplimiento de la documentación y requisitos legales es satisfactorio."
                    );

                } else if (promedio >= 3.5) {

                    observaciones.push(
                        "• Cumplimiento de SST y requisitos legales: Se recomienda fortalecer el control documental y mantener actualizados los requisitos legales y de SST."
                    );

                } else {

                    observaciones.push(
                        "• Cumplimiento de SST y requisitos legales: Se identifican incumplimientos documentales y de SST que requieren atención inmediata."
                    );

                }

                break;

        }

    });

    //---------------------------------------------------
    // CONCLUSIÓN GENERAL
    //---------------------------------------------------

    const promedioFinal = promedioGeneral / totalPreguntas;

    observaciones.push("");

    if (promedioFinal >= 4.5) {

        observaciones.push(
            "Conclusión: El proveedor obtuvo un desempeño excelente durante la evaluación. Se recomienda mantener las buenas prácticas evidenciadas y continuar fortaleciendo la relación comercial."
        );

    } else if (promedioFinal >= 4) {

        observaciones.push(
            "Conclusión: El proveedor presenta un desempeño satisfactorio. Se recomienda mantener las fortalezas identificadas y continuar implementando acciones de mejora continua."
        );

    } else if (promedioFinal >= 3.5) {

        observaciones.push(
            "Conclusión: El desempeño general del proveedor es aceptable. Se recomienda formular acciones de mejora orientadas a fortalecer los criterios con menor calificación."
        );

    } else {

        observaciones.push(
            "Conclusión: Como resultado de la evaluación, se requiere la implementación de un plan de mejoramiento que permita fortalecer el desempeño del proveedor y garantizar el cumplimiento de los estándares del Parque Comercial El Tesoro P.H."
        );

    }

    campoObservaciones.value = observaciones.join("\n\n");

}
//===============================
// LIMPIAR RESPUESTAS
//===============================
function limpiarRespuestas() {
    criterios.forEach(criterio => {
        criterio.preguntas.forEach(pregunta => {
            const radios = document.querySelectorAll(`input[name="p${pregunta.id}"]`);
            radios.forEach(radio => { radio.checked = false; });
        });
    });
}

// Inicializar al cargar el documento
document.addEventListener("DOMContentLoaded", cargarPreguntas);
