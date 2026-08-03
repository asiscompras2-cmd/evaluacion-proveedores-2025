const preguntas = [
    { id: 1, texto: "Calidad de los productos o servicios entregados." },
    { id: 2, texto: "Cumplimiento de los plazos de entrega acordados." },
    { id: 3, texto: "Capacidad de respuesta ante urgencias o cambios." },
    { id: 4, texto: "Competitividad en precios y condiciones comerciales." },
    { id: 5, texto: "Cumplimiento de requisitos legales, de seguridad y salud." },
    { id: 6, texto: "Atención al cliente y soporte técnico brindado." }
];

function cargarPreguntas() {
    const contenedor = document.getElementById("contenedorPreguntas");
    if (!contenedor) return;

    contenedor.innerHTML = ""; // Limpiar contenido previo

    preguntas.forEach((p) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${p.texto}</td>
            <td>
                <label class="option-label">
                    <input type="radio" name="p${p.id}" value="1" class="radio-input val-1" required>
                    <span class="custom-radio"></span>
                </label>
            </td>
            <td>
                <label class="option-label">
                    <input type="radio" name="p${p.id}" value="2" class="radio-input val-2" required>
                    <span class="custom-radio"></span>
                </label>
            </td>
            <td>
                <label class="option-label">
                    <input type="radio" name="p${p.id}" value="3" class="radio-input val-3" required>
                    <span class="custom-radio"></span>
                </label>
            </td>
            <td>
                <label class="option-label">
                    <input type="radio" name="p${p.id}" value="4" class="radio-input val-4" required>
                    <span class="custom-radio"></span>
                </label>
            </td>
            <td>
                <label class="option-label">
                    <input type="radio" name="p${p.id}" value="5" class="radio-input val-5" required>
                    <span class="custom-radio"></span>
                </label>
            </td>
        `;
        contenedor.appendChild(fila);
    });

    // Agregar eventos para recalcular el puntaje cada vez que se marque una opción
    document.querySelectorAll('.radio-input').forEach(input => {
        input.addEventListener('change', () => {
            if (typeof actualizarResultado === 'function') {
                actualizarResultado();
            }
        });
    });
}

// Inicializar al cargar el documento
document.addEventListener("DOMContentLoaded", cargarPreguntas);
