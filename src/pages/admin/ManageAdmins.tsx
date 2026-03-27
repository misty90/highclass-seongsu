import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Users, Trash2, Plus, Mail } from 'lucide-react';

export default function ManageAdmins() {
  const { admins, addAdmin, removeAdmin } = useStore();
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    if (admins.includes(newEmail)) {
      setError('이미 등록된 관리자입니다.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await addAdmin(newEmail);
      setNewEmail('');
    } catch (err) {
      console.error(err);
      setError('관리자 추가 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (window.confirm(`${email} 계정을 관리자에서 삭제하시겠습니까?`)) {
      try {
        await removeAdmin(email);
      } catch (err) {
        console.error(err);
        alert('관리자 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1A2B] flex items-center">
            <Users className="w-6 h-6 mr-2" />
            관리자 계정 관리
          </h1>
          <p className="text-gray-500 mt-1">다른 직원의 구글 이메일을 추가하여 관리자 권한을 부여할 수 있습니다.</p>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">새 관리자 추가</h2>
        <form onSubmit={handleAddAdmin} className="flex gap-4 items-start">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="직원의 구글 이메일 주소 입력 (예: employee@gmail.com)"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#0F1A2B] focus:border-[#0F1A2B] sm:text-sm"
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading || !newEmail}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0F1A2B] hover:bg-[#1a2b44] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F1A2B] disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isLoading ? '추가 중...' : '추가하기'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">등록된 관리자 목록</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          <li className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#0F1A2B] text-white flex items-center justify-center font-bold text-sm mr-4">
                M
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">soinvu.com@gmail.com</p>
                <p className="text-xs text-gray-500">마스터 관리자 (삭제 불가)</p>
              </div>
            </div>
          </li>
          
          {admins.map((email) => (
            <li key={email} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm mr-4">
                  {email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{email}</p>
                  <p className="text-xs text-gray-500">일반 관리자</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveAdmin(email)}
                className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="삭제"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
          
          {admins.length === 0 && (
            <li className="px-6 py-8 text-center text-gray-500 text-sm">
              추가된 일반 관리자가 없습니다.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
