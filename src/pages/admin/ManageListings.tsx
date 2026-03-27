import React, { useState, useRef, useMemo } from 'react';
import { useStore, Listing, Complex, TransactionType } from '../../store/useStore';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Check, Copy, Settings } from 'lucide-react';
import { addWatermark, resizeImage } from '../../utils/watermark';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableImageProps {
  id: string;
  img: string;
  idx: number;
  isThumbnail: boolean;
  onRemove: (idx: number) => void;
  onSetThumbnail: (img: string) => void;
}

const SortableImageItem: React.FC<SortableImageProps> = ({ id, img, idx, isThumbnail, onRemove, onSetThumbnail }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className="relative w-48 h-48 shrink-0 snap-start group rounded-sm overflow-hidden border border-gray-200 cursor-move bg-white touch-none"
    >
      <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover pointer-events-none" />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <X className="w-4 h-4" />
      </button>
      {isThumbnail && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-[#0F1A2B] text-white text-xs font-medium rounded-sm z-10">
          대표
        </div>
      )}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onSetThumbnail(img); }}
        className="absolute bottom-0 left-0 right-0 py-2 bg-black/50 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
      >
        대표 이미지로 설정
      </button>
    </div>
  );
}

const initialFormState: Omit<Listing, 'id' | 'createdAt'> = {
  title: '',
  complex: '갤러리아포레',
  type: '매매',
  size: '',
  price: '',
  address: '',
  approvalDate: '',
  purpose: '공동주택',
  parking: '',
  floor: '',
  dong: '',
  area: '',
  roomsBaths: '',
  maintenanceFee: '전기 도시가스사용량에 따라 개별부과, 중개의뢰인 관리비 미고지-비목별 세부내역 확인불가',
  direction: '',
  moveInDate: '협의 가능',
  images: [],
  thumbnail: '',
  isPublic: true,
  isRecommended: false,
};

export default function ManageListings() {
  const { listings, addListing, updateListing, deleteListing } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [imgInput, setImgInput] = useState('');
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [watermarkText, setWatermarkText] = useState('HIGHCLASS');
  const [saveOriginal, setSaveOriginal] = useState(false);
  const [showWatermarkSettings, setShowWatermarkSettings] = useState(false);

  // Stable IDs for dnd-kit to avoid using huge base64 strings as DOM IDs
  const imageIdMap = useRef<Map<string, string>>(new Map());
  
  const sortableItems = useMemo(() => {
    return formData.images.map(img => {
      if (!imageIdMap.current.has(img)) {
        imageIdMap.current.set(img, Math.random().toString(36).substring(2, 9));
      }
      return imageIdMap.current.get(img)!;
    });
  }, [formData.images]);

  const handleAddImage = () => {
    const trimmedInput = imgInput.trim();
    if (trimmedInput) {
      if (formData.images.includes(trimmedInput)) {
        alert('이미 등록된 이미지입니다.');
        return;
      }
      setFormData({
        ...formData,
        images: [...formData.images, trimmedInput],
        thumbnail: formData.thumbnail || trimmedInput
      });
      setImgInput('');
    }
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const newImages: string[] = [];

    for (const file of imageFiles) {
      if (watermarkEnabled) {
        try {
          const watermarkedDataUrl = await addWatermark(file, watermarkText);
          newImages.push(watermarkedDataUrl);
          
          if (saveOriginal) {
            try {
              const originalDataUrl = await resizeImage(file);
              newImages.push(originalDataUrl);
            } catch (e) {
              console.error('Failed to resize original:', e);
            }
          }
        } catch (error) {
          console.error('Failed to add watermark:', error);
          // Fallback to original (resized)
          try {
            const originalDataUrl = await resizeImage(file);
            newImages.push(originalDataUrl);
          } catch (e) {
            console.error('Failed to resize fallback:', e);
          }
        }
      } else {
        try {
          const originalDataUrl = await resizeImage(file);
          newImages.push(originalDataUrl);
        } catch (e) {
          console.error('Failed to resize image:', e);
        }
      }
    }

    setFormData(prev => {
      const uniqueNewImages = newImages.filter(img => !prev.images.includes(img));
      const updatedImages = [...prev.images, ...uniqueNewImages];
      return {
        ...prev,
        images: updatedImages,
        thumbnail: prev.thumbnail || updatedImages[0] || ''
      };
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages,
      thumbnail: newImages.length > 0 ? newImages[0] : ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentId) {
      updateListing(currentId, formData);
    } else {
      addListing(formData);
    }
    setIsEditing(false);
    setCurrentId(null);
    setFormData(initialFormState);
  };

  const handleEditClick = (listing: Listing) => {
    setFormData(listing);
    setCurrentId(listing.id);
    setIsEditing(true);
  };

  const handleDuplicateClick = (listing: Listing) => {
    const { id, createdAt, ...rest } = listing;
    addListing({
      ...rest,
      title: `${rest.title} (복제본)`
    });
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteListing(id);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFormData((prev) => {
        const oldIndex = sortableItems.indexOf(active.id as string);
        const newIndex = sortableItems.indexOf(over.id as string);
        
        return {
          ...prev,
          images: arrayMove(prev.images, oldIndex, newIndex),
        };
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 md:pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#0F1A2B]">매물 관리</h1>
          {!isEditing && (
            <button
              onClick={() => {
                setFormData(initialFormState);
                setCurrentId(null);
                setIsEditing(true);
              }}
              className="flex items-center px-6 py-3 bg-[#0F1A2B] text-white font-medium rounded-sm hover:bg-[#1a2b44] transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              새 매물 등록
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h2 className="font-serif text-2xl font-bold text-[#0F1A2B]">
                {currentId ? '매물 수정' : '새 매물 등록'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">매물 제목</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">단지</label>
                  <select
                    value={formData.complex}
                    onChange={(e) => setFormData({...formData, complex: e.target.value as Complex})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  >
                    <option value="갤러리아포레">갤러리아포레</option>
                    <option value="아크로서울포레스트">아크로서울포레스트</option>
                    <option value="트리마제">트리마제</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">거래 유형</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as TransactionType})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  >
                    <option value="매매">매매</option>
                    <option value="전세">전세</option>
                    <option value="월세">월세</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">가격</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                    placeholder="예: 120억, 5억/1500만"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">평형</label>
                  <input
                    type="text"
                    required
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                    placeholder="예: 100, 77, 56"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">소재지 (주소)</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">해당동</label>
                  <input
                    type="text"
                    value={formData.dong}
                    onChange={(e) => setFormData({...formData, dong: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">해당층/총층</label>
                  <input
                    type="text"
                    value={formData.floor}
                    onChange={(e) => setFormData({...formData, floor: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">공급/전용면적</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">방/욕실수</label>
                  <input
                    type="text"
                    value={formData.roomsBaths}
                    onChange={(e) => setFormData({...formData, roomsBaths: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">방향</label>
                  <input
                    type="text"
                    value={formData.direction}
                    onChange={(e) => setFormData({...formData, direction: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">주차대수</label>
                  <input
                    type="text"
                    value={formData.parking}
                    onChange={(e) => setFormData({...formData, parking: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">사용승인일자</label>
                  <input
                    type="text"
                    value={formData.approvalDate}
                    onChange={(e) => setFormData({...formData, approvalDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">주용도</label>
                  <input
                    type="text"
                    value={formData.purpose}
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">입주가능일</label>
                  <input
                    type="text"
                    value={formData.moveInDate}
                    onChange={(e) => setFormData({...formData, moveInDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                  />
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">관리비</label>
                  <textarea
                    rows={2}
                    value={formData.maintenanceFee}
                    onChange={(e) => setFormData({...formData, maintenanceFee: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B] resize-none"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">이미지 관리 (URL 입력 또는 파일 드래그앤드랍)</label>
                  <button
                    type="button"
                    onClick={() => setShowWatermarkSettings(!showWatermarkSettings)}
                    className="flex items-center text-sm text-gray-500 hover:text-[#0F1A2B] transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    워터마크 설정
                  </button>
                </div>

                {showWatermarkSettings && (
                  <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={watermarkEnabled}
                          onChange={(e) => setWatermarkEnabled(e.target.checked)}
                          className="w-4 h-4 text-[#0F1A2B] border-gray-300 rounded focus:ring-[#0F1A2B]"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-900">워터마크 자동 삽입</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={saveOriginal}
                          onChange={(e) => setSaveOriginal(e.target.checked)}
                          disabled={!watermarkEnabled}
                          className="w-4 h-4 text-[#0F1A2B] border-gray-300 rounded focus:ring-[#0F1A2B] disabled:opacity-50"
                        />
                        <span className={`ml-2 text-sm font-medium ${watermarkEnabled ? 'text-gray-900' : 'text-gray-400'}`}>
                          원본 이미지도 함께 저장
                        </span>
                      </label>
                    </div>
                    {watermarkEnabled && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">워터마크 텍스트</label>
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                          placeholder="HIGHCLASS"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  <input
                    type="url"
                    value={imgInput}
                    onChange={(e) => setImgInput(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-sm focus:ring-[#0F1A2B] focus:border-[#0F1A2B]"
                    placeholder="이미지 URL을 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-sm hover:bg-gray-200 transition-colors"
                  >
                    추가
                  </button>
                </div>

                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files) as File[];
                    handleFiles(files);
                  }}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input 
                    id="file-upload"
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFiles(Array.from(e.target.files) as File[]);
                      }
                    }}
                  />
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">
                    이미지를 이곳으로 드래그하거나 클릭하여 업로드하세요. (여러 장 선택 가능)
                  </p>
                </div>

                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={sortableItems}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div 
                      className="flex overflow-x-auto gap-4 pb-4 snap-x [&::-webkit-scrollbar]:hidden"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {formData.images.map((img, idx) => {
                        const id = imageIdMap.current.get(img)!;
                        return (
                          <SortableImageItem
                            key={id}
                            id={id}
                            img={img}
                            idx={idx}
                            isThumbnail={formData.thumbnail === img}
                            onRemove={handleRemoveImage}
                            onSetThumbnail={(newThumb) => setFormData({...formData, thumbnail: newThumb})}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {/* Settings */}
              <div className="pt-6 border-t border-gray-100 flex gap-8">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                    className="w-5 h-5 text-[#0F1A2B] border-gray-300 rounded focus:ring-[#0F1A2B]"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">공개 매물</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRecommended}
                    onChange={(e) => setFormData({...formData, isRecommended: e.target.checked})}
                    className="w-5 h-5 text-[#0F1A2B] border-gray-300 rounded focus:ring-[#0F1A2B]"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">추천 매물 (메인 노출)</span>
                </label>
              </div>

              <div className="pt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-sm hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#0F1A2B] text-white font-medium rounded-sm hover:bg-[#1a2b44] transition-colors"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">상태</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">단지/유형</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">제목</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">가격</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            listing.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {listing.isPublic ? '공개' : '비공개'}
                          </span>
                          {listing.isRecommended && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              추천
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{listing.complex}</div>
                        <div className="text-sm text-gray-500">{listing.type} · {listing.size}평형</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium line-clamp-1">{listing.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(listing.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-[#0F1A2B]">{listing.price}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDuplicateClick(listing)}
                          className="text-green-600 hover:text-green-900 p-2"
                          title="복제"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(listing)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 ml-2"
                          title="수정"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(listing.id)}
                          className="text-red-600 hover:text-red-900 p-2 ml-2"
                          title="삭제"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {listings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        등록된 매물이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
