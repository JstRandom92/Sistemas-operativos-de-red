/* ==========================================================================
   SISTEMAS OPERATIVOS DE RED — script principal
   JavaScript ES6+ (vanilla). Sin dependencias externas.
   --------------------------------------------------------------------------
   Índice de funcionalidades:
     0. Tema claro / oscuro
     1. Estado "scroll" del header
     2. Progreso de lectura
     3. Menú hamburguesa responsive
     4. Scroll suave y cierre automático del menú
     5. Scroll spy (sección activa en la navegación)
     6. Animaciones de aparición al hacer scroll
     7. Botón "volver arriba"
     8. Acordeones del diseño curricular
     9. Glosario con buscador
    10. Diagrama de arquitectura interactivo
    11. Quiz interactivo
   ========================================================================== */

'use strict';

/* El script se ejecuta cuando el DOM está listo. Como el HTML carga el script
   al final de <body>, el DOM ya existe; aun así usamos DOMContentLoaded para
   orden, robustez y para no tocar nodos antes de tiempo. */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initReadingProgress();
  initMobileMenu();
  initSmoothScroll();
  initScrollSpy();
  initRevealAnimations();
  initBackToTop();
  initCurriculumAccordion();
  initGlossarySearch();
  initArchInteractive();
  initQuiz();
});

/* --------------------------------------------------------------------------
   0. Tema claro / oscuro
   Lee la preferencia guardada en localStorage (establecida por el script
   temprano del <head>), actualiza el botón y persiste cada cambio.
   -------------------------------------------------------------------------- */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#101010' : '#FFFFFF');
    }
    if (btn) {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
  };

  // Sincroniza el botón con el tema ya aplicado por el script del <head>
  const initial = root.getAttribute('data-theme') || 'light';
  apply(initial);

  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('nos-theme', next);
      } catch (e) {
        /* almacenamiento no disponible: el tema solo dura la sesión */
      }
      apply(next);
    });
  }
}

/* --------------------------------------------------------------------------
   1. Estado "scroll" del header
   Añade sombra y fondo más opaco cuando la página se desplaza.
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial
}

/* --------------------------------------------------------------------------
   2. Progreso de lectura
   Barra superior que refleja el porcentaje leído de la página.
   -------------------------------------------------------------------------- */
function initReadingProgress() {
  const bar = document.getElementById('readingProgress');
  if (!bar) return;

  const update = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update(); // valor inicial
}

/* --------------------------------------------------------------------------
   3. Menú hamburguesa responsive
   Alterna la clase "is-open" y sincroniza aria-expanded / aria-label.
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  const setState = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  };

  toggle.addEventListener('click', () => {
    setState(!menu.classList.contains('is-open'));
  });

  // Cierra el menú al redimensionar a escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setState(false);
  });

  // Cierra el menú si se pulsa Escape (accesibilidad con teclado)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setState(false);
      toggle.focus();
    }
  });
}

/* --------------------------------------------------------------------------
   4. Scroll suave y cierre automático del menú
   Gestiona los enlaces internos (anclas) para cerrar el menú móvil y
   permitir que el header fijo no tape el destino (scroll-margin en CSS
   ya se encarga del desplazamiento correcto).
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length < 2) return; // enlaces "#" sueltos
      const target = document.querySelector(targetId);
      if (!target) return;

      // No interrumpimos el comportamiento nativo de CSS `scroll-behavior:smooth`,
      // solo cerramos el menú móvil si estaba abierto.
      const menu = document.getElementById('navMenu');
      const toggle = document.getElementById('navToggle');
      if (menu && menu.classList.contains('is-open')) {
        e.preventDefault();
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú de navegación');
        // Retraso mínimo para permitir la animación de cierre antes de hacer scroll
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Scroll spy
   Resalta el enlace correspondiente a la sección visible.
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const onScroll = () => {
    const pos = window.scrollY + window.innerHeight / 3;

    // Última sección alcanzada antes de la posición actual
    let current = sections[0].id;
    for (const section of sections) {
      if (section.offsetTop <= pos) current = section.id;
    }
    setActive(current);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   6. Animaciones de aparición al hacer scroll
   Utiliza IntersectionObserver para añadir la clase "in" a [data-reveal].
   -------------------------------------------------------------------------- */
function initRevealAnimations() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  // Si no hay soporte, mostramos todo directamente.
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target); // se revela una sola vez
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   7. Botón "volver arriba"
   Aparece al pasar de 500 px y vuelve arriba con desplazamiento suave.
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = () => {
    const visible = window.scrollY > 500;
    btn.hidden = !visible;
  };

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   8. Acordeones del diseño curricular
   Al hacer clic en el encabezado de una unidad se abre/cierra su contenido.
   Gestión de ARIA: aria-expanded, aria-controls y regiones hidden.
   Solo una unidad abierta a la vez salvo que sea el toggle de la misma.
   -------------------------------------------------------------------------- */
function initCurriculumAccordion() {
  const units = document.querySelectorAll('.unit');

  units.forEach((unit) => {
    const toggle = unit.querySelector('.unit__toggle');
    const body = unit.querySelector('.unit__body');
    if (!toggle || !body) return;

    toggle.addEventListener('click', () => {
      const isOpen = unit.classList.contains('is-open');

      // Cerrar todas las unidades
      units.forEach((u) => {
        u.classList.remove('is-open');
        const b = u.querySelector('.unit__body');
        const t = u.querySelector('.unit__toggle');
        if (b) b.hidden = true;
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      // Si la unidad pulsada estaba cerrada, abrirla
      if (!isOpen) {
        unit.classList.add('is-open');
        body.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. Glosario con buscador
   Filtra los términos del glosario en tiempo real; muestra aviso si no hay
   coincidencias. También permite buscar por términos contenidos en el texto.
   -------------------------------------------------------------------------- */
function initGlossarySearch() {
  const input = document.getElementById('glossarySearch');
  const list = document.getElementById('glossaryList');
  const empty = document.getElementById('glossaryEmpty');
  if (!input || !list) return;

  const items = Array.from(list.querySelectorAll('.glossary__item'));

  const filter = () => {
    const term = input.value.trim().toLowerCase();
    let visibleCount = 0;

    items.forEach((item) => {
      const haystack = item.textContent.toLowerCase();
      const match = haystack.includes(term);
      item.hidden = !match;
      if (match) visibleCount += 1;
    });

    empty.hidden = visibleCount !== 0;
  };

  input.addEventListener('input', filter);
}

/* --------------------------------------------------------------------------
   10. Diagrama de arquitectura interactivo
   Cada nodo del SVG muestra su descripción en el panel inferior al
   pulsarlo o al activarlo con el teclado (Intro / Espacio).
   -------------------------------------------------------------------------- */

// Descripciones de cada elemento del diagrama
const ARCH_INFO = {
  internet:  { title: 'Internet', text: 'Red externa que provee conectividad hacia el exterior. El router es la puerta de enlace entre Internet y la red local.' },
  router:    { title: 'Router', text: 'Dirige el tráfico entre la red local e Internet y aplica NAT para compartir una dirección pública entre varios equipos.' },
  firewall:  { title: 'Firewall', text: 'Filtra el tráfico según reglas de seguridad: permite lo legítimo y bloquea accesos no autorizados antes de llegar a la LAN.' },
  switch:    { title: 'Switch', text: 'Conecta servidores, clientes y el administrador dentro de la red local (LAN) mediante conmutación de tramas.' },
  dns:       { title: 'Servidor DNS', text: 'Traduce nombres de dominio en direcciones IP para que los equipos localicen servicios y sitios por su nombre.' },
  dhcp:      { title: 'Servidor DHCP', text: 'Asigna automáticamente direcciones IP y parámetros de red (máscara, puerta de enlace, DNS) a los equipos.' },
  web:       { title: 'Servidor web', text: 'Publica sitios y aplicaciones mediante los protocolos HTTP y HTTPS para los usuarios de la red.' },
  archivos:  { title: 'Servidor de archivos', text: 'Almacena carpetas compartidas y controla quién puede leer, modificar o ejecutar cada recurso según sus permisos.' },
  clientes:  { title: 'Clientes', text: 'Estaciones de trabajo de los usuarios: consumen los servicios (web, archivos, impresión) que brindan los servidores.' },
  admin:     { title: 'Administrador de red', text: 'Gestiona usuarios, servicios y seguridad, y supervisa el estado de la red mediante monitoreo y registros.' }
};

function initArchInteractive() {
  const svg = document.getElementById('archSvg');
  const infoTitle = document.getElementById('archInfoTitle');
  const infoText = document.getElementById('archInfoText');
  if (!svg || !infoTitle || !infoText) return;

  const showInfo = (key) => {
    const info = ARCH_INFO[key];
    if (!info) return;
    infoTitle.textContent = info.title;
    infoText.textContent = info.text;
  };

  const nodes = svg.querySelectorAll('.arch-node');
  nodes.forEach((node) => {
    const key = node.getAttribute('data-arch');
    node.addEventListener('click', () => showInfo(key));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showInfo(key);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   11. Quiz interactivo
   Cuestionario de opción múltiple con validación, retroalimentación,
   puntaje final y reinicio. Sin librerías externas.
   -------------------------------------------------------------------------- */

// Banco de preguntas
const QUESTIONS = [
  {
    question: '¿Qué es un sistema operativo de red (NOS)?',
    options: [
      'Un programa para navegar por Internet',
      'Software que coordina y administra los recursos de una red',
      'Un sistema operativo para una sola computadora personal',
      'Un antivirus corporativo'
    ],
    answer: 1,
    feedback: 'El NOS coordina usuarios, recursos compartidos y servicios de toda la red.'
  },
  {
    question: '¿Qué servicio asigna automáticamente direcciones IP a los equipos?',
    options: ['DNS', 'HTTP', 'DHCP', 'FTP'],
    answer: 2,
    feedback: 'DHCP (Dynamic Host Configuration Protocol) asigna IP y parámetros de red automáticamente.'
  },
  {
    question: '¿Para qué sirve el DNS en una red?',
    options: [
      'Para traducir nombres de dominio en direcciones IP',
      'Para cifrar las conexiones remotas',
      'Para compartir archivos entre equipos',
      'Para filtrar el tráfico del firewall'
    ],
    answer: 0,
    feedback: 'El DNS resuelve nombres de host a direcciones IP.'
  },
  {
    question: '¿Cuál es un protocolo seguro para administrar servidores de forma remota?',
    options: ['Telnet', 'FTP', 'SSH', 'SMTP'],
    answer: 2,
    feedback: 'SSH cifra la conexión y es el estándar para administración remota.'
  },
  {
    question: 'En Windows Server, ¿qué servicio de directorio centraliza usuarios y políticas?',
    options: ['Samba', 'Active Directory', 'DNS', 'IIS'],
    answer: 1,
    feedback: 'Active Directory gestiona identidades y políticas del dominio en Windows Server.'
  },
  {
    question: '¿Qué componente filtra el tráfico de red según reglas de seguridad?',
    options: ['Switch', 'Router', 'Firewall', 'Hub'],
    answer: 2,
    feedback: 'El firewall controla qué tráfico entra y sale de la red según reglas de seguridad.'
  },
  {
    question: '¿Cuál es una ventaja principal de un sistema operativo de red?',
    options: [
      'Administración centralizada de usuarios y recursos',
      'Eliminar por completo la necesidad de seguridad',
      'Funcionar sin conexión a Internet',
      'Reemplazar todas las aplicaciones locales'
    ],
    answer: 0,
    feedback: 'La administración centralizada de usuarios y recursos es una de sus ventajas clave.'
  },
  {
    question: '¿Qué permite a un servidor Linux compartir archivos con equipos Windows?',
    options: ['Apache', 'Samba', 'BIND', 'Kubernetes'],
    answer: 1,
    feedback: 'Samba implementa los protocolos SMB/CIFS para interoperar con equipos Windows.'
  },
  {
    question: '¿Qué diferencia hay entre una máquina virtual y un contenedor?',
    options: [
      'Son exactamente el mismo concepto',
      'La MV incluye su propio sistema operativo; el contenedor comparte el núcleo del host',
      'Los contenedores solo sirven para juegos',
      'La MV no puede ejecutar Linux'
    ],
    answer: 1,
    feedback: 'La MV virtualiza hardware con un SO completo; el contenedor aísla un proceso compartiendo el kernel del host.'
  },
  {
    question: '¿Cuál es el principio de mínimo privilegio?',
    options: [
      'Dar a cada usuario solo los permisos necesarios para su tarea',
      'Dar permisos de administrador a todos',
      'Eliminar todas las cuentas de usuario',
      'Usar solo contraseñas cortas'
    ],
    answer: 0,
    feedback: 'Se otorga solo el acceso imprescindible para reducir riesgos.'
  },
  {
    question: '¿Para qué se utiliza LDAP en una red?',
    options: [
      'Para asignar direcciones IP',
      'Para gestionar directorios de información y autenticación centralizada',
      'Para publicar sitios web',
      'Para crear copias de seguridad'
    ],
    answer: 1,
    feedback: 'LDAP organiza directorios, como cuentas de usuario, para autenticación central.'
  },
  {
    question: '¿Qué práctica es fundamental en la seguridad de cualquier red?',
    options: [
      'Compartir la misma contraseña entre todos',
      'Realizar copias de seguridad periódicas y verificadas',
      'Desactivar los logs del sistema',
      'Conectar todos los servicios directamente a Internet'
    ],
    answer: 1,
    feedback: 'Los respaldos verificados protegen la información ante fallas o ataques.'
  }
];

function initQuiz() {
  const app = document.getElementById('quizApp');

  const startBtn = document.getElementById('quizStartBtn');
  const panelStart = document.getElementById('quizStart');
  const panelQuiz = document.getElementById('quizPanel');
  const panelResult = document.getElementById('quizResult');

  const questionEl = document.getElementById('quizQuestion');
  const optionsWrap = document.getElementById('quizOptions');
  const feedbackEl = document.getElementById('quizFeedback');
  const progressEl = document.getElementById('quizProgress');
  const barEl = document.getElementById('quizBar');
  const prevBtn = document.getElementById('quizPrevBtn');
  const nextBtn = document.getElementById('quizNextBtn');
  const finishBtn = document.getElementById('quizFinishBtn');
  const restartBtn = document.getElementById('quizRestartBtn');
  const scoreEl = document.getElementById('quizScore');
  const scoreLabelEl = document.getElementById('quizScoreLabel');
  const resultTextEl = document.getElementById('quizResultText');

  if (!app || !startBtn) return;

  /* --- Estado local del quiz --- */
  let current = 0;
  let answers = [];
  let finished = false;

  /* --- Utilidades de navegación de paneles --- */
  const show = (panel) => panel.hidden = false;
  const hide = (panel) => panel.hidden = true;

  /* --- Renderiza la pregunta actual --- */
  const render = () => {
    const q = QUESTIONS[current];
    questionEl.textContent = `Q${current + 1}. ${q.question}`;
    progressEl.textContent = `Pregunta ${current + 1} de ${QUESTIONS.length}`;
    barEl.style.width = `${((current + 1) / QUESTIONS.length) * 100}%`;
    feedbackEl.textContent = '';
    feedbackEl.style.borderLeftColor = '';

    // Estado de los botones de navegación
    prevBtn.hidden = current === 0;
    nextBtn.hidden = current === QUESTIONS.length - 1;
    finishBtn.hidden = current !== QUESTIONS.length - 1;

    // Opciones
    optionsWrap.innerHTML = '';
    q.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz__option';
      btn.textContent = option;
      btn.setAttribute('aria-pressed', 'false');

      btn.addEventListener('click', () => selectOption(index));
      optionsWrap.appendChild(btn);
    });

    // Si la pregunta ya fue respondida, restaurar colores, deshabilitado y feedback
    const answered = answers[current];
    if (answered !== undefined) {
      showAnswerState();
    }
  };

  /* --- Marca visiblemente la respuesta correcta e incorrecta --- */
  const showAnswerState = () => {
    const q = QUESTIONS[current];
    const selected = answers[current];

    Array.from(optionsWrap.children).forEach((el, i) => {
      el.disabled = true;
      if (i === q.answer) el.classList.add('is-correct');
      else if (i === selected) el.classList.add('is-incorrect');
    });

    const isCorrect = selected === q.answer;
    const correctText = q.options[q.answer];
    feedbackEl.textContent = isCorrect
      ? `✓ Correcto. ${q.feedback}`
      : `✗ Incorrecto. La respuesta correcta era "${correctText}".`;
  };

  /* --- Maneja la selección de una opción --- */
  const selectOption = (index) => {
    if (finished) return;
    if (answers[current] !== undefined) return; // ya respondida
    answers[current] = index;
    showAnswerState();
  };

  /* --- Pasa a la siguiente pregunta --- */
  const goNext = () => {
    if (answers[current] === undefined) {
      feedbackEl.textContent = 'Selecciona una respuesta antes de continuar.';
      feedbackEl.style.borderLeftColor = 'var(--c-mid)';
      return;
    }
    if (current < QUESTIONS.length - 1) {
      current += 1;
      render();
    }
  };

  /* --- Vuelve a la pregunta anterior --- */
  const goPrev = () => {
    if (current > 0) {
      current -= 1;
      render();
    }
  };

  /* --- Calcula y muestra el resultado --- */
  const finish = () => {
    // Validación de la pregunta en curso
    if (answers[current] === undefined) {
      feedbackEl.textContent = 'Selecciona una respuesta antes de ver tu resultado.';
      feedbackEl.style.borderLeftColor = 'var(--c-mid)';
      return;
    }

    const total = QUESTIONS.length;
    let correct = 0;
    QUESTIONS.forEach((q, i) => {
      if (answers[i] === q.answer) correct += 1;
    });

    // Retroalimentación general por rango
    let label = '';
    let text = '';
    const ratio = correct / total;
    if (ratio === 1) {
      label = '¡Excelente!';
      text = 'Dominas por completo los sistemas operativos de red. Puedes profundizar en los contenidos y servir de apoyo a otros estudiantes.';
    } else if (ratio >= 0.75) {
      label = '¡Muy bien!';
      text = 'Tienes un sólido nivel de conocimiento. Revisa los puntos fallados para alcanzar la excelencia.';
    } else if (ratio >= 0.5) {
      label = 'Buen avance';
      text = 'Comprendes los conceptos básicos, pero conviene repasar las secciones de servicios, seguridad y tecnologías.';
    } else {
      label = 'Sigue practicando';
      text = 'Te recomendamos revisar de nuevo la introducción, las características y los recursos educativos antes de reintentar el quiz.';
    }

    scoreEl.textContent = `${correct} / ${total}`;
    scoreLabelEl.textContent = label;
    resultTextEl.textContent = text;

    hide(panelQuiz);
    show(panelResult);
    finished = true;
  };

  /* --- Reinicia el quiz desde cero --- */
  const restart = () => {
    current = 0;
    answers = [];
    finished = false;
    hide(panelResult);
    show(panelStart);
  };

  /* --- Eventos --- */
  startBtn.addEventListener('click', () => {
    hide(panelStart);
    show(panelQuiz);
    render();
  });

  nextBtn.addEventListener('click', goNext);
  prevBtn.addEventListener('click', goPrev);
  finishBtn.addEventListener('click', finish);
  restartBtn.addEventListener('click', restart);
}