# Ejercicio 5 de Node.js: página principal y página de login con Express Generator

## Descripción

Proyecto Express creado con `express-generator` que incluye una página principal
con una lista de elementos cargada desde el servidor y una página de login independiente.

## Estructura del proyecto (generada por express-generator)

- `app.js`: configuración principal de Express, motor de plantillas Pug, archivos estáticos.
- `bin/www`: punto de arranque del servidor.
- `routes/index.js`: rutas para `/` (página principal) y `/login` (GET y POST).
- `views/layout.pug`: plantilla base.
- `views/index.pug`: página principal con lista de recomendaciones.
- `views/login.pug`: página de login con formulario.
- `public/stylesheets/style.css`: estilos con paleta oscura y color de acento.
- `package.json`: dependencias y script de inicio.

## Funcionamiento

- El servidor escucha en el puerto `3000` (configurado en `bin/www`).
- **Página principal (`/`)**: muestra un título y una lista de recomendaciones que proviene de un array definido en `routes/index.js`. Incluye un botón para ir a la página de login.
- **Página de login (`/login`)**:
  - Muestra un formulario con campos para usuario/correo y contraseña.
  - El formulario se envía por POST a la misma ruta.
  - Al enviar, muestra un mensaje indicando que es una demo (no hay autenticación real).
  - Incluye un enlace para volver a la página principal.
- No se usa base de datos ni sistema de sesiones real, según el enunciado.

## Cómo ejecutarlo

Desde esta carpeta, ejecuta:

```bash
npm install
npm start
```

También se puede iniciar directamente con:

```bash
node ./bin/www
```

Para detener el servidor, pulsa `Ctrl + C`.

## Cómo probarlo

Con el servidor iniciado, abre en el navegador:

- `http://localhost:3000/`: página principal con la lista y botón de login.
- `http://localhost:3000/login`: página de login con formulario funcional (demo).

Navega entre ambas páginas usando los enlaces/botones correspondientes.

## Tecnologías

- Node.js + Express (generado con `express-generator`).
- Pug como motor de plantillas.
- CSS nativo (sin frameworks frontend).
- Paleta oscura, texto legible, color de acento.