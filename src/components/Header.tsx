import React from 'react';
import { Search, Bell, ShieldCheck, Upload, Menu, Eye, LogIn } from 'lucide-react';
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
  onOpenLogin,
  onOpenUpload,
  onGoHome,
  onToggleMobileSidebar
}) => {
  return (
    <header
      id="main-app-header"
      className="sticky top-0 w-full bg-[#00263f] text-white shadow-md border-b border-[#3c586d]/40 transition-colors duration-200 z-50"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle + Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          {onToggleMobileSidebar && (
            <button
              id="header-mobile-sidebar-toggle"
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Buka Menu Modul Gerai"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <button
            id="header-subpage-logo-btn"
            onClick={onGoHome}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none cursor-pointer select-none"
          >
            <img
              src="/cloud-kintoun-logo.svg"
              alt="Kintoun Logo"
              className="w-8 h-6 sm:w-12 sm:h-8.5 object-contain transition-transform duration-150 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-black tracking-wider text-white group-hover:text-[#c0c9ce] transition leading-none">
                KINTOUN
              </span>
              {/* Sub-judul disembunyikan di HP (hidden) dan muncul di layar sm ke atas */}
              <span className="hidden sm:block text-[10px] sm:text-[11px] tracking-widest text-[#c0c9ce] font-bold uppercase mt-1">
                Operating System & Partner
              </span>
            </div>
          </button>
        </div>

        {/* Right: Essential Tools (Search, Notif, Profile, Admin Upload) */}
        <div className="flex items-center gap-1 sm:gap-3">
          {role === 'admin' && (
            <button
              onClick={onOpenUpload}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition transform hover:scale-105 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Input PDF Baru</span>
            </button>
          )}

          {/* Search Button */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Pencarian Materi & SOP"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Button */}
          <button
            id="header-notif-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Notifikasi Update Konten"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#00263f]"></span>
            )}
          </button>

          {/* Ganti Akun Button (Hanya tampil ikonnya di HP agar ringkas, teks muncul di layar besar) */}
          <button
            id="header-login-btn"
            onClick={onOpenLogin}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold text-white/90 hover:text-white hover:bg-white/10 border border-white/20 transition cursor-pointer"
            title="Ganti Akun"
          >
            <LogIn className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Ganti Akun</span>
          </button>

          {/* Profile / Authority Badge */}
          <button
            id="header-profile-btn"
            onClick={onOpenProfile}
            className="p-1 rounded-xl hover:bg-white/10 text-white transition cursor-pointer flex items-center justify-center focus:outline-none"
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
        </div>

      </div>
    </header>
  );
};
