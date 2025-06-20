import Link from 'next/link';
import React from 'react'
import { getBrandName } from '../../lib/getBrandName';

export default function Header() {
  const brandName = getBrandName();
  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white shadow-md">
      <div className="flex items-center space-x-2 md:space-x-3">
        <Link href="/" className="flex items-center space-x-2 text-lg md:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" viewBox="0 0 32 32" fill="currentColor">
            <defs>
              <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#2563eb', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#1d4ed8', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="6" fill="url(#headerGrad)"/>
            <path d="M8 12 L16 8 L24 12 L24 20 L16 24 L8 20 Z" fill="white" opacity="0.9"/>
            <circle cx="16" cy="16" r="3" fill="white"/>
            <path d="M12 10 L20 10 M12 14 L20 14 M12 18 L20 18" stroke="white" strokeWidth="1" opacity="0.7"/>
          </svg>
          <span>{brandName}</span>
        </Link>
      </div>
      <nav className="hidden md:flex items-center space-x-6">
        <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
          Ana Sayfa
        </Link>
        <Link href="/all-tools" className="text-gray-600 hover:text-blue-600 transition-colors">
          Tüm Araçlar
        </Link>
        <Link href="https://furkansadeuckun.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
          Hakkımda
        </Link>
      </nav>
    </header>
  );
} 