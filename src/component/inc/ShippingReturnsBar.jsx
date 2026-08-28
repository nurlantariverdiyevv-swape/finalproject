import { useState } from 'react';
import { ChevronRight, X, Package, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';

const ICONS = { package: Package, truck: Truck };

// Backend (content.json) hələ yenilənməyibsə də bar boş qalmasın deyə
// defolt məzmun - API-dən content.infoBar gələn kimi o üstünlük təşkil edir.
const DEFAULT_ITEMS = [
  {
    icon: 'package',
    title: 'Free Returns Within 45 Days',
    body: [
      'Free returns by mail within 45 days of delivery.',
      'Items must be unworn, in their original packaging, with all tags attached.',
    ],
    linkTo: '/returns',
    linkLabel: 'Learn more here.',
  },
  {
    icon: 'truck',
    title: 'Free Shipping for S/PLUS Members',
    body: [
      'S/Plus Members will receive free ground delivery shipping on every purchase and will be gifted +50 bonus points after signing up.',
      'Unfortunately, we cannot accommodate PO, FPO, or APO boxes at this time.',
    ],
    linkTo: '/s-plus-member',
    linkLabel: 'Become a member.',
  },
];

// Salomon saytındakı kimi: footerin üstündə "Free Returns Within 45 Days" /
// "Free Shipping for S/PLUS Members" sətirləri, üstünə basanda sağdan
// sürüşən panel açılır (Header-dəki S/PLUS modalı ilə eyni stil).
// Məzmun content.json-dan (content.infoBar) gəlir; backend hələ
// yenilənməyibsə DEFAULT_ITEMS istifadə olunur ki, bar heç vaxt yox olmasın.
function ShippingReturnsBar({ variant = 'bar' }) {
  const { content } = useDataContext();
  const items = content?.infoBar?.length ? content.infoBar : DEFAULT_ITEMS;
  const [activeItem, setActiveItem] = useState(null);

  if (items.length === 0) return null;

  const wrapperClass =
    variant === 'bar'
      ? 'w-full border-t border-b border-gray-200 bg-white'
      : 'w-full border border-gray-200 rounded-lg bg-white overflow-hidden';

  return (
    <div className={wrapperClass}>
      <div className={variant === 'bar' ? 'max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2' : ''}>
        {items.map((item, idx) => {
          const Icon = ICONS[item.icon] || Package;
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => setActiveItem(item)}
              className={`w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-4 text-left text-sm font-semibold text-black hover:bg-gray-50 transition-colors cursor-pointer ${
                idx === 0 ? 'sm:border-r border-b sm:border-b-0 border-gray-200' : ''
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                <span>{item.title}</span>
              </span>
              <ChevronRight size={18} className="text-gray-400 shrink-0" />
            </button>
          );
        })}
      </div>

      {/* SAĞDAN SÜRÜŞƏN PANEL */}
      <div
        onClick={() => setActiveItem(null)}
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
          activeItem ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[110] shadow-2xl transition-transform duration-300 transform overflow-y-auto ${
          activeItem ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {activeItem && (
          <>
            <div className="flex items-start justify-between gap-4 px-6 py-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-bold text-black leading-snug">{activeItem.title}</h2>
              <button type="button" onClick={() => setActiveItem(null)} className="shrink-0 p-1 hover:opacity-70 cursor-pointer" aria-label="Close">
                <X size={22} className="text-black" strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-6 text-[15px] leading-relaxed text-black space-y-4">
              {activeItem.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {activeItem.linkTo && (
                <Link to={activeItem.linkTo} onClick={() => setActiveItem(null)} className="inline-block font-semibold underline underline-offset-4 hover:text-gray-600">
                  {activeItem.linkLabel || 'Learn more.'}
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ShippingReturnsBar;
