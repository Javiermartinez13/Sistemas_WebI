import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

/**
 * Descarga el HTML de la URL y extrae las citas con sus autores.
 * @param {string} url - URL de la página a scrapear
 * @returns {Promise<Array<{text: string, author: string}>>} Array de citas
 */
export async function fetchQuotes(url) {
  // Descargar HTML
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Node.js Scraping Exercise)',
      'Accept': 'text/html,application/xhtml+xml',
    },
    timeout: 10_000, // 10 segundos
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();

  // Parsear con Cheerio
  const $ = cheerio.load(html);

  const quotes = [];

  // Selector para las citas en quotes.toscrape.com
  // Cada cita está en un div.quote con span.text y small.author
  $('.quote').each((_, element) => {
    const text = $(element).find('.text').text().trim();
    const author = $(element).find('.author').text().trim();

    if (text && author) {
      quotes.push({ text, author });
    }
  });

  if (quotes.length === 0) {
    throw new Error('No se encontraron citas en la página (estructura HTML inesperada)');
  }

  return quotes;
}