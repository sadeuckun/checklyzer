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
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').first().text();
    const wordCount = $('body').text().split(/\s+/).length;
    const viewport = $('meta[name="viewport"]').attr('content') || '';
    const mobileFriendly = viewport.includes('width=device-width');
    res.status(200).json({ title, description, h1, wordCount, mobileFriendly });
  } catch (e) {
    clearApiGuard(req);
    if (e.name === 'AbortError') {
      res.status(504).json({ error: 'İstek zaman aşımına uğradı. Lütfen daha küçük bir siteyle tekrar deneyin.' });
    } else {
      console.error('SEO API Hatası:', e);
      res.status(500).json({ error: 'Analiz başarısız. Lütfen geçerli bir site adresi girin.' });
    }
  }
} 