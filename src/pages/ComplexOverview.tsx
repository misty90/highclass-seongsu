import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { X, ZoomIn } from 'lucide-react';

export default function ComplexOverview() {
  const { id } = useParams<{ id: string }>();
  const complexes = useStore((state) => state.complexes);
  const data = complexes[id as keyof typeof complexes];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!data) return <div className="pt-32 text-center">단지 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#0F1A2B]/60" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-sans text-4xl md:text-6xl font-bold mb-4">{data.name}</h1>
            <p className="text-xl md:text-2xl font-light text-white/90">{data.title}</p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg leading-relaxed text-gray-600">
            {data.desc}
          </p>
          {id === 'galleria' && (
            <p className="mt-8 text-[#0F1A2B] font-medium text-lg border border-[#0F1A2B] inline-block px-6 py-3">
              갤러리아포레 단독입점 부동산, 하이클래스
            </p>
          )}
        </div>
      </section>

      {/* Details */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Floor Plans */}
            <div>
              <h2 className="font-sans text-2xl font-bold text-[#0F1A2B] mb-8 border-b border-gray-200 pb-4">평면도 구성</h2>
              <div className="grid grid-cols-2 gap-4">
                {data.floorPlans.map((plan, idx) => (
                  <div 
                    key={idx} 
                    className={`bg-white p-4 text-center border border-gray-100 shadow-sm text-gray-700 font-medium flex flex-col items-center justify-center min-h-[100px] relative group ${plan.image ? 'cursor-pointer hover:border-[#0F1A2B] transition-colors' : ''}`}
                    onClick={() => plan.image && setSelectedImage(plan.image)}
                  >
                    {plan.image ? (
                      <>
                        <img src={plan.image} alt={plan.name} className="w-full h-auto mb-2 object-contain max-h-32 mix-blend-multiply" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                          <div className="bg-white/90 text-[#0F1A2B] px-3 py-1.5 rounded-full font-medium text-xs flex items-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                            <ZoomIn className="w-3 h-3 mr-1" />
                            확대
                          </div>
                        </div>
                      </>
                    ) : null}
                    <span className="relative z-10">{plan.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Community */}
            <div>
              <h2 className="font-sans text-2xl font-bold text-[#0F1A2B] mb-8 border-b border-gray-200 pb-4">커뮤니티 시설</h2>
              <ul className="space-y-4">
                {data.community.map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-[#0F1A2B] rounded-full mr-4"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

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
