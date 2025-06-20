import { useState } from 'react';

function getMetaScore({ title, description, keywords }) {
  let score = 100;
  if (!title) score -= 40;
  else if (title.length < 20 || title.length > 60) score -= 10;
  if (!description) score -= 40;
  else if (description.length < 50 || description.length > 160) score -= 10;
  if (!keywords) score -= 10;
  return Math.max(score, 0);
}

function getMetaSuggestions({ title, description, keywords }) {
  const suggestions = [];
  if (!title) suggestions.push('Başlık (title) etiketi eksik.');
  else if (title.length < 20 || title.length > 60) suggestions.push('Başlık 20-60 karakter arası olmalı.');
  if (!description) suggestions.push('Açıklama (description) etiketi eksik.');
  else if (description.length < 50 || description.length > 160) suggestions.push('Açıklama 50-160 karakter arası olmalı.');
  if (!keywords) suggestions.push('Anahtar kelimeler eksik.');
  return suggestions;
}

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

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [show, setShow] = useState(false);

  const metaData = { title, description, keywords };
  const score = getMetaScore(metaData);
  const suggestions = getMetaSuggestions(metaData);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShow(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Meta Tag Oluşturucu</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
        <input
          type="text"
          required
          placeholder="Başlık (title)"
          className="border rounded px-3 py-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Açıklama (description)"
          className="border rounded px-3 py-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Anahtar Kelimeler (virgülle ayırın)"
          className="border rounded px-3 py-2"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Oluştur
        </button>
      </form>
      {show && (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto animate-fade-in">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <svg width="80" height="80">
                <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle cx="40" cy="40" r="36" stroke="#2563eb" strokeWidth="8" fill="none" strokeDasharray={226} strokeDashoffset={226 - (score * 226) / 100} style={{transition: 'stroke-dashoffset 1s'}} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-700">{score}</div>
            </div>
            <div>
              <div className="text-lg font-semibold mb-1">Meta Tag Puanı</div>
              <div className="text-gray-500 text-sm">100 üzerinden</div>
              {score >= 80 && <Badge color="green">Harika!</Badge>}
              {score >= 60 && score < 80 && <Badge color="yellow">İyi</Badge>}
              {score < 60 && <Badge color="red">Eksik</Badge>}
            </div>
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Meta Tag Bilgileri</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Başlık (title)
                  {title ? (
                    <Badge color={title.length >= 20 && title.length <= 60 ? 'green' : 'yellow'}>✔</Badge>
                  ) : (
                    <Badge color="red">Eksik</Badge>
                  )}
                </div>
                <div className="text-gray-700 text-sm break-words">{title || <span className="text-red-600">Başlık etiketi bulunamadı.</span>}</div>
                <div className="text-xs text-gray-500 mt-1">{title ? `${title.length} karakter (İdeal: 20-60)` : 'Başlık etiketi SEO için çok önemlidir.'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Meta Açıklama
                  {description ? (
                    <Badge color={description.length >= 50 && description.length <= 160 ? 'green' : 'yellow'}>✔</Badge>
                  ) : (
                    <Badge color="red">Eksik</Badge>
                  )}
                </div>
                <div className="text-gray-700 text-sm break-words">{description || <span className="text-red-600">Meta açıklama bulunamadı.</span>}</div>
                <div className="text-xs text-gray-500 mt-1">{description ? `${description.length} karakter (İdeal: 50-160)` : 'Meta açıklama arama sonuçlarında öne çıkar.'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-1 flex items-center gap-2">Anahtar Kelimeler
                  {keywords ? <Badge color="green">Var</Badge> : <Badge color="red">Eksik</Badge>}
                </div>
                <div className="text-gray-700 text-sm break-words">{keywords || <span className="text-red-600">Anahtar kelimeler girilmedi.</span>}</div>
                <div className="text-xs text-gray-500 mt-1">Anahtar kelimeler, arama motorlarının sayfanızı anlamasına yardımcı olur.</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Öneriler</div>
            <ul className="list-disc ml-6 text-sm">
              {suggestions.length === 0 ? (
                <li className="text-green-600">Her şey yolunda görünüyor!</li>
              ) : (
                suggestions.map((s, i) => <li key={i} className="text-orange-600">{s}</li>)
              )}
            </ul>
          </div>

          <div className="font-semibold text-gray-700 mb-2">Meta Tag Kodları</div>
          <pre className="bg-white p-2 rounded text-sm overflow-x-auto border border-gray-200">
{`<title>${title}</title>
<meta name="description" content="${description}" />
${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}`}
          </pre>
        </div>
      )}
    </div>
  );
} 