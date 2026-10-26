# Ejercicio 3 de Node.js: generador de contraseñas

## Descripción

Servidor web sencillo que genera una contraseña combinando palabras aleatorias
de un diccionario. El número de palabras se indica mediante el parámetro `x`
de la URL.

## Archivos

- `index.js`: servidor HTTP, lectura del diccionario, validación de la URL y
  generación de contraseñas.
- `diccionario.txt`: palabras disponibles, con una palabra por línea.
- `package.json`: configuración del proyecto y comando de inicio.

## Funcionamiento

- El servidor escucha en el puerto `3000`.
- Lee las palabras de `diccionario.txt` mediante el módulo nativo `fs`.
- Si no se indica `x`, genera una contraseña de tres palabras.
- Acepta valores entre `1` y `10`.
- Selecciona palabras sin repetir dentro de la misma contraseña.
- Separa las palabras con guiones.
- Devuelve un error comprensible si el parámetro no es válido o el diccionario
  no está disponible.
- Cada petición vuelve a seleccionar las palabras de forma aleatoria.

## Cómo ejecutarlo

Desde esta carpeta, ejecuta:

```bash
npm start
```

También se puede iniciar directamente con:

```bash
node index.js
```

## Cómo probarlo

Con el servidor iniciado, abre estas direcciones en el navegador:

- `http://localhost:3000/`: genera tres palabras por defecto.
- `http://localhost:3000/?x=2`: genera dos palabras.
- `http://localhost:3000/?x=5`: genera cinco palabras.
- `http://localhost:3000/?x=abc`: muestra un mensaje de error.
- `http://localhost:3000/?x=0`: muestra un mensaje de error.

Recarga la página para obtener una nueva selección aleatoria. Para detener el
servidor, pulsa `Ctrl + C` en la terminal.

## Tecnologías

- Node.js.
- Módulo nativo `http`.
- Módulo nativo `fs`.
- HTML y CSS integrados en la respuesta del servidor.
