// Simple in-memory rate limiting
const rateLimitStore = new Map();

function getClientId(req) {
  return req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'anon';
}

function isRateLimited(clientId, limit) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const clientData = rateLimitStore.get(clientId) || { count: 0, resetTime: now + windowMs };
  
  // Reset if window has passed
  if (now > clientData.resetTime) {
    clientData.count = 0;
    clientData.resetTime = now + windowMs;
  }
  
  // Check if limit exceeded
  if (clientData.count >= limit) {
    return true;
  }
  
  // Increment count
  clientData.count++;
  rateLimitStore.set(clientId, clientData);
  
  return false;
}

export async function apiGuard(req, res, { timeoutMs = 10000, limit } = {}) {
  // Only log in development or when there's an error
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    console.log('🔍 API Guard Debug:', {
      url: req.url,
      method: req.method,
      nodeEnv: process.env.NODE_ENV,
      userAgent: req.headers['user-agent'],
      ip: getClientId(req)
    });
  }

  // Get limit from environment variable or parameter, default 100 (production) or 1000 (development)
  const defaultLimit = process.env.NODE_ENV === 'production' ? 100 : 1000;
  const effectiveLimit = limit || parseInt(process.env.RATE_LIMIT, 10) || defaultLimit;
  
  if (isDev) {
    console.log('📊 Rate Limit Info:', {
      defaultLimit,
      providedLimit: limit,
      envLimit: process.env.RATE_LIMIT,
      effectiveLimit,
      isProduction: process.env.NODE_ENV === 'production'
    });
  }
  
  // Apply rate limiting in production
  if (process.env.NODE_ENV === 'production') {
    if (isDev) console.log('🛡️ Applying rate limiting...');
    
    const clientId = getClientId(req);
    if (isDev) console.log('👤 Client ID:', clientId);
    
    if (isRateLimited(clientId, effectiveLimit)) {
      console.log('❌ Rate limit exceeded for client:', clientId);
      res.status(429).json({ error: 'Çok fazla istek yaptınız. Lütfen bir süre sonra tekrar deneyin.' });
      return false;
    }
    
    if (isDev) console.log('✅ Rate limit check passed');
  } else {
    if (isDev) console.log('🔧 Development mode - skipping rate limiting');
  }
  
  req.abortController = new AbortController();
  req.timeout = setTimeout(() => {
    if (isDev) console.log('⏰ Request timeout after', timeoutMs, 'ms');
    req.abortController.abort();
  }, timeoutMs);
  
  if (isDev) console.log('✅ API Guard passed');
  return true;
}

export function clearApiGuard(req) {
  if (req.timeout) {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) console.log('🧹 Clearing API Guard timeout');
    clearTimeout(req.timeout);
  }
} 