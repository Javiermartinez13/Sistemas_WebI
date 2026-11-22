const express = require('express');
const router = express.Router();

// usuarios de prueba
const usuarios = {
  javier: '1234',
  ana: 'abcd',
  luis: 'pass'
};

function comprobarLogin(req, res, next) {
  if (req.session.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', function (req, res) {
  if (req.session.usuario) {
    res.redirect('/chat');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function (req, res) {
  if (req.session.usuario) {
    return res.redirect('/chat');
  }
  res.render('login', { title: 'Login' });
});

router.post('/login', function (req, res) {
  const usuario = req.body.usuario;
  const password = req.body.password;

  if (usuarios.hasOwnProperty(usuario) && usuarios[usuario] === password) {
    req.session.usuario = usuario;
    res.redirect('/chat');
  } else {
    res.render('login', {
      title: 'Login',
      error: 'Usuario o contraseña incorrectos',
      usuario: usuario
    });
  }
});

router.get('/chat', comprobarLogin, function (req, res) {
  res.render('chat', { title: 'Chat', usuario: req.session.usuario });
});

router.post('/logout', function (req, res) {
  const io = req.app.get('io');
  const id = req.session.id;

  req.session.destroy(function () {
    // se desconectan los sockets que tenia abiertos ese usuario
    io.in(id).disconnectSockets(true);
    res.redirect('/login');
  });
});

module.exports = router;
