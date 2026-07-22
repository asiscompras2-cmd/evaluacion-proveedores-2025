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

    const contenedor = document.getElementById("contenedorPreguntas");

    contenedor.innerHTML = "";

    criterios.forEach(criterio => {

        const divCriterio = document.createElement("div");

        divCriterio.className = "criterio";

        divCriterio.textContent =
            `${criterio.criterio} (Peso: ${criterio.peso}%)`;

        contenedor.appendChild(divCriterio);

        criterio.preguntas.forEach(pregunta => {

            const divPregunta = document.createElement("div");

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
                                onchange="calcularResultado()"
                            >
                            <span>1</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="p${pregunta.id}"
                                value="2"
                                onchange="calcularResultado()"
                            >
                            <span>2</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="p${pregunta.id}"
                                value="3"
                                onchange="calcularResultado()"
                            >
                            <span>3</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="p${pregunta.id}"
                                value="4"
                                onchange="calcularResultado()"
                            >
                            <span>4</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="p${pregunta.id}"
                                value="5"
                                onchange="calcularResultado()"
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

            const seleccionado = document.querySelector(
                `input[name="p${pregunta.id}"]:checked`
            );

            respuestas[pregunta.id] = seleccionado
                ? parseInt(seleccionado.value)
                : null;

        });

    });

    return respuestas;

}

//===============================
// LIMPIAR RESPUESTAS
//===============================

function limpiarRespuestas() {

    criterios.forEach(criterio => {

        criterio.preguntas.forEach(pregunta => {

            const radios = document.querySelectorAll(
                `input[name="p${pregunta.id}"]`
            );

            radios.forEach(r => r.checked = false);

        });

    });

}
