# Editorial Atlas Design Foundation

Base visual reutilizable para interfaces de consulta, documentación, catálogos y productos de contenido. La dirección combina un atlas editorial contemporáneo con la sensación de una mesa de trabajo: tinta oscura, papel cálido, tipografía con carácter, líneas finas y acentos que expresan estado.

La referencia no es una plantilla cerrada. Es un punto de partida para construir una interfaz con personalidad sin perder claridad ni capacidad de crecer.

## Dirección

### Personalidad

- Editorial, cálida y rigurosa.
- Evocadora sin convertirse en decoración temática.
- Curiosa: resuelve primero y abre caminos después.
- Táctil: superficies tintadas, separadores, textura mínima y movimiento contenido.
- Sobria: pocos acentos, mucha jerarquía y nada de ruido ornamental.

### Principios

1. **La respuesta va primero.** La acción principal debe ser evidente antes que el contexto secundario.
2. **El contenido dirige la composición.** La interfaz no debe competir con nombres, resultados, documentos o datos.
3. **La jerarquía se construye con espacio.** Separar grupos y acercar relaciones es más importante que añadir contenedores.
4. **El color comunica estado.** Un acento puede representar modo, pertenencia, estado o selección, pero nunca debe ser la única señal.
5. **La procedencia es parte del producto.** Fuentes, continuidad, estado y confianza deben tener un lugar visible.
6. **La interfaz debe invitar a seguir.** Una respuesta puede conducir a una relación, una categoría, un mapa o una referencia.

## Tipografía

### Pareja recomendada

- **Display y títulos:** `Bitter`, serif con textura y personalidad editorial.
- **Interfaz y lectura:** `Source Sans 3`, sans humanista, abierta y legible en densidad media.

```css
@import url('https://fonts.googleapis.com/css2?family=Bitter:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap');

:root {
  --font-display: 'Bitter', Georgia, serif;
  --font-body: 'Source Sans 3', system-ui, sans-serif;
}
```

### Reglas de uso

- Usar la serif para títulos, nombres, métricas reales y momentos de énfasis.
- Usar la sans para párrafos, navegación, formularios, filtros y metadatos.
- Mantener los títulos con `font-weight: 500`; el peso medio conserva carácter sin endurecer la página.
- Usar `letter-spacing` negativo en títulos grandes, aproximadamente entre `-0.03em` y `-0.05em`.
- Usar mayúsculas pequeñas solo para etiquetas, navegación y metadatos, nunca para párrafos.
- Usar una escala fluida con `clamp()` en títulos de portada y encabezados de sección.

```css
h1,
h2,
h3 {
  margin: 0;
  color: var(--text);
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.045em;
}

h1 {
  font-size: clamp(3.4rem, 8vw, 7.3rem);
  line-height: 0.93;
}

.eyebrow,
.meta,
.label {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.13em;
  line-height: 1.3;
  text-transform: uppercase;
}
```

## Color

La paleta se apoya en neutrales teñidos, no en blanco y negro puros. El modo oscuro usa tinta verde profunda; el modo claro invierte la relación y usa papel cálido como superficie dominante.

### Tokens base

Los valores están expresados en OKLCH para que los cambios de luminosidad y saturación sean más previsibles.

```css
:root {
  --ink: oklch(20% 0.025 148);
  --ink-soft: oklch(27% 0.03 148);
  --paper: oklch(91% 0.035 88);
  --paper-soft: oklch(86% 0.035 86);
  --paper-deep: oklch(79% 0.04 84);

  --text: oklch(92% 0.025 84);
  --muted: oklch(73% 0.035 84);
  --faint: oklch(54% 0.03 148);

  --line: oklch(100% 0 0 / 0.18);
  --line-strong: oklch(100% 0 0 / 0.35);

  --rust: oklch(63% 0.13 43);
  --moss: oklch(65% 0.09 133);
  --accent: oklch(77% 0.12 81);
}

:root[data-theme='light'] {
  --ink: oklch(91% 0.035 88);
  --ink-soft: oklch(87% 0.04 86);
  --paper: oklch(22% 0.025 148);
  --paper-soft: oklch(30% 0.03 148);
  --paper-deep: oklch(38% 0.035 148);

  --text: oklch(20% 0.025 148);
  --muted: oklch(37% 0.035 148);
  --faint: oklch(57% 0.03 148);

  --line: oklch(20% 0.025 148 / 0.16);
  --line-strong: oklch(20% 0.025 148 / 0.32);

  --rust: oklch(52% 0.14 43);
  --moss: oklch(48% 0.10 133);
  --accent: oklch(55% 0.13 76);
}
```

### Accent modes

Para una elección de bando, modo editorial, categoría o estado, el acento semántico puede cambiar sin duplicar todos los estilos.

```css
:root {
  --mode-green: oklch(70% 0.13 135);
  --mode-red: oklch(66% 0.16 28);
  --mode-accent: var(--accent);
}

:root[data-mode='green'] {
  --mode-accent: var(--mode-green);
}

:root[data-mode='red'] {
  --mode-accent: var(--mode-red);
}
```

Aplicar `var(--mode-accent)` a títulos destacados, foco, links principales, bordes activos y una atmósfera de fondo. No colorear todos los elementos: el acento debe guiar, no inundar.

### Atmósfera de fondo

Un gradiente radial amplio puede hacer perceptible un modo sin convertir la página en una ilustración. Debe ser más intenso en oscuro y más liviano en claro.

```css
:root {
  --mode-gradient:
    radial-gradient(
      circle at 8% 0%,
      color-mix(in oklch, var(--mode-accent) 27%, transparent),
      transparent 34%
    ),
    radial-gradient(
      circle at 92% 26%,
      color-mix(in oklch, var(--mode-accent) 15%, transparent),
      transparent 36%
    );
}

body {
  position: relative;
  isolation: isolate;
  color: var(--text);
  background: var(--ink);
}

body::after {
  position: fixed;
  z-index: -1;
  inset: 0;
  pointer-events: none;
  content: '';
  background: var(--mode-gradient);
}
```

El cambio de modo debe verse también en el control seleccionado. Combinar siempre color con texto, `aria-pressed`, relleno, borde o una línea de estado.

## Espaciado y contenedor

Usar una escala corta y consistente. La composición necesita ritmo, no una separación idéntica entre todos los elementos.

```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;
  --space-4xl: 64px;
  --space-5xl: 96px;
}

.shell {
  width: min(1180px, calc(100% - 48px));
  margin-inline: auto;
}
```

### Ritmo recomendado

- `8–16px` para elementos que pertenecen al mismo control.
- `24–32px` entre título y explicación breve.
- `48–64px` entre grupos dentro de una misma sección.
- `80–148px` entre secciones editoriales importantes.
- Usar `clamp()` para el padding vertical de portadas y secciones largas.

## Composición de portada

La portada funciona mejor cuando no intenta decirlo todo en el primer bloque.

### Orden

1. **Cabecera:** wordmark, navegación y control de tema.
2. **Puente de acción:** una franja corta entre header y hero con el CTA principal.
3. **Hero:** promesa del producto, explicación breve y selector de modo o audiencia.
4. **Acción principal:** búsqueda o formulario inmediatamente después del contexto.
5. **Exploración secundaria:** destacados, relaciones, mapa, fuentes o método.

El CTA superior debe ser reconocible como puente, no una pieza aislada. Una estructura útil es:

```html
<section class="action-bridge" aria-label="Acceso rápido">
  <a class="action-cta" href="#primary-action">
    <Icon name="arrow-down" size={18} />
    <span class="action-copy">
      <strong>Encuentra tu término</strong>
      <small>Buscar en español o inglés</small>
    </span>
    <Icon name="arrow-up-right" size={18} />
  </a>
  <span class="action-label">Consulta rápida · N términos</span>
</section>
```

### Hero de dos columnas

En desktop, el copy y el panel lateral deben compartir centro vertical. Si el panel usa `align-self: end` mientras el copy se queda en `start`, las columnas parecen pertenecer a secciones distintas.

```css
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(250px, 0.65fr);
  gap: clamp(42px, 7vw, 100px) 72px;
  align-items: center;
  padding-block: clamp(68px, 9vw, 112px) clamp(72px, 9vw, 120px);
}

.hero-aside {
  align-self: center;
}

.hero-search {
  grid-column: 1 / -1;
}

@media (max-width: 800px) {
  .hero {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .hero-aside {
    align-self: start;
  }
}
```

No centrar todos los textos. La estructura puede compartir eje vertical mientras el contenido permanece alineado a la izquierda.

## Componentes y patrones

### Wordmark editorial

- Sello circular pequeño o monograma.
- Kicker en sans y mayúsculas.
- Nombre en serif, con peso medio.
- No convertir el wordmark en un logo complejo si el producto aún está creciendo.

### Campo de búsqueda

- Debe ser el control más grande de la sección.
- Placeholder explícito sobre idiomas, alias o tipos aceptados.
- Contador de resultados con `aria-live="polite"`.
- Tecla rápida solo si realmente está implementada.
- Filtros debajo del campo, no antes de él.
- Lista inicial limitada cuando el índice es grande; al buscar se muestra el conjunto completo.

### CTA editorial

El CTA funciona mejor como una pieza de navegación con contexto, no como un botón redondeado genérico.

- Borde fino en el acento actual.
- Relleno tenue en el mismo color.
- Marca pequeña o flecha, nunca un icono enorme.
- Título de acción y subtítulo de contexto.
- Hover con cambio de fondo y una traslación mínima.
- Foco visible y área táctil cómoda.

### Selector de modo o bando

```html
<div class="mode-picker" role="group" aria-label="Elegir modo">
  <button type="button" aria-pressed="true">Modo verde</button>
  <button type="button" aria-pressed="false">Modo rojo</button>
</div>
```

Estado seleccionado mínimo:

```css
.mode-option[aria-pressed='true'] {
  border-color: var(--mode-option-color);
  background: color-mix(in oklch, var(--mode-option-color) 20%, transparent);
  box-shadow: inset 0 -3px 0 var(--mode-option-color);
}

.mode-option[aria-pressed='true'] .mode-sigil {
  color: var(--ink);
  background: var(--mode-option-color);
}
```

El script debe estar encapsulado en una función para no colisionar con otros scripts inline de la página:

```js
(() => {
  const root = document.documentElement;
  const options = document.querySelectorAll('[data-mode-option]');

  const setMode = (mode) => {
    root.dataset.mode = mode;
    options.forEach((option) => {
      option.setAttribute('aria-pressed', String(option.dataset.modeOption === mode));
    });
  };

  options.forEach((option) => {
    option.addEventListener('click', () => setMode(option.dataset.modeOption));
  });
})();
```

### Lista de resultados

Para contenido denso, preferir filas editoriales sobre tarjetas repetidas:

- Índice o número pequeño.
- Nombre principal en serif.
- Equivalencia o alias en color de acento.
- Resumen breve en muted.
- Metadatos en uppercase pequeño.
- Flecha de navegación alineada al borde.
- Separadores finos en lugar de sombras.
- Iconos SVG de trazo fino, nunca caracteres Unicode que puedan convertirse en emoji.

## Responsive

### Desktop

- Usar dos columnas para promesa y contexto secundario.
- Mantener un ancho máximo amplio pero legible.
- Dejar que el buscador o lista ocupe todo el grid cuando sea la acción principal.
- Centrar verticalmente columnas relacionadas.

### Tablet y móvil

- En `800px`, pasar el hero a una columna y mantener el CTA antes del contexto secundario.
- En `560px`, hacer que las opciones del selector pasen a una columna.
- No ocultar la búsqueda ni los filtros esenciales.
- Convertir el puente de CTA en una columna con el contador debajo.
- Mantener controles con al menos `44px` de alto cuando sea posible.
- Reducir tamaño, no claridad: el texto puede envolver, pero no desaparecer.

## Movimiento

Usar una entrada inicial coordinada en lugar de animar cada elemento por separado.

```css
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    animation: reveal-in 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
}

@keyframes reveal-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

No animar `width`, `height`, `padding` o `margin` para crear una sensación de movimiento. Preferir `opacity` y `transform`.

## Accesibilidad

- Usar `aria-pressed` para modos, filtros y opciones mutuamente excluyentes.
- Mantener `:focus-visible` con un anillo en el acento actual.
- No depender únicamente del color: acompañar el estado con texto, relleno, borde, icono o posición.
- Usar `aria-live="polite"` para contadores y cambios de resultados.
- Mantener contraste alto entre texto y superficie, especialmente en modo claro.
- Respetar `prefers-reduced-motion`.
- Hacer que la navegación por teclado siga el orden visual y editorial.
- Evitar truncar nombres importantes; usar wrapping antes que `ellipsis` en contenido principal.

## Lo que se debe evitar

- Gradientes púrpura-azul o brillos neón sin una función semántica.
- Blanco puro y negro puro como superficies principales.
- Tarjetas redondeadas para cada bloque.
- Sombras genéricas como sustituto de jerarquía.
- Centrar todos los textos por defecto.
- Un hero con métrica decorativa que no ayude a la tarea.
- Tres o más colores de acento compitiendo.
- Selector de tema que solo cambia una etiqueta pero no la superficie, el acento o el estado.
- Botones que anuncian una tecla rápida inexistente.
- Párrafos largos antes de la acción principal.

## Checklist de implementación

- [ ] El usuario entiende qué es el producto en la primera pantalla.
- [ ] La acción principal aparece antes del contexto secundario.
- [ ] El CTA está conectado visualmente con la sección a la que lleva.
- [ ] El hero comparte eje vertical entre columnas en desktop.
- [ ] El layout se convierte en una columna sin perder acciones en móvil.
- [ ] El modo activo cambia superficie, acento y estado del control.
- [ ] El modo claro conserva contraste y no se limita a invertir colores.
- [ ] La búsqueda tiene estado vacío, resultados iniciales y resultados filtrados.
- [ ] Hay foco visible y navegación completa por teclado.
- [ ] `npm run check` y `npm run build` pasan antes de publicar.
