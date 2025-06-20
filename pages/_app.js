import '../styles/globals.css'
import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Checklyzer - Web sitenizin SEO, güvenlik, hız ve mobil uyumluluğunu analiz eden kapsamlı araç seti. Ücretsiz web analiz araçları." />
        <meta name="keywords" content="SEO testi, web analizi, site hızı, mobil uyumluluk, SSL testi, robots.txt, sitemap, favicon kontrolü, kırık link kontrolü, canonical tag" />
        <meta name="author" content="Checklyzer" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Checklyzer - Web Site Analiz Araçları" />
        <meta property="og:description" content="Web sitenizin SEO, güvenlik, hız ve mobil uyumluluğunu analiz eden kapsamlı araç seti." />
        <meta property="og:url" content="https://checklyzer.sade.works" />
        <meta property="og:site_name" content="Checklyzer" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Checklyzer - Web Site Analiz Araçları" />
        <meta name="twitter:description" content="Web sitenizin SEO, güvenlik, hız ve mobil uyumluluğunu analiz eden kapsamlı araç seti." />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://checklyzer.sade.works" />
      </Head>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  )
} 