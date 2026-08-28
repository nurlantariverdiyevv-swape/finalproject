import { Link, useLocation } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';

// Falls back to a readable title built from the URL (e.g. "/size-guide" -> "Size Guide")
// for routes that aren't in content.footer, like /country-select.
function titleFromPath(pathname) {
  return pathname
    .replace(/^\//, '')
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Runova is a demo store built on Salomon's public product catalog, so pages
// like "Terms & Conditions", "Careers", "Size Guide" etc. don't have real
// content yet. This shared page renders in their place so every footer/info
// link goes to a real page on this site instead of somewhere else.
function StaticInfoPage() {
  const { pathname } = useLocation();
  const { content } = useDataContext();

  const allFooterLinks = (content?.footer || []).flatMap((section) => section.links);
  const matchedLink = allFooterLinks.find((link) => link.path === pathname);
  const title = matchedLink?.label || titleFromPath(pathname);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-black mb-4">{title}</h1>
      <p className="text-gray-600 text-base leading-relaxed mb-8">
        This page doesn't have its content set up yet, but the link works and keeps you
        on Runova.
      </p>
      <Link to="/shop" className="inline-block bg-black text-white font-bold text-sm uppercase tracking-wide px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
        Continue Shopping
      </Link>
    </div>
  );
}

export default StaticInfoPage;
