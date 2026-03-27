import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, MapPin, Maximize } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Home() {
  const { listings, settings, complexes: storeComplexes } = useStore();
  const recommendedListings = listings.filter(l => l.isPublic && l.isRecommended).slice(0, 6);

  const complexes = [
    {
      id: 'galleria',
      name: storeComplexes.galleria.name,
      image: storeComplexes.galleria.image,
      desc: storeComplexes.galleria.title,
      path: '/complex/galleria'
    },
    {
      id: 'acro',
      name: storeComplexes.acro.name,
      image: storeComplexes.acro.image,
      desc: storeComplexes.acro.title,
      path: '/complex/acro'
    },
    {
      id: 'trimage',
      name: storeComplexes.trimage.name,
      image: storeComplexes.trimage.image,
      desc: storeComplexes.trimage.title,
      path: '/complex/trimage'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {settings.heroImage && (
            <img
              src={settings.heroImage}
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-[#0F1A2B]/40 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              서울숲 하이엔드<br />주거의 기준
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-2 font-light tracking-wide">
              갤러리아포레 단독입점 부동산, 하이클래스
            </p>
            <p className="text-base md:text-lg text-white/80 mb-10 font-light">
              엄선된 프리미엄 매물만 제공합니다
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/listings"
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#0F1A2B] font-medium hover:bg-gray-100 transition-colors rounded-sm"
              >
                매물보기
              </Link>
              <Link
                to="/inquiry"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white text-white font-medium hover:bg-white/10 transition-colors rounded-sm"
              >
                문의하기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Complex Cards Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0F1A2B] mb-4">PREMIUM COMPLEX</h2>
            <div className="w-12 h-0.5 bg-[#0F1A2B] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {complexes.map((complex, index) => (
              <motion.div
                key={complex.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Link to={complex.path} className="group block">
                  <div className="relative overflow-hidden aspect-[3/4] mb-6">
                    <img
                      src={complex.image}
                      alt={complex.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">{complex.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{complex.desc}</p>
                  <span className="inline-flex items-center text-[#0F1A2B] font-medium text-sm group-hover:underline underline-offset-4">
                    자세히 보기 <ArrowRight className="ml-1 w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Listings */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0F1A2B] mb-4">RECOMMENDED</h2>
              <div className="w-12 h-0.5 bg-[#0F1A2B]"></div>
            </div>
            <Link to="/listings" className="hidden sm:inline-flex items-center text-gray-600 hover:text-[#0F1A2B] transition-colors">
              전체보기 <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedListings.map((listing) => (
              <Link key={listing.id} to={`/listings/${listing.id}`} className="group bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={listing.thumbnail || listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-[#0F1A2B] text-white text-xs font-medium tracking-wider">
                      {listing.complex}
                    </span>
                    <span className="px-3 py-1 bg-white text-[#0F1A2B] text-xs font-medium tracking-wider border border-gray-200">
                      {listing.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-medium text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-[#0F1A2B] transition-colors">
                    {listing.title}
                  </h3>
                  <div className="font-serif text-2xl font-bold text-[#0F1A2B] mb-4">
                    {listing.price}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Maximize className="w-4 h-4 mr-1.5" />
                      {listing.size}평형
                    </div>
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1.5" />
                      {listing.floor}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/listings" className="inline-flex items-center text-[#0F1A2B] font-medium">
              전체보기 <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Inquiry Banner */}
      <section className="py-24 bg-[#0F1A2B] text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            비공개 매물은 별도 문의 바랍니다
          </h2>
          <p className="text-white/70 mb-10 font-light text-lg">
            온라인에 공개되지 않은 최상급 보안 세대 매물을 다수 보유하고 있습니다.
          </p>
          <Link
            to="/inquiry"
            className="inline-block px-10 py-4 bg-white text-[#0F1A2B] font-medium hover:bg-gray-100 transition-colors rounded-sm"
          >
            상담 예약하기
          </Link>
        </div>
      </section>
    </div>
  );
}
