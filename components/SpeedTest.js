import { useState } from 'react';
import URLInput from './URLInput';
import { getBrandName } from '../lib/getBrandName';

const brandName = getBrandName();

function getSpeedScore(result) {
  // Mobil ve masaüstü skorlarının ortalamasını al
  if (!result) return 0;
  return Math.round(((result.mobileScore || 0) + (result.desktopScore || 0)) / 2);
}

function getSpeedSuggestions(result) {
  const suggestions = [];
  if (result.mobileScore < 80) suggestions.push('Mobil hız puanınız düşük. Görsel optimizasyonu ve kod küçültme önerilir.');
  if (result.desktopScore < 80) suggestions.push('Masaüstü hız puanınız düşük. Sunucu yanıt süresini ve kod optimizasyonunu kontrol edin.');
  if (result.fcp && parseFloat(result.fcp) > 2) suggestions.push('İlk içerik boyama (FCP) süresi yüksek. Kritik CSS ve JS dosyalarını küçültün.');
  if (result.lcp && parseFloat(result.lcp) > 2.5) suggestions.push('En büyük içerik boyama (LCP) süresi yüksek. Büyük görselleri optimize edin.');
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

export default function SpeedTest() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/speed?url=${encodeURIComponent(url)}`);
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

  const score = result ? getSpeedScore(result) : null;
  const suggestions = result ? getSpeedSuggestions(result) : [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sayfa Hızı Testi</h2>
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
                <circle cx="40" cy="40" r="36" stroke="#f59e42" strokeWidth="8" fill="none" strokeDasharray={226} strokeDashoffset={226 - (score * 226) / 100} style={{transition: 'stroke-dashoffset 1s'}} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-orange-600">{score}</div>
            </div>
            <div>
              <div className="text-lg font-semibold mb-1">Hız Puanı</div>
              <div className="text-gray-500 text-sm">100 üzerinden</div>
              {score >= 80 && <Badge color="green">Çok Hızlı</Badge>}
              {score >= 60 && score < 80 && <Badge color="yellow">İyi</Badge>}
              {score < 60 && <Badge color="red">Yavaş</Badge>}
            </div>
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Detaylı Sonuçlar</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Mobil Skor
                  <Badge color={result.mobileScore >= 80 ? 'green' : result.mobileScore >= 60 ? 'yellow' : 'red'}>{result.mobileScore}</Badge>
                </div>
                <div className="text-gray-700 text-sm">Mobil cihazlarda hız puanınız.</div>
                <div className="text-xs text-gray-500 mt-1">Google PageSpeed Insights verisi.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Masaüstü Skor
                  <Badge color={result.desktopScore >= 80 ? 'green' : result.desktopScore >= 60 ? 'yellow' : 'red'}>{result.desktopScore}</Badge>
                </div>
                <div className="text-gray-700 text-sm">Masaüstü cihazlarda hız puanınız.</div>
                <div className="text-xs text-gray-500 mt-1">Google PageSpeed Insights verisi.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">İlk İçerik Boyama (FCP)
                  <Badge color={parseFloat(result.fcp) <= 2 ? 'green' : 'yellow'}>{result.fcp}</Badge>
                </div>
                <div className="text-gray-700 text-sm">Kullanıcıya ilk içeriğin gösterilme süresi.</div>
                <div className="text-xs text-gray-500 mt-1">İdeal: 2 saniye ve altı.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">En Büyük İçerik Boyama (LCP)
                  <Badge color={parseFloat(result.lcp) <= 2.5 ? 'green' : 'yellow'}>{result.lcp}</Badge>
                </div>
                <div className="text-gray-700 text-sm">En büyük içeriğin yüklenme süresi.</div>
                <div className="text-xs text-gray-500 mt-1">İdeal: 2.5 saniye ve altı.</div>
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

          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded mb-2">
            <div className="font-semibold text-orange-700 mb-1">Sayfa Hızı Neden Önemli?</div>
            <div className="text-xs text-orange-700">Sayfa hızı, kullanıcı deneyimi ve SEO için kritik bir faktördür. Hızlı siteler daha fazla ziyaretçi ve daha iyi Google sıralaması elde eder.</div>
          </div>
          <div className="text-xs text-gray-400 text-right">{brandName} Hız Testi</div>
        </div>
      )}
    </div>
  );
} 