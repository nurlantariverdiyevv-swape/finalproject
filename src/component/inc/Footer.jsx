import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RiFacebookCircleFill, RiInstagramFill, RiYoutubeFill } from 'react-icons/ri';

function Footer() {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const footerData = [
    {
      title: "Runova",
      links: [
        { label: "Who We Are", path: "/who-we-are" },
        { label: "Become an S/PLUS Member", path: "/s-plus-member" },
        { label: "Pro Deal Access", path: "/pro-deal" },
        { label: "Affiliate Program", path: "/affiliate" },
        { label: "Salomon Forces", path: "/forces" },
        { label: "Press Center", path: "/press" },
        { label: "Careers", path: "/careers" },
        { label: "Newsletter", path: "/newsletter" }
      ]
    },
    {
      title: "Help Center",
      links: [
        { label: "Size Guide", path: "/size-guide" },
        { label: "Order/return tracking", path: "/order-tracking" },
        { label: "Gift Cards", path: "/gift-cards" },
        { label: "Warranty", path: "/warranty" },
        { label: "Shipping", path: "/shipping-info" },
        { label: "Returns", path: "/returns" },
        { label: "FAQ", path: "/faq" },
        { label: "Contact", path: "/contact" },
        { label: "Find a Shop", path: "/find-a-shop" },
        { label: "Tax Exempt", path: "/tax-exempt" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Terms & Conditions", path: "/terms" },
        { label: "S/PLUS - Terms & Conditions", path: "/s-plus-terms" },
        { label: "Cookie Preferences", path: "/cookie-preferences" },
        { label: "Cookie Policy", path: "/cookie-policy" },
        { label: "Privacy", path: "/privacy" },
        { label: "Accessibility", path: "/accessibility" },
        { label: "Declaration of conformity", path: "/conformity" },
        { label: "Product Recall", path: "/product-recall" },
        { label: "Customer Reviews", path: "/reviews" }
      ]
    },
    {
      title: "Sustainability",
      links: [
        { label: "Our Responsible Commitments", path: "/sustainability" }
      ]
    }
  ];

  return (
    <footer className="bg-black text-white pt-12 pb-8 px-6 md:px-16 font-sans">
      <div className="max-w-[1400px] mx-auto">

        {/* DESKTOP VIEW */}
        <div className="hidden md:grid md:grid-cols-5 gap-8 pb-16">
          {footerData.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h3 className="font-bold text-[17px] text-white">{section.title}</h3>
              <div className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <Link key={link.label} to={link.path} className="text-[15px] font-medium text-[#e5e5e5] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Shipping Bölməsi */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-[17px] text-white">Shipping</h3>
            <Link to="/country-select" className="flex items-center gap-2.5 text-[15px] font-medium text-white">
              <svg className="w-6 h-4 rounded-[1px] object-cover" viewBox="0 0 640 480">
                <g fillRule="evenodd">
                  <path fill="#bd3d44" d="M0 0h640v480H0z"/>
                  <path fill="#fff" d="M0 36.9h640v36.9H0zm0 73.8h640v36.9H0zm0 73.9h640v36.9H0zm0 73.8h640v36.9H0zm0 73.9h640v36.9H0zm0 73.8h640v36.9H0z"/>
                  <path fill="#192f5d" d="M0 0h256v258.5H0z"/>
                  <g fill="#fff">
                    <path d="M28.3 15.6l1.6 4.9h5.1l-4.1 3 1.6 4.9-4.2-3.1-4.1 3.1 1.6-4.9-4.2-3h5.2zm42.7 0l1.6 4.9h5.1l-4.1 3 1.6 4.9-4.2-3.1-4.1 3.1 1.6-4.9-4.2-3h5.2zm42.6 0l1.6 4.9h5.2l-4.2 3 1.6 4.9-4.1-3.1-4.2 3.1 1.6-4.9-4.2-3h5.2zm42.7 0l1.6 4.9h5.1l-4.1 3 1.6 4.9-4.2-3.1-4.1 3.1 1.6-4.9-4.2-3h5.2zm42.7 0l1.6 4.9h5.1l-4.1 3 1.6 4.9-4.2-3.1-4.1 3.1 1.6-4.9-4.2-3h5.2z"/>
                  </g>
                </g>
              </svg>
              <span>USA</span>
            </Link>
          </div>
        </div>

        {/* MOBILE VIEW (Accordion) */}
        <div className="md:hidden flex flex-col pb-8">
          {footerData.map((section) => {
            const isOpen = openSections[section.title];
            return (
              <div key={section.title} className="border-b border-[#333]">
                <button type="button" onClick={() => toggleSection(section.title)} className="w-full py-4 flex items-center justify-between text-left font-bold text-[17px] text-white">
                  <span>{section.title}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                </button>

                {isOpen && (
                  <div className="pb-4 flex flex-col gap-3">
                    {section.links.map((link) => (
                      <Link key={link.label} to={link.path} className="text-[15px] font-medium text-[#e5e5e5] hover:text-white block">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Shipping Mobile */}
          <div className="py-4 border-b border-[#333]">
            <h3 className="font-bold text-[17px] mb-3 text-white">Shipping</h3>
            <Link to="/country-select" className="flex items-center gap-2.5 text-[15px] font-medium text-white">
              <svg className="w-6 h-4 rounded-[1px] object-cover" viewBox="0 0 640 480">
                <g fillRule="evenodd">
                  <path fill="#bd3d44" d="M0 0h640v480H0z"/>
                  <path fill="#fff" d="M0 36.9h640v36.9H0zm0 73.8h640v36.9H0zm0 73.9h640v36.9H0zm0 73.8h640v36.9H0zm0 73.9h640v36.9H0zm0 73.8h640v36.9H0z"/>
                  <path fill="#192f5d" d="M0 0h256v258.5H0z"/>
                </g>
              </svg>
              <span>USA</span>
            </Link>
          </div>
        </div>

        {/* AŞAĞI HİSSƏ VƏ NAZİK BOZ XƏTT */}
        <div className="pt-8 border-t border-[#333] flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Sosial Medya İkonları */}
          <div className="flex items-center gap-5 w-full md:w-auto">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
              <RiFacebookCircleFill className="w-8 h-8 text-white" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
              <RiInstagramFill className="w-8 h-8 text-white" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
              <RiYoutubeFill className="w-9 h-8 text-white" />
            </a>
          </div>

          {/* Copyright Text */}
          <div className="text-[14px] text-[#e5e5e5] w-full md:w-auto text-left md:text-center">
            ©2026 — by Nurlan Tarıverdiyev
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;