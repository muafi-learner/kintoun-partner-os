import React from 'react';
import { Search, Bell, User, ShieldCheck, Upload, Menu, Eye, LogIn } from 'lucide-react';
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
  variant: _variant,
  role,
  user,
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
      className="w-full bg-[#00263f] text-white shadow-md border-b border-[#3c586d]/40 transition-colors duration-200 z-30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Left Side: Mobile Menu Button + KINTOUN Branding */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {onToggleMobileSidebar && (
            <button
              id="header-mobile-sidebar-toggle"
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Buka Menu Modul Gerai"
              aria-label="Buka Menu Modul Gerai"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            id="header-subpage-logo-btn"
            onClick={onGoHome}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer select-none"
            title="Kembali ke Beranda"
          >
            <img
              src="/cloud-kintoun-logo.svg"
              alt="Kintoun Logo"
              className="w-10 h-7 sm:w-12 sm:h-8.5 object-contain transition-transform duration-150 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white group-hover:text-[#c0c9ce] transition leading-none">
                KINTOUN
              </span>
              <span className="block text-[10px] sm:text-[11px] tracking-widest text-[#c0c9ce] font-bold uppercase mt-1">
                Operating System & Partner
              </span>
            </div>
          </button>
        </div>

        {/* Right Side: Admin Status, Search, Notif, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin upload shortcut if role is admin */}
          {role === 'admin' ? (
            <button
              id="header-admin-upload-btn"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition transform hover:scale-105 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Input PDF Baru</span>
            </button>
          ) : null}

          {/* Search Button */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="p-2.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Pencarian Materi & SOP"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Button */}
          <button
            id="header-notif-btn"
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Notifikasi Update Konten"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-[#00263f]"></span>
            )}
          </button>

          {/* Login / Ganti Akun Button */}
          <button
            id="header-login-btn"
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white/90 hover:text-white hover:bg-white/10 border border-white/20 transition cursor-pointer"
            title="Masuk atau Ganti Level Otoritas"
          >
            <LogIn className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Ganti Akun</span>
          </button>

          {/* Profile / Authority Level Button */}
          <button
            id="header-profile-btn"
            onClick={onOpenProfile}
            className="p-1 rounded-xl hover:bg-white/10 text-white transition cursor-pointer flex items-center justify-center focus:outline-none"
            title={`${user.name} - ${role === 'admin' ? 'Administrator' : 'Kru Gerai'} (Klik untuk melihat profil & otoritas)`}
            aria-label="Profil & Tingkat Otoritas"
          >
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-transform duration-150 hover:scale-105 shadow-xs ${
              role === 'admin' 
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300/90' 
                : 'bg-sky-600 text-white border border-sky-400/50'
            }`}>
              {role === 'admin' ? <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
