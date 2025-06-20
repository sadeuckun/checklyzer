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
    const robotsUrl = url.replace(/\/$/, '') + '/robots.txt';
    const sitemapUrl = url.replace(/\/$/, '') + '/sitemap.xml';
    const robotsRes = await fetchFn(robotsUrl, { signal: req.abortController.signal });
    const sitemapRes = await fetchFn(sitemapUrl, { signal: req.abortController.signal });
    clearApiGuard(req);
    res.status(200).json({
      robotsFound: robotsRes.ok,
      sitemapFound: sitemapRes.ok
    });
  } catch (e) {
    clearApiGuard(req);
    res.status(500).json({ error: 'Analiz başarısız.' });
  }
} 