document.addEventListener('DOMContentLoaded', () => {
    console.log("SMAA Motor de Seguridad Integrado.");

    // Pantallas
    const screenLogin = document.getElementById('screen-login');
    const screenForm = document.getElementById('screen-form');
    const screenQr = document.getElementById('screen-qr');
    const screenDashboard = document.getElementById('screen-dashboard');
    const screenDirector = document.getElementById('screen-director');

    // Botones
    const btnClaveUnica = document.getElementById('btn-claveunica');
    const btnFuncionario = document.getElementById('btn-funcionario');
    const btnDirector = document.getElementById('btn-director');
    const btnLogoutDashboard = document.getElementById('btn-logout-dashboard');
    const btnLogoutDirector = document.getElementById('btn-logout-director');
    const btnRestart = document.getElementById('btn-restart');

    // Inputs dinámicos
    const inputRut = document.getElementById('rut');
    const rutError = document.getElementById('rut-error');
    const inputPatente = document.getElementById('patente');
    const smaaForm = document.getElementById('smaa-form');
    const apiStatus = document.getElementById('api-status');
    const folioIdSpan = document.getElementById('folio-id');

    // Módulos condicionales
    const checkboxMenores = document.getElementById('menores');
    const sectionMenoresDetalle = document.getElementById('section-menores-detalle');
    const checkboxSag = document.getElementById('sag-declaracion');
    const sectionSagDetalle = document.getElementById('section-sag-detalle');
    const selectSagTipo = document.getElementById('sag-tipo');

    // Control de Caseta y Auditoría
    const inputSearchFolio = document.getElementById('search-folio');
    const btnSearch = document.getElementById('btn-search');
    const panelTramiteDetalle = document.getElementById('panel-tramite-detalle');
    const btnApproveControl = document.getElementById('btn-approve-control');
    const btnRejectControl = document.getElementById('btn-reject-control');
    const tableAuditLogs = document.getElementById('table-audit-logs');

    let currentFolioEnEvaluacion = null;

    // --- VALIDACIÓN DE RUT ---
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

    if (inputRut) {
        inputRut.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9kK-]/g, '');
            e.target.value = value;
            if (value.includes('-') && value.split('-')[1].length >= 1) {
                rutError.style.display = validarRutChileno(value) ? 'none' : 'block';
            }
        });
    }

    if (inputPatente) {
        inputPatente.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        });
    }

    // --- VERIFICACIÓN DE CLONACIÓN DE PATENTE ---
    function verificarPatenteDuplicada(patente, folioActual) {
        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave && clave.startsWith("SMAA-") && clave !== folioActual) {
                const registro = JSON.parse(localStorage.getItem(clave));
                if (registro.patente === patente && registro.estado === "Aprobado") {
                    return true; // Existe otro folio ya aprobado con la misma patente
                }
            }
        }
        return false;
    }

    // --- RENDERIZAR TABLA DE AUDITORÍA ---
    function cargarTablaAuditoria() {
        if (!tableAuditLogs) return;
        let registrosProcesados = [];

        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave && clave.startsWith("SMAA-")) {
                const registro = JSON.parse(localStorage.getItem(clave));
                if (registro.estado === "Aprobado" || registro.estado === "Rechazado") {
                    registrosProcesados.push(registro);
                }
            }
        }

        if (registrosProcesados.length === 0) {
            tableAuditLogs.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #aaa; padding: 10px;">Ningún vehículo procesado en este turno.</td></tr>`;
            return;
        }

        // Ordenar o limitar si se quiere, mostramos los últimos procesados
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

    // --- NAVEGACIÓN ---
    if (btnClaveUnica) btnClaveUnica.addEventListener('click', () => { screenLogin.classList.remove('active'); screenForm.classList.add('active'); });
    if (btnFuncionario) btnFuncionario.addEventListener('click', () => { screenLogin.classList.remove('active'); screenDashboard.classList.add('active'); panelTramiteDetalle.classList.add('hidden'); inputSearchFolio.value = ''; cargarTablaAuditoria(); });
    if (btnDirector) btnDirector.addEventListener('click', () => { screenLogin.classList.remove('active'); screenDirector.classList.add('active'); calcularMetricasDirectivas(); });
    if (btnLogoutDashboard) btnLogoutDashboard.addEventListener('click', () => { screenDashboard.classList.remove('active'); screenLogin.classList.add('active'); });
    if (btnLogoutDirector) btnLogoutDirector.addEventListener('click', () => { screenDirector.classList.remove('active'); screenLogin.classList.add('active'); });
    if (btnRestart) btnRestart.addEventListener('click', () => { screenQr.classList.remove('active'); screenLogin.classList.add('active'); });

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

    // --- FORMULARIO CIUDADANO ---
    if (smaaForm) {
        smaaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validarRutChileno(inputRut.value)) {
                alert("RUT no válido.");
                return;
            }

            apiStatus.classList.remove('hidden', 'error');
            apiStatus.classList.add('loading');
            apiStatus.innerHTML = "Sincronizando con APIs...";

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
                screenForm.classList.remove('active');
                screenQr.classList.add('active');
                smaaForm.reset();
                sectionMenoresDetalle.classList.add('hidden');
                sectionSagDetalle.classList.add('hidden');
            }, 800);
        });
    }

    // --- BÚSQUEDA CASETA Y DISPARADOR DE ALERTAS DE SEGURIDAD ---
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            const folioBuscado = inputSearchFolio.value.trim().toUpperCase();
            const datosRecuperados = localStorage.getItem(folioBuscado);

            if (!datosRecuperados) {
                alert("Folio no encontrado.");
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
            
            // Evaluar alertas en cascada
            document.getElementById('dashboard-pdi-alert').classList.toggle('hidden', tramite.patente !== "PRUEBA");
            
            // Verificar posible clonación de patente
            const esClonada = verificarPatenteDuplicada(tramite.patente, tramite.idFolio);
            document.getElementById('dashboard-clone-alert').classList.toggle('hidden', !esClonada);

            panelTramiteDetalle.classList.remove('hidden');
        });
    }

    // --- PROCESAMIENTO ---
    if (btnApproveControl) {
        btnApproveControl.addEventListener('click', () => {
            if (currentFolioEnEvaluacion) {
                let tramite = JSON.parse(localStorage.getItem(currentFolioEnEvaluacion));
                tramite.estado = "Aprobado";
                localStorage.setItem(currentFolioEnEvaluacion, JSON.stringify(tramite));
                alert(`Vehículo Despachado.`);
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
                alert("Control Rechazado.");
                panelTramiteDetalle.classList.add('hidden');
                inputSearchFolio.value = '';
                cargarTablaAuditoria();
            }
        });
    }

    // --- PANEL DIRECTIVO ---
    function calcularMetricasDirectivas() {
        let totalFormularios = 0, totalAlertasPdi = 0, totalDeclaracionesSag = 0, conteoAprobados = 0, conteoRechazados = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave && clave.startsWith("SMAA-")) {
                totalFormularios++;
                const item = JSON.parse(localStorage.getItem(clave));
                if (item.patente === "PRUEBA") totalAlertasPdi++;
                if (item.declaracionSag && item.declaracionSag.includes("SÍ DECLARA")) totalDeclaracionesSag++;
                if (item.estado === "Aprobado") conteoAprobados++;
                if (item.estado === "Rechazado") conteoRechazados++;
            }
        }

        document.getElementById('kpi-total-forms').innerText = totalFormularios;
        document.getElementById('kpi-total-alerts').innerText = totalAlertasPdi;
        document.getElementById('kpi-total-sag').innerText = totalDeclaracionesSag;
        document.getElementById('kpi-time-saved').innerText = `${totalFormularios * 45} min`;
        document.getElementById('txt-count-approved').innerText = conteoAprobados;
        document.getElementById('txt-count-rejected').innerText = conteoRechazados;

        const totalProcesados = conteoAprobados + conteoRechazados;
        if (totalProcesados > 0) {
            document.getElementById('bar-approved').style.width = `${(conteoAprobados / totalProcesados) * 100}%`;
            document.getElementById('bar-rejected').style.width = `${(conteoRechazados / totalProcesados) * 100}%`;
        }
    }
});