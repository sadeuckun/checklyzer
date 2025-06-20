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
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    res.status(200).json({ canonical });
  } catch (e) {
    clearApiGuard(req);
    res.status(500).json({ error: 'Analiz başarısız.' });
  }
}
