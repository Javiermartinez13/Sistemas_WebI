$(document).ready(function () {
    var letras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/;
    var email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var telefono = /^\+34\d{9}$/;

    $("#boton-registro").click(function () {
        $("#contenido-principal").hide();
        $("#seccion-registro").show();
        $("#mensajes").removeClass("correcto").html("");
    });

    $("#boton-cancelar").click(function () {
        $("#formulario-registro")[0].reset();
        $("#mensajes").removeClass("correcto").html("");
        $("#seccion-registro").hide();
        $("#contenido-principal").show();
    });

    $("#formulario-registro").on("submit", function (evento) {
        var nombre = $("#nombre").val().trim();
        var correo = $("#email").val().trim();
        var numero = $("#telefono").val().trim();
        var telefonoCompleto = "+34" + numero;
        var contrasena = $("#contrasena").val();
        var errores = [];

        evento.preventDefault();

        if (!letras.test(nombre)) {
            errores.push("El nombre y apellidos deben contener al menos dos palabras y solo letras.");
        }

        if (!email.test(correo)) {
            errores.push("El email no tiene un formato válido.");
        }

        if (!telefono.test(telefonoCompleto)) {
            errores.push("El teléfono debe tener 9 números después del prefijo +34.");
        }

        if (
            contrasena.length < 8 ||
            !/[A-Z]/.test(contrasena) ||
            !/[a-z]/.test(contrasena) ||
            !/\d/.test(contrasena)
        ) {
            errores.push("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
        }

        if (errores.length > 0) {
            $("#mensajes").removeClass("correcto").html(errores.join("<br>"));
        } else {
            $("#mensajes")
                .addClass("correcto")
                .html("El registro se ha realizado correctamente.");
        }
    });
});
