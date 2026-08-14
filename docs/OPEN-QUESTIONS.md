# Preguntas pendientes

Estas decisiones no bloquean la documentacion, pero deben resolverse antes de cerrar el modelo de contenido y el importador.

## Edicion espanola de referencia

Que edicion se utilizara como autoridad para nombres, titulos y capitulos?

Opciones posibles:

- Edicion de Espana / Gigamesh.
- Edicion de bolsillo o Debolsillo.
- La edicion concreta que esta leyendo el creador.
- Registrar varias ediciones y marcar la variante regional.

Recomendacion: registrar la edicion que el creador esta leyendo y permitir variantes por fuente, en lugar de declarar una unica traduccion como universal.

## Profundidad de la carga masiva

La primera importacion puede producir:

- Muchas fichas minimas con nombres, alias, tipo, continuidades, enlaces y fuentes.
- Menos fichas con resumen completo, relaciones y referencias enriquecidas.

Recomendacion: hacer carga masiva de fichas minimas y priorizar despues las entradas mas consultadas, empezando por HOTD y *Fuego y sangre*.

## Alcance de las referencias de libros

Decidir si la primera version tendra solo obra/capitulo o tambien POV, edicion, paginas e ISBN.

Recomendacion: empezar por obra, capitulo, titulo ES/EN y POV. Agregar pagina solo cuando la edicion este registrada.

## Licencia del mapa

Decidir si se utilizara:

- SVG propio redibujado.
- Un archivo concreto de Wikimedia Commons con licencia compatible.
- Solo enlaces a mapas externos.

Recomendacion: SVG propio con posiciones aproximadas y atribucion de las fuentes de referencia. No usar escaneos de mapas impresos.

## Despliegue

Falta definir dominio, host y puerto de publicacion. Como este proyecto es independiente, no se debe reutilizar ni alterar el puerto 4324 del Help Desk ni la configuracion de Nginx de los servicios existentes.

## Canon y nivel de confianza

Decidir si se incluiran teorias de fans y material no canonico. Si se incluyen, deben aparecer en una categoria separada, con etiqueta `teoria`, `no canonico` o `pendiente de verificar`.
