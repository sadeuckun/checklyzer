const cheerio = require('cheerio');
import { apiGuard, clearApiGuard } from '../../lib/apiGuard';

let fetchFn = global.fetch;
if (!fetchFn) {
  fetchFn = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

export default async function handler(req, res) {
  if (!(await apiGuard(req, res))) return;
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL gerekli.' });
  try {
    const response = await fetchFn(url, { signal: req.abortController.signal });
    clearApiGuard(req);
    const html = await response.text();
    const $ = cheerio.load(html);
    const favicons = [];
    $('link[rel~="icon"], link[rel="apple-touch-icon"]').each((i, el) => {
      favicons.push({
        href: $(el).attr('href') ? new URL($(el).attr('href'), url).href : '',
        type: $(el).attr('type') || '',
        sizes: $(el).attr('sizes') || ''
      });
    });
    res.status(200).json({ favicons });
  } catch (e) {
    clearApiGuard(req);
    res.status(500).json({ error: 'Analiz başarısız.' });
  }
} 