import { useState } from 'react';
import URLInput from './URLInput';
import { getBrandName } from '../lib/getBrandName';

const brandName = getBrandName();

function getSslScore(result) {
  let score = 100;
  if (!result.ssl) score = 0;
  else {
    if (!result.valid) score -= 40;
    if (!result.protocol || !result.protocol.startsWith('TLS')) score -= 20;
    if (result.validTo) {
      const daysLeft = Math.floor((new Date(result.validTo) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysLeft < 30) score -= 20;
      else if (daysLeft < 90) score -= 10;
    } else {
      score -= 10;
    }
  }
  return Math.max(score, 0);
}

function getSslSuggestions(result) {
  const suggestions = [];
  if (!result.ssl) suggestions.push('SSL sertifikası bulunamadı. Siteniz güvenli değil.');
  if (result.ssl && !result.valid) suggestions.push('SSL sertifikanız geçersiz veya süresi dolmuş.');
  if (result.ssl && result.validTo) {
    const daysLeft = Math.floor((new Date(result.validTo) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 30) suggestions.push('SSL sertifikanızın süresi yakında dolacak. Yenileme işlemini planlayın.');
    else if (daysLeft < 90) suggestions.push('SSL sertifikanızın süresi 3 aydan az. Takipte kalın.');
  }
  if (result.ssl && result.protocol && !result.protocol.startsWith('TLS')) suggestions.push('Güvenli bir protokol (TLS) kullanmıyorsunuz.');
  return suggestions;
}

function Badge({ children, color }) {
  const colors = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${colors[color] || colors.gray}`}>{children}</span>
  );
}

export default function SslTest() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/ssl?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error('Analiz başarısız.');
      const data = await res.json();
      if (data.error) {
        setError('Girilen siteye ulaşılamadı veya analiz başarısız oldu. Lütfen adresi kontrol edin veya farklı bir site deneyin.');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Girilen siteye ulaşılamadı veya analiz başarısız oldu. Lütfen adresi kontrol edin veya farklı bir site deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const score = result ? getSslScore(result) : null;
  const suggestions = result ? getSslSuggestions(result) : [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">SSL/Güvenlik Testi</h2>
      <URLInput
        url={url}
        setUrl={setUrl}
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Analiz Et"
        placeholder="Site adresinizi girin (https://...)"
      />
      {error && <div className="text-red-600 mb-2 font-semibold">{error}</div>}
      {result && (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto animate-fade-in">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <svg width="80" height="80">
                <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle cx="40" cy="40" r="36" stroke="#059669" strokeWidth="8" fill="none" strokeDasharray={226} strokeDashoffset={226 - (score * 226) / 100} style={{transition: 'stroke-dashoffset 1s'}} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-green-700">{score}</div>
            </div>
            <div>
              <div className="text-lg font-semibold mb-1">Güvenlik Puanı</div>
              <div className="text-gray-500 text-sm">100 üzerinden</div>
              {score >= 80 && <Badge color="green">Güvenli</Badge>}
              {score >= 60 && score < 80 && <Badge color="yellow">İyi</Badge>}
              {score < 60 && <Badge color="red">Riskli</Badge>}
            </div>
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Sertifika Detayları</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">SSL Sertifikası
                  {result.ssl ? <Badge color="green">Var</Badge> : <Badge color="red">Yok</Badge>}
                </div>
                <div className="text-gray-700 text-sm">{result.ssl ? 'Siteniz SSL ile korunuyor.' : 'Siteniz SSL ile korunmuyor.'}</div>
                <div className="text-xs text-gray-500 mt-1">SSL, kullanıcı verilerinin güvenliği için zorunludur.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Geçerlilik
                  {result.valid ? <Badge color="green">Geçerli</Badge> : <Badge color="red">Geçersiz</Badge>}
                </div>
                <div className="text-gray-700 text-sm">{result.valid ? 'Sertifikanız geçerli.' : 'Sertifikanız geçersiz veya süresi dolmuş.'}</div>
                <div className="text-xs text-gray-500 mt-1">Geçersiz sertifikalar tarayıcıda uyarı verir.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Bitiş Tarihi
                  {result.validTo ? (
                    <Badge color={(() => {
                      const daysLeft = Math.floor((new Date(result.validTo) - new Date()) / (1000 * 60 * 60 * 24));
                      if (daysLeft < 30) return 'red';
                      if (daysLeft < 90) return 'yellow';
                      return 'green';
                    })()}>{result.validTo}</Badge>
                  ) : <Badge color="gray">Bilinmiyor</Badge>}
                </div>
                <div className="text-gray-700 text-sm">{result.validTo ? `Sertifika bitiş tarihi: ${result.validTo}` : 'Bitiş tarihi alınamadı.'}</div>
                <div className="text-xs text-gray-500 mt-1">Süresi dolan sertifikalar güvenlik riski oluşturur.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Protokol
                  {result.protocol ? <Badge color={result.protocol.startsWith('TLS') ? 'green' : 'red'}>{result.protocol}</Badge> : <Badge color="gray">Bilinmiyor</Badge>}
                </div>
                <div className="text-gray-700 text-sm">{result.protocol ? `Kullanılan protokol: ${result.protocol}` : 'Protokol alınamadı.'}</div>
                <div className="text-xs text-gray-500 mt-1">TLS protokolü modern ve güvenlidir.</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Öneriler</div>
            <ul className="list-disc ml-6 text-sm">
              {suggestions.length === 0 ? (
                <li className="text-green-600">Her şey yolunda görünüyor!</li>
              ) : (
                suggestions.map((s, i) => <li key={i} className="text-orange-600">{s}</li>)
              )}
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-2">
            <div className="font-semibold text-green-700 mb-1">SSL Nedir?</div>
            <div className="text-xs text-green-700">SSL (Güvenli Yuva Katmanı), web siteniz ile ziyaretçileriniz arasındaki veri iletişimini şifreler ve güvenli hale getirir. Güvenli bir site, SEO ve kullanıcı güveni için kritiktir.</div>
          </div>
          <div className="text-xs text-gray-400 text-right">{brandName} SSL Testi</div>
        </div>
      )}
    </div>
  );
} 