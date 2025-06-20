import { CheckCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon, DevicePhoneMobileIcon, RocketLaunchIcon, BoltIcon, DocumentTextIcon, LinkIcon, TagIcon, EyeIcon } from '@heroicons/react/24/solid';

const icons = {
  'SEO Testi': <RocketLaunchIcon className="w-7 h-7 text-blue-500" />,
  'SSL/Güvenlik Testi': <ShieldCheckIcon className="w-7 h-7 text-green-500" />,
  'Mobil Uyumluluk Testi': <DevicePhoneMobileIcon className="w-7 h-7 text-pink-500" />,
  'Sayfa Hızı Testi': <BoltIcon className="w-7 h-7 text-yellow-500" />,
  'Robots.txt & Sitemap': <EyeIcon className="w-7 h-7 text-gray-500" />,
  'Favicon Kontrolü': <TagIcon className="w-7 h-7 text-indigo-500" />,
  'Kırık Link Kontrolü': <LinkIcon className="w-7 h-7 text-red-500" />,
  'Canonical Tag Kontrolü': <DocumentTextIcon className="w-7 h-7 text-blue-400" />,
  'Sayfa Boyutu & Asset': <DocumentTextIcon className="w-7 h-7 text-orange-500" />,
  'Meta Tag Oluşturucu': <TagIcon className="w-7 h-7 text-purple-500" />,
};

function ProgressBar({ score }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-400' : 'bg-red-500';
  return (
    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${score || 0}%` }} />
    </div>
  );
}

export default function ResultCard({ title, score, badge, description, suggestion, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-100 flex flex-col gap-3 animate-fade-in hover:shadow-2xl transition-shadow">
      <div className="flex items-center gap-3 mb-1">
        <div>{icons[title] || <CheckCircleIcon className="w-7 h-7 text-gray-400" />}</div>
        <h2 className="text-xl font-bold flex-1 text-gray-900">{title}</h2>
        {badge && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-tr from-blue-100 to-blue-200 text-blue-700 border border-blue-200 shadow-sm">
            {badge}
          </span>
        )}
        {typeof score === 'number' && <ProgressBar score={score} />}
      </div>
      {description && <div className="text-gray-700 whitespace-pre-line mb-1">{description}</div>}
      {suggestion && (
        <div className="text-sm text-yellow-900 bg-yellow-50 border-l-4 border-yellow-400 rounded px-4 py-2 mb-1 font-medium">
          <ExclamationTriangleIcon className="w-4 h-4 inline mr-1 align-text-bottom text-yellow-500" /> {suggestion}
        </div>
      )}
      {children}
    </div>
  );
} 