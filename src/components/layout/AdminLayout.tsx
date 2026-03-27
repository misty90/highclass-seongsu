import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { LayoutDashboard, Building2, ImageIcon, LogOut, Home, Users } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: '대시보드', icon: LayoutDashboard },
    { path: '/admin/listings', label: '매물 관리', icon: Building2 },
    { path: '/admin/complexes', label: '단지 정보 관리', icon: ImageIcon },
    { path: '/admin/accounts', label: '계정 관리', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0F1A2B] text-white z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/admin/dashboard" className="font-serif text-xl font-bold tracking-wider flex items-center">
                HIGHCLASS <span className="text-xs font-sans text-gray-400 font-normal ml-2 px-2 py-0.5 border border-gray-600 rounded-full hidden sm:inline-block">ADMIN</span>
              </Link>
              
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-white/10 text-white' 
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                target="_blank"
                className="text-gray-300 hover:text-white text-sm font-medium flex items-center transition-colors"
              >
                <Home className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">홈페이지 보기</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-800 bg-[#0F1A2B] overflow-x-auto">
          <div className="flex px-4 py-2 space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
