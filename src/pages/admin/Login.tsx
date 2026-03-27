import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Lock } from 'lucide-react';
import { signInWithGoogle } from '../../firebase';

export default function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, setAdmin, admins } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const user = await signInWithGoogle();
      if (user.email === 'soinvu.com@gmail.com' || admins.includes(user.email || '')) {
        setAdmin(true);
        navigate('/admin/dashboard');
      } else {
        setError('등록된 관리자 계정이 아닙니다.');
        setAdmin(false);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('현재 도메인이 Firebase에 등록되지 않았습니다. 파이어베이스 콘솔(Authentication > Settings > Authorized domains)에서 현재 웹사이트 주소를 추가해주세요.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('로그인 창이 닫혔습니다. 다시 시도해주세요.');
      } else {
        setError(`로그인 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0F1A2B]/10 mb-4">
            <Lock className="w-8 h-8 text-[#0F1A2B]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0F1A2B]">관리자 로그인</h1>
          <p className="text-gray-500 mt-2">하이클래스 부동산 관리자 시스템</p>
        </div>

        <div className="space-y-6">
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 bg-[#0F1A2B] text-white font-medium rounded-sm hover:bg-[#1a2b44] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : 'Google 계정으로 로그인'}
          </button>
          <p className="text-xs text-gray-400 text-center mt-4">
            보안을 위해 등록된 관리자 계정으로만 접속 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
