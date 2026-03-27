import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, ArrowLeft, Building2, Maximize, Calendar, MapPin, Compass, Car, Info, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { listings, complexes } = useStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const listing = listings.find(l => l.id === id);

  const complexKey = Object.keys(complexes).find(k => complexes[k].name === listing?.complex);
  const complexData = complexKey ? complexes[complexKey] : null;
  const matchedFloorPlan = complexData?.floorPlans.find(plan => {
    const planSize = plan.name.replace(/[^0-9]/g, '');
    const listingSize = listing?.size.replace(/[^0-9]/g, '');
    if (!planSize && !listingSize) return plan.name === listing?.size;
    return planSize && listingSize && planSize === listingSize;
  });

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24">
        <h2 className="text-2xl font-serif font-bold text-[#0F1A2B] mb-4">매물을 찾을 수 없습니다.</h2>
        <Link to="/listings" className="text-gray-600 hover:text-[#0F1A2B] underline underline-offset-4">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pt-24 pb-32 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link to="/listings" className="inline-flex items-center text-gray-500 hover:text-[#0F1A2B] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-[#0F1A2B] text-white text-sm font-medium tracking-wider rounded-sm">
              {listing.complex}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-[#0F1A2B] text-sm font-medium tracking-wider border border-gray-200 rounded-sm">
              {listing.type}
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {listing.title}
          </h1>
          <div className="font-serif text-4xl md:text-5xl font-bold text-[#0F1A2B]">
            {listing.price}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-16 relative group">
          <div 
            id="image-gallery"
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {listing.images.map((img, idx) => (
              <div 
                key={idx} 
                className="w-full md:w-[85%] shrink-0 snap-center aspect-[21/9] overflow-hidden rounded-sm cursor-pointer relative" 
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img}
                  alt={`${listing.title} - ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="bg-white/90 text-[#0F1A2B] px-4 py-2 rounded-full font-medium text-sm flex items-center opacity-0 hover:opacity-100 transition-opacity shadow-sm">
                    <ZoomIn className="w-4 h-4 mr-2" />
                    확대
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={() => {
              const gallery = document.getElementById('image-gallery');
              if (gallery) gallery.scrollBy({ left: -gallery.clientWidth * 0.8, behavior: 'smooth' });
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white text-[#0F1A2B] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="이전 이미지"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => {
              const gallery = document.getElementById('image-gallery');
              if (gallery) gallery.scrollBy({ left: gallery.clientWidth * 0.8, behavior: 'smooth' });
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white text-[#0F1A2B] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="다음 이미지"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-sm border border-gray-100">
              <div>
                <div className="text-gray-500 text-sm mb-1 flex items-center"><Maximize className="w-4 h-4 mr-1" />평형</div>
                <div className="font-medium text-lg text-[#0F1A2B]">{listing.size}평형</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1 flex items-center"><Building2 className="w-4 h-4 mr-1" />층수</div>
                <div className="font-medium text-lg text-[#0F1A2B]">{listing.floor}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1 flex items-center"><MapPin className="w-4 h-4 mr-1" />동</div>
                <div className="font-medium text-lg text-[#0F1A2B]">{listing.dong}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1 flex items-center"><Compass className="w-4 h-4 mr-1" />방향</div>
                <div className="font-medium text-lg text-[#0F1A2B]">{listing.direction}</div>
              </div>
            </div>

            {/* Floor Plan (Auto-matched) */}
            {matchedFloorPlan && matchedFloorPlan.image && (
              <div className="mb-12">
                <h2 className="font-serif text-2xl font-bold text-[#0F1A2B] mb-6 border-b border-gray-200 pb-4">평면도 ({matchedFloorPlan.name})</h2>
                <div 
                  className="bg-gray-50 border border-gray-200 p-8 rounded-sm cursor-pointer hover:border-[#0F1A2B] transition-colors relative group flex justify-center"
                  onClick={() => setSelectedImage(matchedFloorPlan.image)}
                >
                  <img 
                    src={matchedFloorPlan.image} 
                    alt={`${matchedFloorPlan.name} 평면도`} 
                    className="max-h-96 object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 text-[#0F1A2B] px-4 py-2 rounded-full font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <ZoomIn className="w-4 h-4 mr-2" />
                      클릭하여 확대
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Table */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#0F1A2B] mb-6 border-b border-gray-200 pb-4">매물 상세 정보</h2>
              <div className="border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">소재지</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{listing.address}</dd>
                  </div>
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">공급/전용면적</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{listing.area}</dd>
                  </div>
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">해당층/총층</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{listing.floor}</dd>
                  </div>
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">방/욕실수</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{listing.roomsBaths}</dd>
                  </div>
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">방향</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{listing.direction}</dd>
                  </div>
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">주차대수</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{listing.parking}</dd>
                  </div>
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">사용승인일</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{listing.approvalDate}</dd>
                  </div>
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">주용도</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{listing.purpose}</dd>
                  </div>
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">입주가능일</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{listing.moveInDate}</dd>
                  </div>
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">관리비</dt>
                    <dd className="text-sm text-gray-900 col-span-2 leading-relaxed">
                      {listing.maintenanceFee}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Special Text for Galleria */}
            {listing.complex === '갤러리아포레' && (
              <div className="bg-[#0F1A2B]/5 border border-[#0F1A2B]/10 p-6 rounded-sm text-center">
                <p className="text-[#0F1A2B] font-medium text-lg">
                  갤러리아포레 단독입점 부동산, 하이클래스
                </p>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
              <h3 className="font-serif text-xl font-bold text-[#0F1A2B] mb-6">매물 문의하기</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                해당 매물에 대해 궁금하신 점이 있으신가요? 연락 주시면 친절하게 상담해 드립니다.
              </p>
              
              <div className="space-y-4">
                <a
                  href="tel:02-3443-8287"
                  className="flex items-center justify-center w-full py-4 bg-[#0F1A2B] text-white font-medium rounded-sm hover:bg-[#1a2b44] transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  02-3443-8287
                </a>
                <a
                  href="sms:010-4446-0308"
                  className="flex items-center justify-center w-full py-4 bg-white border border-[#0F1A2B] text-[#0F1A2B] font-medium rounded-sm hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  010-4446-0308
                </a>
                <Link
                  to="/inquiry"
                  className="flex items-center justify-center w-full py-4 bg-gray-100 text-gray-700 font-medium rounded-sm hover:bg-gray-200 transition-colors"
                >
                  온라인 문의하기
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-10 h-10" />
          </button>
          <img 
            src={selectedImage} 
            alt="Enlarged view" 
            className="max-w-full max-h-[90vh] object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
}
