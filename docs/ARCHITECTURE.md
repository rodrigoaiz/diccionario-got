# Arquitectura tecnica propuesta

## Stack

- Astro para paginas estaticas, rutas y generacion de fichas.
- React Islands para componentes interactivos.
- Tailwind CSS para tokens, layout y responsive.
- TypeScript para el modelo de datos y validaciones.
- SVG propio para el mapa interactivo.
- Datos locales versionados en el repositorio para que el sitio sea estable y auditable.

La implementacion debe seguir la convencion ya usada en otros proyectos Astro del entorno: `astro.config.mjs`, `src/layouts`, `src/components`, `src/pages`, `src/styles` y alias `@/*`.

## Componentes Astro y React

Astro debe encargarse de:

- Layout general y metadatos.
- Cabecera, pie, navegacion y contenido editorial.
- Generacion estatica de las fichas.
- Renderizado inicial del listado y de los textos.

React Islands debe encargarse de:

- Buscador global.
- Filtros combinados.
- Mapa con seleccion de marcadores.
- Panel de detalle del mapa.
- Estado de resultados y nombres ambiguos.

No convertir toda la aplicacion en una SPA. Usar islands pequenas y directivas como `client:load` o `client:visible` solo donde hagan falta.

## Rutas previstas

- `/`: portada, buscador y entradas destacadas.
- `/diccionario/`: listado completo.
- `/diccionario/[slug]/`: ficha de una entrada.
- `/mapa/`: mapa completo.
- `/cronologia/`: linea temporal por continuidad.
- `/fuentes/`: metodologia, atribuciones y licencias.
- `/acerca-de/`: objetivo y limites del proyecto.

## Organizacion prevista

```text
src/
  components/
    atlas/
    islands/
    layout/
  content/
    entries/
    books/
    series/
  data/
    map/
    relationships/
  layouts/
  pages/
  styles/
scripts/
  import/
  validate/
public/
  map/
```

## Estrategia de contenido

Las fichas editoriales deben vivir como Markdown con frontmatter validado por una coleccion de contenido de Astro. La recomendacion es:

- Markdown para fichas, alias, relaciones, coordenadas, referencias y resumen editorial.
- MDX solo para fichas que necesiten componentes especiales.
- JSON para capturas brutas, archivos intermedios e indices generados, no como fuente editorial principal.
- Un identificador estable y un `slug` separado del nombre visible.
- Ningun componente debe depender del HTML de una wiki externa.

## Generacion de fichas

Las paginas de entrada deben usar `getStaticPaths()` y construir rutas estaticas. La busqueda puede hidratar un indice reducido en el cliente, mientras que las fichas completas permanecen prerenderizadas.

## Rendimiento

- No cargar el mapa completo de forma interactiva hasta que sea visible o se visite `/mapa/`.
- Evitar imagenes remotas como dependencia del contenido principal.
- Cargar solo los datos necesarios para el buscador inicial.
- Generar un indice de busqueda durante la importacion.
- Usar SVG y datos de coordenadas en vez de una imagen pesada cuando sea posible.

## No previsto en esta fase

- Base de datos o panel de administracion.
- Login, cuentas, progreso personal, favoritos o notas.
- Scraping durante el request del usuario.
- Dependencia del Help Desk o de su PostgreSQL.
- Modificaciones en Nginx, Caddy o los puertos del Help Desk.
