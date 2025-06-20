import { useState } from 'react';
import URLInput from './URLInput';
import { getBrandName } from '../lib/getBrandName';

function getSeoScore(result) {
  let score = 100;
  if (!result.title) score -= 20;
  else if (result.title.length < 20 || result.title.length > 60) score -= 10;
  if (!result.description) score -= 20;
  else if (result.description.length < 50 || result.description.length > 160) score -= 10;
  if (!result.h1) score -= 15;
  if (!result.mobileFriendly) score -= 15;
  if (result.wordCount < 300) score -= 10;
  return Math.max(score, 0);
}

function getSeoSuggestions(result) {
  const suggestions = [];
  if (!result.title) suggestions.push('Başlık (title) etiketi eksik.');
  else if (result.title.length < 20) suggestions.push('Başlık çok kısa. 20 karakterden uzun olmalı.');
  else if (result.title.length > 60) suggestions.push('Başlık çok uzun. 60 karakterden kısa olmalı.');
  if (!result.description) suggestions.push('Meta açıklama (description) etiketi eksik.');
  else if (result.description.length < 50) suggestions.push('Meta açıklama çok kısa. 50 karakterden uzun olmalı.');
  else if (result.description.length > 160) suggestions.push('Meta açıklama çok uzun. 160 karakterden kısa olmalı.');
  if (!result.h1) suggestions.push('H1 etiketi eksik.');
  if (!result.mobileFriendly) suggestions.push('Mobil uyumluluk eksik. Viewport meta etiketi eklenmeli.');
  if (result.wordCount < 300) suggestions.push('Sayfa içeriği çok kısa. En az 300 kelime olmalı.');
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

export default function SeoTest() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/seo?url=${encodeURIComponent(url)}`);
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

  const score = result ? getSeoScore(result) : null;
  const suggestions = result ? getSeoSuggestions(result) : [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">SEO Testi</h2>
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
                <circle cx="40" cy="40" r="36" stroke="#2563eb" strokeWidth="8" fill="none" strokeDasharray={226} strokeDashoffset={226 - (score * 226) / 100} style={{transition: 'stroke-dashoffset 1s'}} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-700">{score}</div>
            </div>
            <div>
              <div className="text-lg font-semibold mb-1">SEO Puanı</div>
              <div className="text-gray-500 text-sm">100 üzerinden</div>
              {score >= 80 && <Badge color="green">Harika!</Badge>}
              {score >= 60 && score < 80 && <Badge color="yellow">İyi</Badge>}
              {score < 60 && <Badge color="red">Düşük</Badge>}
            </div>
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Temel SEO Kriterleri</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Başlık (title)
                  {result.title ? (
                    <Badge color={result.title.length >= 20 && result.title.length <= 60 ? 'green' : 'yellow'}>✔</Badge>
                  ) : (
                    <Badge color="red">Eksik</Badge>
                  )}
                </div>
                <div className="text-gray-700 text-sm break-words">{result.title || <span className="text-red-600">Başlık etiketi bulunamadı.</span>}</div>
                <div className="text-xs text-gray-500 mt-1">{result.title ? `${result.title.length} karakter (İdeal: 20-60)` : 'Başlık etiketi SEO için çok önemlidir.'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Meta Açıklama
                  {result.description ? (
                    <Badge color={result.description.length >= 50 && result.description.length <= 160 ? 'green' : 'yellow'}>✔</Badge>
                  ) : (
                    <Badge color="red">Eksik</Badge>
                  )}
                </div>
                <div className="text-gray-700 text-sm break-words">{result.description || <span className="text-red-600">Meta açıklama bulunamadı.</span>}</div>
                <div className="text-xs text-gray-500 mt-1">{result.description ? `${result.description.length} karakter (İdeal: 50-160)` : 'Meta açıklama arama sonuçlarında öne çıkar.'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">H1 Etiketi
                  {result.h1 ? <Badge color="green">✔</Badge> : <Badge color="red">Eksik</Badge>}
                </div>
                <div className="text-gray-700 text-sm break-words">{result.h1 || <span className="text-red-600">H1 etiketi bulunamadı.</span>}</div>
                <div className="text-xs text-gray-500 mt-1">Her sayfada bir adet H1 etiketi olmalı.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Mobil Uyumluluk
                  {result.mobileFriendly ? <Badge color="green">✔</Badge> : <Badge color="red">Yok</Badge>}
                </div>
                <div className="text-gray-700 text-sm">{result.mobileFriendly ? 'Mobil uyumlu.' : 'Viewport meta etiketi eksik.'}</div>
                <div className="text-xs text-gray-500 mt-1">Mobil uyumluluk SEO için kritiktir.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Kelime Sayısı
                  {result.wordCount >= 300 ? <Badge color="green">✔</Badge> : <Badge color="yellow">Düşük</Badge>}
                </div>
                <div className="text-gray-700 text-sm">{result.wordCount} kelime</div>
                <div className="text-xs text-gray-500 mt-1">İdeal: En az 300 kelime</div>
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
            <div className="font-semibold text-blue-700 mb-1">SEO Nedir?</div>
            <div className="text-xs text-blue-700">SEO (Arama Motoru Optimizasyonu), web sitenizin arama motorlarında daha üst sıralarda yer almasını sağlayan teknik ve içeriksel iyileştirmeleri kapsar. Bu analiz, temel SEO kriterleri için hızlı bir kontrol sunar.</div>
          </div>
          <div className="text-xs text-gray-400 text-right">{brandName} SEO Testi</div>
        </div>
      )}
    </div>
  );
} 