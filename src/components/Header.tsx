import React from 'react';
import { Search, Bell, Upload, Menu, Building, Store as StoreIcon, LogOut } from 'lucide-react';
import { Role, UserProfile, AppNotification, CategoryId } from '../types';
import { CATEGORIES } from '../data/initialData';

interface HeaderProps {
  currentView: string;
  role: Role;
  user: UserProfile;
  notifications: AppNotification[];
  unreadCount: number;
  selectedCategory?: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenUpload: () => void;
  onGoHome: () => void;
  onToggleMobileSidebar?: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  role,
  user,
  unreadCount,
  selectedCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenNotifications,
  onOpenUpload,
  onGoHome,
  onToggleMobileSidebar,
  onLogout
}) => {
  return (
    <header
      id="main-app-header"
      className="sticky top-0 w-full bg-[#00263f] text-white shadow-md border-b border-[#3c586d]/40 transition-colors duration-200 z-50"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* KIRI: Logo Kintoun Mepet Kiri */}
        <div className="flex items-center shrink-0">
          <button
            id="header-subpage-logo-btn"
            onClick={onGoHome}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none cursor-pointer select-none"
          >
            <img
              src="/cloud-kintoun-logo.svg"
              alt="Kintoun Logo"
              className="w-8 h-6 sm:w-11 sm:h-8 object-contain transition-transform duration-150 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-wider text-white group-hover:text-[#c0c9ce] transition leading-tight">
                KINTOUN
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-[#c0c9ce] font-extrabold uppercase leading-none">
                PARTNER
              </span>
            </div>
          </button>
        </div>

        {/* TENGAH: Navigasi Kategori (Hanya Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 mx-4 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = currentView !== 'home' && currentView !== 'main-news' && currentView !== 'dashboard' && selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-[10px] xl:text-xs font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-white/15 text-white shadow-xs' 
                    : 'text-[#c0c9ce] hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </nav>

        {/* KANAN: Tools, Profile, & Hamburger Menu */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {role === 'admin' && (
            <button
              onClick={onOpenUpload}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition transform hover:scale-105 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Input PDF Baru</span>
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className="p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Pencarian Materi & SOP"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Notifikasi Update Konten"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#00263f]"></span>
            )}
          </button>

          {/* Indikator Profil Store/HQ & Logout (Hanya Desktop) */}
          <div className="hidden lg:flex items-center gap-3 pl-3 ml-1 border-l border-white/20">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                {role === 'admin' ? <Building className="w-4 h-4 text-amber-400" /> : <StoreIcon className="w-4 h-4 text-sky-400" />}
              </div>
              <div className="flex flex-col text-left max-w-[120px] xl:max-w-[150px]">
                <span className="text-[10px] font-black uppercase tracking-widest truncate">
                  {role === 'admin' ? 'HQ ADMIN' : (user?.storeName || 'STORE')}
                </span>
                <span className="text-[9px] text-slate-300 truncate">{user?.name}</span>
              </div>
            </div>
            <button 
              onClick={onLogout} 
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-lg transition cursor-pointer" 
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Icon Hamburger di pojok paling kanan (Hanya Mobile / Tablet) */}
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 ml-1 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
