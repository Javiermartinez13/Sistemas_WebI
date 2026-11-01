import http from 'node:http';
import { fetchQuotes } from './scraper.js';

// Estado global para almacenar los resultados
let quotes = [];
let lastUpdate = null;
let lastError = null;

// Configuración
const PORT = 3000;
const SCRAPE_INTERVAL_MS = 60_000; // 60 segundos
const TARGET_URL = 'https://quotes.toscrape.com/';

/**
 * Genera la página HTML con las citas extraídas
 */
function generateHtml() {
  const dateStr = lastUpdate
    ? lastUpdate.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '—';

  const quotesHtml = quotes.length > 0
    ? quotes.map(q => `
        <article class="quote-card">
          <blockquote>"${escapeHtml(q.text)}"</blockquote>
          <footer>— ${escapeHtml(q.author)}</footer>
        </article>
      `).join('')
    : '<p class="no-results">No hay citas disponibles todavía.</p>';

  const errorHtml = lastError
    ? `<div class="error-banner">⚠ ${escapeHtml(lastError)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Citas extraídas</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #1a1a2e;
      color: #eaeaea;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem;
    }
    h1 {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      font-weight: 600;
      color: #f0f0f0;
      margin-bottom: 0.5rem;
      text-align: center;
    }
    .meta {
      font-size: 0.9rem;
      color: #888;
      margin-bottom: 2rem;
      text-align: center;
    }
    .meta strong { color: #aaa; }
    .error-banner {
      background: #3d1a1a;
      border: 1px solid #662222;
      color: #f88;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      max-width: 600px;
      width: 100%;
      font-size: 0.9rem;
    }
    .quotes-grid {
      display: grid;
      gap: 1rem;
      width: 100%;
      max-width: 600px;
    }
    .quote-card {
      background: #22223b;
      border: 1px solid #333355;
      border-radius: 8px;
      padding: 1.25rem 1.5rem;
      transition: border-color 0.2s, transform 0.1s;
    }
    .quote-card:hover {
      border-color: #4a4a7a;
      transform: translateY(-1px);
    }
    .quote-card blockquote {
      font-style: italic;
      font-size: 1.05rem;
      line-height: 1.6;
      color: #e0e0e0;
      margin-bottom: 0.75rem;
    }
    .quote-card footer {
      font-size: 0.85rem;
      color: #a0a0c0;
      text-align: right;
    }
    .no-results {
      text-align: center;
      color: #666;
      padding: 3rem;
      font-size: 1.1rem;
    }
    .accent { color: #7c9cff; }
  </style>
</head>
<body>
  <h1>Citas extraídas</h1>
  <p class="meta">Última actualización: <strong>${dateStr}</strong></p>
  ${errorHtml}
  <div class="quotes-grid">
    ${quotesHtml}
  </div>
</body>
</html>`;
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

/**
 * Ejecuta el scraping y actualiza el estado
 */
async function runScrape() {
  try {
    const result = await fetchQuotes(TARGET_URL);
    quotes = result;
    lastUpdate = new Date();
    lastError = null;
    console.log(`[${new Date().toISOString()}] Scraping completado: ${quotes.length} citas extraídas`);
  } catch (err) {
    lastError = `Error al descargar o procesar: ${err.message}`;
    console.error(`[${new Date().toISOString()}] ${lastError}`);
  }
}

/**
 * Crea el servidor HTTP
 */
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(generateHtml());
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No encontrado');
  }
});

// Primera descarga al arrancar
runScrape();

// Descargas periódicas
setInterval(runScrape, SCRAPE_INTERVAL_MS);

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Scraping programado cada ${SCRAPE_INTERVAL_MS / 1000} segundos`);
  console.log('Presiona Ctrl+C para detener');
});

// Manejo limpio de cierre
process.on('SIGINT', () => {
  console.log('\nDeteniendo servidor...');
  server.close(() => process.exit(0));
});