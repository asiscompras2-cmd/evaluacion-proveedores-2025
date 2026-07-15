// ==========================================
// PROVEEDORES.JS
// Manejo de carga y filtrado de proveedores
// ==========================================

let datosProveedores = [];

//===============================
// CARGAR PROVEEDORES
//===============================

async function cargarProveedores() {
    try {
        const response = await fetch('data/proveedores.json');
        if (!response.ok) throw new Error("No se pudo cargar el archivo de proveedores.");
        
        datosProveedores = await response.json();
        console.log("Proveedores cargados:", datosProveedores.length);
        
        llenarComboAreas();
    } catch (error) {
        console.error("Error cargando proveedores:", error);
    }
}

//===============================
// LLENAR COMBO ÁREAS
//===============================

function llenarComboAreas() {
    const comboArea = document.getElementById("area");
    if (!comboArea) return;
    
    // Obtener áreas únicas y limpiar espacios
    const areas = [...new Set(datosProveedores.map(p => p.AREA))].filter(a => a).sort();
    
    comboArea.innerHTML = '<option value="">-- Seleccione un Área --</option>';
    areas.forEach(a => {
        const option = document.createElement("option");
        option.value = a;
        option.textContent = a;
        comboArea.appendChild(option);
    });

    // Usar onchange directo para asegurar compatibilidad total
    comboArea.onchange = function() {
        llenarComboProveedores(this.value);
    };
}

//===============================
// LLENAR COMBO PROVEEDORES
//===============================

function llenarComboProveedores(areaSeleccionada) {
    const comboProveedor = document.getElementById("proveedor");
    const nitInput = document.getElementById("nit");
    const servicioInput = document.getElementById("servicio");
    const cedulaActual = document.getElementById("cedula").value.trim();
    
    if (!comboProveedor) return;
    
    // Limpiar campos dependientes
    comboProveedor.innerHTML = '<option value="">-- Seleccione un Proveedor --</option>';
    if (nitInput) nitInput.value = "";
    if (servicioInput) servicioInput.value = "";

    if (!areaSeleccionada) return;

    // Obtener NITs ya evaluados por este evaluador (si hay cédula)
    let nitsEvaluados = [];
    if (cedulaActual && typeof obtenerHistorial === 'function') {
        const historial = obtenerHistorial();
        nitsEvaluados = historial
            .filter(e => e.cedula === cedulaActual)
            .map(e => String(e.nit)); // Asegurar comparación como string
    }

    // Filtrar por área
    const filtrados = datosProveedores.filter(p => p.AREA === areaSeleccionada);

    // Filtrar los que NO ha evaluado este usuario aún
    const pendientes = filtrados.filter(p => !nitsEvaluados.includes(String(p.NIT)));

    // Si ya evaluó a todos en el área, mostrar todos para permitir revisión si es necesario
    // Pero priorizar siempre los pendientes
    const listaAMostrar = (pendientes.length > 0) ? pendientes : filtrados;

    // Ordenar alfabéticamente
    listaAMostrar.sort((a, b) => {
        const nameA = String(a["NOMBRE DE PROVEEDOR"] || "");
        const nameB = String(b["NOMBRE DE PROVEEDOR"] || "");
        return nameA.localeCompare(nameB);
    });

    // Llenar el combo
    listaAMostrar.forEach(p => {
        const option = document.createElement("option");
        option.value = p["NOMBRE DE PROVEEDOR"];
        option.textContent = p["NOMBRE DE PROVEEDOR"];
        
        // Guardar datos en atributos data
        option.setAttribute("data-nit", p.NIT || "");
        option.setAttribute("data-servicio", p["BIEN O SERVICIO PRESTADO"] || "");
        
        comboProveedor.appendChild(option);
    });

    // Evento al cambiar proveedor
    comboProveedor.onchange = function() {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption && selectedOption.value) {
            if (nitInput) nitInput.value = selectedOption.getAttribute("data-nit");
            if (servicioInput) servicioInput.value = selectedOption.getAttribute("data-servicio");
        } else {
            if (nitInput) nitInput.value = "";
            if (servicioInput) servicioInput.value = "";
        }
    };
}
