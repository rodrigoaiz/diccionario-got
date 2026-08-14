# Brief del producto

## Resumen

El proyecto sera un atlas publico y diccionario bilingue para consultar el universo de George R. R. Martin desde una perspectiva de lectura en espanol y visionado en ingles.

El problema central es la diferencia entre nombres y referencias localizadas. Un lector puede encontrar `Invernalia` en el libro y `Winterfell` en la serie, o `Desembarco del Rey` en espanol y `King's Landing` en ingles, sin saber si se trata del mismo lugar ni en que obra aparece.

## Accion principal

Buscar un nombre, termino o lugar en espanol o ingles y recibir:

- Equivalencia de nombres.
- Tipo de entrada.
- Continuidad y obra.
- Resumen breve.
- Referencias a libro y capitulo o temporada y episodio.
- Relaciones con otras entradas.
- Ubicacion en el mapa cuando corresponda.
- Fuentes consultadas.

## Alcance de la primera version

La arquitectura debe soportar todo el universo desde el inicio:

- *Cancion de hielo y fuego*.
- *Fuego y sangre*.
- *Game of Thrones*.
- *House of the Dragon*.
- Historia, geografia, casas, personajes, dragones, organizaciones, religiones, objetos, titulos y eventos.

La primera carga sera masiva. La recomendacion editorial es que muchas entradas empiecen como fichas minimas estructuradas, mientras que las entradas prioritarias reciban resenas propias y referencias mas completas.

## Direccion de experiencia

La interfaz debe parecer un atlas historico contemporaneo construido sobre una mesa de cartografo:

- Fondo de tinta oscura y superficies de pergamino controladas.
- Tipografia de display con personalidad historica para titulos.
- Tipografia sans serif legible para busqueda, filtros y metadatos.
- Acentos de tinta roja, ocre y verde apagado para distinguir tipos de entrada.
- Bordes finos y textura sutil, sin sombras genericas ni exceso de tarjetas.
- El mapa debe ser una herramienta para orientarse, no un fondo decorativo.

## Estructura de pantallas

### Inicio

- Cabecera con marca, navegacion y enlace al mapa.
- Hero con la pregunta: `Que nombre estas buscando?`.
- Buscador que acepta espanol, ingles y alias.
- Accesos por tipo: personajes, lugares, casas, dragones, conceptos y eventos.
- Seccion de entradas destacadas.
- Vista previa del mapa con lugares principales.
- Nota editorial sobre continuidades y spoilers.

### Resultados

- Lista escaneable, no una cuadricula repetitiva.
- Nombre espanol destacado.
- Equivalencia inglesa en segundo nivel.
- Tipo, continuidad y region.
- Alias relevantes.
- Estado de confianza o cobertura de la ficha.
- Filtros por tipo, continuidad, region y obra.
- Estado especifico para nombres ambiguos, como varios `Aegon`.

### Ficha de entrada

- Nombre principal y nombre original.
- Tipo y continuidad.
- Alias y variantes.
- Resumen original breve.
- Bloque de referencias de libros.
- Bloque de referencias de series.
- Relaciones cruzadas bidireccionales.
- Ubicacion cartografica si aplica.
- Fuentes y fecha de consulta.
- Aviso de spoilers visible antes de informacion sensible.

### Mapa

- SVG propio con regiones, mares, rutas y lugares principales.
- Zoom y desplazamiento.
- Marcadores pulsables.
- Filtros por region y continuidad.
- Panel de detalle para el marcador seleccionado.
- En mobile, el detalle se presenta como panel inferior.
- Nota visible de que las posiciones son aproximadas.

## Estados de interfaz

- Primera visita sin busqueda.
- Busqueda con resultados.
- Busqueda sin resultados.
- Resultados ambiguos.
- Filtro sin coincidencias.
- Entrada con datos parciales.
- Conflicto entre libro y serie.
- Aviso de spoiler.
- Mapa cargando.
- Mapa sin ubicaciones para el filtro seleccionado.
- Error de carga de datos.
- Navegacion mobile con controles reducidos pero completos.

## Responsive

- Desktop: composicion en dos columnas para resultados y detalle/mapa.
- Tablet: paneles apilados con filtros en una barra horizontal desplazable.
- Mobile: buscador primero, resultados en lista, mapa con controles tactiles grandes y detalle en panel inferior.
- No ocultar la equivalencia inglesa, referencias ni acciones principales en mobile.

## Criterio de exito

La aplicacion debe permitir resolver una duda de traduccion u orientacion en menos de tres acciones, sin abrir varias wikis. Una ficha debe dejar claro si el dato pertenece al libro, a una serie, a varias continuidades o a una inferencia.
