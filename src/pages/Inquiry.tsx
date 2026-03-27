import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Inquiry() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    complex: '갤러리아포레',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/mzdkbjwo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', phone: '', complex: '갤러리아포레', message: '' });
        
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setIsSubmitting(false);
        alert('전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      setIsSubmitting(false);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="w-full pt-24 pb-32 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl font-bold text-[#0F1A2B] mb-4">CONTACT US</h1>
            <div className="w-12 h-0.5 bg-[#0F1A2B] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 font-light">
              하이클래스 부동산에 문의주시면 신속하고 친절하게 안내해 드리겠습니다.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-12"
          >
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#0F1A2B] mb-8">오시는 길</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <MapPin className="w-6 h-6 text-[#0F1A2B]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">주소</h3>
                    <p className="mt-1 text-gray-600">서울시 성동구 서울숲2길 32-14, 110호<br />(갤러리아포레 상가)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Phone className="w-6 h-6 text-[#0F1A2B]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">연락처</h3>
                    <p className="mt-1 text-gray-600">
                      대표전화: 02-3443-8287<br />
                      휴대전화: 010-4446-0308
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="w-6 h-6 text-[#0F1A2B]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">영업시간</h3>
                    <p className="mt-1 text-gray-600">
                      평일: 09:30 - 18:30<br />
                      주말 및 공휴일: 사전 예약제 운영
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Link */}
            <div 
              className="aspect-video bg-gray-50 rounded-sm overflow-hidden relative border border-gray-200 group cursor-pointer hover:shadow-md transition-all"
              onClick={() => window.open('https://map.naver.com/p/search/서울시%20성동구%20서울숲2길%2032-14', '_blank')}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-[#00C73C]" />
                </div>
                <span className="font-medium text-gray-900 mb-2">서울시 성동구 서울숲2길 32-14, 110호</span>
                <span className="text-sm text-[#00C73C] font-medium group-hover:underline">네이버 지도에서 길찾기 &rarr;</span>
              </div>
            </div>
          </motion.div>

          {/* Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white p-8 md:p-10 rounded-sm shadow-xl border border-gray-100">
              <h2 className="font-serif text-2xl font-bold text-[#0F1A2B] mb-8">온라인 문의</h2>
              
              {isSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-sm p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">문의가 접수되었습니다.</h3>
                  <p className="text-sm">빠른 시일 내에 연락 드리겠습니다. 감사합니다.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B] transition-colors"
                      placeholder="홍길동"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B] transition-colors"
                      placeholder="010-0000-0000"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="complex" className="block text-sm font-medium text-gray-700 mb-2">문의단지</label>
                    <select
                      id="complex"
                      required
                      value={formData.complex}
                      onChange={(e) => setFormData({...formData, complex: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B] transition-colors bg-white"
                    >
                      <option value="갤러리아포레">갤러리아포레</option>
                      <option value="트리마제">트리마제</option>
                      <option value="아크로서울포레스트">아크로서울포레스트</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">문의내용</label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B] transition-colors resize-none"
                      placeholder="관심 단지, 평형, 입주 희망일 등을 남겨주시면 더 정확한 상담이 가능합니다."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 text-white font-medium rounded-sm transition-colors ${
                      isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0F1A2B] hover:bg-[#1a2b44]'
                    }`}
                  >
                    {isSubmitting ? '전송 중...' : '문의하기'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
