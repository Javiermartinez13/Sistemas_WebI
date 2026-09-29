var diccionario = [
    "arbol", "camino", "cielo", "coche", "fuego", "gato", "isla",
    "jardin", "luna", "mar", "montana", "nube", "océano", "piedra",
    "puerta", "rio", "sol", "tierra", "tren", "viento", "verde",
    "viaje", "bosque", "estrella", "libro", "musica", "playa", "reloj",
    "silla", "teclado", "ventana", "zapato"
];

var formulario = document.getElementById("form");
var numeroPalabras = document.getElementById("numero");
var primeraMayuscula = document.getElementById("mayuscula");
var sinRepetir = document.getElementById("unicas");
var resultado = document.getElementById("resultado");
var mensaje = document.getElementById("mensaje");

function ponerPrimeraMayuscula(palabra) {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}

function generarContraseña() {
    var cantidad = Number(numeroPalabras.value);
    var palabrasElegidas = [];
    var palabrasDisponibles;
    var indiceAleatorio;
    var palabra;
    var i;

    mensaje.textContent = "";

    if (!Number.isInteger(cantidad) || cantidad < 1) {
        resultado.textContent = "Aquí aparecerá la contraseña";
        mensaje.textContent = "Introduce un número entero mayor o igual que 1.";
        return;
    }

    if (cantidad > 50) {
        resultado.textContent = "Aquí aparecerá la contraseña";
        mensaje.textContent = "El número máximo de palabras es 50.";
        return;
    }

    if (sinRepetir.checked && cantidad > diccionario.length) {
        resultado.textContent = "Aquí aparecerá la contraseña";
        mensaje.textContent = "No hay suficientes palabras distintas para esa configuración.";
        return;
    }

    palabrasDisponibles = diccionario.slice();

    for (i = 0; i < cantidad; i++) {
        indiceAleatorio = Math.floor(Math.random() * palabrasDisponibles.length);
        palabra = palabrasDisponibles[indiceAleatorio];

        if (primeraMayuscula.checked) {
            palabra = ponerPrimeraMayuscula(palabra);
        }

        palabrasElegidas.push(palabra);

        if (sinRepetir.checked) {
            palabrasDisponibles.splice(indiceAleatorio, 1);
        }
    }

    resultado.textContent = palabrasElegidas.join("-");
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    generarContraseña();
});
