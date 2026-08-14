# Diccionario de referencia de Poniente

Proyecto independiente para crear un atlas y diccionario bilingue de referencia del universo de *Cancion de hielo y fuego*, *Fuego y sangre*, *Game of Thrones* y *House of the Dragon*.

## Estado actual

Existe una primera base funcional en Astro con busqueda, filtros, fichas estaticas y una vista secundaria del mapa.

El contenido actual es una importacion de prueba de 7 entradas. Las fichas Markdown son la fuente editorial y el fixture JSON solo simula la entrada bruta del importador.

La documentacion se preparo para continuar el trabajo en una sesion nueva desde:

```text
~/Documentos/Dev/diccionario-got
```

El repositorio `tickets-sep` queda fuera de este proyecto y no debe modificarse para construirlo.

## Decisiones confirmadas

- Proyecto separado del Help Desk.
- Stack previsto: Astro, React Islands y Tailwind CSS.
- Aplicacion publica, sin login.
- Espanol como idioma principal.
- Ingles visible como equivalencia en nombres, alias, titulos y referencias.
- Cobertura del universo completo, no solo `House of the Dragon`.
- Primera carga masiva de datos.
- Avisos de spoilers, sin bloquear el contenido.
- Mapa interactivo propio, preferentemente en SVG.
- Sin cuentas, favoritos ni notas personales en la primera version.
- Direccion visual: mapa medieval y atlas historico.

## Documentos

- [`docs/BRIEF.md`](docs/BRIEF.md): objetivo, usuarios, experiencia y alcance.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): arquitectura tecnica propuesta para Astro.
- [`docs/CONTENT-PLAN.md`](docs/CONTENT-PLAN.md): entidades, continuidades, referencias y reglas editoriales.
- [`docs/IMPORT-PLAN.md`](docs/IMPORT-PLAN.md): estrategia para la carga masiva y normalizacion.
- [`docs/SOURCES.md`](docs/SOURCES.md): fuentes investigadas, usos y precauciones.
- [`docs/OPEN-QUESTIONS.md`](docs/OPEN-QUESTIONS.md): decisiones que siguen pendientes.
- [`.impeccable.md`](.impeccable.md): contexto visual para futuras sesiones de diseno.

## Siguiente paso

Antes de cerrar el importador, confirmar las preguntas de [`docs/OPEN-QUESTIONS.md`](docs/OPEN-QUESTIONS.md), especialmente la edicion espanola de referencia y el alcance real de las fichas que tendran resumen editorial en la primera carga.

## Desarrollo local

```bash
npm install
npm run import:test
IMPORT_LIMIT=4 npm run import:mediawiki
npm run dev
```

`npm run import:test` regenera las fichas de prueba en `src/content/entries/` a partir de `scripts/import/fixtures/entries.sample.json`.
`npm run import:mediawiki` consulta una categoria real, guarda la respuesta bruta y crea fichas minimas pendientes de revision.
