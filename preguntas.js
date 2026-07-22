// ==========================================
// PREGUNTAS.JS
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
// RENDERIZAR PREGUNTAS
//===============================

function renderizarPreguntas() {

    const contenedor =
        document.getElementById("contenedorPreguntas");

    contenedor.innerHTML = "";

    criterios.forEach(criterio => {

        const divCriterio =
            document.createElement("div");

        divCriterio.className = "criterio";

        divCriterio.textContent =
            `${criterio.criterio} (Peso: ${criterio.peso}%)`;

        contenedor.appendChild(divCriterio);


        criterio.preguntas.forEach(pregunta => {

            const divPregunta =
                document.createElement("div");

            divPregunta.className = "pregunta";

            divPregunta.innerHTML = `

                <div class="preguntaFila">

                    <div class="textoPregunta">
                        ${pregunta.id}. ${pregunta.texto}
                    </div>

                    <div class="opciones">

                        <label>
                            <input
                                type="radio"
                                name="p${pregunta.id}"
                                value="1"
                                onchange="calcularResultado(); generarObservacionesAutomaticas()"
                            >
                            <span>1</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="p${pregunta.id}"
                                value="2"
                                onchange="calcularResultado(); generarObservacionesAutomaticas()"
                            >
                            <span>2</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="p${pregunta.id}"
                                value="3"
                                onchange="calcularResultado(); generarObservacionesAutomaticas()"
                            >
                            <span>3</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="p${pregunta.id}"
                                value="4"
                                onchange="calcularResultado(); generarObservacionesAutomaticas()"
                            >
                            <span>4</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="p${pregunta.id}"
                                value="5"
                                onchange="calcularResultado(); generarObservacionesAutomaticas()"
                            >
                            <span>5</span>
                        </label>

                    </div>

                </div>
            `;

            contenedor.appendChild(divPregunta);

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

            const seleccionado =
                document.querySelector(
                    `input[name="p${pregunta.id}"]:checked`
                );

            respuestas[pregunta.id] =
                seleccionado
                    ? parseInt(seleccionado.value)
                    : null;

        });

    });

    return respuestas;

}


//=========================================
// GENERAR OBSERVACIONES BREVES
//=========================================

function generarObservacionesAutomaticas() {

    const campoObservaciones =
        document.getElementById("observaciones");

    if (!campoObservaciones) return;

    const respuestas = obtenerRespuestas();

    const valores = Object.values(respuestas)
        .filter(valor => valor !== null);

    if (valores.length === 0) {
        campoObservaciones.value = "";
        return;
    }

    const promedio =
        valores.reduce((a, b) => a + b, 0) / valores.length;

    let observacion = "";

    if (promedio >= 4.5) {

        observacion =
            "El proveedor presenta un desempeño excelente y consistente en los criterios evaluados. Se recomienda mantener las buenas prácticas identificadas y continuar fortaleciendo la calidad del servicio suministrado.";

    }

    else if (promedio >= 4.0) {

        observacion =
            "El proveedor presenta un desempeño favorable en los criterios evaluados, evidenciando un cumplimiento satisfactorio. Se identifican oportunidades puntuales de mejora que pueden ser fortalecidas mediante seguimiento continuo.";

    }

    else if (promedio >= 3.5) {

        observacion =
            "El desempeño general del proveedor es aceptable. Se recomienda fortalecer los aspectos con menor calificación y realizar seguimiento a las oportunidades de mejora identificadas.";

    }

    else {

        observacion =
            "Se identifican aspectos que requieren atención y acciones de mejora. Se recomienda establecer un seguimiento orientado al fortalecimiento del desempeño y la calidad del servicio suministrado.";

    }

    campoObservaciones.value = observacion;

}
//===============================
// LIMPIAR RESPUESTAS
//===============================

function limpiarRespuestas() {

    criterios.forEach(criterio => {

        criterio.preguntas.forEach(pregunta => {

            const radios =
                document.querySelectorAll(
                    `input[name="p${pregunta.id}"]`
                );

            radios.forEach(radio => {

                radio.checked = false;

            });

        });

    });

}
