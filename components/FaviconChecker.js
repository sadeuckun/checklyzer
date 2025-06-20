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

export default function FaviconChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/favicon?url=${encodeURIComponent(url)}`);
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
      <h2 className="text-2xl font-bold mb-4">Favicon Kontrolü</h2>
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
            <div className="text-lg font-semibold mb-1">Favicon Durumu</div>
            {result.favicons.length > 0 ? (
              <Badge color="green">Favicon Bulundu</Badge>
            ) : (
              <Badge color="red">Favicon Yok</Badge>
            )}
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Favicon Detayları</div>
            {result.favicons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.favicons.map((f, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                    <img src={f.href} alt="favicon" className="w-10 h-10 rounded border" />
                    <div>
                      <div className="text-sm font-semibold">{f.type || 'Bilinmiyor'}</div>
                      <div className="text-xs text-gray-500">{f.sizes || 'Boyut bilinmiyor'}</div>
                      <div className="text-xs text-gray-500 break-all">{f.href}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-red-600">Favicon bulunamadı. Sitenizin tarayıcı sekmesinde marka görünürlüğü için favicon ekleyin.</div>
            )}
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Öneriler</div>
            <ul className="list-disc ml-6 text-sm">
              {result.favicons.length === 0 ? (
                <li className="text-orange-600">Favicon ekleyin. Farklı boyutlarda (16x16, 32x32, 180x180) PNG veya ICO formatında favicon önerilir.</li>
              ) : (
                <li className="text-green-600">Her şey yolunda görünüyor!</li>
              )}
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-2">
            <div className="font-semibold text-blue-700 mb-1">Favicon Nedir?</div>
            <div className="text-xs text-blue-700">Favicon, web sitenizin tarayıcı sekmesinde ve yer imlerinde görünen küçük simgedir. Marka bilinirliği ve profesyonellik için önemlidir.</div>
          </div>
          <div className="text-xs text-gray-400 text-right">{brandName} Favicon Aracı</div>
        </div>
      )}
    </div>
  );
} 