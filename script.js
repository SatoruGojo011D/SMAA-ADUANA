document.addEventListener('DOMContentLoaded', () => {
    // Forzar estado cerrado inicial del modal anti-bloqueos
    const modalFaq = document.getElementById('modal-faq');
    if (modalFaq) modalFaq.classList.add('hidden');

    console.log("SMAA Engine Unificado v11.0 - Recordar credenciales y Visualización de ClaveÚnica activa.");

    // --- MÓDULO MODO OSCURO ---
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const appContainer = document.querySelector('.smartphone-container');

    if (localStorage.getItem('theme-dark') === 'true') {
        appContainer.classList.add('dark-mode');
        if (themeToggleIcon) themeToggleIcon.innerText = "☀️";
        if (btnThemeToggle) btnThemeToggle.innerHTML = `<span>☀️</span> Módulo Diurno`;
    }

    if (btnThemeToggle) {
        btnThemeToggle.addEventListener('click', () => {
            appContainer.classList.toggle('dark-mode');
            const isDark = appContainer.classList.contains('dark-mode');
            localStorage.setItem('theme-dark', isDark);

            if (isDark) {
                themeToggleIcon.innerText = "☀️";
                btnThemeToggle.innerHTML = `<span>☀️</span> Módulo Diurno`;
            } else {
                themeToggleIcon.innerText = "🌙";
                btnThemeToggle.innerHTML = `<span>🌙</span> Módulo Nocturno`;
            }
        });
    }

    // Listas de Simulación del Estado para Fiscalización
    const rutsConArraigoPdi = ["12345678-9", "11111111-1", "22222222-2"];
    const patentesEncargoRobo = ["BBBB11", "ROBO26", "CC2233"];

    // Pantallas / Secciones SPA
    const screenLogin = document.getElementById('screen-login');
    const screenForm = document.getElementById('screen-form');
    const screenExtranjero = document.getElementById('screen-extranjero');
    const screenQr = document.getElementById('screen-qr');
    const screenDashboard = document.getElementById('screen-dashboard');
    const screenDirector = document.getElementById('screen-director');
    const screenRevisar = document.getElementById('screen-revisar');

    // Botones de Navegación y Auth
    const linkExtranjero = document.getElementById('link-extranjero');
    const btnLogoutDashboard = document.getElementById('btn-logout-dashboard');
    const btnLogoutDirector = document.getElementById('btn-logout-director');
    const btnRestart = document.getElementById('btn-restart');
    const btnCancelForm = document.getElementById('btn-cancel-form');
    const btnCancelExt = document.getElementById('btn-cancel-ext');
    const btnRevisarFormularios = document.getElementById('btn-revisar-formularios');
    const btnLogoutRevisar = document.getElementById('btn-logout-revisar');

    // Componentes del Modal FAQ
    const btnHelpModal = document.getElementById('btn-help-modal');
    const btnCloseFaq = document.getElementById('btn-close-faq');
    const faqSearch = document.getElementById('faq-search');
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    // Formularios e Inputs de Control
    const inputRut = document.getElementById('rut');
    const rutError = document.getElementById('rut-error');
    const inputPatente = document.getElementById('patente');
    const patenteError = document.getElementById('patente-error');
    const smaaForm = document.getElementById('smaa-form');
    const smaaFormExtranjero = document.getElementById('smaa-form-extranjero');
    const apiStatus = document.getElementById('api-status');
    const apiStatusExt = document.getElementById('api-status-ext');
    const folioIdSpan = document.getElementById('folio-id');

    // Módulos Condicionales
    const checkboxMenores = document.getElementById('menores');
    const sectionMenoresDetalle = document.getElementById('section-menores-detalle');
    const checkboxSag = document.getElementById('sag-declaracion');
    const sectionSagDetalle = document.getElementById('section-sag-detalle');
    const selectSagTipo = document.getElementById('sag-tipo');
    
    // Papeles del Vehículo
    const checkboxTieneInformeTec = document.getElementById('tiene-informe-tec');
    const sectionInformeTec = document.getElementById('section-informe-tec');
    const docCertificado = document.getElementById('doc-certificado');
    const docPermiso = document.getElementById('doc-permiso');
    const docSeguro = document.getElementById('doc-seguro');
    const docInformeTec = document.getElementById('doc-informe-tec');
    
    // Papeles de Extranjeros
    const extDocCertificado = document.getElementById('ext-doc-certificado');
    const extDocPermiso = document.getElementById('ext-doc-permiso');
    const extDocSeguro = document.getElementById('ext-doc-seguro');
    
    // Declaración SAG de Extranjeros
    const checkboxExtSag = document.getElementById('ext-sag');
    const sectionExtSagDetalle = document.getElementById('section-ext-sag-detalle');
    const selectExtSagTipo = document.getElementById('ext-sag-tipo');

    // Operativa de la Caseta
    const inputSearchFolio = document.getElementById('search-folio');
    const btnSearch = document.getElementById('btn-search');
    const panelTramiteDetalle = document.getElementById('panel-tramite-detalle');
    const btnApproveControl = document.getElementById('btn-approve-control');
    const btnRejectControl = document.getElementById('btn-reject-control');
    const tableAuditLogs = document.getElementById('table-audit-logs');

    let currentFolioEnEvaluacion = null;

    // --- CREAR DATOS DE EJEMPLO PARA DEMOSTRACIÓN ---
    function crearDatosDeEjemplo() {
        // Verificar si ya existen datos de ejemplo para evitar duplicados
        if (localStorage.getItem('ejemplos-creados') === 'true') return;

        const ejemplos = [
            {
                idFolio: "SMAA-234567",
                rutPropietario: "18765432-5",
                patente: "BC1234",
                patenteVisual: "BC1234",
                marca: "Hyundai",
                modelo: "Tucson",
                llevaMenores: "No",
                declaracionSag: "SÍ DECLARA - Tipo: Vegetal | Descripción: 30 kg de sandías de Ica, marca local",
                papeles: { certificado: "Registro_Hyundai.pdf", permiso: "Permiso_Circulación.pdf", seguro: "SOAP_Vigente.pdf" },
                estado: "En Espera de Revisión",
                fechaRegistro: "14:32:15"
            },
            {
                idFolio: "SMAA-345678",
                rutPropietario: "19234567-8",
                patente: "XY5678",
                patenteVisual: "XY5678",
                marca: "Chevrolet",
                modelo: "Onix",
                llevaMenores: "Sí",
                declaracionSag: "Nada que declarar",
                papeles: { certificado: "Registro_Chevrolet.pdf", permiso: "Permiso_Circulación.pdf", seguro: "SOAP_Vigente.pdf" },
                estado: "En Espera de Revisión",
                fechaRegistro: "14:45:22"
            },
            {
                idFolio: "SMAA-EXT-456789",
                rutPropietario: "PA12345678",
                patente: "ABC123",
                patenteVisual: "ABC123 (Argentina)",
                marca: "Ford",
                modelo: "Ranger",
                llevaMenores: "No",
                declaracionSag: "SÍ DECLARA - Control Físico",
                papeles: { certificado: "Registro_Internacional.pdf", permiso: "Permiso_Origen.pdf", seguro: "Cobertura_Internacional.pdf" },
                estado: "En Espera de Revisión",
                fechaRegistro: "15:10:45"
            }
        ];

        ejemplos.forEach(ejemplo => {
            localStorage.setItem(ejemplo.idFolio, JSON.stringify(ejemplo));
        });

        localStorage.setItem('ejemplos-creados', 'true');
    }

    // Crear datos de ejemplo al cargar
    crearDatosDeEjemplo();

    // --- MANEJO DE PANTALLAS SPA ---
    function switchScreen(targetScreen) {
        [screenLogin, screenForm, screenExtranjero, screenQr, screenDashboard, screenDirector, screenRevisar].forEach(s => {
            s.classList.remove('active');
        });
        targetScreen.classList.add('active');
        const appContent = document.querySelector('.app-content');
        if (appContent) appContent.scrollTop = 0;
    }

    // --- BARRA DE CARGA ASÍNCRONA ---
    const topLoadingBar = document.getElementById('top-loading-bar');

    function switchScreenWithLoader(targetScreen, delay = 500) {
        if (!topLoadingBar) {
            switchScreen(targetScreen);
            return;
        }
        topLoadingBar.classList.remove('hidden');
        topLoadingBar.style.width = '0%';
        
        setTimeout(() => { topLoadingBar.style.width = '35%'; }, 30);
        setTimeout(() => { topLoadingBar.style.width = '75%'; }, delay * 0.4);

        setTimeout(() => {
            topLoadingBar.style.width = '100%';
            setTimeout(() => {
                topLoadingBar.classList.add('hidden');
                switchScreen(targetScreen);
            }, 150);
        }, delay);
    }

    // --- SISTEMA DE AUTENTICACIÓN SIMPLE ---
    const btnAccederSimple = document.getElementById('btn-acceder-simple');
    const loginNombre = document.getElementById('login-nombre');

    if (btnAccederSimple) {
        btnAccederSimple.addEventListener('click', () => {
            switchScreenWithLoader(screenForm, 600);
        });
    }

    // Eventos SPA
    if (linkExtranjero) linkExtranjero.addEventListener('click', (e) => { e.preventDefault(); switchScreenWithLoader(screenExtranjero, 600); });
    if (btnCancelForm) btnCancelForm.addEventListener('click', () => switchScreenWithLoader(screenLogin, 400));
    if (btnCancelExt) btnCancelExt.addEventListener('click', () => switchScreenWithLoader(screenLogin, 400));
    if (btnRestart) btnRestart.addEventListener('click', () => switchScreenWithLoader(screenLogin, 400));
    if (btnLogoutDashboard) btnLogoutDashboard.addEventListener('click', () => switchScreenWithLoader(screenLogin, 400));
    if (btnLogoutDirector) btnLogoutDirector.addEventListener('click', () => switchScreenWithLoader(screenLogin, 400));
    if (btnRevisarFormularios) {
        btnRevisarFormularios.addEventListener('click', () => {
            switchScreenWithLoader(screenRevisar, 500);
            cargarFormulariosPendientes();
        });
    }
    if (btnLogoutRevisar) btnLogoutRevisar.addEventListener('click', () => switchScreenWithLoader(screenLogin, 400));

    // --- CONTROL MODAL FAQ ---
    if (btnHelpModal) btnHelpModal.addEventListener('click', () => modalFaq.classList.remove('hidden'));
    if (btnCloseFaq) btnCloseFaq.addEventListener('click', () => modalFaq.classList.add('hidden'));

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            item.classList.toggle('open');
            trigger.querySelector('span').innerText = item.classList.contains('open') ? '−' : '+';
        });
    });

    if (faqSearch) {
        faqSearch.addEventListener('input', (e) => {
            const busqueda = e.target.value.toLowerCase();
            document.querySelectorAll('.faq-item').forEach(item => {
                const keywords = item.getAttribute('data-keywords');
                item.style.display = keywords.includes(busqueda) ? "block" : "none";
            });
        });
    }

    // --- VALIDACIONES ---
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

    function ofuscarRut(doc) {
        if(!doc.includes('-')) return `EXT: ${doc.substring(0, 4)}***`;
        const partes = doc.split('-');
        if(partes[0].length <= 4) return doc;
        return partes[0].substring(0, 4) + "***" + "-" + partes[1];
    }

    function validarFormatoPatente(patente) {
        return /^[A-Z]{2}[0-9]{4}$|^[A-Z]{4}[0-9]{2}$/.test(patente);
    }

    if (inputRut) {
        inputRut.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9kK]/g, '');
            if (value.length > 1) { value = value.slice(0, -1) + '-' + value.slice(-1); }
            e.target.value = value.toLowerCase();
            
            if (value.includes('-') && value.split('-')[0].length >= 7) {
                rutError.style.display = validarRutChileno(value) ? 'none' : 'block';
            } else {
                rutError.style.display = 'none';
            }
        });
    }

    if (inputPatente) {
        inputPatente.addEventListener('input', (e) => {
            let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            e.target.value = value;
            
            if(value.length === 6) {
                patenteError.style.display = validarFormatoPatente(value) ? 'none' : 'block';
            } else {
                patenteError.style.display = 'none';
            }
        });
    }

    // --- ENVÍO DE FORMULARIOS ---
    if (smaaForm) {
        smaaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validarRutChileno(inputRut.value) || !validarFormatoPatente(inputPatente.value)) {
                alert("Verifique que el RUT y Patente estén bien escritos.");
                return;
            }
            
            // Validar que los archivos requeridos estén cargados
            if (!docCertificado.files.length) {
                alert("⚠️ Debe adjuntar el Certificado de Registro.");
                return;
            }
            if (!docPermiso.files.length) {
                alert("⚠️ Debe adjuntar el Permiso de Circulación.");
                return;
            }
            if (!docSeguro.files.length) {
                alert("⚠️ Debe adjuntar el Seguro Obligatorio (SOAP).");
                return;
            }
            if (checkboxTieneInformeTec.checked && !docInformeTec.files.length) {
                alert("⚠️ Debe adjuntar el Informe Técnico seleccionado.");
                return;
            }

            const papelesCargados = {
                certificado: docCertificado.files[0].name,
                permiso: docPermiso.files[0].name,
                seguro: docSeguro.files[0].name,
                informeTecnico: checkboxTieneInformeTec.checked ? docInformeTec.files[0].name : "No aplica"
            };

            const descSag = document.getElementById('sag-descripcion');
            const textoSag = checkboxSag.checked ? `SÍ DECLARA - Tipo: ${selectSagTipo.value} | Descripción: ${descSag.value || "Sin especificar"}` : "Nada que declarar";

            procesarGuardadoFormulario(inputRut.value, inputPatente.value, document.getElementById('marca').value, document.getElementById('modelo').value, checkboxMenores.checked ? "Sí" : "No", textoSag, apiStatus, false, papelesCargados);
        });
    }

    if (smaaFormExtranjero) {
        smaaFormExtranjero.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validar que los archivos requeridos estén cargados
            if (!extDocCertificado.files.length) {
                alert("⚠️ Debe adjuntar el Certificado de Registro.");
                return;
            }
            if (!extDocPermiso.files.length) {
                alert("⚠️ Debe adjuntar el Permiso de Circulación.");
                return;
            }
            if (!extDocSeguro.files.length) {
                alert("⚠️ Debe adjuntar la Póliza de Seguro/Cobertura Internacional.");
                return;
            }
            
            const documento = document.getElementById('ext-documento').value.toUpperCase().trim();
            const patenteExt = document.getElementById('ext-patente').value.toUpperCase().trim();
            const marca = document.getElementById('ext-marca').value;
            const modelo = document.getElementById('ext-modelo').value;
            const pais = document.getElementById('ext-pais').value;
            
            const descExtSag = document.getElementById('ext-sag-descripcion');
            const textoExtSag = checkboxExtSag.checked ? `SÍ DECLARA - Tipo: ${selectExtSagTipo.value} | Descripción: ${descExtSag.value || "Sin especificar"}` : "Nada que declarar";

            const papelesCargados = {
                certificado: extDocCertificado.files[0].name,
                permiso: extDocPermiso.files[0].name,
                seguro: extDocSeguro.files[0].name
            };

            procesarGuardadoFormulario(documento, `${patenteExt} (${pais})`, marca, modelo, "No (Extranjero)", textoExtSag, apiStatusExt, true, papelesCargados);
        });
    }

    function procesarGuardadoFormulario(documento, patente, marca, modelo, menores, sag, spinnerElement, esExtranjero = false, papeles = null) {
        spinnerElement.classList.remove('hidden');
        spinnerElement.className = "status-box loading";
        spinnerElement.innerHTML = `<div class="spinner"></div><p class="spinner-text">Validando Base de Datos...</p>`;

        setTimeout(() => {
            const randomFolio = Math.floor(100000 + Math.random() * 900000);
            const idFolioGenerado = esExtranjero ? `SMAA-EXT-${randomFolio}` : `SMAA-${randomFolio}`;

            const estructura = {
                idFolio: idFolioGenerado,
                rutPropietario: documento,
                patente: patente.replace(/[\(\)]/g, '').split(' ')[0], 
                patenteVisual: patente,
                marca: marca,
                modelo: modelo,
                llevaMenores: menores,
                declaracionSag: sag,
                papeles: papeles || null,
                estado: "En Espera de Revisión",
                fechaRegistro: new Date().toLocaleTimeString()
            };

            localStorage.setItem(idFolioGenerated = idFolioGenerado, JSON.stringify(estructura));
            folioIdSpan.innerText = idFolioGenerado;

            const qrMockContainer = document.querySelector('.qr-mock');
            if (qrMockContainer) {
                qrMockContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${idFolioGenerado}" alt="QR" class="qr-image">`;
            }

            spinnerElement.classList.add('hidden');
            switchScreen(screenQr);
            if(smaaForm) smaaForm.reset();
            if(smaaFormExtranjero) smaaFormExtranjero.reset();
            sectionMenoresDetalle.classList.add('hidden');
            sectionSagDetalle.classList.add('hidden');
            sectionExtSagDetalle.classList.add('hidden');
            sectionInformeTec.classList.add('hidden');
        }, 1200);
    }

    // --- CASETA DE CONTROL ---
    function buscarTramiteEnBaseDatos(criterio) {
        const textoBusqueda = criterio.trim().toUpperCase();
        if (!textoBusqueda) return null;

        let directo = localStorage.getItem(textoBusqueda);
        if (directo) return JSON.parse(directo);

        let coincidencias = [];
        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave && (clave.includes("SMAA-") || clave.includes("SMAA-EXT-"))) {
                const registro = JSON.parse(localStorage.getItem(clave));
                if (registro.rutPropietario.toUpperCase() === textoBusqueda || 
                    registro.patente.toUpperCase() === textoBusqueda) {
                    coincidencias.push(registro);
                }
            }
        }

        if (coincidencias.length > 0) {
            return coincidencias[coincidencias.length - 1];
        }
        return null;
    }

    function verificarPatenteDuplicada(patente, folioActual) {
        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave && (clave.includes("SMAA-") || clave.includes("SMAA-EXT-")) && clave !== folioActual) {
                const reg = JSON.parse(localStorage.getItem(clave));
                if (reg.patente === patente && reg.estado === "Aprobado") return true;
            }
        }
        return false;
    }

    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            const criterio = inputSearchFolio.value;
            const tramite = buscarTramiteEnBaseDatos(criterio);

            if (!tramite) {
                alert("No se encontró ningún trámite con ese Folio, RUT o Patente.");
                panelTramiteDetalle.classList.add('hidden');
                return;
            }

            currentFolioEnEvaluacion = tramite.idFolio;

            document.getElementById('view-folio').innerText = tramite.idFolio;
            document.getElementById('view-rut').innerText = ofuscarRut(tramite.rutPropietario);
            document.getElementById('view-patente').innerText = tramite.patenteVisual || tramite.patente;
            document.getElementById('view-vehiculo').innerText = `${tramite.marca} ${tramite.modelo}`;
            document.getElementById('view-menores').innerText = tramite.llevaMenores;
            document.getElementById('view-sag-status').innerText = tramite.declaracionSag;
            
            const tieneArraigo = rutsConArraigoPdi.includes(tramite.rutPropietario.trim());
            document.getElementById('dashboard-pdi-alert').classList.toggle('hidden', !tieneArraigo);
            
            const esClonada = verificarPatenteDuplicada(tramite.patente, tramite.idFolio);
            document.getElementById('dashboard-clone-alert').classList.toggle('hidden', !esClonada);

            const tieneEncargoRobo = patentesEncargoRobo.includes(tramite.patente.trim().toUpperCase());
            document.getElementById('dashboard-stolen-alert').classList.toggle('hidden', !tieneEncargoRobo);

            if (tieneArraigo || esClonada || tieneEncargoRobo) {
                btnApproveControl.disabled = true;
                btnApproveControl.classList.add('btn-disabled');
                btnApproveControl.innerText = "Despacho Bloqueado 🚫";
            } else {
                btnApproveControl.disabled = false;
                btnApproveControl.classList.remove('btn-disabled');
                btnApproveControl.innerText = "Despachar Vehículo ✓";
            }

            panelTramiteDetalle.classList.remove('hidden');
        });
    }

    if (btnApproveControl) {
        btnApproveControl.addEventListener('click', () => {
            if (currentFolioEnEvaluacion) {
                let t = JSON.parse(localStorage.getItem(currentFolioEnEvaluacion));
                t.estado = "Aprobado";
                localStorage.setItem(currentFolioEnEvaluacion, JSON.stringify(t));
                panelTramiteDetalle.classList.add('hidden');
                inputSearchFolio.value = '';
                cargarTablaAuditoria();
            }
        });
    }

    if (btnRejectControl) {
        btnRejectControl.addEventListener('click', () => {
            if (currentFolioEnEvaluacion) {
                let t = JSON.parse(localStorage.getItem(currentFolioEnEvaluacion));
                t.estado = "Rechazado";
                localStorage.setItem(currentFolioEnEvaluacion, JSON.stringify(t));
                panelTramiteDetalle.classList.add('hidden');
                inputSearchFolio.value = '';
                cargarTablaAuditoria();
            }
        });
    }

    function cargarTablaAuditoria() {
        if (!tableAuditLogs) return;
        let logs = [];
        for (let i = 0; i < localStorage.length; i++) {
            const c = localStorage.key(i);
            if (c && (c.includes("SMAA-") || c.includes("SMAA-EXT-"))) {
                const r = JSON.parse(localStorage.getItem(c));
                if (r.estado !== "Pendiente") logs.push(r);
            }
        }
        
        document.getElementById('total-vehiculos').innerText = `Historial del Turno (${logs.length})`;
        
        if(logs.length === 0) {
            tableAuditLogs.innerHTML = `<tr><td colspan="3" class="text-center text-muted">Ningún vehículo procesado.</td></tr>`;
            return;
        }

        logs.reverse();
        tableAuditLogs.innerHTML = logs.map(l => `
            <tr>
                <td style="padding:8px 6px; font-weight:bold; font-size:0.75rem;">${l.idFolio}</td>
                <td style="padding:8px 6px; font-size:0.75rem;">${l.patente}</td>
                <td style="padding:8px 6px; text-align:right; font-weight:bold; font-size:0.75rem; color:${l.estado==='Aprobado'?'#2ecc71':'#e74c3c'}">${l.estado}</td>
            </tr>
        `).join('');
    }

    function calcularMetricasDirectivas() {
        let total = 0, pdi = 0, sag = 0, ap = 0, re = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const c = localStorage.key(i);
            if (c && (c.includes("SMAA-") || c.includes("SMAA-EXT-"))) {
                total++;
                const item = JSON.parse(localStorage.getItem(c));
                if (rutsConArraigoPdi.includes(item.rutPropietario.trim())) pdi++;
                if (item.declaracionSag.includes("SÍ DECLARA")) sag++;
                if (item.estado === "Aprobado") ap++;
                if (item.estado === "Rechazado") re++;
            }
        }
        document.getElementById('kpi-total-forms').innerText = total;
        document.getElementById('kpi-total-alerts').innerText = pdi;
        document.getElementById('kpi-total-sag').innerText = sag;
        document.getElementById('kpi-time-saved').innerText = `${total * 5} min`;
        document.getElementById('txt-count-approved').innerText = ap;
        document.getElementById('txt-count-rejected').innerText = re;
        const totalEv = ap + re;
        document.getElementById('bar-approved').style.width = totalEv > 0 ? `${(ap / totalEv) * 100}%` : '0%';
        document.getElementById('bar-rejected').style.width = totalEv > 0 ? `${(re / totalEv) * 100}%` : '0%';
    }

    function cargarFormulariosPendientes() {
        const panelPendientes = document.getElementById('panel-formularios-pendientes');
        const panelSin = document.getElementById('panel-sin-formularios');
        const listaFormularios = document.getElementById('lista-formularios');

        let formulariosPendientes = [];
        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave && (clave.includes("SMAA-") || clave.includes("SMAA-EXT-"))) {
                const formulario = JSON.parse(localStorage.getItem(clave));
                if (formulario.estado === "En Espera de Revisión") {
                    formulariosPendientes.push(formulario);
                }
            }
        }

        if (formulariosPendientes.length === 0) {
            panelPendientes.classList.add('hidden');
            panelSin.classList.remove('hidden');
            return;
        }

        panelPendientes.classList.remove('hidden');
        panelSin.classList.add('hidden');

        listaFormularios.innerHTML = formulariosPendientes.map(f => `
            <div class="info-card" style="margin-bottom: 12px; padding: 12px; border-left: 4px solid #0033a0;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <p style="font-weight: bold; color: var(--gob-azul); margin-bottom: 4px;">📋 ${f.idFolio}</p>
                        <p style="font-size: 0.8rem;"><strong>Patente:</strong> ${f.patenteVisual || f.patente}</p>
                        <p style="font-size: 0.8rem;"><strong>Vehículo:</strong> ${f.marca} ${f.modelo}</p>
                        <p style="font-size: 0.8rem;"><strong>Menores:</strong> ${f.llevaMenores}</p>
                        <p style="font-size: 0.8rem;"><strong>SAG:</strong> ${f.declaracionSag}</p>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">🕐 ${f.fechaRegistro}</p>
                    </div>
                    <span class="badge" style="background: #fbbf24; color: #78350f;">Pendiente</span>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                    <button class="btn-accept-form" data-folio="${f.idFolio}" style="flex: 1; padding: 8px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.8rem;">
                        ✓ Aceptar
                    </button>
                    <button class="btn-reject-form" data-folio="${f.idFolio}" style="flex: 1; padding: 8px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.8rem;">
                        ✗ Rechazar
                    </button>
                </div>
            </div>
        `).join('');

        // Agregar eventos a los botones de aceptar y rechazar
        document.querySelectorAll('.btn-accept-form').forEach(btn => {
            btn.addEventListener('click', () => {
                const folio = btn.getAttribute('data-folio');
                aceptarFormulario(folio);
            });
        });

        document.querySelectorAll('.btn-reject-form').forEach(btn => {
            btn.addEventListener('click', () => {
                const folio = btn.getAttribute('data-folio');
                rechazarFormulario(folio);
            });
        });
    }

    function aceptarFormulario(folio) {
        const formulario = JSON.parse(localStorage.getItem(folio));
        formulario.estado = "Aprobado";
        localStorage.setItem(folio, JSON.stringify(formulario));
        cargarFormulariosPendientes();
    }

    function rechazarFormulario(folio) {
        const formulario = JSON.parse(localStorage.getItem(folio));
        formulario.estado = "Rechazado";
        localStorage.setItem(folio, JSON.stringify(formulario));
        cargarFormulariosPendientes();
    }

    if (checkboxMenores) {
        checkboxMenores.addEventListener('change', (e) => sectionMenoresDetalle.classList.toggle('hidden', !e.target.checked));
    }
    if (checkboxSag) {
        checkboxSag.addEventListener('change', (e) => sectionSagDetalle.classList.toggle('hidden', !e.target.checked));
    }
    if (checkboxTieneInformeTec) {
        checkboxTieneInformeTec.addEventListener('change', (e) => sectionInformeTec.classList.toggle('hidden', !e.target.checked));
    }
    if (checkboxExtSag) {
        checkboxExtSag.addEventListener('change', (e) => sectionExtSagDetalle.classList.toggle('hidden', !e.target.checked));
    }

    // --- NOTIFICACIONES PUSH SIMULADAS ---
    const pushBox = document.getElementById('push-notification-box');
    const pushTitle = document.getElementById('push-title');
    const pushMessage = document.getElementById('push-message');
    const btnClosePush = document.getElementById('btn-close-push');

    const alertasSimuladas = [
        { titulo: "🚨 Alerta PDI", mensaje: "Control exhaustivo solicitado para vehículos provenientes de pasos no habilitados." },
        { titulo: "❄️ Estado de Pasos", mensaje: "Paso Los Libertadores operando con porte obligatorio de cadenas por escarcha." },
        { titulo: "🟢 Sincronización Exitosa", mensaje: "Base de datos del Servicio de Registro Civil e Identificación actualizada." },
        { titulo: "🦺 Alerta SAG", mensaje: "Fiscalización preventiva activa en andenes por detección de brote de mosca de la fruta." }
    ];

    function mostrarNotificacionPush(titulo, mensaje, duracion = 5000) {
        if (!pushBox) return;
        pushTitle.innerText = titulo;
        pushMessage.innerText = mensaje;
        
        pushBox.classList.remove('hidden');
        pushBox.classList.add('push-active');

        setTimeout(() => { ocultarNotificacionPush(); }, duracion);
    }

    function ocultarNotificacionPush() {
        if (pushBox) {
            pushBox.classList.remove('push-active');
            setTimeout(() => pushBox.classList.add('hidden'), 300);
        }
    }

    if (btnClosePush) btnClosePush.addEventListener('click', ocultarNotificacionPush);

    setInterval(() => {
        if (screenLogin && !screenLogin.classList.contains('active')) {
            const alertaAlAzar = alertasSimuladas[Math.floor(Math.random() * alertasSimuladas.length)];
            mostrarNotificacionPush(alertaAlAzar.titulo, alertaAlAzar.mensaje);
        }
    }, 45000);
});