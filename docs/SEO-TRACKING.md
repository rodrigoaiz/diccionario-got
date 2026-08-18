# SEO Tracking

Registro vivo para interpretar Search Console y decidir el rumbo editorial del diccionario.

## Objetivo

Conseguir que una persona que encuentra un nombre en español, inglés, un libro o una adaptación llegue a una ficha clara, bilingüe y con contexto suficiente para reconocer el concepto.

La prioridad es utilidad editorial, no publicar páginas por volumen.

## Línea Base

Primer corte compartido de Search Console: 2026-08-18.

| Consulta | Clics | Impresiones | Página | Lectura | Acción |
| --- | ---: | ---: | --- | --- | --- |
| `game of thrones asha` | 0 | 2 | `/diccionario/asha-greyjoy/` | Intención de encontrar a Asha/Yara dentro de la serie | Añadir continuidad GOT, alias Yara y referencia televisiva |
| `sotodeoro` | 0 | 1 | `/diccionario/sotodeoro/` | Búsqueda de lugar muy específico | Explicar Goldengrove, Casa Rowan y relación con El Dominio |

Estos datos son señales tempranas, no una muestra suficiente para medir rendimiento.

## Estado Actual

- Sitio: `https://diccionario-got.vercel.app/`
- Último build validado: 232 páginas estáticas.
- Las fichas `Pendiente` no son indexables.
- Las fichas revisadas incluyen nombre español, equivalente inglés, tipo, continuidad, región, resumen y fuentes.
- El diccionario sigue siendo la superficie principal; el mapa es secundaria.

## Cómo Interpretar Consultas

### Consultas de personaje

Ejemplos: `game of thrones asha`, `yara greyjoy`, `asha greyjoy libros`.

La ficha debe resolver la diferencia entre nombre de libros y nombre de adaptación, además de enlazar casa, región y relaciones principales.

### Consultas de lugar

Ejemplos: `sotodeoro`, `goldengrove`, `sotodeoro casa rowan`.

La ficha debe decir qué es, dónde está, quién lo gobierna y con qué nombre aparece en inglés. No basta con traducir el nombre.

### Consultas de traducción

Ejemplos: `the wall español`, `goldengrove español`, `asha o yara`.

La equivalencia debe estar en `nameEn` o `aliases`, pero siempre acompañada por una explicación para evitar confundir traducción, adaptación y entidad.

### Consultas genéricas

Ejemplos: `personajes got`, `lugares juego de tronos`.

Sirven para detectar categorías y páginas de entrada, no para decidir fichas individuales sin más evidencia.

## Reglas de Decisión

- Una o dos impresiones no justifican crear una ficha nueva por sí solas.
- Una consulta repetida durante varias semanas sí justifica mejorar la ficha y sus relaciones.
- Si hay impresiones y cero clics, revisar título, resumen, equivalentes y coincidencia con la intención.
- Si hay clics, ampliar el contexto relacionado antes de crear más páginas aisladas.
- Agrupar consultas por tema: personaje, casa, lugar, evento, dragón o traducción.
- No publicar candidatos sin tipo, continuidad, región, fuente y resumen.
- No eliminar una ficha indexada solo por tener poco tráfico; eliminar únicamente duplicados, ruido o entradas incorrectas.
- Mantener las capturas raw aunque una ficha se descarte.

## Umbrales Prácticos

Son heurísticas para priorizar trabajo, no objetivos rígidos.

| Señal en 28 días | Decisión |
| --- | --- |
| 1-2 impresiones | Registrar y esperar más datos |
| 3-9 impresiones | Revisar si falta alias, contexto o enlace interno |
| 10+ impresiones y 0 clics | Mejorar título, descripción y primer párrafo |
| 10+ impresiones y clics | Crear relaciones y fichas de apoyo |
| Varias consultas del mismo grupo | Trabajar el cluster completo |

## Rumbo Editorial

### Prioridad 1: resolver nombres que ya aparecen

- Asha Greyjoy / Yara Greyjoy / Game of Thrones.
- Sotodeoro / Goldengrove / Casa Rowan / El Dominio.
- El Muro / The Wall / Guardia de la Noche.

### Prioridad 2: completar clusters relacionados

- Islas del Hierro: Asha, Balon, Theon, Euron, Aeron, Victarion y Casa Greyjoy.
- El Dominio: Sotodeoro, Casa Rowan, Altojardín, Casa Tyrell, Casa Tarly y Casa Florent.
- Norte y Muro: El Muro, Guardia de la Noche, Mance, Caminantes Blancos, Hodor y pueblos libres.

### Prioridad 3: ampliar cobertura con intención clara

- Personajes secundarios que aparezcan en consultas o relaciones.
- Casas con sede y región comprensibles.
- Lugares con equivalencia española/inglesa real.
- Eventos que ayuden a leer libros y distinguir adaptaciones.

## Revisión Semanal

Guardar un nuevo corte cada 7-14 días, usando siempre el mismo periodo comparativo de 28 días.

| Fecha | Periodo | Clics | Impresiones | CTR | Posición media | Páginas indexadas | Decisión |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 2026-08-18 | Primer corte | 0 | 3 | - | - | Pendiente de medir | Mejorar Asha y Sotodeoro |

### Consultas nuevas

| Fecha | Consulta | Impresiones | Clics | Página | Acción |
| --- | --- | ---: | ---: | --- | --- |
| 2026-08-18 | `game of thrones asha` | 2 | 0 | `asha-greyjoy` | Hecho |
| 2026-08-18 | `sotodeoro` | 1 | 0 | `sotodeoro` | Hecho |

## Checklist Por Ficha

- El nombre español es el usado por el lector objetivo.
- El equivalente inglés aparece de forma visible.
- Los alias de libros y series están separados o explicados.
- El primer párrafo responde qué es y por qué importa.
- La continuidad no mezcla libros y adaptación sin indicarlo.
- La región es concreta y enlazable.
- Existe al menos una fuente trazable.
- Hay relaciones hacia casa, región, personaje o evento relevante.
- El título y la descripción contienen la intención sin repetir palabras artificialmente.

## Registro De Cambios

| Fecha | Cambio | Motivo | Resultado esperado |
| --- | --- | --- | --- |
| 2026-08-18 | Asha incluye GOT, Yara Greyjoy y referencia televisiva | Consulta `game of thrones asha` | Mejor coincidencia con la intención de adaptación |
| 2026-08-18 | Sotodeoro explica Goldengrove, Casa Rowan y El Dominio | Consulta `sotodeoro` | Reducir ambigüedad y mejorar comprensión |

## Próxima Revisión

Esperar un corte de 28 días antes de sacar conclusiones de rendimiento. Mientras tanto, mejorar clusters relacionados y registrar cada consulta nueva en este documento en vez de reaccionar con páginas aisladas.
