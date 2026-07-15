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

        // Encabezado del criterio
        const divCriterio = document.createElement("div");
        divCriterio.className = "criterio";
        divCriterio.textContent = `${criterio.criterio}  (Peso: ${criterio.peso}%)`;
        contenedor.appendChild(divCriterio);

        // Preguntas del criterio
        criterio.preguntas.forEach(pregunta => {

            const divPregunta = document.createElement("div");
            divPregunta.className = "pregunta";

            divPregunta.innerHTML = `
                <p class="textoPregunta">
                    ${pregunta.id}. ${pregunta.texto}
                </p>
                <div class="opciones">
                    <label>
                        <input type="radio" name="p${pregunta.id}" value="5"
                               onchange="calcularResultado()">
                        Excelente (5)
                    </label>
                    <label>
                        <input type="radio" name="p${pregunta.id}" value="4"
                               onchange="calcularResultado()">
                        Bueno (4)
                    </label>
                    <label>
                        <input type="radio" name="p${pregunta.id}" value="3"
                               onchange="calcularResultado()">
                        Aceptable (3)
                    </label>
                    <label>
                        <input type="radio" name="p${pregunta.id}" value="2"
                               onchange="calcularResultado()">
                        Deficiente (2)
                    </label>
                    <label>
                        <input type="radio" name="p${pregunta.id}" value="1"
                               onchange="calcularResultado()">
                        Inaceptable (1)
                    </label>
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
