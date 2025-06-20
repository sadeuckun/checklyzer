const cheerio = require('cheerio');
import { apiGuard, clearApiGuard } from '../../lib/apiGuard';

let fetchFn = global.fetch;
if (!fetchFn) {
  fetchFn = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

async function getAssetSize(url, signal) {
  try {
    const res = await fetchFn(url, { method: 'HEAD', redirect: 'follow', signal });
    const size = res.headers.get('content-length');
    return size ? parseInt(size, 10) : 0;
  } catch {
    return 0;
  }
}

export default async function handler(req, res) {
  if (!(await apiGuard(req, res))) return;
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL gerekli.' });
  try {
    // Ana sayfa boyutu
    const response = await fetchFn(url, { signal: req.abortController.signal });
    const html = await response.text();
    const mainSize = response.headers.get('content-length') ? parseInt(response.headers.get('content-length'), 10) : Buffer.byteLength(html);
    const $ = cheerio.load(html);
    // Asset linklerini topla
    const images = [];
    const scripts = [];
    const styles = [];
    $('img[src]').each((i, el) => {
      try { images.push(new URL($(el).attr('src'), url).href); } catch {}
    });
    $('script[src]').each((i, el) => {
      try { scripts.push(new URL($(el).attr('src'), url).href); } catch {}
    });
    $('link[rel="stylesheet"][href]').each((i, el) => {
      try { styles.push(new URL($(el).attr('href'), url).href); } catch {}
    });
    // Asset boyutlarını topla (ilk 20 asset ile sınırla, timeout riskine karşı)
    const imagesSize = (await Promise.all(images.slice(0, 20).map(src => getAssetSize(src, req.abortController.signal)))).reduce((a, b) => a + b, 0);
    const jsSize = (await Promise.all(scripts.slice(0, 20).map(src => getAssetSize(src, req.abortController.signal)))).reduce((a, b) => a + b, 0);
    const cssSize = (await Promise.all(styles.slice(0, 20).map(src => getAssetSize(src, req.abortController.signal)))).reduce((a, b) => a + b, 0);
    clearApiGuard(req);
    const totalSize = mainSize + imagesSize + jsSize + cssSize;
    res.status(200).json({ totalSize, imagesSize, jsSize, cssSize });
  } catch (e) {
    clearApiGuard(req);
    res.status(500).json({ error: 'Analiz başarısız.' });
  }
} 