// ==========================================
// CALCULOS.JS
// Parque Comercial El Tesoro - Escala 1.0 a 5.0
// ==========================================

//===============================
// CALCULAR RESULTADO
//===============================

function calcularResultado() {

    const respuestas = obtenerRespuestas();

    // Verificar si todas las preguntas están respondidas
    const totalPreguntas = Object.keys(respuestas).length;
    const respondidas    = Object.values(respuestas).filter(v => v !== null).length;

    if (respondidas < totalPreguntas) {
        const divResultado = document.getElementById("resultado");
        divResultado.innerHTML = `
            <div class="alert alert-secondary">
                <h4>Resultado pendiente</h4>
                <p>Ha respondido ${respondidas} de ${totalPreguntas} preguntas.</p>
            </div>
        `;
        return;
    }

    // Calcular puntaje ponderado sobre 5.0
    // La fórmula es: Suma(Calificación * PesoRelativo)
    // Donde Suma(PesoRelativo) = 1 (100%)
    let puntajeFinal = 0;

    criterios.forEach(criterio => {
        let sumaCriterio = 0;
        
        criterio.preguntas.forEach(pregunta => {
            const calificacion = respuestas[pregunta.id]; // Valor de 1 a 5
            sumaCriterio += calificacion * pregunta.valor; // pregunta.valor es su peso relativo dentro del total (0.10, 0.05, etc.)
        });

        // Como pregunta.valor ya suma el 100% (1.0) entre todas las preguntas, 
        // la sumaCriterio ya es el aporte directo a la escala de 5.
        puntajeFinal += sumaCriterio;
    });

    mostrarResultado(puntajeFinal);

}

//===============================
// MOSTRAR RESULTADO
//===============================

function mostrarResultado(puntaje) {

    const divResultado = document.getElementById("resultado");

    let clase    = "";
    let etiqueta = "";
    let icono    = "";

    // Rangos ajustados a escala 5.0 (90% = 4.5, 75% = 3.75, 60% = 3.0)
    if (puntaje >= 4.5) {
        clase    = "resultadoExcelente";
        etiqueta = "EXCELENTE PROVEEDOR";
        icono    = "bi-star-fill";
    } else if (puntaje >= 3.75) {
        clase    = "resultadoAprobado";
        etiqueta = "PROVEEDOR APROBADO";
        icono    = "bi-check-circle-fill";
    } else if (puntaje >= 3.0) {
        clase    = "resultadoAceptable";
        etiqueta = "PROVEEDOR ACEPTABLE";
        icono    = "bi-exclamation-circle-fill";
    } else {
        clase    = "resultadoPlan";
        etiqueta = "REQUIERE PLAN DE MEJORA";
        icono    = "bi-x-circle-fill";
    }

    divResultado.innerHTML = `
        <div class="${clase}">
            <h3>
                <i class="bi ${icono}"></i>
                ${etiqueta}
            </h3>
            <h4>Calificación Final: ${puntaje.toFixed(2)} / 5.00</h4>
            <p>
                ${puntaje >= 4.5
                    ? "El proveedor cumple de manera sobresaliente con todos los criterios de evaluación."
                    : puntaje >= 3.75
                    ? "El proveedor cumple satisfactoriamente con los criterios de evaluación."
                    : puntaje >= 3.0
                    ? "El proveedor cumple de manera básica. Se recomienda seguimiento."
                    : "El proveedor no cumple con los estándares mínimos. Se requiere plan de mejora inmediato."
                }
            </p>
        </div>
    `;

}
