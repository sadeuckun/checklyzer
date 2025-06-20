import { useState } from 'react';

export default function URLInput({ url, setUrl, onSubmit, loading, buttonText = 'Analiz Et', placeholder = 'https://ornek.com' }) {
  const [inputError, setInputError] = useState('');

  function isValidUrl(str) {
    try {
      const u = new URL(str);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputError('');
    if (!isValidUrl(url)) {
      setInputError('Lütfen geçerli bir site adresi girin (https://... gibi)');
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-4">
      <input
        type="url"
        required
        placeholder={placeholder}
        className="border rounded px-3 py-2 flex-1"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition min-w-[120px]">
        {loading ? 'Yükleniyor...' : buttonText}
      </button>
      {inputError && <div className="text-red-600 text-sm mt-1 w-full">{inputError}</div>}
    </form>
  );
} 