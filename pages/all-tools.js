import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ResultCard from '../components/ResultCard';
import URLInput from '../components/URLInput';
import { RocketLaunchIcon, MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

const toolList = [
  { key: 'seo', title: 'SEO Testi', api: '/api/seo' },
  { key: 'ssl', title: 'SSL/Güvenlik Testi', api: '/api/ssl' },
  { key: 'mobile', title: 'Mobil Uyumluluk Testi', api: '/api/seo' },
  { key: 'speed', title: 'Sayfa Hızı Testi', api: '/api/speed' },
  { key: 'robots', title: 'Robots.txt & Sitemap', api: '/api/robots' },
  { key: 'favicon', title: 'Favicon Kontrolü', api: '/api/favicon' },
  { key: 'brokenlinks', title: 'Kırık Link Kontrolü', api: '/api/broken-links' },
  { key: 'canonical', title: 'Canonical Tag Kontrolü', api: '/api/canonical' },
  { key: 'pagesize', title: 'Sayfa Boyutu & Asset', api: '/api/pagesize' },
  { key: 'meta', title: 'Meta Tag Oluşturucu', api: '/api/seo' },
];

function getSeoResultProps(data) {
  if (!data || data.error) return {
    title: 'SEO Testi',
    badge: 'Hata',
    description: data?.error || 'Sonuç alınamadı.',
    score: undefined,
    suggestion: undefined,
    children: null
  };
  return {
    title: 'SEO Testi',
    badge: data.mobileFriendly ? 'Mobil Uyumlu' : 'Mobil Uyumlu Değil',
    score: data.wordCount > 300 ? 90 : 60,
    description: `Başlık: ${data.title || '-'}\nAçıklama: ${data.description || '-'}\nH1: ${data.h1 || '-'}`,
    suggestion: data.wordCount < 300 ? 'Daha fazla içerik ekleyin.' : 'İçerik uzunluğu iyi.',
    children: null
  };
}

function getSslResultProps(data) {
  if (!data || data.error) return {
    title: 'SSL/Güvenlik Testi', badge: 'Hata', description: data?.error || 'Sonuç alınamadı.', score: undefined, suggestion: undefined, children: null
  };
  return {
    title: 'SSL/Güvenlik Testi',
    badge: data.ssl && data.valid ? 'Geçerli' : 'Geçersiz',
    score: data.ssl && data.valid ? 100 : 0,
    description: data.ssl ? `SSL Sertifikası geçerli. Protokol: ${data.protocol || '-'}` : 'SSL Sertifikası bulunamadı.',
    suggestion: data.ssl && data.valid ? 'Güvenli bağlantı.' : 'SSL sertifikası yükleyin veya yenileyin.',
    children: data.validTo && <div className="text-xs text-gray-500 mt-2">Geçerlilik: {data.validTo}</div>
  };
}

function getMobileScore(result) {
  let score = 100;
  if (!result.mobileFriendly) score -= 50;
  if (result.wordCount && result.wordCount < 300) score -= 10;
  return Math.max(score, 0);
}

function getMobileSuggestions(result) {
  const suggestions = [];
  if (!result.mobileFriendly) suggestions.push('Viewport meta etiketi eksik. Mobil uyumluluk için gereklidir.');
  if (result.wordCount && result.wordCount < 300) suggestions.push('Sayfa içeriği mobilde daha uzun olmalı.');
  return suggestions;
}

function getMobileResultProps(data) {
  if (!data || data.error) return {
    title: 'Mobil Uyumluluk Testi', badge: 'Hata', description: data?.error || 'Sonuç alınamadı.', score: undefined, suggestion: undefined, children: null
  };
  const score = getMobileScore(data);
  const suggestions = getMobileSuggestions(data);
  return {
    title: 'Mobil Uyumluluk Testi',
    badge: score >= 80 ? 'Harika!' : score >= 60 ? 'İyi' : 'Düşük',
    score,
    description: `Mobil Friendly: ${data.mobileFriendly ? 'Evet' : 'Hayır'}\nKelime Sayısı: ${data.wordCount || '-'}\nViewport: ${data.mobileFriendly ? 'Var' : 'Yok'}`,
    suggestion: suggestions.length > 0 ? suggestions.join(' ') : 'Her şey yolunda görünüyor!',
    children: null
  };
}

function getSpeedResultProps(data) {
  if (!data || data.error) return {
    title: 'Sayfa Hızı Testi', badge: 'Hata', description: data?.error || 'Sonuç alınamadı.', score: undefined, suggestion: undefined, children: null
  };
  return {
    title: 'Sayfa Hızı Testi',
    badge: data.mobileScore > 80 ? 'Hızlı' : data.mobileScore > 50 ? 'Orta' : 'Yavaş',
    score: data.mobileScore,
    description: `Mobil FCP: ${data.fcp}, LCP: ${data.lcp}`,
    suggestion: data.mobileScore < 80 ? 'Görselleri optimize edin, gereksiz scriptleri kaldırın.' : 'Sayfa hızı iyi.',
    children: <div className="text-xs text-gray-500 mt-2">Desktop Skoru: {data.desktopScore}</div>
  };
}

function getRobotsResultProps(data) {
  if (!data || data.error) return {
    title: 'Robots.txt & Sitemap', badge: 'Hata', description: data?.error || 'Sonuç alınamadı.', score: undefined, suggestion: undefined, children: null
  };
  return {
    title: 'Robots.txt & Sitemap',
    badge: data.robotsFound && data.sitemapFound ? 'Tam' : data.robotsFound ? 'Sadece Robots' : data.sitemapFound ? 'Sadece Sitemap' : 'Eksik',
    score: data.robotsFound && data.sitemapFound ? 100 : 50,
    description: `robots.txt: ${data.robotsFound ? 'Var' : 'Yok'}, sitemap.xml: ${data.sitemapFound ? 'Var' : 'Yok'}`,
    suggestion: !data.robotsFound || !data.sitemapFound ? 'robots.txt ve sitemap.xml dosyalarını ekleyin.' : 'Her şey yolunda.',
    children: null
  };
}

function getFaviconResultProps(data) {
  if (!data || data.error) return {
    title: 'Favicon Kontrolü', badge: 'Hata', description: data?.error || 'Sonuç alınamadı.', score: undefined, suggestion: undefined, children: null
  };
  return {
    title: 'Favicon Kontrolü',
    badge: data.favicons && data.favicons.length > 0 ? 'Var' : 'Yok',
    score: data.favicons && data.favicons.length > 0 ? 100 : 0,
    description: data.favicons && data.favicons.length > 0 ? `${data.favicons.length} favicon bulundu.` : 'Favicon bulunamadı.',
    suggestion: data.favicons && data.favicons.length > 0 ? 'Favicon mevcut.' : 'Favicon ekleyin.',
    children: data.favicons && data.favicons.length > 0 && (
      <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
        {data.favicons.map((f, i) => <li key={i}>{f.href} <span className="text-xs text-gray-400">{f.type} {f.sizes}</span></li>)}
      </ul>
    )
  };
}

function getBrokenLinksResultProps(data) {
  if (!data || data.error) return {
    title: 'Kırık Link Kontrolü', badge: 'Hata', description: data?.error || 'Sonuç alınamadı.', score: undefined, suggestion: undefined, children: null
  };
  return {
    title: 'Kırık Link Kontrolü',
    badge: data.broken && data.broken.length === 0 ? 'Sorun Yok' : 'Kırık Link Var',
    score: data.broken && data.broken.length === 0 ? 100 : 40,
    description: `Toplam link: ${data.links?.length || 0}, Kırık link: ${data.broken?.length || 0}`,
    suggestion: data.broken && data.broken.length > 0 ? 'Kırık linkleri düzeltin.' : 'Tüm linkler çalışıyor.',
    children: data.broken && data.broken.length > 0 && (
      <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
        {data.broken.map((l, i) => <li key={i}>{l.url}</li>)}
      </ul>
    )
  };
}

function getCanonicalResultProps(data) {
  if (!data || data.error) return {
    title: 'Canonical Tag Kontrolü', badge: 'Hata', description: data?.error || 'Sonuç alınamadı.', score: undefined, suggestion: undefined, children: null
  };
  return {
    title: 'Canonical Tag Kontrolü',
    badge: data.canonical ? 'Var' : 'Yok',
    score: data.canonical ? 100 : 0,
    description: data.canonical ? `Canonical: ${data.canonical}` : 'Canonical etiketi bulunamadı.',
    suggestion: data.canonical ? 'Canonical etiketi mevcut.' : 'Canonical etiketi ekleyin.',
    children: null
  };
}

function getPageSizeResultProps(data) {
  if (!data || data.error) return {
    title: 'Sayfa Boyutu & Asset', badge: 'Hata', description: data?.error || 'Sonuç alınamadı.', score: undefined, suggestion: undefined, children: null
  };
  const mb = (b) => (b / 1024 / 1024).toFixed(2) + ' MB';
  return {
    title: 'Sayfa Boyutu & Asset',
    badge: data.totalSize < 2 * 1024 * 1024 ? 'İyi' : 'Büyük',
    score: data.totalSize < 2 * 1024 * 1024 ? 100 : 50,
    description: `Toplam: ${mb(data.totalSize)}, Görsel: ${mb(data.imagesSize)}, JS: ${mb(data.jsSize)}, CSS: ${mb(data.cssSize)}`,
    suggestion: data.totalSize > 2 * 1024 * 1024 ? 'Sayfa boyutunu ve assetleri küçültün.' : 'Sayfa boyutu iyi.',
    children: null
  };
}

function getMetaResultProps(data) {
  if (!data || data.error) return {
    title: 'Meta Tag Oluşturucu', badge: 'Hata', description: data?.error || 'Sonuç alınamadı.', score: undefined, suggestion: undefined, children: null
  };
  return {
    title: 'Meta Tag Oluşturucu',
    badge: data.title && data.description ? 'Var' : 'Eksik',
    score: data.title && data.description ? 100 : 50,
    description: `Başlık: ${data.title || '-'}\nAçıklama: ${data.description || '-'}`,
    suggestion: !data.title || !data.description ? 'Başlık ve açıklama meta taglerini ekleyin.' : 'Meta tagler mevcut.',
    children: null
  };
}

const toolResultProps = {
  seo: getSeoResultProps,
  ssl: getSslResultProps,
  mobile: getMobileResultProps,
  speed: getSpeedResultProps,
  robots: getRobotsResultProps,
  favicon: getFaviconResultProps,
  brokenlinks: getBrokenLinksResultProps,
  canonical: getCanonicalResultProps,
  pagesize: getPageSizeResultProps,
  meta: getMetaResultProps,
};

const BATCH_API = '/api/batch-analyze';

export default function AllTools() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const router = useRouter();
  const pdfRef = useRef();

  const handleAnalyze = async () => {
    setError(null);
    setResults({});
    setAnalyzed(false);
    if (!url) {
      setError('Lütfen geçerli bir site adresi girin (https://... gibi)');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BATCH_API}?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.error) {
        setError('Girilen siteye ulaşılamadı veya analiz başarısız oldu. Lütfen adresi kontrol edin veya farklı bir site deneyin.');
      } else {
        setResults(data);
        setAnalyzed(true);
      }
    } catch (err) {
      setError('Girilen siteye ulaşılamadı veya analiz başarısız oldu. Lütfen adresi kontrol edin veya farklı bir site deneyin.');
    }
    setLoading(false);
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;
    const pdfElement = pdfRef.current.cloneNode(true);
    pdfElement.classList.add('pdf-mode');
    document.body.appendChild(pdfElement);
    html2pdf()
      .set({
        margin: 0.05,
        filename: 'analiz-sonuclari.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 0.9 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .from(pdfElement)
      .save()
      .then(() => document.body.removeChild(pdfElement));
  };

  return (
    <>
      <Head>
        <title>Tüm Araçlar - Checklyzer | Kapsamlı Web Site Analizi</title>
        <meta name="description" content="Tek seferde web sitenizin SEO, güvenlik, hız, mobil uyumluluk ve daha fazlasını analiz edin. Kapsamlı rapor indirin." />
        <meta property="og:title" content="Tüm Araçlar - Checklyzer | Kapsamlı Web Site Analizi" />
        <meta property="og:description" content="Tek seferde web sitenizin SEO, güvenlik, hız, mobil uyumluluk ve daha fazlasını analiz edin." />
        <meta property="og:url" content="https://checklyzer.sade.works/all-tools" />
        <meta name="twitter:title" content="Tüm Araçlar - Checklyzer | Kapsamlı Web Site Analizi" />
        <meta name="twitter:description" content="Tek seferde web sitenizin SEO, güvenlik, hız, mobil uyumluluk ve daha fazlasını analiz edin." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12 px-4">
        <style jsx global>{`
          .pdf-mode {
            font-size: 10px !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .pdf-mode .bg-white {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            margin-bottom: 2px !important;
            padding: 6px !important;
          }
          .pdf-mode .text-xl { font-size: 0.85rem !important; }
          .pdf-mode .text-lg { font-size: 0.8rem !important; }
          .pdf-mode .text-base { font-size: 0.75rem !important; }
          .pdf-mode .rounded-lg { border-radius: 4px !important; }
          .pdf-mode .mb-2, .pdf-mode .mb-4, .pdf-mode .mb-6, .pdf-mode .mt-2, .pdf-mode .mt-12 { margin: 0 !important; }
          .pdf-mode ul { margin: 0 0 0 10px !important; }
          .pdf-mode .space-y-8 > :not([hidden]) ~ :not([hidden]) { margin-top: 2px !important; }
          .pdf-mode .font-bold { font-weight: 600 !important; }
          .pdf-mode .font-semibold { font-weight: 500 !important; }
        `}</style>
        <div className="max-w-2xl mx-auto">
          <button
            className="mb-6 text-blue-600 hover:underline"
            onClick={() => router.push('/')}
          >
            ← Geri Dön
          </button>
          <div className="flex flex-col items-center mb-8">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-lg mb-4">
              <RocketLaunchIcon className="w-10 h-10 text-white" />
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-2 tracking-tight">Tüm Araçları Tek Tıkla Dene</h1>
            <p className="text-gray-600 text-center max-w-xl mb-2">Web siteni <span className="font-semibold text-blue-700">SEO</span>, <span className="font-semibold text-green-700">güvenlik</span>, <span className="font-semibold text-indigo-700">hız</span>, <span className="font-semibold text-pink-700">mobil uyumluluk</span> ve daha fazlası için anında analiz et. Sonuçları PDF olarak indir, önerilerle siteni güçlendir!</p>
          </div>
          <div className="flex justify-center mb-8">
            <URLInput
              url={url}
              setUrl={setUrl}
              onSubmit={handleAnalyze}
              loading={loading}
              buttonText="Analiz Et"
              placeholder="https://ornek.com"
            />
          </div>
          {!analyzed && !loading && (
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100 text-gray-700 text-center mb-8 animate-fade-in">
              <h2 className="text-lg font-semibold mb-2">Tüm araçları tek seferde deneyin!</h2>
              <p>Bir web sitesi adresi girin ve SEO, güvenlik, hız, mobil uyumluluk, robots.txt, favicon, kırık link, canonical, sayfa boyutu ve meta tag analizlerini tek tıkla görün. Sonuçları PDF olarak da indirebilirsiniz.</p>
            </div>
          )}
          {analyzed && Object.keys(results).length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow text-base"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                PDF Olarak İndir
              </button>
            </div>
          )}
          {error && <div className="text-red-600 mb-4 font-semibold">{error}</div>}
          {analyzed && (
            <div ref={pdfRef} className="space-y-8">
              {toolList.map(tool => {
                const getProps = toolResultProps[tool.key];
                return (
                  <ResultCard key={tool.key} {...getProps(results[tool.key])} />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 