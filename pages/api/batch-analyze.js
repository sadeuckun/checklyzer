import { apiGuard, clearApiGuard } from '../../lib/apiGuard';

const fetchFn = global.fetch || ((...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)));

const apis = [
  { key: 'seo', path: '/api/seo' },
  { key: 'ssl', path: '/api/ssl' },
  { key: 'mobile', path: '/api/seo' }, // mobile uses seo api
  { key: 'speed', path: '/api/speed' },
  { key: 'robots', path: '/api/robots' },
  { key: 'favicon', path: '/api/favicon' },
  { key: 'brokenlinks', path: '/api/broken-links' },
  { key: 'canonical', path: '/api/canonical' },
  { key: 'pagesize', path: '/api/pagesize' },
  { key: 'meta', path: '/api/seo' },
];

export default async function handler(req, res) {
  if (!(await apiGuard(req, res, { timeoutMs: 30000, limit: 20 }))) {
    return;
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL gerekli.' });
  }

  try {
    // Call each API in background
    const isLocalhost = req.headers.host?.startsWith('localhost');
    const port = process.env.PORT || '3000';
    const base = isLocalhost ? `http://localhost:${port}` : `https://${req.headers.host}`;

    const fetches = apis.map(api => {
      const apiUrl = `${base}${api.path}?url=${encodeURIComponent(url)}`;
      
      return fetchFn(apiUrl)
        .then(r => r.json())
        .then(data => ({ key: api.key, data }))
        .catch(error => {
          console.log(`❌ ${api.key} failed:`, error.message);
          return { key: api.key, data: { error: 'API isteği başarısız oldu' } };
        });
    });

    const allResults = await Promise.all(fetches);
    const resultObj = {};
    allResults.forEach(r => { resultObj[r.key] = r.data; });
    
    clearApiGuard(req);
    res.status(200).json(resultObj);
  } catch (e) {
    console.log('❌ Batch analysis failed:', e.message);
    clearApiGuard(req);
    res.status(500).json({ error: 'Toplu analiz başarısız.' });
  }
} 