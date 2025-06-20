import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SeoTest from '../components/SeoTest';
import SslTest from '../components/SslTest';
import MobileTest from '../components/MobileTest';
import SpeedTest from '../components/SpeedTest';
import RobotsTest from '../components/RobotsTest';
import MetaTagGenerator from '../components/MetaTagGenerator';
import FaviconChecker from '../components/FaviconChecker';
import BrokenLinkChecker from '../components/BrokenLinkChecker';
import CanonicalChecker from '../components/CanonicalChecker';
import PageSizeAnalyzer from '../components/PageSizeAnalyzer';
import { getBrandName } from '../lib/getBrandName';

const tools = [
  {
    key: 'seo',
    title: 'SEO Testi',
    description: 'Web sitenizin SEO uyumluluğunu analiz edin ve iyileştirme önerileri alın.'
  },
  {
    key: 'ssl',
    title: 'SSL/Güvenlik Testi',
    description: 'Sitenizin SSL sertifikası ve temel güvenlik durumunu kontrol edin.'
  },
  {
    key: 'mobile',
    title: 'Mobil Uyumluluk Testi',
    description: 'Web sitenizin mobil cihazlarda nasıl göründüğünü ve uyumluluğunu test edin.'
  },
  {
    key: 'speed',
    title: 'Sayfa Hızı Testi',
    description: 'Web sitenizin açılış hızını ve performansını ölçün.'
  },
  {
    key: 'robots',
    title: 'Robots.txt & Sitemap Kontrolü',
    description: 'Sitenizin robots.txt ve sitemap.xml dosyalarını kontrol edin.'
  },
  {
    key: 'meta',
    title: 'Meta Tag Oluşturucu',
    description: 'Başlık, açıklama ve anahtar kelime meta tagleri oluşturun.'
  },
  {
    key: 'favicon',
    title: 'Favicon Kontrol Aracı',
    description: 'Web sitenizde favicon olup olmadığını ve detaylarını kontrol edin.'
  },
  {
    key: 'brokenlinks',
    title: 'Kırık Link Kontrolü',
    description: 'Web sitenizdeki bozuk (404) linkleri tespit edin ve düzeltin.'
  },
  {
    key: 'canonical',
    title: 'Canonical Tag Kontrolü',
    description: 'Sayfanızda canonical etiketi olup olmadığını ve değerini kontrol edin.'
  },
  {
    key: 'pagesize',
    title: 'Sayfa Boyutu & Asset Analizi',
    description: 'Sayfanızın toplam boyutunu ve ana assetlerin boyutunu analiz edin.'
  }
];

function ToolContainer({ tool, onClick }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:scale-105 transition-transform border border-gray-100"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold mb-2">{tool.title}</h2>
      <p className="text-gray-600">{tool.description}</p>
    </div>
  );
}

const brandName = getBrandName();

export default function Home() {
  const [selectedTool, setSelectedTool] = useState(null);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Checklyzer - Web Site Analiz Araçları | SEO, Hız, Güvenlik Testi</title>
        <meta name="description" content="Web sitenizin SEO, güvenlik, hız ve mobil uyumluluğunu analiz eden kapsamlı araç seti. Ücretsiz web analiz araçları ile sitenizi optimize edin." />
        <meta property="og:title" content="Checklyzer - Web Site Analiz Araçları" />
        <meta property="og:description" content="Web sitenizin SEO, güvenlik, hız ve mobil uyumluluğunu analiz eden kapsamlı araç seti." />
        <meta property="og:url" content="https://checklyzer.sade.works" />
        <meta name="twitter:title" content="Checklyzer - Web Site Analiz Araçları" />
        <meta name="twitter:description" content="Web sitenizin SEO, güvenlik, hız ve mobil uyumluluğunu analiz eden kapsamlı araç seti." />
      </Head>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">{brandName} Araçları</h1>
          {!selectedTool ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map((tool) => (
                  <ToolContainer
                    key={tool.key}
                    tool={tool}
                    onClick={() => setSelectedTool(tool.key)}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-12">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition-colors text-lg"
                  onClick={() => router.push('/all-tools')}
                >
                  Tüm Araçları Dene
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                className="mb-4 text-blue-600 hover:underline"
                onClick={() => setSelectedTool(null)}
              >
                ← Geri Dön
              </button>
              {selectedTool === 'seo' && <SeoTest />}
              {selectedTool === 'ssl' && <SslTest />}
              {selectedTool === 'mobile' && <MobileTest />}
              {selectedTool === 'speed' && <SpeedTest />}
              {selectedTool === 'robots' && <RobotsTest />}
              {selectedTool === 'meta' && <MetaTagGenerator />}
              {selectedTool === 'favicon' && <FaviconChecker />}
              {selectedTool === 'brokenlinks' && <BrokenLinkChecker />}
              {selectedTool === 'canonical' && <CanonicalChecker />}
              {selectedTool === 'pagesize' && <PageSizeAnalyzer />}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 