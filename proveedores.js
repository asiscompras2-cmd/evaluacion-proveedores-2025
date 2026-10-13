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
        const response = await fetch('proveedores.json')
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

async function llenarComboProveedores(areaSeleccionada) {
    const comboProveedor = document.getElementById("proveedor");
    const nitInput = document.getElementById("nit");
    const servicioInput = document.getElementById("servicio");
    const cedulaInput = document.getElementById("cedula");

    if (!comboProveedor) return;

    const cedulaActual = cedulaInput
        ? cedulaInput.value.trim()
        : "";

    let nitsEvaluados = [];

    // Normalizar NIT para comparar aunque tenga puntos, espacios o guiones
    const normalizarNit = valor =>
        String(valor ?? "")
            .trim()
            .replace(/[.\-\s]/g, "");

    if (cedulaActual) {
        const { data, error } = await window.supabaseClient
            .from("evaluaciones")
            .select("nit")
            .eq("cedula", cedulaActual);

        if (error) {
            console.error(
                "Error consultando NIT evaluados:",
                error
            );
        } else {
            nitsEvaluados = (data || [])
                .map(evaluacion =>
                    normalizarNit(evaluacion.nit)
                )
                .filter(Boolean);
        }
    }

    // Limpiar campos dependientes
    comboProveedor.innerHTML =
        '<option value="">-- Seleccione un Proveedor --</option>';

    if (nitInput) nitInput.value = "";
    if (servicioInput) servicioInput.value = "";

    if (!areaSeleccionada) return;

    // Filtrar proveedores del área seleccionada
    const areaNormalizada = String(areaSeleccionada)
        .trim()
        .toLowerCase();

    const filtrados = datosProveedores.filter(proveedor =>
        String(proveedor.AREA ?? "")
            .trim()
            .toLowerCase() === areaNormalizada
    );

    // Dejar únicamente los proveedores cuyo NIT no está evaluado
    const pendientes = filtrados.filter(proveedor => {
        const nitProveedor = normalizarNit(proveedor.NIT);

        return (
            nitProveedor !== "" &&
            !nitsEvaluados.includes(nitProveedor)
        );
    });

    // IMPORTANTE: no cambiar por "filtrados"
    const listaAMostrar = pendientes;

    // Ordenar alfabéticamente
    listaAMostrar.sort((a, b) => {
        const nombreA = String(
            a["NOMBRE DE PROVEEDOR"] ?? ""
        );

        const nombreB = String(
            b["NOMBRE DE PROVEEDOR"] ?? ""
        );

        return nombreA.localeCompare(
            nombreB,
            "es",
            { sensitivity: "base" }
        );
    });

    // Mostrar mensaje cuando no haya pendientes
    if (listaAMostrar.length === 0) {
        const option = document.createElement("option");

        option.value = "";
        option.textContent =
            "-- No hay proveedores pendientes --";

        comboProveedor.appendChild(option);
    }

    // Cargar proveedores pendientes
    listaAMostrar.forEach(proveedor => {
        const option = document.createElement("option");

        option.value =
            proveedor["NOMBRE DE PROVEEDOR"];

        option.textContent =
            proveedor["NOMBRE DE PROVEEDOR"];

        option.setAttribute(
            "data-nit",
            proveedor.NIT ?? ""
        );

        option.setAttribute(
            "data-servicio",
            proveedor["BIEN O SERVICIO PRESTADO"] ?? ""
        );

        comboProveedor.appendChild(option);
    });

    // Cargar NIT y servicio al seleccionar proveedor
    comboProveedor.onchange = function () {
        const selectedOption =
            this.options[this.selectedIndex];

        if (selectedOption && selectedOption.value) {
            if (nitInput) {
                nitInput.value =
                    selectedOption.getAttribute("data-nit") || "";
            }

            if (servicioInput) {
                servicioInput.value =
                    selectedOption.getAttribute("data-servicio") || "";
            }
        } else {
            if (nitInput) nitInput.value = "";
            if (servicioInput) servicioInput.value = "";
        }
    };

    console.log("Cédula consultada:", cedulaActual);
    console.log("NIT evaluados:", nitsEvaluados);
    console.log("Proveedores del área:", filtrados.length);
    console.log("Proveedores pendientes:", pendientes.length);
}

    // Ordenar alfabéticamente
    listaAMostrar.sort((a, b) => {
        const nameA = String(a["NOMBRE DE PROVEEDOR"] || "");
        const nameB = String(b["NOMBRE DE PROVEEDOR"] || "");
        return nameA.localeCompare(nameB);
    });

    // Llenar el combo
    if (listaAMostrar.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "-- No hay proveedores pendientes --";
    comboProveedor.appendChild(option);
}
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
async function obtenerNitsEvaluados(cedula) {
    const normalizarNit = valor =>
        String(valor ?? "")
            .trim()
            .replace(/[.\-\s]/g, "");

    const { data, error } = await window.supabaseClient
        .from("evaluaciones")
        .select("nit")
        .eq("cedula", String(cedula).trim());

    if (error) {
        console.error(
            "Error consultando evaluaciones:",
            error
        );

        return [];
    }

    return (data || [])
        .map(evaluacion =>
            normalizarNit(evaluacion.nit)
        )
        .filter(Boolean);
}

