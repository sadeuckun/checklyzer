import { apiGuard, clearApiGuard } from '../../lib/apiGuard';

const fetchFn = global.fetch || ((...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)));

const apis = [
  { key: 'seo', path: '/api/seo' },
  { key: 'ssl', path: '/api/ssl' },
  { key: 'mobile', path: '/api/seo' }, // mobil için de seo
  { key: 'speed', path: '/api/speed' },
  { key: 'robots', path: '/api/robots' },
  { key: 'favicon', path: '/api/favicon' },
  { key: 'brokenlinks', path: '/api/broken-links' },
  { key: 'canonical', path: '/api/canonical' },
  { key: 'pagesize', path: '/api/pagesize' },
  { key: 'meta', path: '/api/seo' },
];

export default async function handler(req, res) {
  if (!(await apiGuard(req, res, { timeoutMs: 30000, limit: 2 }))) return;
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL gerekli.' });
  try {
    // Her API'yi arka planda çağır
    const base = req.headers.host?.startsWith('localhost') ? 'http://localhost:3000' : `https://${req.headers.host}`;
    const fetches = apis.map(api =>
      fetchFn(`${base}${api.path}?url=${encodeURIComponent(url)}`)
        .then(r => r.json())
        .then(data => ({ key: api.key, data }))
        .catch(() => ({ key: api.key, data: { error: 'Hata oluştu' } }))
    );
    const allResults = await Promise.all(fetches);
    const resultObj = {};
    allResults.forEach(r => { resultObj[r.key] = r.data; });
    clearApiGuard(req);
    res.status(200).json(resultObj);
  } catch (e) {
    clearApiGuard(req);
    res.status(500).json({ error: 'Toplu analiz başarısız.' });
  }
} 