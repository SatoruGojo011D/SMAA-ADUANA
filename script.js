document.addEventListener('DOMContentLoaded', () => {
    console.log("SMAA Engine Unificado v3 - Control Total Fronterizo Activado.");

    // Base de datos estática simulada de la PDI para la defensa (RF-4)
    const rutsConArraigoPdi = ["12345678-9", "11111111-1"];

    // Pantallas
    const screenLogin = document.getElementById('screen-login');
    const screenForm = document.getElementById('screen-form');
    const screenQr = document.getElementById('screen-qr');
    const screenDashboard = document.getElementById('screen-dashboard');
    const screenDirector = document.getElementById('screen-director');

    // Botones Navegación
    const btnClaveUnica = document.getElementById('btn-claveunica');
    const btnFuncionario = document.getElementById('btn-funcionario');
    const btnDirector = document.getElementById('btn-director');
    const btnLogoutDashboard = document.getElementById('btn-logout-dashboard');
    const btnLogoutDirector = document.getElementById('btn-logout-director');
    const btnRestart = document.getElementById('btn-restart');

    // Inputs y Formulario Ciudadano
    const inputRut = document.getElementById('rut');
    const rutError = document.getElementById('rut-error');
    const inputPatente = document.getElementById('patente');
    const smaaForm = document.getElementById('smaa-form');
    const apiStatus = document.getElementById('api-status');
    const folioIdSpan = document.getElementById('folio-id');

    // Módulos Condicionales
    const checkboxMenores = document.getElementById('menores');
    const sectionMenoresDetalle = document.getElementById('section-menores-detalle');
    const checkboxSag = document.getElementById('sag-declaracion');
    const sectionSagDetalle = document.getElementById('section-sag-detalle');
    const selectSagTipo = document.getElementById('sag-tipo');

    // Operación de Caseta
    const inputSearchFolio = document.getElementById('search-folio');
    const btnSearch = document.getElementById('btn-search');
    const panelTramiteDetalle = document.getElementById('panel-tramite-detalle');
    const btnApproveControl = document.getElementById('btn-approve-control');
    const btnRejectControl = document.getElementById('btn-reject-control');
    const tableAuditLogs = document.getElementById('table-audit-logs');

    let currentFolioEnEvaluacion = null;

    // --- ALGORITMO INTEGRAL: VALIDACIÓN DE RUT CHILENO (DV) ---
    function validarRutChileno(rutCompleto) {
        if (!/^[0-9]+-[0-9kK]{1}$/.test(rutCompleto)) return false;
        const tmp = rutCompleto.split('-');
        let digv = tmp[1].toUpperCase();
        let rut = tmp[0];
        if (digv == 'K') digv = 'k';
        
        let M = 0, S = 1;
        for (; rut; rut = Math.floor(rut / 10)) {
            S = (S + rut % 10 * (9 - M++ % 6)) % 11;
        }
        return S ? S - 1 : 'k';
    }

    // Formateador dinámico y validador de RUT
    if (inputRut) {
        inputRut.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9kK-]/g, '');
            e.target.value = value;
            
            if (value.includes('-') && value.split('-')[1].length >= 1) {
                rutError.style.display = validarRutChileno(value) ? 'none' : 'block';
            }
        });
    }

    // Filtro estricto para Patentes
    if (inputPatente) {
        inputPatente.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        });
    }

    // --- MOTOR DE SEGURIDAD INTERNA: CONTROL DE FRAUDES Y CLONACIONES ---
    function verificarPatenteDuplicada(patente, folioActual) {
        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave && clave.startsWith("SMAA-") && clave !== folioActual) {
                const registro = JSON.parse(localStorage.getItem(clave));
                if (registro.patente === patente && registro.estado === "Aprobado") {
                    return true; 
                }
            }
        }
        return false;
    }

    // --- RENDERIZADOR DEL HISTORIAL DE AUDITORÍA (CASETA) ---
    function cargarTablaAuditoria() {
        if (!tableAuditLogs) return;
        let registrosProcesados = [];
        let conteoTurno = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave && clave.startsWith("SMAA-")) {
                const registro = JSON.parse(localStorage.getItem(clave));
                if (registro.estado === "Aprobado" || registro.estado === "Rechazado") {
                    registrosProcesados.push(registro);
                    conteoTurno++;
                }
            }
        }

        // Actualizar el header del historial dinámicamente con el total
        document.getElementById('total-vehiculos').innerText = `Últimos Procesados en Turno (${conteoTurno})`;

        if (registrosProcesados.length === 0) {
            tableAuditLogs.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #aaa; padding: 10px;">Ningún vehículo procesado en este turno.</td></tr>`;
            return;
        }

        tableAuditLogs.innerHTML = registrosProcesados.map(reg => {
            const colorEstado = reg.estado === "Aprobado" ? "#2ecc71" : "#e74c3c";
            return `
                <tr style="border-bottom: 1px solid #edf2f7; color: #4a5568;">
                    <td style="padding: 6px 4px; font-weight: bold;">${reg.idFolio}</td>
                    <td style="padding: 6px 4px;">${reg.patente}</td>
                    <td style="padding: 6px 4px; text-align: right; color: ${colorEstado}; font-weight: bold;">${reg.estado}</td>
                </tr>
            `;
        }).join('');
    }

    // --- NAVEGACIÓN SPA ---
    if (btnClaveUnica) btnClaveUnica.addEventListener('click', () => { switchScreen(screenForm); });
    if (btnFuncionario) btnFuncionario.addEventListener('click', () => { switchScreen(screenDashboard); panelTramiteDetalle.classList.add('hidden'); inputSearchFolio.value = ''; cargarTablaAuditoria(); });
    if (btnDirector) btnDirector.addEventListener('click', () => { switchScreen(screenDirector); calcularMetricasDirectivas(); });
    if (btnLogoutDashboard) btnLogoutDashboard.addEventListener('click', () => { switchScreen(screenLogin); });
    if (btnLogoutDirector) btnLogoutDirector.addEventListener('click', () => { switchScreen(screenLogin); });
    if (btnRestart) btnRestart.addEventListener('click', () => { switchScreen(screenLogin); });

    function switchScreen(targetScreen) {
        [screenLogin, screenForm, screenQr, screenDashboard, screenDirector].forEach(s => s.classList.remove('active'));
        targetScreen.classList.add('active');
    }

    // Modificadores condicionales de interfaz (Menores y SAG)
    if (checkboxMenores) {
        checkboxMenores.addEventListener('change', (e) => {
            sectionMenoresDetalle.classList.toggle('hidden', !e.target.checked);
            document.getElementById('rut-menor').required = e.target.checked;
        });
    }

    if (checkboxSag) {
        checkboxSag.addEventListener('change', (e) => {
            sectionSagDetalle.classList.toggle('hidden', !e.target.checked);
        });
    }

    // --- LOGICA DISPARADORA: FORMULARIO CIUDADANO ---
    if (smaaForm) {
        smaaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validarRutChileno(inputRut.value)) {
                alert("No se puede continuar: Formato de RUT inválido.");
                return;
            }

            apiStatus.classList.remove('hidden');
            apiStatus.className = "status-box loading";
            apiStatus.innerHTML = "Sincronizando con APIs del Estado (Aduanas - PDI - SAG)...";

            setTimeout(() => {
                const randomFolio = Math.floor(100000 + Math.random() * 900000);
                const idFolioGenerado = `SMAA-${randomFolio}`;

                let glosaSag = "Nada que declarar (Canal Verde)";
                if (checkboxSag.checked) glosaSag = `SÍ DECLARA - Tipo: ${selectSagTipo.value} (Andén Físico)`;

                const estructuraFormulario = {
                    idFolio: idFolioGenerado,
                    rutPropietario: inputRut.value,
                    patente: inputPatente.value,
                    marca: document.getElementById('marca').value,
                    modelo: document.getElementById('modelo').value,
                    llevaMenores: checkboxMenores.checked ? "Sí" : "No",
                    declaracionSag: glosaSag,
                    estado: "Pendiente"
                };

                localStorage.setItem(idFolioGenerado, JSON.stringify(estructuraFormulario));

                folioIdSpan.innerText = idFolioGenerado;
                apiStatus.classList.add('hidden');
                switchScreen(screenQr);
                
                smaaForm.reset();
                sectionMenoresDetalle.classList.add('hidden');
                sectionSagDetalle.classList.add('hidden');
            }, 800);
        });
    }

    // --- BÚSQUEDA CRUZADA EN CASETA (FUNCIONARIO) ---
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            const folioBuscado = inputSearchFolio.value.trim().toUpperCase();
            const datosRecuperados = localStorage.getItem(folioBuscado);

            if (!datosRecuperados) {
                alert("El folio ingresado no se encuentra registrado en el sistema local.");
                panelTramiteDetalle.classList.add('hidden');
                return;
            }

            const tramite = JSON.parse(datosRecuperados);
            currentFolioEnEvaluacion = folioBuscado;

            document.getElementById('view-folio').innerText = tramite.idFolio;
            document.getElementById('view-rut').innerText = tramite.rutPropietario;
            document.getElementById('view-patente').innerText = tramite.patente;
            document.getElementById('view-vehiculo').innerText = `${tramite.marca} ${tramite.modelo}`;
            document.getElementById('view-menores').innerText = tramite.llevaMenores;
            document.getElementById('view-sag-status').innerText = tramite.declaracionSag;
            
            // 🚨 REGLA DE NEGOCIO CRÍTICA (RF-4): Cruce inmediato con base de datos de Arraigos PDI
            const tieneArraigo = rutsConArraigoPdi.includes(tramite.rutPropietario.trim());
            document.getElementById('dashboard-pdi-alert').classList.toggle('hidden', !tieneArraigo);
            
            // ⚠️ REGLA DE SEGURIDAD FRONTERIZA: Control Antifraude de patentes clonadas
            const esClonada = verificarPatenteDuplicada(tramite.patente, tramite.idFolio);
            document.getElementById('dashboard-clone-alert').classList.toggle('hidden', !esClonada);

            panelTramiteDetalle.classList.remove('hidden');
        });
    }

    // --- RESOLUCIÓN DE DECISIONES ADUANERAS ---
    if (btnApproveControl) {
        btnApproveControl.addEventListener('click', () => {
            if (currentFolioEnEvaluacion) {
                let tramite = JSON.parse(localStorage.getItem(currentFolioEnEvaluacion));
                tramite.estado = "Aprobado";
                localStorage.setItem(currentFolioEnEvaluacion, JSON.stringify(tramite));
                
                alert(`Control Exitoso: Vehículo ${tramite.patente} DESPACHADO.`);
                panelTramiteDetalle.classList.add('hidden');
                inputSearchFolio.value = '';
                cargarTablaAuditoria();
            }
        });
    }

    if (btnRejectControl) {
        btnRejectControl.addEventListener('click', () => {
            if (currentFolioEnEvaluacion) {
                let tramite = JSON.parse(localStorage.getItem(currentFolioEnEvaluacion));
                tramite.estado = "Rechazado";
                localStorage.setItem(currentFolioEnEvaluacion, JSON.stringify(tramite));
                
                alert("Control registrado como RECHAZADO. Alertas notificadas a jefatura.");
                panelTramiteDetalle.classList.add('hidden');
                inputSearchFolio.value = '';
                cargarTablaAuditoria();
            }
        });
    }

    // --- PANEL ALTA DIRECCIÓN: CÁLCULOS ESTADÍSTICOS ---
    function calcularMetricasDirectivas() {
        let totalFormularios = 0, totalAlertasPdi = 0, totalDeclaracionesSag = 0, conteoAprobados = 0, conteoRechazados = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave && clave.startsWith("SMAA-")) {
                totalFormularios++;
                const item = JSON.parse(localStorage.getItem(clave));
                
                // Si el RUT está en la lista negra o la patente es de prueba, suma a las métricas críticas
                if (rutsConArraigoPdi.includes(item.rutPropietario.trim())) totalAlertasPdi++;
                if (item.declaracionSag && item.declaracionSag.includes("SÍ DECLARA")) totalDeclaracionesSag++;
                
                if (item.estado === "Aprobado") conteoAprobados++;
                if (item.estado === "Rechazado") conteoRechazados++;
            }
        }

        // Renderizar Cuadros Numéricos (KPIs)
        document.getElementById('kpi-total-forms').innerText = totalFormularios;
        document.getElementById('kpi-total-alerts').innerText = totalAlertasPdi;
        document.getElementById('kpi-total-sag').innerText = totalDeclaracionesSag;
        document.getElementById('kpi-time-saved').innerText = `${totalFormularios * 4.5} min`; // Factor de agilización estimado

        // Renderizar Textos Analíticos
        document.getElementById('txt-count-approved').innerText = conteoAprobados;
        document.getElementById('txt-count-rejected').innerText = conteoRechazados;

        // Renderizar Ancho Porcentual de las Barras CSS
        const totalEvaluados = conteoAprobados + conteoRechazados;
        if (totalEvaluados > 0) {
            document.getElementById('bar-approved').style.width = `${(conteoAprobados / totalEvaluados) * 100}%`;
            document.getElementById('bar-rejected').style.width = `${(conteoRechazados / totalEvaluados) * 100}%`;
        } else {
            document.getElementById('bar-approved').style.width = `0%`;
            document.getElementById('bar-rejected').style.width = `0%`;
        }
    }
});