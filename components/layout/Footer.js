import React from 'react'
import Link from 'next/link';
import { getBrandName } from '../../lib/getBrandName';

export default function Footer() {
  const brandName = getBrandName();
  return (
    <footer className="w-full bg-gray-50 border-t">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 32 32" fill="currentColor">
                <defs>
                  <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#2563eb', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#1d4ed8', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="6" fill="url(#footerGrad)"/>
                <path d="M8 12 L16 8 L24 12 L24 20 L16 24 L8 20 Z" fill="white" opacity="0.9"/>
                <circle cx="16" cy="16" r="3" fill="white"/>
                <path d="M12 10 L20 10 M12 14 L20 14 M12 18 L20 18" stroke="white" strokeWidth="1" opacity="0.7"/>
              </svg>
              <span className="text-lg font-bold text-gray-900">{brandName}</span>
            </div>
            <p className="text-gray-600 mb-4">
              Web sitenizin SEO, güvenlik, hız ve mobil uyumluluğunu analiz eden kapsamlı araç seti. 
              Ücretsiz web analiz araçları ile sitenizi optimize edin.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Araçlar</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link></li>
              <li><Link href="/all-tools" className="hover:text-blue-600 transition-colors">Tüm Araçlar</Link></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">SEO Testi</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Hız Testi</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Güvenlik Testi</span></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Şirket</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="https://furkansadeuckun.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Furkan Sade Uckun</a></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Hakkımızda</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">İletişim</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Gizlilik</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {brandName}. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 