import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Building2, Settings, FileText, Image as ImageIcon, Upload } from 'lucide-react';

export default function Dashboard() {
  const { listings, settings, updateSettings, complexes, updateComplex } = useStore();
  const [seoForm, setSeoForm] = useState({
    ...settings,
    heroImage: settings.heroImage || ''
  });

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(seoForm);
    alert('설정이 저장되었습니다.');
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSeoForm({ ...seoForm, heroImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplexImageUpload = (complexId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateComplex(complexId, { image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 md:pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-sans text-3xl font-bold text-[#0F1A2B]">관리자 대시보드</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center">
            <div className="p-4 bg-blue-50 rounded-full mr-6">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">총 등록 매물</p>
              <p className="text-3xl font-bold text-gray-900">{listings.length}건</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center">
            <div className="p-4 bg-green-50 rounded-full mr-6">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">공개 매물</p>
              <p className="text-3xl font-bold text-gray-900">{listings.filter(l => l.isPublic).length}건</p>
            </div>
          </div>

          <Link
            to="/admin/listings"
            className="bg-[#0F1A2B] text-white p-6 rounded-sm shadow-sm hover:bg-[#1a2b44] transition-colors flex flex-col items-center justify-center group"
          >
            <Building2 className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-lg">매물 관리 바로가기</span>
          </Link>

          <Link
            to="/admin/complexes"
            className="bg-[#0F1A2B] text-white p-6 rounded-sm shadow-sm hover:bg-[#1a2b44] transition-colors flex flex-col items-center justify-center group"
          >
            <ImageIcon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-lg">단지 정보 관리</span>
          </Link>
        </div>

        {/* SEO Settings */}
        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
          <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
            <Settings className="w-6 h-6 text-[#0F1A2B] mr-3" />
            <h2 className="font-sans text-2xl font-bold text-[#0F1A2B]">사이트 설정 (SEO & SNS)</h2>
          </div>

          <form onSubmit={handleSaveSeo} className="space-y-8 max-w-3xl">
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">메인 페이지 설정</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">메인 히어로 이미지</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors relative">
                  <div className="space-y-1 text-center">
                    {seoForm.heroImage ? (
                      <div className="mb-4">
                        <img src={seoForm.heroImage} alt="Hero Preview" className="max-h-48 mx-auto rounded-sm object-cover" />
                      </div>
                    ) : (
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="hero-image-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-[#0F1A2B] hover:text-[#1a2b44] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#0F1A2B]"
                      >
                        <span>이미지 업로드</span>
                        <input id="hero-image-upload" name="hero-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleHeroImageUpload} />
                      </label>
                      <p className="pl-1">또는 드래그 앤 드롭</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/*" 
                    onChange={handleHeroImageUpload} 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-4">프리미엄 단지 썸네일 (PREMIUM COMPLEX)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {Object.values(complexes).map((complex) => (
                    <div key={complex.id} className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">{complex.name}</p>
                      <div className="relative aspect-[3/4] rounded-md overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors group">
                        {complex.image ? (
                          <img src={complex.image} alt={complex.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-100 transition-colors">
                            이미지 변경
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={(e) => handleComplexImageUpload(complex.id, e)} 
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">검색엔진 최적화 (SEO)</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사이트 제목 (Title)</label>
                <input
                  type="text"
                  value={seoForm.seoTitle}
                  onChange={(e) => setSeoForm({...seoForm, seoTitle: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                />
                <p className="mt-2 text-xs text-gray-500">브라우저 탭과 검색 결과에 표시되는 제목입니다.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사이트 설명 (Description)</label>
                <textarea
                  rows={3}
                  value={seoForm.seoDescription}
                  onChange={(e) => setSeoForm({...seoForm, seoDescription: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B] resize-none"
                />
                <p className="mt-2 text-xs text-gray-500">검색 결과에서 제목 아래에 표시되는 설명 문구입니다.</p>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">SNS 링크 설정</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">인스타그램 URL</label>
                <input
                  type="url"
                  value={seoForm.snsLinks.instagram}
                  onChange={(e) => setSeoForm({
                    ...seoForm, 
                    snsLinks: { ...seoForm.snsLinks, instagram: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">블로그 URL</label>
                <input
                  type="url"
                  value={seoForm.snsLinks.blog}
                  onChange={(e) => setSeoForm({
                    ...seoForm, 
                    snsLinks: { ...seoForm.snsLinks, blog: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  placeholder="https://blog.naver.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">유튜브 URL</label>
                <input
                  type="url"
                  value={seoForm.snsLinks.youtube}
                  onChange={(e) => setSeoForm({
                    ...seoForm, 
                    snsLinks: { ...seoForm.snsLinks, youtube: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">틱톡 URL</label>
                <input
                  type="url"
                  value={seoForm.snsLinks.tiktok}
                  onChange={(e) => setSeoForm({
                    ...seoForm, 
                    snsLinks: { ...seoForm.snsLinks, tiktok: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  placeholder="https://tiktok.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">홈페이지 URL</label>
                <input
                  type="url"
                  value={seoForm.snsLinks.homepage}
                  onChange={(e) => setSeoForm({
                    ...seoForm, 
                    snsLinks: { ...seoForm.snsLinks, homepage: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  placeholder="https://highclasskorea.com"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="px-8 py-3 bg-[#0F1A2B] text-white font-medium rounded-sm hover:bg-[#1a2b44] transition-colors"
              >
                설정 저장
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
