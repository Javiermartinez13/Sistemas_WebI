# Ejercicio 2 de JSON: información de cine

## Descripción

Diseño de un mensaje JSON para una aplicación web de venta de entradas de
cine. El mensaje reúne la información de dos películas y sus distintas
sesiones de proyección en salas concretas.

## Archivo

- `ejercicio2.json`: mensaje JSON válido con las películas, sus directores,
  actores principales y sesiones.

## Estructura del mensaje

El documento contiene un array llamado `peliculas`. Cada elemento del array
representa una película e incluye:

- `titulo`: nombre de la película.
- `director`: director de la película.
- `actores`: array con los actores principales.
- `sesiones`: array con todas sus proyecciones.

Cada sesión se representa mediante un objeto con los campos `sala` y `hora`.
Los datos generales de cada película aparecen una sola vez, mientras que sus
sesiones se agrupan dentro de ella. De esta forma se evita repetir el título,
el director y los actores en cada horario.

## Información incluida

- **Spider-Man: Brand New Day**: dirigida por Destin Daniel, con Tom Holland
  y Zendaya. Tiene sesiones en las salas 17 y 20.
- **Resident Evil**: dirigida por Zach Cregger, con Austin Abrams y Zach
  Cherry. Tiene sesiones en las salas 5 y 22.

## Cómo comprobarlo

Desde la carpeta de este ejercicio, ejecuta:

```bash
node -e "const fs = require('fs'); JSON.parse(fs.readFileSync('ejercicio2.json', 'utf8')); console.log('JSON válido')"
```

El comando lee el archivo y utiliza `JSON.parse()` para comprobar que el
contenido está bien formado. Si el JSON contiene un error de sintaxis, Node.js
mostrará el error correspondiente.

No hace falta instalar paquetes ni crear un servidor, una base de datos o una
interfaz web.

## Tecnologías

- JSON.
- Node.js para la comprobación del formato.
