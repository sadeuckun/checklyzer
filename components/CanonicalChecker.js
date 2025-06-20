import { useState } from 'react';
import URLInput from './URLInput';
import { getBrandName } from '../lib/getBrandName';

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

export default function CanonicalChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/canonical?url=${encodeURIComponent(url)}`);
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Canonical Tag Kontrolü</h2>
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
            <div className="text-lg font-semibold mb-1">Canonical Tag Durumu</div>
            {result.canonical ? (
              <Badge color="green">Canonical Var</Badge>
            ) : (
              <Badge color="red">Canonical Yok</Badge>
            )}
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Canonical Değeri</div>
            {result.canonical ? (
              <div className="bg-gray-50 rounded-lg p-4 text-sm break-all">
                <span className="font-semibold">{result.canonical}</span>
              </div>
            ) : (
              <div className="text-red-600">Canonical etiketi bulunamadı. Kopya içerik riskine karşı önerilir.</div>
            )}
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Öneriler</div>
            <ul className="list-disc ml-6 text-sm">
              {result.canonical ? (
                <li className="text-green-600">Her şey yolunda görünüyor!</li>
              ) : (
                <li className="text-orange-600">Her önemli sayfanızda doğru canonical etiketi kullanın. Kopya içerik ve SEO sorunlarını önler.</li>
              )}
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-2">
            <div className="font-semibold text-blue-700 mb-1">Canonical Tag Nedir?</div>
            <div className="text-xs text-blue-700">Canonical etiketi, arama motorlarına bir sayfanın asıl (orijinal) adresini bildirir. Kopya içerik sorunlarını önlemek ve SEO başarısı için gereklidir.</div>
          </div>
          <div className="text-xs text-gray-400 text-right">{brandName} Canonical Aracı</div>
        </div>
      )}
    </div>
  );
} 