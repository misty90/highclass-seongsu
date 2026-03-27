import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Youtube, Globe } from 'lucide-react';

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="bg-[#0F1A2B] text-white/80 py-16 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="font-sans text-2xl font-bold text-white tracking-tighter">HIGHCLASS</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>하이클래스 공인중개사사무소</p>
              <p>대표 김령하</p>
              <p>사업자등록번호 337-07-00425</p>
              <p>개설등록번호 11200-2017-00067</p>
              <p>전화번호 02-3443-8287</p>
              <p>주소 서울시 성동구 서울숲2길 32-14, 110호</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-medium text-white uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/complex/galleria" className="hover:text-white transition-colors">갤러리아포레</Link></li>
              <li><Link to="/complex/acro" className="hover:text-white transition-colors">아크로서울포레스트</Link></li>
              <li><Link to="/complex/trimage" className="hover:text-white transition-colors">트리마제</Link></li>
              <li><Link to="/listings" className="hover:text-white transition-colors">전체매물</Link></li>
              <li><Link to="/inquiry" className="hover:text-white transition-colors">문의하기</Link></li>
            </ul>
          </div>

          {/* Contact / SNS */}
          <div className="space-y-6">
            <h4 className="font-medium text-white uppercase tracking-wider text-sm">Connect</h4>
            <div className="flex flex-wrap gap-4">
              {settings.snsLinks.instagram && (
                <a href={settings.snsLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35-.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              {settings.snsLinks.blog && (
                <a href={settings.snsLinks.blog} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="sr-only">Blog</span>
                  <span className="text-[10px] font-bold tracking-wider uppercase">blog</span>
                </a>
              )}
              {settings.snsLinks.youtube && (
                <a href={settings.snsLinks.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="sr-only">YouTube</span>
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {settings.snsLinks.tiktok && (
                <a href={settings.snsLinks.tiktok} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="sr-only">TikTok</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.34-2.11.25-4.34 1.62-5.99 1.25-1.52 3.12-2.43 5.09-2.58.01 1.34-.01 2.68.01 4.02-1.02.13-2.03.62-2.73 1.38-.64.69-.99 1.65-.95 2.6.04 1.06.52 2.06 1.32 2.73.81.68 1.92.98 2.96.86 1.11-.13 2.11-.77 2.69-1.71.49-.8.74-1.75.73-2.69-.02-3.93-.01-7.86-.02-11.79z" />
                  </svg>
                </a>
              )}
              {settings.snsLinks.homepage && (
                <a href={settings.snsLinks.homepage} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="sr-only">Homepage</span>
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
            <div className="pt-4">
              <Link to="/inquiry" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-[#0F1A2B] bg-white hover:bg-gray-50 transition-colors">
                상담 문의하기
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 text-xs text-center text-white/50 relative">
          <p>&copy; {new Date().getFullYear()} HIGHCLASS Real Estate. All rights reserved.</p>
          <Link to="/admin" className="absolute right-0 top-8 text-white/20 hover:text-white/50 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
