# Plan de contenido y modelo editorial

## Continuidades

Las continuidades deben almacenarse separadas y nunca combinar hechos automaticamente:

- `libros`: *Cancion de hielo y fuego*.
- `fuego-y-sangre`: cronica de la casa Targaryen y material que sirve de base a HOTD.
- `got-tv`: *Game of Thrones*.
- `hotd-tv`: *House of the Dragon*.
- `universo`: datos generales que no dependen de una adaptacion concreta.

Una entrada puede pertenecer a varias continuidades, pero cada apariencia, parentesco, muerte, titulo, mapa o evento debe indicar su continuidad concreta.

## Tipos de entrada

- Personaje.
- Casa o linaje.
- Dragon.
- Lugar, ciudad, castillo, isla o region.
- Evento historico o batalla.
- Organizacion u orden.
- Concepto, religion, costumbre o termino.
- Titulo, cargo o tratamiento.
- Objeto, arma o artefacto.
- Obra, libro, temporada o episodio.

## Campos minimos de una entrada

```text
id
slug
tipo
nombre_es
nombre_en
alias_es
alias_en
resumen
continuidades
region
etiquetas
nivel_de_confianza
spoiler_hasta
fuentes
relaciones
apariciones
coordenadas_mapa
fecha_consulta
```

## Equivalencias

Cada equivalencia debe conservar su procedencia:

- Nombre usado en la edicion espanola del libro.
- Nombre original en ingles.
- Nombre de doblaje.
- Nombre de subtitulos.
- Variante comunitaria o regional.
- Alias historico dentro del universo.

No marcar una traduccion comunitaria como oficial. Si hay variantes, mostrarlas con una etiqueta que explique su origen.

## Referencias de libros

Registrar como minimo:

- Obra en espanol.
- Titulo original.
- Numero de capitulo cuando exista.
- Titulo del capitulo en espanol e ingles cuando este disponible.
- Personaje POV si aplica.
- Edicion o traduccion usada.
- URL de apoyo si la fuente es externa.

Las paginas son opcionales porque cambian entre ediciones. Si se agregan, siempre deben tener la edicion y el ISBN.

## Referencias de series

Registrar:

- Serie.
- Temporada.
- Numero de episodio.
- Titulo original.
- Titulo localizado usado por la fuente.
- Tipo de referencia: aparicion, evento, primera mencion o ultima aparicion.
- Fuente del titulo localizado: plataforma, doblaje, subtitulos o Wikipedia.

## Referencias cruzadas

Las relaciones deben ser tipadas y bidireccionales cuando tenga sentido:

- `pertenece_a`.
- `gobierna`.
- `es_jinete_de`.
- `monta_a`.
- `es_pariente_de`.
- `es_descendiente_de`.
- `es_sede_de`.
- `esta_en`.
- `participa_en`.
- `aparece_en`.
- `equivale_a`.
- `contradice_en_continuidad`.

Esto permite enlazar una casa con sus miembros, una ciudad con su region, un dragon con sus jinetes y una version literaria con su adaptacion sin forzar todos los datos a una misma ficha plana.

## Spoilers

La decision confirmada es mostrar avisos, no bloquear contenido.

Cada entrada o referencia puede tener una etiqueta como:

- `sin-spoiler`.
- `inicio-de-la-obra`.
- `intermedio`.
- `final-de-la-obra`.
- `spoiler-total`.

El aviso debe aparecer antes del bloque sensible y explicar la continuidad afectada, por ejemplo: `Contiene informacion posterior al episodio 4 de la temporada 1`.

## Calidad editorial

Cada dato importante debe tener:

- Fuente.
- Fecha de consulta.
- Continuidad.
- Nivel de confianza.
- Nota si existe contradiccion o incertidumbre.

Niveles de confianza recomendados:

- `oficial`.
- `bibliografico`.
- `wiki-comunitaria`.
- `inferido`.
- `pendiente-de-verificar`.
