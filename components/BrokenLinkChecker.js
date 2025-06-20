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

export default function BrokenLinkChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/broken-links?url=${encodeURIComponent(url)}`);
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
      <h2 className="text-2xl font-bold mb-4">Kırık Link Kontrolü</h2>
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
            <div className="text-lg font-semibold mb-1">Kırık Link Durumu</div>
            {result.broken.length === 0 ? (
              <Badge color="green">Hiç Kırık Link Yok</Badge>
            ) : (
              <Badge color="red">{result.broken.length} Kırık Link</Badge>
            )}
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Tüm Linkler</div>
            <div className="grid grid-cols-1 gap-2">
              {result.links.map((l, i) => (
                <div key={i} className="flex items-center gap-2 text-sm bg-gray-50 rounded p-2">
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="truncate max-w-xs text-blue-700 underline">{l.url}</a>
                  {l.status === 200 && <Badge color="green">200 OK</Badge>}
                  {l.status === 404 && <Badge color="red">404 Kırık</Badge>}
                  {l.status !== 200 && l.status !== 404 && <Badge color="yellow">{l.status}</Badge>}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Öneriler</div>
            <ul className="list-disc ml-6 text-sm">
              {result.broken.length === 0 ? (
                <li className="text-green-600">Her şey yolunda görünüyor!</li>
              ) : (
                <li className="text-orange-600">Kırık linkleri düzeltin veya kaldırın. SEO ve kullanıcı deneyimi için önemlidir.</li>
              )}
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-2">
            <div className="font-semibold text-blue-700 mb-1">Kırık Link Nedir?</div>
            <div className="text-xs text-blue-700">Kırık linkler (404 hatası veren linkler), kullanıcıların ve arama motorlarının sitenizde gezinmesini olumsuz etkiler. SEO ve kullanıcı deneyimi için düzenli kontrol edilmelidir.</div>
          </div>
          <div className="text-xs text-gray-400 text-right">{brandName} Kırık Link Aracı</div>
        </div>
      )}
    </div>
  );
} 