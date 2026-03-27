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

  // Helper to safely convert base64 to File
  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleFloorPlanImageChange = async (index: number, value: string) => {
    try {
      // Create a copy of the floor plans
      const newFloorPlans = [...data.floorPlans];
      newFloorPlans[index].image = value;
      
      // Auto-compress any existing large images to prevent 1MB limit
      let needsOptimization = false;
      for (let i = 0; i < newFloorPlans.length; i++) {
        const plan = newFloorPlans[i];
        // If it's a base64 image and it's larger than ~60KB (approx 80,000 chars in base64)
        // Trimage has 11 floor plans, so 11 * 80KB = 880KB, keeping it safely under 1MB
        if (plan.image && plan.image.startsWith('data:image') && plan.image.length > 80000) {
          try {
            const file = dataURLtoFile(plan.image, 'image.jpg');
            
            const resizedDataUrl = await resizeImage(file, {
              maxWidth: 500,
              maxHeight: 500,
              quality: 0.4,
              forceJpeg: true
            });
            
            if (resizedDataUrl.length < plan.image.length) {
              newFloorPlans[i].image = resizedDataUrl;
              needsOptimization = true;
            }
          } catch (e) {
            console.error('Failed to auto-compress image at index', i, e);
          }
        }
      }

      await updateComplex(selectedComplex, { floorPlans: newFloorPlans });
      
      if (needsOptimization) {
        console.log('Automatically optimized existing large images to save space.');
      }
    } catch (error) {
      console.error('Failed to update complex:', error);
      alert('데이터베이스 저장에 실패했습니다. 이미지 용량이 너무 클 수 있습니다. 기존 이미지 일괄 압축 버튼을 먼저 눌러주세요.');
    }
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        // Extremely aggressive compression for floor plans to avoid Firestore 1MB document limit
        // Trimage has 11 floor plans + 1 hero image, all stored in one document
        const resizedDataUrl = await resizeImage(file, {
          maxWidth: 500,
          maxHeight: 500,
          quality: 0.4,
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
                        // Compress hero image to avoid 1MB document limit
                        const resizedDataUrl = await resizeImage(file, {
                          maxWidth: 1200,
                          maxHeight: 1200,
                          quality: 0.7,
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
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">평면도 이미지 관리</h3>
                <p className="text-sm text-gray-500 mt-1">이미지 URL을 입력하거나 파일을 직접 업로드하세요.</p>
              </div>
              <button
                onClick={async () => {
                  if (!confirm('기존에 업로드된 평면도 이미지들의 용량을 일괄적으로 줄이시겠습니까? (저장 오류 해결용)')) return;
                  
                  setIsUploading(true);
                  try {
                    const newFloorPlans = [...data.floorPlans];
                    let optimizedCount = 0;
                    
                    for (let i = 0; i < newFloorPlans.length; i++) {
                      const plan = newFloorPlans[i];
                      if (plan.image && plan.image.startsWith('data:image') && plan.image.length > 80000) {
                        // Convert base64 back to file to resize
                        const file = dataURLtoFile(plan.image, 'image.jpg');
                        
                        const resizedDataUrl = await resizeImage(file, {
                          maxWidth: 500,
                          maxHeight: 500,
                          quality: 0.4,
                          forceJpeg: true
                        });
                        
                        if (resizedDataUrl.length < plan.image.length) {
                          newFloorPlans[i].image = resizedDataUrl;
                          optimizedCount++;
                        }
                      }
                    }
                    
                    if (optimizedCount > 0) {
                      await updateComplex(selectedComplex, { floorPlans: newFloorPlans });
                      alert(`${optimizedCount}개의 이미지가 성공적으로 압축되었습니다. 이제 나머지 이미지를 업로드해보세요.`);
                    } else {
                      alert('압축할 이미지가 없거나 이미 최적화되어 있습니다.');
                    }
                  } catch (error) {
                    console.error('Failed to optimize images:', error);
                    alert('이미지 압축 중 오류가 발생했습니다.');
                  } finally {
                    setIsUploading(false);
                  }
                }}
                disabled={isUploading}
                className="px-4 py-2 bg-[#0F1A2B] text-white rounded-md hover:bg-[#1a2b44] text-sm font-medium disabled:opacity-50"
              >
                {isUploading ? '압축 중...' : '기존 이미지 일괄 압축'}
              </button>
            </div>
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
                      {plan.image && (
                        <button
                          onClick={() => handleFloorPlanImageChange(idx, '')}
                          className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 text-sm font-medium"
                        >
                          삭제
                        </button>
                      )}
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
