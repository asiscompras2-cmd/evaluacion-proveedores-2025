// ==========================================
// APP.JS
// Parque Comercial El Tesoro
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    // Fecha automática
    const hoy = new Date();
    document.getElementById("fecha").value = hoy.toISOString().split("T")[0];

    // Recargar proveedores cuando cambia la cédula
    document.getElementById("cedula").addEventListener("input", () => {
        const area = document.getElementById("area").value;
        if (area) llenarComboProveedores(area);
    });

    // Cargar información inicial
    await cargarProveedores();
    await cargarPreguntas();

    // Botón Guardar (solo una vez)
    document.getElementById("btnGuardar").addEventListener("click", guardarEvaluacion);

    // Botón Excel
    const btnExcel = document.getElementById("btnExcel");
    if (btnExcel) {
        btnExcel.addEventListener("click", exportarExcel);
    }

    // Botón PDF
    const btnPDF = document.getElementById("btnPDF");
    if (btnPDF) {
        btnPDF.addEventListener("click", generarPDFISO);
    }

});


//====================================
// GUARDAR EVALUACIÓN
//====================================

async function guardarEvaluacion() {

    try {

        const nombre = document.getElementById("nombre").value.trim();
        const cedula = document.getElementById("cedula").value.trim();
        const proveedor = document.getElementById("proveedor").value;
        const observaciones = document.getElementById("observaciones").value.trim();

        if (!nombre) {
            return mostrarModal("Por favor ingrese el nombre del evaluador.");
        }

        if (!cedula) {
            return mostrarModal("Por favor ingrese la cédula del evaluador.");
        }

        if (!proveedor) {
            return mostrarModal("Por favor seleccione un proveedor.");
        }

        if (!observaciones) {
            return mostrarModal("Por favor ingrese las observaciones de la evaluación.");
        }

        const respuestas = obtenerRespuestas();

        const sinResponder = Object.values(respuestas).filter(v => v === null).length;

        if (sinResponder > 0) {
            return mostrarModal(`Faltan ${sinResponder} preguntas por responder.`);
        }

        const nit = document.getElementById("nit").value;

        // Verificar duplicado
        const duplicado = await existeEvaluacion(cedula, nit);

        if (duplicado) {
            return mostrarModal(
                `El evaluador con cédula ${cedula} ya registró una evaluación para este proveedor.`
            );
        }

        // Obtener puntaje
        let puntajeActual = 0;

        const resultadoH4 = document.querySelector("#resultado h4");

        if (resultadoH4) {

            const match = resultadoH4.textContent.match(/([\d.]+)/);

            if (match) {
                puntajeActual = parseFloat(match[1]);
            }
        }

        const evaluacion = {

            fecha: document.getElementById("fecha").value,
            nombre,
            cedula,
            area: document.getElementById("area").value,
            proveedor,
            nit,
            puntaje: puntajeActual,
            observaciones,
            respuestas

        };

        await guardarEnHistorial(evaluacion);

        mostrarModal("Evaluación guardada correctamente.");

        limpiarFormulario();

    } catch (error) {

        console.error("Error:", error);

        mostrarModal("Ocurrió un error al guardar la evaluación.");

    }

}


//====================================
// MODAL
//====================================

function mostrarModal(mensaje) {

    document.getElementById("mensajeModal").textContent = mensaje;

    const modal = new bootstrap.Modal(
        document.getElementById("modalMensaje")
    );

    modal.show();

}


//====================================
// PROTEGER HISTORIAL
//====================================

window.CLAVE_HISTORIAL = "Tesoro2025";

document.addEventListener("DOMContentLoaded", () => {

    const btnHistorial = document.getElementById("historial-tab");

    if (!btnHistorial) return;

    btnHistorial.addEventListener("click", function (e) {

        const clave = prompt("Ingrese la contraseña para acceder al historial:");

        if (clave !== window.CLAVE_HISTORIAL) {

            e.preventDefault();
            e.stopPropagation();

            mostrarModal("Contraseña incorrecta.");

            return false;

        }

    });

});


//====================================
// LIMPIAR FORMULARIO
//====================================

function limpiarFormulario() {

    document.getElementById("nombre").value = "";
    document.getElementById("cedula").value = "";

    document.getElementById("area").selectedIndex = 0;

    const proveedor = document.getElementById("proveedor");

    proveedor.innerHTML =
        '<option value="">Seleccione primero un área...</option>';

    document.getElementById("nit").value = "";
    document.getElementById("servicio").value = "";

    document.getElementById("observaciones").value = "";

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    document.getElementById("resultado").innerHTML = `
        <div class="alert alert-light border">
            <h4 class="text-muted">RESULTADO DE LA EVALUACIÓN</h4>
            <p>
                Responda todas las preguntas para obtener la calificación sobre
                <strong>5.00</strong>
            </p>
        </div>
    `;

}
