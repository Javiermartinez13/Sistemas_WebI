# Ejercicio Tampermonkey

## Descripción

Userscript llamado **Quitar distracciones de YouTube**. Añade un panel de
control a YouTube para ocultar Shorts y vídeos recomendados mientras se navega.

## Archivos

- `concentracion-youtube.js`: script completo de Tampermonkey, con metadatos,
  JavaScript y estilos del panel.

## Funcionamiento

- Añade un panel flotante en la esquina inferior izquierda de YouTube.
- Muestra si el modo está activado o desactivado.
- Oculta la sección de Shorts cuando se pulsa **Activar**.
- Oculta los vídeos recomendados de la barra lateral cuando es posible
  identificarlos.
- Comprueba periódicamente si YouTube ha cargado contenido nuevo.
- Restaura los elementos ocultos al pulsar **Desactivar**.
- No elimina vídeos de YouTube ni oculta el reproductor actual o sus controles.

## Cómo instalarlo y probarlo

1. Instala la extensión Tampermonkey en el navegador.
2. Abre Tampermonkey y selecciona **Crear un nuevo script**.
3. Copia todo el contenido de `concentracion-youtube.js`.
4. Pégalo en el editor de Tampermonkey y guarda con `Ctrl + S`.
5. Abre o recarga `https://www.youtube.com/`.
6. Pulsa **Activar** en el panel para ocultar las distracciones.
7. Pulsa **Desactivar** para restaurarlas.

## Limitaciones

El script utiliza selectores de la estructura interna de YouTube. Si YouTube
cambia sus etiquetas o contenedores, alguna sección podría dejar de ocultarse.
El script solo modifica la página localmente y no cambia la cuenta ni borra
contenido.

## Tecnologías

- JavaScript.
- HTML y CSS creados desde el script.
- Tampermonkey.
