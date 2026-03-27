import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingMenu from './FloatingMenu';
import { useStore } from '../../store/useStore';
import { useEffect } from 'react';

export default function Layout() {
  const { settings, isInitialized } = useStore();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.title = settings.seoTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', settings.seoDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = settings.seoDescription;
      document.head.appendChild(meta);
    }
  }, [settings]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1A2B]">
        <div className="animate-pulse flex flex-col items-center">
          <h1 className="font-serif text-3xl font-bold text-white tracking-wider mb-4">HIGHCLASS</h1>
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingMenu />
    </div>
  );
}
