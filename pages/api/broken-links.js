const cheerio = require('cheerio');
import { apiGuard, clearApiGuard } from '../../lib/apiGuard';

let fetchFn = global.fetch;
if (!fetchFn) {
  fetchFn = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

async function checkLink(url, signal) {
  try {
    const res = await fetchFn(url, { method: 'HEAD', redirect: 'follow', signal });
    return res.status;
  } catch {
    return 0;
  }
}

export default async function handler(req, res) {
  if (!(await apiGuard(req, res, { timeoutMs: 20000, limit: 50 }))) return;
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL gerekli.' });
  try {
    const response = await fetchFn(url, { signal: req.abortController.signal });
    const html = await response.text();
    const $ = cheerio.load(html);
    const linksSet = new Set();
    $('a[href]').each((i, el) => {
      let href = $(el).attr('href');
      if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
        try {
          href = new URL(href, url).href;
          linksSet.add(href);
        } catch {}
      }
    });
    const links = Array.from(linksSet).slice(0, 30); // limit to first 30 links
    const results = await Promise.all(
      links.map(async l => ({ url: l, status: await checkLink(l, req.abortController.signal) }))
    );
    clearApiGuard(req);
    const broken = results.filter(l => l.status === 404);
    res.status(200).json({ links: results, broken });
  } catch (e) {
    clearApiGuard(req);
    res.status(500).json({ error: 'Analiz başarısız.' });
  }
} 