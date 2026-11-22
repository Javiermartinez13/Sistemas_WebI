const socket = io();

const lista = document.getElementById('mensajes');
const form = document.getElementById('formulario');
const input = document.getElementById('texto');
const estado = document.getElementById('estado');

function añadirMensaje(msg) {
  const li = document.createElement('li');
  const hora = new Date(msg.hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  // se usa textContent para que no se pueda meter html en los mensajes
  const autor = document.createElement('span');
  autor.className = 'autor';
  autor.textContent = msg.usuario;

  const spanHora = document.createElement('span');
  spanHora.className = 'hora';
  spanHora.textContent = hora;

  const texto = document.createElement('p');
  texto.textContent = msg.texto;

  li.append(autor, spanHora, texto);
  lista.appendChild(li);
  lista.scrollTop = lista.scrollHeight;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value.trim() !== '') {
    socket.emit('mensaje', input.value);
    input.value = '';
  }
});

socket.on('connect', function () {
  estado.textContent = 'Conectado';
});

socket.on('historico', function (mensajes) {
  lista.innerHTML = '';
  mensajes.forEach(añadirMensaje);
});

socket.on('mensaje', añadirMensaje);

socket.on('connect_error', function (err) {
  if (err.message === 'No autorizado') {
    window.location.href = '/login';
  } else {
    estado.textContent = 'No se puede conectar con el servidor';
  }
});

socket.on('disconnect', function (motivo) {
  // si es el servidor el que corta la conexion es que la sesion ya no vale
  if (motivo === 'io server disconnect') {
    window.location.href = '/login';
  } else {
    estado.textContent = 'Desconectado, reintentando...';
  }
});
