import rateLimit from 'next-rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 dakika
  uniqueTokenPerInterval: 500,
});

export async function apiGuard(req, res, { timeoutMs = 10000, limit } = {}) {
  // Limit ortam değişkeninden veya parametreden alınır, yoksa 5
  const effectiveLimit = limit || parseInt(process.env.RATE_LIMIT, 10) || 5;
  if (process.env.NODE_ENV === 'production') {
    try {
      await limiter.check(res, effectiveLimit, req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'anon');
    } catch {
      res.status(429).json({ error: 'Çok fazla istek yaptınız. Lütfen bir süre sonra tekrar deneyin.' });
      return false;
    }
  }
  req.abortController = new AbortController();
  req.timeout = setTimeout(() => req.abortController.abort(), timeoutMs);
  return true;
}

export function clearApiGuard(req) {
  if (req.timeout) clearTimeout(req.timeout);
} 