const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = 3000;
const DEFAULT_WORD_COUNT = 3;
const MAX_WORD_COUNT = 10;
const DICTIONARY_PATH = path.join(__dirname, 'diccionario.txt');

function loadDictionary() {
  const fileContent = fs.readFileSync(DICTIONARY_PATH, 'utf8');
  const words = fileContent
    .split(/\r?\n/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) {
    throw new Error('El diccionario está vacío.');
  }

  return [...new Set(words)];
}

function getWordCount(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${PORT}`);
  const value = url.searchParams.get('x');

  if (value === null || value.trim() === '') {
    return { count: DEFAULT_WORD_COUNT };
  }

  if (!/^\d+$/.test(value)) {
    return {
      error: 'El parámetro x debe ser un número entero entre 1 y 10.'
    };
  }

  const count = Number(value);
  if (count < 1 || count > MAX_WORD_COUNT) {
    return {
      error: 'El parámetro x debe ser un número entero entre 1 y 10.'
    };
  }

  return { count };
}

function generatePassword(words, count) {
  const availableWords = [...words];
  const selectedWords = [];

  for (let index = 0; index < count; index += 1) {
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    selectedWords.push(availableWords.splice(randomIndex, 1)[0]);
  }

  return selectedWords.join('-');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderPage(content, statusCode = 200) {
  return {
    statusCode,
    body: `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Generador de contraseñas</title>
    <style>
      :root {
        color-scheme: dark;
        font-family: Arial, sans-serif;
        background: #151923;
        color: #f2f4f8;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #151923;
      }

      main {
        width: min(90%, 620px);
        padding: 2.5rem;
        text-align: center;
        background: #222938;
        border: 1px solid #3a455b;
        border-radius: 12px;
        box-sizing: border-box;
      }

      h1 {
        margin-top: 0;
        color: #71c7ec;
      }

      .password {
        margin: 2rem 0;
        padding: 1rem;
        overflow-wrap: anywhere;
        background: #151923;
        border-radius: 8px;
        color: #f8d477;
        font-size: 1.35rem;
        font-weight: bold;
      }

      p {
        line-height: 1.5;
      }

      code {
        color: #f8d477;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Generador de contraseñas</h1>
      ${content}
    </main>
  </body>
</html>`
  };
}

let dictionary;
try {
  dictionary = loadDictionary();
  console.log(`Diccionario cargado: ${dictionary.length} palabras.`);
} catch (error) {
  console.error(`Error al cargar el diccionario: ${error.message}`);
}

const server = http.createServer((req, res) => {
  if (!dictionary) {
    const page = renderPage(
      '<p>No se puede generar la contraseña porque el diccionario no está disponible.</p>',
      500
    );
    res.writeHead(page.statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page.body);
    return;
  }

  const result = getWordCount(req.url);
  if (result.error) {
    const page = renderPage(`<p>${escapeHtml(result.error)}</p>
      <p>Prueba con una dirección como <code>/?x=4</code>.</p>`, 400);
    res.writeHead(page.statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page.body);
    return;
  }

  if (result.count > dictionary.length) {
    const page = renderPage(
      `<p>El diccionario solo tiene ${dictionary.length} palabras diferentes. ` +
      `Solicita como máximo ${dictionary.length}.</p>`,
      400
    );
    res.writeHead(page.statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page.body);
    return;
  }

  const password = generatePassword(dictionary, result.count);
  const page = renderPage(`<p class="password">${escapeHtml(password)}</p>
      <p>Se han utilizado ${result.count} palabras.</p>
      <p>Para cambiar la cantidad, añade el parámetro <code>x</code> a la URL,
      por ejemplo <code>/?x=5</code>.</p>`);
  res.writeHead(page.statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(page.body);
});

server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
