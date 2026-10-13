// ==UserScript==
// @name         Quitar distracciones de YouTube
// @namespace    https://example.com/
// @version      1.0
// @description  Oculta Shorts y recomendaciones de YouTube con un botón.
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    console.log('Script de YouTube sin distracciones cargado.');

    var idPanel = 'youtube-sin-distracciones';
    var modoActivo = false;
    var elementosOcultos = [];
    var temporizador;

    function crearPanel() {
        if (document.getElementById(idPanel)) {
            return;
        }

        var panel = document.createElement('div');
        panel.id = idPanel;
        var titulo = document.createElement('strong');
        var estado = document.createElement('p');
        var boton = document.createElement('button');

        titulo.textContent = 'YouTube sin distracciones';
        estado.id = 'youtube-sin-distracciones-estado';
        estado.textContent = 'Desactivado';
        boton.type = 'button';
        boton.textContent = 'Activar';

        panel.appendChild(titulo);
        panel.appendChild(estado);
        panel.appendChild(boton);

        panel.style.cssText =
            'position: fixed !important;' +
            'bottom: 20px !important;' +
            'left: 20px !important;' +
            'z-index: 2147483647 !important;' +
            'width: 220px !important;' +
            'padding: 16px !important;' +
            'color: #f5f5f5 !important;' +
            'background: #181818 !important;' +
            'border: 1px solid #4d4d70 !important;' +
            'border-radius: 12px !important;' +
            'box-shadow: 0 6px 20px rgba(0, 0, 0, .45) !important;' +
            'font: 14px Arial, sans-serif !important;';

        panel.querySelector('strong').style.cssText =
            'display: block; margin-bottom: 8px; color: #ffffff; ' +
            'font-size: 15px; letter-spacing: .2px;';
        panel.querySelector('p').style.cssText =
            'margin: 0 0 12px; color: #bdbdbd; font-size: 13px;';
        panel.querySelector('button').style.cssText =
            'width: 100%; padding: 9px 10px; color: #ffffff; ' +
            'background: #536dfe; border: 0; border-radius: 7px; cursor: pointer; ' +
            'font-weight: bold; transition: background .2s ease;';

        (document.body || document.documentElement).appendChild(panel);

        panel.querySelector('button').addEventListener('click', cambiarModo);
    }

    function guardarYOcultar(elemento) {
        if (elementosOcultos.some(function (item) {
            return item.elemento === elemento;
        })) {
            return;
        }

        elementosOcultos.push({
            elemento: elemento,
            estilo: elemento.getAttribute('style')
        });
        elemento.style.setProperty('display', 'none', 'important');
    }

    function ocultarDistracciones() {
        document.querySelectorAll('a[href^="/shorts/"]').forEach(function (enlace) {
            var seccion = enlace.closest(
                'ytd-rich-shelf-renderer, ytd-rich-section-renderer, ' +
                'ytd-reel-shelf-renderer, ytd-rich-grid-row'
            );

            if (seccion) {
                guardarYOcultar(seccion);
            }
        });

        document.querySelectorAll(
            'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer'
        ).forEach(guardarYOcultar);
    }

    function restaurarDistracciones() {
        elementosOcultos.forEach(function (item) {
            if (item.estilo === null) {
                item.elemento.removeAttribute('style');
            } else {
                item.elemento.setAttribute('style', item.estilo);
            }
        });

        elementosOcultos = [];
    }

    function actualizarPanel() {
        var panel = document.getElementById(idPanel);
        var estado = panel.querySelector('p');
        var boton = panel.querySelector('button');

        estado.textContent = modoActivo ? 'Activado' : 'Desactivado';
        boton.textContent = modoActivo ? 'Desactivar' : 'Activar';
        boton.style.background = modoActivo ? '#7e57c2' : '#536dfe';
        estado.style.color = modoActivo ? '#b9c4ff' : '#bdbdbd';
    }

    function cambiarModo() {
        modoActivo = !modoActivo;

        if (modoActivo) {
            ocultarDistracciones();
        } else {
            restaurarDistracciones();
        }

        actualizarPanel();
    }

    function revisarContenido() {
        if (modoActivo) {
            ocultarDistracciones();
        }
    }

    function iniciar() {
        crearPanel();

        if (!temporizador) {
            temporizador = window.setInterval(revisarContenido, 1500);
        }
    }

    iniciar();
    window.setTimeout(iniciar, 500);
    window.setTimeout(iniciar, 1500);
    window.setTimeout(iniciar, 3000);
}());
