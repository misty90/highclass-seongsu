import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Upload } from 'lucide-react';
import { resizeImage } from '../../utils/watermark';

export default function ManageComplexes() {
  const complexes = useStore((state) => state.complexes);
  const updateComplex = useStore((state) => state.updateComplex);
  const [selectedComplex, setSelectedComplex] = useState<string>('galleria');
  const [isUploading, setIsUploading] = useState(false);
  
  const data = complexes[selectedComplex];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateComplex(selectedComplex, { [name]: value });
  };

  const handleFloorPlanImageChange = async (index: number, value: string) => {
    const newFloorPlans = [...data.floorPlans];
    newFloorPlans[index].image = value;
    try {
      await updateComplex(selectedComplex, { floorPlans: newFloorPlans });
    } catch (error) {
      console.error('Failed to update complex:', error);
      alert('데이터베이스 저장에 실패했습니다. 이미지 용량이 너무 클 수 있습니다.');
    }
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const resizedDataUrl = await resizeImage(file, {
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 0.7,
          forceJpeg: true
        });
        await handleFloorPlanImageChange(index, resizedDataUrl);
      } catch (error) {
        console.error('Failed to resize image:', error);
        alert('이미지 업로드에 실패했습니다. 다른 이미지를 시도해주세요.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 md:pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-sans text-3xl font-bold text-[#0F1A2B]">단지 정보 관리</h1>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="mb-6 flex space-x-4">
          {Object.values(complexes).map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedComplex(c.id)}
              className={`px-4 py-2 rounded-md font-medium ${
                selectedComplex === c.id
                  ? 'bg-[#0F1A2B] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              히어로 타이틀
            </label>
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              단지 설명
            </label>
            <textarea
              name="desc"
              value={data.desc}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              히어로 이미지 URL
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="image"
                value={data.image}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                placeholder="https://..."
              />
              <label className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Upload className="w-4 h-4" />
                {isUploading ? '업로드 중...' : '파일 첨부'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        setIsUploading(true);
                        const resizedDataUrl = await resizeImage(file, {
                          maxWidth: 1600,
                          maxHeight: 1600,
                          quality: 0.8,
                          forceJpeg: true
                        });
                        await updateComplex(selectedComplex, { image: resizedDataUrl });
                      } catch (error) {
                        console.error('Failed to resize image:', error);
                        alert('이미지 업로드에 실패했습니다. 다른 이미지를 시도해주세요.');
                      } finally {
                        setIsUploading(false);
                      }
                    }
                  }}
                />
              </label>
            </div>
            {data.image && (
              <div className="mt-2 relative h-48 rounded-md overflow-hidden bg-gray-100">
                <img src={data.image} alt="Hero preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">평면도 이미지 관리</h3>
            <p className="text-sm text-gray-500 mb-4">이미지 URL을 입력하거나 파일을 직접 업로드하세요.</p>
            <div className="space-y-4">
              {data.floorPlans.map((plan, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-md">
                  <div className="w-24 font-medium text-gray-700">{plan.name}</div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={plan.image}
                        onChange={(e) => handleFloorPlanImageChange(idx, e.target.value)}
                        placeholder="이미지 URL 입력..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-[#0F1A2B] focus:border-[#0F1A2B] text-sm"
                      />
                      <label className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Upload className="w-4 h-4" />
                        {isUploading ? '업로드 중...' : '파일 첨부'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => handleFileUpload(idx, e)}
                        />
                      </label>
                    </div>
                    {plan.image && (
                      <div className="mt-2">
                        <img src={plan.image} alt={plan.name} className="h-20 object-contain rounded border bg-white" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
