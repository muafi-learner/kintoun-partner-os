import React from 'react';
import { Search, Bell, ShieldCheck, Upload, Menu, Eye } from 'lucide-react';
import { Role, UserProfile, AppNotification } from '../types';

interface HeaderProps {
  variant: 'home' | 'subpage';
  role: Role;
  user: UserProfile;
  notifications: AppNotification[];
  unreadCount: number;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenLogin: () => void;
  onOpenUpload: () => void;
  onGoHome: () => void;
  onOpenHostingerGuide?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  unreadCount,
  onOpenSearch,
  onOpenNotifications,
  onOpenProfile,
  onOpenUpload,
  onGoHome,
  onToggleMobileSidebar
}) => {
  return (
    <header
      id="main-app-header"
      className="sticky top-0 w-full bg-[#00263f] text-white shadow-md border-b border-[#3c586d]/40 transition-colors duration-200 z-50"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* KIRI: Logo Kintoun Mepet Kiri */}
        <div className="flex items-center gap-2 sm:gap-4">
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

        {/* KANAN: Tools, Profile, & Hamburger Menu (Pojok Kanan Atas) */}
        <div className="flex items-center gap-1.5 sm:gap-3">
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

          <button
            onClick={onOpenProfile}
            className="hidden sm:flex p-1 rounded-xl hover:bg-white/10 text-white transition cursor-pointer items-center justify-center focus:outline-none"
            title="Profil & Tingkat Otoritas"
          >
            <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
              role === 'admin' 
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300/90' 
                : 'bg-sky-600 text-white border border-sky-400/50'
            }`}>
              {role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </div>
          </button>

          {/* Icon Hamburger di pojok paling kanan untuk Mobile & Desktop */}
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="p-2 ml-1 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition cursor-pointer"
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
