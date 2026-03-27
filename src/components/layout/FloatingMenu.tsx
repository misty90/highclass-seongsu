import { MessageCircle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingMenu() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href="sms:010-4446-0308"
        className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0F1A2B] hover:bg-gray-50 transition-all hover:scale-110 border border-gray-100 group relative"
        aria-label="문자 문의"
      >
        <MessageCircle size={24} />
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          문자 문의
        </span>
      </a>
      <a
        href="tel:02-3443-8287"
        className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0F1A2B] hover:bg-gray-50 transition-all hover:scale-110 border border-gray-100 group relative"
        aria-label="전화 문의"
      >
        <Phone size={24} />
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          전화 문의
        </span>
      </a>
      <Link
        to="/inquiry"
        className="w-14 h-14 bg-[#0F1A2B] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#1a2b44] transition-all hover:scale-110 group relative"
        aria-label="온라인 문의"
      >
        <Mail size={24} />
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          온라인 문의
        </span>
      </Link>
    </div>
  );
}
