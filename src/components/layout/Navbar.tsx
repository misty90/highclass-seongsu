import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    {
      name: '단지개요',
      path: '/complex',
      subLinks: [
        { name: '갤러리아포레', path: '/complex/galleria' },
        { name: '아크로서울포레스트', path: '/complex/acro' },
        { name: '트리마제', path: '/complex/trimage' },
      ]
    },
    {
      name: '매물보기',
      path: '/listings',
      subLinks: [
        { name: '전체매물', path: '/listings' },
        { name: '갤러리아포레', path: '/listings?complex=갤러리아포레' },
        { name: '아크로서울포레스트', path: '/listings?complex=아크로서울포레스트' },
        { name: '트리마제', path: '/listings?complex=트리마제' },
      ]
    },
    { name: '문의', path: '/inquiry' }
  ];

  const isTransparentPage = location.pathname === '/' || location.pathname.startsWith('/complex');

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || !isTransparentPage ? 'bg-white shadow-sm py-4' : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className={cn(
              "font-serif text-2xl font-bold tracking-tighter",
              isScrolled || !isTransparentPage ? "text-[#0F1A2B]" : "text-white"
            )}>
              HIGHCLASS
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-10">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.subLinks ? (
                  <div className="flex items-center cursor-pointer">
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      isScrolled || !isTransparentPage ? "text-gray-800 hover:text-[#0F1A2B]" : "text-white/90 hover:text-white"
                    )}>
                      {link.name}
                    </span>
                    <ChevronDown className={cn(
                      "ml-1 w-4 h-4",
                      isScrolled || !isTransparentPage ? "text-gray-500" : "text-white/70"
                    )} />
                    
                    {/* Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white shadow-lg rounded-md py-2 w-48 border border-gray-100">
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F1A2B]"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isScrolled || !isTransparentPage ? "text-gray-800 hover:text-[#0F1A2B]" : "text-white/90 hover:text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "p-2",
                isScrolled || !isTransparentPage ? "text-gray-900" : "text-white"
              )}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <div key={link.name} className="py-2">
                {link.subLinks ? (
                  <>
                    <div className="font-medium text-gray-900 px-3 py-2">{link.name}</div>
                    <div className="pl-6 space-y-1">
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-[#0F1A2B] hover:bg-gray-50 rounded-md"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className="block font-medium text-gray-900 px-3 py-2 hover:bg-gray-50 rounded-md"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
