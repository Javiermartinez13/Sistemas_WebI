# Ejercicio 6 de Node.js: chat con Socket.IO y login

## Descripción

Chat en tiempo real hecho con Socket.IO al que solo se puede entrar después de
iniciar sesión. El login se hace con Express y `express-session`.

Lo que pide el enunciado:

- Solo los usuarios con sesión iniciada pueden entrar al chat.
- Cada mensaje muestra el nombre de quien lo ha escrito.
- Se guarda un histórico de los últimos mensajes.

Los apartados opcionales (chats privados y chat en todas las páginas) no están
hechos.

## Archivos

- `app.js`: crea la aplicación Express, el servidor HTTP y Socket.IO. También
  contiene la parte del chat (conexiones, mensajes e histórico).
- `routes/index.js`: rutas de login, chat y logout, y los usuarios de prueba.
- `views/`: plantillas Pug (`layout`, `login`, `chat` y `error`).
- `public/javascripts/chat.js`: código del chat en el navegador.
- `public/stylesheets/style.css`: estilos con tema oscuro.

## Usuarios de prueba

- `javier` / `1234`
- `ana` / `abcd`
- `luis` / `pass`

## Cómo ejecutarlo

Desde esta carpeta:

```bash
npm install
npm start
```

El servidor se queda escuchando en el puerto `3000`. Para pararlo, `Ctrl + C`.

## Cómo probarlo

Abre `http://localhost:3000/`. Si no has iniciado sesión te lleva al login.
Al entrar con uno de los usuarios se abre el chat.

Para probarlo con dos usuarios hay que abrir una ventana de incógnito (u otro
navegador) e iniciar sesión con otro usuario, ya que dos pestañas normales
comparten la misma cookie de sesión. Los mensajes que se envían desde una
ventana aparecen en la otra sin recargar.

Si entra un usuario nuevo, le aparecen los últimos mensajes que se habían
enviado antes.

## Funcionamiento

Para que Socket.IO funcione junto a Express se crea un servidor HTTP con
`http.createServer(app)`, se inicia Socket.IO sobre ese servidor y se arranca
con `server.listen(3000)`.

El middleware de la sesión se usa tanto en Express como en Socket.IO
(`io.engine.use`), así los dos leen la misma sesión. La ruta `/chat` comprueba
que haya un usuario en la sesión y, si no, redirige al login. En Socket.IO se
hace la misma comprobación con `io.use`, de forma que no se puede conectar
nadie sin haber iniciado sesión.

El nombre del autor de cada mensaje se coge de la sesión en el servidor. El
navegador solo manda el texto.

Los eventos que se usan son:

- `mensaje`: el cliente manda el texto y el servidor lo reenvía a todos con el
  usuario y la hora.
- `historico`: el servidor manda los últimos mensajes al usuario que se
  acaba de conectar.

El histórico es un array en memoria que guarda como máximo 20 mensajes; cuando
se pasa, se borra el más antiguo. Al reiniciar el servidor se pierde.

Al cerrar sesión se destruye la sesión y se desconectan los sockets de ese
usuario, así que tampoco puede seguir mandando mensajes.

## Tecnologías

- Node.js y Express
- express-session
- Socket.IO
- Pug
- HTML, CSS y JavaScript
