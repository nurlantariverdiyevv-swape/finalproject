import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RiFacebookCircleFill, RiInstagramFill, RiYoutubeFill } from 'react-icons/ri';
import { useDataContext } from '../../context/DataContext';

function Footer() {
  const { content } = useDataContext();
  const footerData = content?.footer || [];

  const [openSections, setOpenSections] = useState({});
  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const goHome = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="font-sans">
      <div className="bg-black text-white pt-12 pb-8 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">

          {/* DESKTOP VIEW */}
          <div className="hidden md:grid md:grid-cols-5 gap-8 pb-16">
            {footerData.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h3 className="font-semibold text-[16px] tracking-wide capitalize text-white">{section.title}</h3>
                <div className="flex flex-col gap-3">
                  {section.links.map((link) => (
                    <Link key={link.label} to="/" onClick={goHome} className="text-[15px] font-medium text-[#e5e5e5] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Shipping Section */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-[16px] tracking-wide capitalize text-white">Shipping</h3>
              <Link to="/country-select" className="flex items-center gap-2.5 text-[15px] font-medium text-white">
                <svg className="w-6 h-4 rounded-[1px] object-cover" viewBox="0 0 640 480">
                  <g fillRule="evenodd">
                    <path fill="#bd3d44" d="M0 0h640v480H0z" />
                    <path fill="#fff" d="M0 36.9h640v36.9H0zm0 73.8h640v36.9H0zm0 73.9h640v36.9H0zm0 73.8h640v36.9H0zm0 73.9h640v36.9H0zm0 73.8h640v36.9H0z" />
                    <path fill="#192f5d" d="M0 0h256v258.5H0z" />
                    <g fill="#fff">
                      <path d="M28.3 15.6l1.6 4.9h5.1l-4.1 3 1.6 4.9-4.2-3.1-4.1 3.1 1.6-4.9-4.2-3h5.2zm42.7 0l1.6 4.9h5.1l-4.1 3 1.6 4.9-4.2-3.1-4.1 3.1 1.6-4.9-4.2-3h5.2zm42.6 0l1.6 4.9h5.2l-4.2 3 1.6 4.9-4.1-3.1-4.2 3.1 1.6-4.9-4.2-3h5.2zm42.7 0l1.6 4.9h5.1l-4.1 3 1.6 4.9-4.2-3.1-4.1 3.1 1.6-4.9-4.2-3h5.2zm42.7 0l1.6 4.9h5.1l-4.1 3 1.6 4.9-4.2-3.1-4.1 3.1 1.6-4.9-4.2-3h5.2z" />
                    </g>
                  </g>
                </svg>
                <span>USA</span>
              </Link>
            </div>
          </div>

          {/* MOBILE VIEW */}
          <div className="md:hidden flex flex-col pb-8">
            {footerData.map((section) => {
              const isOpen = !!openSections[section.title];
              return (
                <div key={section.title} className="border-b border-[#333]">
                  <button type="button" onClick={() => toggleSection(section.title)} aria-expanded={isOpen} className="w-full flex items-center justify-between py-4 cursor-pointer">
                    <h3 className="font-bold text-[16px] tracking-wide capitalize text-white">{section.title}</h3>
                    {isOpen ? (
                      <ChevronUp size={20} className="text-white shrink-0" />
                    ) : (
                      <ChevronDown size={20} className="text-white shrink-0" />
                    )}
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-3">
                        {section.links.map((link) => (
                          <Link key={link.label} to="/" onClick={goHome} className="text-[15px] font-medium text-[#e5e5e5] hover:text-white block">
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Shipping Mobile */}
            <div className="border-b border-[#333]">
              <button type="button" onClick={() => toggleSection('Shipping')} aria-expanded={!!openSections.Shipping} className="w-full flex items-center justify-between py-4 cursor-pointer">
                <h3 className="font-bold text-[16px] tracking-wide capitalize text-white">Shipping</h3>
                {openSections.Shipping ? (
                  <ChevronUp size={20} className="text-white shrink-0" />
                ) : (
                  <ChevronDown size={20} className="text-white shrink-0" />
                )}
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${openSections.Shipping ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <Link to="/country-select" className="flex items-center gap-2.5 text-[15px] font-medium text-white">
                    <svg className="w-6 h-4 rounded-[1px] object-cover" viewBox="0 0 640 480">
                      <g fillRule="evenodd">
                        <path fill="#bd3d44" d="M0 0h640v480H0z" />
                        <path fill="#fff" d="M0 36.9h640v36.9H0zm0 73.8h640v36.9H0zm0 73.9h640v36.9H0zm0 73.8h640v36.9H0zm0 73.9h640v36.9H0zm0 73.8h640v36.9H0z" />
                        <path fill="#192f5d" d="M0 0h256v258.5H0z" />
                      </g>
                    </svg>
                    <span>USA</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="pt-8 border-t border-[#333] flex flex-col md:flex-row items-center justify-between gap-6">
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

            <div className="text-[14px] text-[#e5e5e5] w-full md:w-auto text-left md:text-center">
              ©2026 Runova. All rights reserved.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;