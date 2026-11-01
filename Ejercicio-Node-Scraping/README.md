# Ejercicio 4 de Node.js: descargar y procesar HTML de una web

## Descripción

Servidor web que descarga periódicamente el HTML de `https://quotes.toscrape.com/`,
extrae las citas y sus autores, y los muestra en una página local accesible desde
el navegador.

## Archivos

- `index.js`: servidor HTTP, lógica de descarga periódica y generación de la
  página de resultados.
- `scraper.js`: descarga del HTML y extracción de datos con Cheerio.
- `package.json`: configuración del proyecto y dependencias.

## Funcionamiento

- El servidor escucha en el puerto `3000`.
- Al arrancar, realiza la primera descarga inmediatamente.
- Cada 60 segundos repite la descarga y actualiza los datos.
- Utiliza **Cheerio** para localizar los elementos `.quote`, `.text` y `.author`.
- Si la web no responde o cambia su estructura, muestra un mensaje de error
  comprensible y reintenta en el siguiente intervalo.
- La página local muestra las citas obtenidas en la última descarga exitosa.

## Cómo ejecutarlo

Desde esta carpeta, ejecuta:

```bash
npm install
npm start
```

También se puede iniciar directamente con:

```bash
node index.js
```

Para detener el servidor de forma limpia, pulsa `Ctrl + C`.

## Cómo probarlo

Con el servidor iniciado, abre en el navegador:

- `http://localhost:3000/`: muestra la lista de citas, sus autores y la hora
  de la última actualización.

Recarga la página para ver los datos más recientes (provienen de la última
descarga periódica, no se hace una petición por cada visita).

Para simular un error, desconecta internet o cambia la URL en `index.js` y
observa el mensaje de error en la página; el servidor seguirá funcionando.

## Tecnologías

- Node.js (módulos nativos `http`, `process`).
- **Cheerio** para parsear y recorrer el HTML.
- **node-fetch** para realizar peticiones HTTP.
- HTML y CSS integrados en la respuesta del servidor (sin frameworks frontend).

## Estructura de la página de resultados

- Título: «Citas extraídas».
- Fecha y hora de la última actualización.
- Lista de tarjetas con la cita (texto) y el autor.
- Banner de error visible solo cuando falla la descarga.
- Diseño con fondo oscuro, texto legible y color de acento.