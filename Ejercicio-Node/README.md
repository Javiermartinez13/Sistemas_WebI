# Ejercicio 1 de Node.js: información del sistema

Programa de consola que muestra información del equipo al arrancar y enseña
periódicamente estadísticas del sistema y del proceso de Node.js.

## Cómo ejecutarlo

Desde esta carpeta, ejecuta:

```bash
npm start
```

También se puede iniciar directamente con `node index.js`. Para detenerlo de
forma limpia, pulsa `Ctrl + C`.

## Configuración

El archivo `config.json` permite cambiar el comportamiento sin editar
`index.js`:

- `intervalSeconds`: número de segundos entre cada resumen.
- `stats.cpu`: muestra el porcentaje aproximado de uso de CPU.
- `stats.memory`: muestra memoria total, libre y utilizada.
- `stats.systemUptime`: muestra el tiempo de actividad del sistema.
- `stats.nodeUptime`: muestra el tiempo de ejecución del proceso de Node.js.

Cada estadística puede activarse con `true` o desactivarse con `false`. Si el
archivo no existe, no contiene JSON válido o tiene valores incorrectos, el
programa avisa por consola y utiliza una configuración predeterminada.

El uso de CPU se estima comparando los tiempos de CPU de dos mediciones
consecutivas. Por ello es un valor aproximado y depende de la actividad del
equipo durante ese intervalo.
