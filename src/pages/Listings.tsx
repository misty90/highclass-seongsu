import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Building2, Maximize, Filter, ArrowUp, Loader2 } from 'lucide-react';
import { useStore, Complex, TransactionType } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 9;

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { listings, isInitialized } = useStore();
  
  const initialComplex = searchParams.get('complex') as Complex | null;
  const initialType = searchParams.get('type') as TransactionType | null;

  const [filterComplex, setFilterComplex] = useState<Complex | '전체'>(initialComplex || '전체');
  const [filterType, setFilterType] = useState<TransactionType | '전체'>(initialType || '전체');

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      if (!l.isPublic) return false;
      if (filterComplex !== '전체' && l.complex !== filterComplex) return false;
      if (filterType !== '전체' && l.type !== filterType) return false;
      return true;
    });
  }, [listings, filterComplex, filterType]);

  const visibleListings = filteredListings.slice(0, visibleCount);
  const hasMore = visibleCount < filteredListings.length;

  const handleComplexChange = (c: Complex | '전체') => {
    setFilterComplex(c);
    setVisibleCount(ITEMS_PER_PAGE);
    if (c === '전체') {
      searchParams.delete('complex');
    } else {
      searchParams.set('complex', c);
    }
    setSearchParams(searchParams);
  };

  const handleTypeChange = (t: TransactionType | '전체') => {
    setFilterType(t);
    setVisibleCount(ITEMS_PER_PAGE);
    if (t === '전체') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', t);
    }
    setSearchParams(searchParams);
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="w-full pt-24 pb-32 bg-gray-50 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold text-[#0F1A2B] mb-4">PREMIUM LISTINGS</h1>
          <div className="w-12 h-0.5 bg-[#0F1A2B] mx-auto"></div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 mb-12">
          <div className="flex items-center gap-2 mb-6 text-[#0F1A2B] font-medium border-b border-gray-100 pb-4">
            <Filter size={20} />
            <span>상세 검색</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">단지 선택</label>
              <div className="flex flex-wrap gap-2">
                {['전체', '갤러리아포레', '아크로서울포레스트', '트리마제'].map((c) => (
                  <button
                    key={c}
                    onClick={() => handleComplexChange(c as any)}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${
                      filterComplex === c
                        ? 'bg-[#0F1A2B] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">거래 유형</label>
              <div className="flex flex-wrap gap-2">
                {['전체', '매매', '전세', '월세'].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTypeChange(t as any)}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${
                      filterType === t
                        ? 'bg-[#0F1A2B] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 text-gray-600 font-medium">
          총 <span className="text-[#0F1A2B] font-bold">{filteredListings.length}</span>건의 매물이 있습니다.
        </div>

        {!isInitialized ? (
          <div className="text-center py-32 bg-white border border-gray-100 rounded-sm flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#0F1A2B] animate-spin mb-4" />
            <p className="text-gray-500 text-lg">매물 정보를 불러오는 중입니다...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-32 bg-white border border-gray-100 rounded-sm">
            <p className="text-gray-500 text-lg">조건에 맞는 매물이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {visibleListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: (index % ITEMS_PER_PAGE) * 0.05 }}
                  >
                    <Link to={`/listings/${listing.id}`} className="group flex flex-col h-full bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <img
                          src={listing.thumbnail || listing.images[0]}
                          alt={listing.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-3 py-1 bg-[#0F1A2B] text-white text-xs font-medium tracking-wider shadow-sm">
                            {listing.complex}
                          </span>
                          <span className="px-3 py-1 bg-white text-[#0F1A2B] text-xs font-medium tracking-wider border border-gray-200 shadow-sm">
                            {listing.type}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-medium text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-[#0F1A2B] transition-colors">
                          {listing.title}
                        </h3>
                        <div className="font-serif text-2xl font-bold text-[#0F1A2B] mb-4 mt-auto">
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
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Skeleton UI for loading state */}
              {isLoading && Array.from({ length: Math.min(ITEMS_PER_PAGE, filteredListings.length - visibleCount) }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="flex flex-col h-full bg-white border border-gray-100 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200"></div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-6 mt-auto"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-16 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-8 py-4 border border-[#0F1A2B] text-[#0F1A2B] bg-transparent hover:bg-[#0F1A2B] hover:text-white transition-colors rounded-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      로딩 중...
                    </>
                  ) : (
                    '매물 더보기'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-[#0F1A2B] text-white rounded-full shadow-lg hover:bg-[#1a2b44] transition-colors z-50"
            aria-label="상단으로 이동"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
