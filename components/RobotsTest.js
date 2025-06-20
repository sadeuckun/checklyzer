import { useState } from 'react';
import URLInput from './URLInput';
import { getBrandName } from '../lib/getBrandName';

function getRobotsScore(result) {
  let score = 100;
  if (!result.robotsFound) score -= 50;
  if (!result.sitemapFound) score -= 30;
  return Math.max(score, 0);
}

function getRobotsSuggestions(result) {
  const suggestions = [];
  if (!result.robotsFound) suggestions.push('robots.txt dosyası bulunamadı. Arama motorları için gereklidir.');
  if (!result.sitemapFound) suggestions.push('sitemap.xml dosyası bulunamadı. Arama motorlarının sitenizi daha iyi taraması için gereklidir.');
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

const brandName = getBrandName();

export default function RobotsTest() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/robots?url=${encodeURIComponent(url)}`);
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

  const score = result ? getRobotsScore(result) : null;
  const suggestions = result ? getRobotsSuggestions(result) : [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Robots.txt & Sitemap Kontrolü</h2>
      <URLInput
        url={url}
        setUrl={setUrl}
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Kontrol Et"
        placeholder="Site adresinizi girin (https://...)"
      />
      {error && <div className="text-red-600 mb-2 font-semibold">{error}</div>}
      {result && (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto animate-fade-in">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <svg width="80" height="80">
                <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle cx="40" cy="40" r="36" stroke="#2563eb" strokeWidth="8" fill="none" strokeDasharray={226} strokeDashoffset={226 - (score * 226) / 100} style={{transition: 'stroke-dashoffset 1s'}} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-700">{score}</div>
            </div>
            <div>
              <div className="text-lg font-semibold mb-1">Dosya Durumu Puanı</div>
              <div className="text-gray-500 text-sm">100 üzerinden</div>
              {score >= 80 && <Badge color="green">Harika!</Badge>}
              {score >= 60 && score < 80 && <Badge color="yellow">İyi</Badge>}
              {score < 60 && <Badge color="red">Eksik</Badge>}
            </div>
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Dosya Kontrolleri</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">robots.txt
                  {result.robotsFound ? <Badge color="green">Var</Badge> : <Badge color="red">Yok</Badge>}
                </div>
                <div className="text-gray-700 text-sm">{result.robotsFound ? 'robots.txt dosyası mevcut.' : 'robots.txt dosyası bulunamadı.'}</div>
                {result.robotsFound && (
                  <a href={url.replace(/\/$/, '') + '/robots.txt'} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline mt-1 inline-block">{url.replace(/\/$/, '') + '/robots.txt'}</a>
                )}
                <div className="text-xs text-gray-500 mt-1">Arama motorlarının sitenizi doğru taraması için gereklidir.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">sitemap.xml
                  {result.sitemapFound ? <Badge color="green">Var</Badge> : <Badge color="red">Yok</Badge>}
                </div>
                <div className="text-gray-700 text-sm">{result.sitemapFound ? 'sitemap.xml dosyası mevcut.' : 'sitemap.xml dosyası bulunamadı.'}</div>
                {result.sitemapFound && (
                  <a href={url.replace(/\/$/, '') + '/sitemap.xml'} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline mt-1 inline-block">{url.replace(/\/$/, '') + '/sitemap.xml'}</a>
                )}
                <div className="text-xs text-gray-500 mt-1">Sitenizin tüm sayfalarının arama motorlarına bildirilmesi için gereklidir.</div>
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

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-2">
            <div className="font-semibold text-blue-700 mb-1">robots.txt & sitemap.xml Neden Önemli?</div>
            <div className="text-xs text-blue-700">robots.txt ve sitemap.xml dosyaları, arama motorlarının sitenizi daha iyi anlaması ve taraması için gereklidir. SEO başarısı için bu dosyaların eksiksiz olması önerilir.</div>
          </div>
          <div className="text-xs text-gray-400 text-right">{brandName} Dosya Testi</div>
        </div>
      )}
    </div>
  );
} 