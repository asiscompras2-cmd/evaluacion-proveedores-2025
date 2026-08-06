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

function generarObservacionesAutomaticas() {

    const campoObservaciones = document.getElementById("observaciones");
    if (!campoObservaciones) return;

    const respuestas = obtenerRespuestas();
    const respondidas = Object.values(respuestas).filter(v => v !== null).length;

    if (respondidas === 0) {
        campoObservaciones.value = "";
        return;
    }

    const promedio =
        Object.values(respuestas).reduce((a, b) => a + b, 0) / respondidas;

    if (promedio >= 4.5) {
        campoObservaciones.value = "El proveedor obtuvo un desempeño excelente durante el período evaluado.";
    } else if (promedio >= 4.0) {
        campoObservaciones.value = "El proveedor obtuvo un buen desempeño y cumplió satisfactoriamente con los requisitos evaluados.";
    } else if (promedio >= 3.5) {
        campoObservaciones.value = "El proveedor presentó un desempeño aceptable con oportunidades de mejora.";
    } else if (promedio >= 3.0) {
        campoObservaciones.value = "El proveedor requiere acciones de mejora para fortalecer su desempeño.";
    } else {
        campoObservaciones.value = "El proveedor presentó un desempeño insuficiente y requiere un plan de mejoramiento.";
    }
}
