import React from 'react';
import { Search, Bell, Upload, Menu, Building, Store as StoreIcon } from 'lucide-react';
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
  onLogout?: () => void;
  onOpenProfile?: () => void;
  onOpenTicketCatalog: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  role,
  unreadCount,
  selectedCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenNotifications,
  onOpenUpload,
  onGoHome,
  onToggleMobileSidebar,
  onLogout,
  onOpenProfile,
  onOpenTicketCatalog
}) => {
  return (
    <header
      id="main-app-header"
      className="sticky top-0 w-full bg-[#00263f] text-white shadow-sm border-b border-white/5 transition-colors duration-200 z-50"
    >
      {/* Tinggi mobile h-20 dipertahankan sesuai settingan Anda */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-20 sm:h-16 flex items-center justify-between relative">
        
        {/* KIRI: Logo Kintoun Mepet Kiri */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer select-none"
          >
            <img
              src="/cloud-kintoun-logo.svg"
              alt="Kintoun Logo"
              className="w-13 h-11 sm:w-10 sm:h-7 object-contain transition-transform duration-150 group-hover:scale-105"
            />
          </button>
        </div>

        {/* TENGAH: Navigasi Kategori */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
          {CATEGORIES.map((cat) => {
            const isActive = currentView !== 'home' && currentView !== 'main-news' && currentView !== 'dashboard' && currentView !== 'ticket-catalog' && selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap text-[11px] font-bold tracking-widest uppercase transition-colors cursor-pointer ${
                  isActive 
                    ? 'text-white' 
                    : 'text-[#8da2b0] hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            );
          })}

          {/* MENU TIKET: STYLE DISAMAKAN DENGAN KATEGORI */}
          <button
            onClick={onOpenTicketCatalog}
            className={`whitespace-nowrap text-[11px] font-bold tracking-widest uppercase transition-colors cursor-pointer ${
              currentView === 'ticket-catalog'
                ? 'text-white' 
                : 'text-[#8da2b0] hover:text-white'
            }`}
          >
            ESKALASI TIKET
          </button>
        </nav>

        {/* KANAN: Tools & Profile */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {role === 'admin' && (
            <button
              onClick={onOpenUpload}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-400 hover:bg-amber-400 hover:text-[#00263f] transition cursor-pointer uppercase tracking-wider"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF</span>
            </button>
          )}

          {/* //code: Tombol Search - Atur margin kanan (mr-...) di sini jika ingin menjauhkan dari tombol bell */}
          <button
            onClick={onOpenSearch}
            className="p-2 -m-2 text-[#8da2b0] hover:text-white transition cursor-pointer flex items-center justify-center mr-1 sm:mr-0"
            title="Pencarian"
          >
            <Search className="w-6 h-6 sm:w-[18px] sm:h-[18px]" />
          </button>

          {/* //code: Tombol Notifikasi - Atur margin kanan (mr-...) di sini jika ingin menjauhkan dari profil/hamburger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 -m-2 text-[#8da2b0] hover:text-white transition cursor-pointer flex items-center justify-center mr-1 sm:mr-0"
            title="Notifikasi"
          >
            <Bell className="w-6 h-6 sm:w-[18px] sm:h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>

          <button 
            onClick={onOpenProfile || onLogout} 
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-full bg-[#10354f] text-sky-400 hover:bg-[#1a4666] hover:text-white transition cursor-pointer ring-1 ring-white/10"
            title={role === 'admin' ? 'Profil Head Office' : 'Profil Store'}
          >
            {role === 'admin' ? <Building className="w-3.5 h-3.5" /> : <StoreIcon className="w-3.5 h-3.5" />}
          </button>

          {/* //code: Tombol Hamburger Menu - Atur margin kiri (ml-...) untuk jarak dari bell, dan margin kanan (mr-...) untuk jarak dari tepi kanan layar */}
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 -m-2 text-[#8da2b0] hover:text-white transition cursor-pointer ml-0 mr-2 flex items-center justify-center"
            >
              <Menu className="w-7 h-7 sm:w-7 sm:h-7" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
