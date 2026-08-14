# Plan de importacion masiva

## Objetivo

Crear una primera carga amplia del universo sin depender de que el sitio consulte una wiki en cada visita.

La importacion debe producir datos versionados, reproducibles y revisables. No es necesario copiar el texto completo de una wiki para obtener nombres, alias, categorias, enlaces, continuidades y referencias utiles.

## Formatos

- JSON bruto para respuestas de APIs y capturas intermedias.
- Markdown con frontmatter como fuente editorial canonica.
- JSON generado para el indice de busqueda y datos derivados.
- MDX solo cuando una ficha necesite una presentacion interactiva especial.

## Primer adaptador

El primer adaptador funcional usa la API de MediaWiki con un limite configurable. Acepta una categoria o una lista de titulos concretos. Guarda titulos, IDs, categoria, URL y fecha de consulta, pero no copia el texto de las paginas. Las fichas creadas quedan marcadas como `pendiente-de-verificar` hasta completar continuidad, equivalencias y resumen propio. Por defecto no sobreescribe fichas existentes.

## Flujo propuesto

1. Descargar o consultar APIs publicas de MediaWiki cuando existan.
2. Obtener titulos, redirecciones, alias, categorias, enlaces, interwikis y URLs de origen.
3. Normalizar acentos, mayusculas, apostrofes y guiones para el indice de busqueda.
4. Detectar duplicados y homonimos.
5. Clasificar la entidad.
6. Asignar continuidad sin mezclar libros y adaptaciones.
7. Extraer referencias de libros, capitulos, temporadas y episodios cuando sean trazables.
8. Asociar fuentes, fecha de consulta, licencia y nivel de confianza.
9. Generar archivos locales JSON/Markdown.
10. Ejecutar validaciones de slugs, relaciones rotas, fuentes faltantes y duplicados.
11. Revisar manualmente las entradas prioritarias.

## Fuentes para localizar datos

- Wikipedia en espanol para nombres localizados y enlaces iniciales.
- A Wiki of Ice and Fire para estructura de personajes, casas, capitulos, geografia y cronologia.
- Wikidata para identificadores y alias multilingues.
- HBO/Max para titulos, temporadas, episodios y continuidad de las series.
- Hielo y Fuego Wiki como fuente secundaria para terminologia espanola, siempre con verificacion.

## Limite de copia

La carga masiva debe priorizar datos estructurados y redaccion propia:

- Si se usa contenido con licencia CC BY-SA, conservar atribucion, enlace, licencia y obligaciones de compartir igual donde corresponda.
- No copiar sin revisar textos de Fandom, traducciones editoriales, material promocional de HBO, portadas, escudos ni mapas escaneados.
- No copiar resumenes extensos ni texto de capitulos.
- Redactar resumenes originales a partir de varias fuentes.
- Guardar el enlace de la fuente, no sustituirlo por una copia local de su pagina.

## Importador y revisiones futuras

El importador deberia vivir fuera de la ruta publica, por ejemplo en `scripts/import/`, y escribir a una carpeta de datos intermedia antes de modificar el contenido final.

Cada ejecucion debe generar un informe con:

- Entradas nuevas.
- Entradas actualizadas.
- Entradas que desaparecieron.
- Duplicados detectados.
- Relaciones no resueltas.
- Fuentes nuevas o cambiadas.
- Datos que requieren revision manual.

## Orden recomendado de carga

1. Continuidades y obras.
2. Regiones, continentes, mares y lugares principales.
3. Casas y organizaciones.
4. Personajes principales y relaciones familiares.
5. Dragones y jinetes.
6. Conceptos, titulos y religiones.
7. Eventos y cronologia.
8. Capitulos y episodios relacionados.
9. Coordenadas y puntos del mapa.

## Indice de busqueda

Generar un indice que incluya:

- Nombre espanol.
- Nombre ingles.
- Alias.
- Variantes ortograficas.
- Slug.
- Tipo.
- Continuidad.
- Region.

La busqueda debe tolerar acentos y diferencias de apostrofe sin alterar el nombre mostrado al usuario.
