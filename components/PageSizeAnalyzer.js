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

function formatSize(bytes) {
  if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  if (bytes > 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return bytes + ' B';
}

const brandName = getBrandName();

export default function PageSizeAnalyzer() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/pagesize?url=${encodeURIComponent(url)}`);
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
      <h2 className="text-2xl font-bold mb-4">Sayfa Boyutu & Asset Analizi</h2>
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
            <div className="text-lg font-semibold mb-1">Toplam Sayfa Boyutu</div>
            <Badge color={result.totalSize < 1024 * 1024 ? 'green' : 'red'}>{formatSize(result.totalSize)}</Badge>
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Asset Detayları</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Görseller (img)
                  <Badge color={result.imagesSize < 512 * 1024 ? 'green' : 'yellow'}>{formatSize(result.imagesSize)}</Badge>
                </div>
                <div className="text-gray-700 text-sm">Toplam görsel boyutu.</div>
                <div className="text-xs text-gray-500 mt-1">Görselleri optimize edin.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">JavaScript Dosyaları
                  <Badge color={result.jsSize < 512 * 1024 ? 'green' : 'yellow'}>{formatSize(result.jsSize)}</Badge>
                </div>
                <div className="text-gray-700 text-sm">Toplam JS dosya boyutu.</div>
                <div className="text-xs text-gray-500 mt-1">Kritik olmayan JS dosyalarını küçültün.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">CSS Dosyaları
                  <Badge color={result.cssSize < 256 * 1024 ? 'green' : 'yellow'}>{formatSize(result.cssSize)}</Badge>
                </div>
                <div className="text-gray-700 text-sm">Toplam CSS dosya boyutu.</div>
                <div className="text-xs text-gray-500 mt-1">Kullanılmayan CSS kodlarını temizleyin.</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Öneriler</div>
            <ul className="list-disc ml-6 text-sm">
              {result.totalSize < 1024 * 1024 ? (
                <li className="text-green-600">Her şey yolunda görünüyor!</li>
              ) : (
                <li className="text-orange-600">Sayfa boyutunu küçültmek için görsel, JS ve CSS dosyalarını optimize edin.</li>
              )}
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-2">
            <div className="font-semibold text-blue-700 mb-1">Sayfa Boyutu Neden Önemli?</div>
            <div className="text-xs text-blue-700">Sayfa boyutu, sitenizin hızını ve kullanıcı deneyimini doğrudan etkiler. Küçük ve optimize edilmiş dosyalar daha hızlı yüklenir ve SEO için avantaj sağlar.</div>
          </div>
          <div className="text-xs text-gray-400 text-right">{brandName} Asset Analiz Aracı</div>
        </div>
      )}
    </div>
  );
} 