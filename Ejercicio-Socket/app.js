const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session');
const { Server } = require('socket.io');

const indexRouter = require('./routes/index');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// La sesión se guarda en una variable para poder usarla también en socket.io
const sessionMiddleware = session({
  secret: 'sistemas-web-chat',
  resave: false,
  saveUninitialized: false
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware);

// para poder cerrar los sockets desde la ruta de logout
app.set('io', io);

app.use('/', indexRouter);

app.use(function (req, res) {
  res.status(404).render('error', { title: 'Página no encontrada' });
});

// ---------- Chat ----------

io.engine.use(sessionMiddleware);

// historico de los ultimos mensajes (en memoria)
const historico = [];
const MAX_MENSAJES = 20;

// si no hay usuario en la sesion no se deja conectar
io.use(function (socket, next) {
  const sesion = socket.request.session;
  if (sesion && sesion.usuario) {
    next();
  } else {
    next(new Error('No autorizado'));
  }
});

io.on('connection', function (socket) {
  const usuario = socket.request.session.usuario;
  console.log(usuario + ' conectado');

  // sala con el id de la sesion, se usa al hacer logout
  socket.join(socket.request.session.id);

  socket.emit('historico', historico);

  socket.on('mensaje', function (texto) {
    // se vuelve a leer la sesion por si se ha cerrado mientras tanto
    socket.request.session.reload(function (err) {
      if (err || !socket.request.session.usuario) {
        socket.disconnect(true);
        return;
      }

      if (typeof texto !== 'string' || texto.trim() === '') return;

      const msg = {
        usuario: usuario, // sale de la sesion, no de lo que manda el cliente
        texto: texto.trim().substring(0, 500),
        hora: new Date().toISOString()
      };

      historico.push(msg);
      if (historico.length > MAX_MENSAJES) {
        historico.shift();
      }

      io.emit('mensaje', msg);
    });
  });

  socket.on('disconnect', function () {
    console.log(usuario + ' desconectado');
  });
});

// se usa server.listen y no app.listen para que funcione socket.io
server.listen(3000, function () {
  console.log('Servidor en http://localhost:3000');
});
