var express = require('express');
var router = express.Router();

// Datos de ejemplo que proporciona el servidor (array de recomendaciones)
var recomendaciones = [
  'Aprender Node.js y Express',
  'Practicar con plantillas Pug',
  'Entender el patrón MVC en Express',
  'Trabajar con rutas y middleware',
  'Usar archivos estáticos y estilos CSS'
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Página Principal',
    recomendaciones: recomendaciones
  });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Iniciar sesión'
  });
});

/* POST login (demo - no real authentication) */
router.post('/login', function(req, res, next) {
  // En un caso real aquí se validarían las credenciales
  // Para este ejercicio solo mostramos un mensaje
  res.render('login', {
    title: 'Iniciar sesión',
    mensaje: 'Demo: formulario enviado (no hay autenticación real)'
  });
});

module.exports = router;