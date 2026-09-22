# Sistemas Operativos de Red — Plataforma Educativa

Sitio web educativo completo sobre **Sistemas Operativos de Red (NOS — Network Operating Systems)**.
Desarrollado exclusivamente con **HTML5**, **CSS3** y **JavaScript vanilla** (ES6+), sin frameworks,
librerías ni dependencias externas. La estética es minimalista y se limita a blanco, negro y
escala de grises.

## Estructura del proyecto

```
/
├── index.html          # Estructura semántica de todo el sitio
├── css/
│   └── styles.css      # Estilos, tema claro/oscuro, responsive y accesibilidad
├── js/
│   └── script.js       # Funcionalidades interactivas (vanilla JS)
├── img/
│   └── logo-institucion.jpeg  # Logo de la institución educativa
└── README.md
```

## Cómo ejecutar

Abre `index.html` directamente en cualquier navegador moderno. No requiere servidor,
compilación ni instalación de dependencias.

## Secciones del sitio

1. **Hero / Inicio** — Presentación con representación SVG abstracta de una red.
2. **Conceptos fundamentales** — Definición, utilidad, diferencias con un SO convencional
   y componentes del NOS.
3. **Características principales** — 9 tarjetas con iconografía monocromática.
4. **Diseño curricular** — Objetivo general y 6 unidades temáticas en timeline/acordeón,
   cada una con objetivos, contenidos, actividades y competencias.
5. **Tecnologías utilizadas** — 13 tecnologías (Linux, Windows Server, Active Directory,
   Samba, DNS, DHCP, SSH, LDAP, Docker, Kubernetes, virtualización, cloud y TCP/IP).
6. **Comparativa** — Tabla responsive entre Linux, Windows Server y Unix/BSD.
7. **Arquitectura de red** — Diagrama SVG de Internet → Router → Firewall → Switch →
   Servidores → Clientes.
8. **Ventajas y desafíos** — Dos bloques con los puntos fuertes y las dificultades.
9. **Recursos educativos** — Glosario interactivo con buscador, comandos de Linux y
   Windows Server, buenas prácticas de seguridad y preguntas frecuentes.
10. **Quiz interactivo** — 12 preguntas de opción múltiple con validación, puntaje,
    retroalimentación y reinicio.

## Funcionalidades JavaScript

- Modo claro / oscuro con botón en el encabezado, persistencia en `localStorage`
  y respeto inicial a `prefers-color-scheme` (sin parpadeo al cargar).
- Menú hamburguesa responsive con estados ARIA y cierre con `Escape`.
- Navegación suave entre secciones y cierre automático del menú móvil.
- Scroll spy: resalta la sección activa en la navegación (`aria-current`).
- Indicador de progreso de lectura (barra superior).
- Botón "volver arriba".
- Animaciones de aparición al hacer scroll mediante `IntersectionObserver`.
- Acordeones del diseño curricular (una unidad abierta a la vez).
- Glosario con buscador en tiempo real y aviso de "sin resultados".
- Diagrama de arquitectura interactivo: cada nodo muestra su descripción
  en un panel con `aria-live` (ratón y teclado).
- Quiz con validación de respuestas, retroalimentación, puntaje final y reinicio.

## Diseño

- Paleta restringida: `#FFFFFF`, `#000000`, `#1A1A1A`, `#666666`, `#E5E5E5`, `#F5F5F5`.
- El modo oscuro reasigna esas mismas variables a grises invertidos
  (sin colores nuevos). Los diagramas SVG monocromáticos se invierten con
  `filter` para integrarse; el logo institucional conserva sus colores.
- Logo de la institución en el encabezado y en el pie de página.
- Tipografía de sistema moderna y legible; monospace para comandos.
- CSS Grid y Flexbox, breakpoints en 900 px, 768 px y 520 px.
- Sin scroll horizontal accidental; tablas y diagramas con desplazamiento propio en móvil.

## Accesibilidad

- HTML semántico (header, nav, main, section, article, figure, details).
- Contraste elevado, estados `hover` y `focus-visible`.
- Atributos ARIA (aria-expanded, aria-controls, aria-current, aria-live, etc.).
- Soporte para `prefers-reduced-motion`.
- Navegación completa mediante teclado.

## Aviso

Material con fines educativos. Las explicaciones técnicas mantienen rigor y están
orientadas a estudiantes de informática.