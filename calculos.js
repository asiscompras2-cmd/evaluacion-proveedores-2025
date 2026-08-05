// ==========================================
// CALCULOS.JS
// Parque Comercial El Tesoro - Escala 1.0 a 5.0
// ==========================================

//===============================
// CALCULAR RESULTADO
//===============================

function calcularResultado() {

    const respuestas = obtenerRespuestas();

    const totalPreguntas = Object.keys(respuestas).length;
    const respondidas = Object.values(respuestas).filter(v => v !== null).length;

    if (respondidas < totalPreguntas) {

        document.getElementById("resultado").innerHTML = `
            <div class="alert alert-secondary">
                <h5 class="mb-2">
                    <i class="bi bi-hourglass-split"></i>
                    Resultado pendiente
                </h5>

                <p class="mb-0">
                    Ha respondido <strong>${respondidas}</strong> de
                    <strong>${totalPreguntas}</strong> preguntas.
                </p>
            </div>
        `;

        return;
    }

    let puntajeFinal = 0;

    criterios.forEach(criterio => {

        criterio.preguntas.forEach(pregunta => {

            const calificacion = respuestas[pregunta.id];

            puntajeFinal += calificacion * pregunta.valor;

        });

    });

    mostrarResultado(puntajeFinal);

}

//===============================
// MOSTRAR RESULTADO PREMIUM
//===============================

function mostrarResultado(puntaje) {

    const divResultado = document.getElementById("resultado");

    let color = "";
    let clase = "";
    let icono = "";
    let etiqueta = "";
    let mensaje = "";

    if (puntaje >= 4.5) {

        color = "success";
        clase = "bg-success";
        icono = "bi-trophy-fill";
        etiqueta = "EXCELENTE";
        mensaje = "El proveedor demuestra un desempeño sobresaliente y consistente en todos los criterios evaluados.";

    } else if (puntaje >= 3.75) {

        color = "primary";
        clase = "bg-primary";
        icono = "bi-check-circle-fill";
        etiqueta = "SATISFACTORIO";
        mensaje = "El proveedor cumple satisfactoriamente con los criterios establecidos.";

    } else if (puntaje >= 3.0) {

        color = "warning";
        clase = "bg-warning";
        icono = "bi-exclamation-triangle-fill";
        etiqueta = "ACEPTABLE";
        mensaje = "El proveedor requiere fortalecer algunos aspectos para mejorar su desempeño.";

    } else {

        color = "danger";
        clase = "bg-danger";
        icono = "bi-x-octagon-fill";
        etiqueta = "PLAN DE MEJORA";
        mensaje = "El proveedor presenta incumplimientos importantes y requiere un plan de mejoramiento.";

    }

    //========================================
    // PROMEDIO POR CRITERIO
    //========================================

    let tabla = "";

    criterios.forEach(c => {

        let suma = 0;

        c.preguntas.forEach(p => {

            suma += obtenerRespuestas()[p.id];

        });

        const promedio = suma / c.preguntas.length;

        tabla += `
            <tr>
                <td>${c.criterio}</td>
                <td class="text-center fw-bold">${promedio.toFixed(1)}</td>
            </tr>
        `;

    });

    const porcentaje = (puntaje / 5 * 100).toFixed(0);

    divResultado.innerHTML = `

<div class="card shadow border-0">

<div class="card-header ${clase} text-white">

<h4 class="mb-0">

<i class="bi ${icono}"></i>

RESULTADO DE LA EVALUACIÓN

</h4>

</div>

<div class="card-body">

<div class="row text-center mb-3">

<div class="col-md-4">

<h6 class="text-muted">PUNTAJE</h6>

<h1 class="fw-bold text-${color}">
${puntaje.toFixed(1)}
</h1>

<small>sobre 5.0</small>

</div>

<div class="col-md-4">

<h6 class="text-muted">CUMPLIMIENTO</h6>

<div class="progress mt-2" style="height:25px;">

<div class="progress-bar ${clase}"
style="width:${porcentaje}%">

${porcentaje}%

</div>

</div>

</div>

<div class="col-md-4">

<h6 class="text-muted">CLASIFICACIÓN</h6>

<h5 class="fw-bold text-${color}">
${etiqueta}
</h5>

</div>

</div>

<div class="alert alert-light border">

${mensaje}

</div>

<h6 class="fw-bold mb-3">

<i class="bi bi-bar-chart-fill"></i>

Resultado por criterio

</h6>

<table class="table table-bordered table-sm align-middle">

<thead class="table-secondary">

<tr>

<th>Criterio</th>

<th width="120" class="text-center">

Resultado

</th>

</tr>

</thead>

<tbody>

${tabla}

</tbody>

</table>

</div>

</div>

`;

}
