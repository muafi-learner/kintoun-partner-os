import React, { useState } from 'react';
import { Search, Bell, Upload, Menu, Building, Store as StoreIcon, ChevronDown } from 'lucide-react';
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
  onOpenTicketCatalog?: () => void;
  canViewTickets?: boolean;
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
  onOpenTicketCatalog,
  canViewTickets
}) => {
  // State untuk mengontrol visibilitas Mega Menu (Sub-navbar)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  // Fungsi helper saat klik kategori di dalam Mega Menu
  const handleCategoryClick = (catId: CategoryId) => {
    onSelectCategory(catId);
    setIsMegaMenuOpen(false); // Tutup panel setelah dipilih
  };

  return (
    <header
      id="main-app-header"
      // Jika kursor mouse keluar dari seluruh area header, tutup Mega Menu
      onMouseLeave={() => setIsMegaMenuOpen(false)}
      className="sticky top-0 w-full z-50 transition-colors duration-200"
    >
      {/* --- LAYER 1: HEADER UTAMA (IDLE) --- */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between relative bg-[#00263f] text-white shadow-sm border-b border-white/5 z-20">
        
        {/* KIRI: Logo Kintoun Mepet Kiri */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => {
              onGoHome();
              setIsMegaMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer select-none"
          >
            <img
              src="/cloud-kintoun-logo.svg"
              alt="Kintoun Logo"
              className="w-8 h-6 sm:w-10 sm:h-7 object-contain transition-transform duration-150 group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-wider text-white group-hover:text-[#c0c9ce] transition leading-tight">
                KINTOUN
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-widest text-[#8da2b0] font-bold uppercase leading-none">
                PARTNER
              </span>
            </div>
          </button>
        </div>

        {/* TENGAH: Navigasi Minimalis (Absolute Centered agar Simetris) */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 h-full">
          <button
            onClick={() => {
              onGoHome();
              setIsMegaMenuOpen(false);
            }}
            className={`whitespace-nowrap text-[11px] font-bold tracking-widest uppercase transition-colors cursor-pointer ${
              currentView === 'home' 
                ? 'text-white' 
                : 'text-[#8da2b0] hover:text-white'
            }`}
          >
            HOMEPAGE
          </button>

          {/* TRIGGER MEGA MENU: Modul Operasional */}
          <div 
            // Buka Mega Menu saat di-hover
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            className="h-full flex items-center cursor-pointer group"
          >
            <span className={`flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold tracking-widest uppercase transition-colors ${
              isMegaMenuOpen || ['category', 'subcategory', 'specific-news'].includes(currentView)
                ? 'text-white' 
                : 'text-[#8da2b0] group-hover:text-white'
            }`}>
              MODUL OPERASIONAL
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
            </span>
          </div>

          {/* MENU TIKET: HANYA TAMPIL JIKA DIIZINKAN */}
          {canViewTickets && onOpenTicketCatalog && (
            <button
              onClick={() => {
                onOpenTicketCatalog();
                setIsMegaMenuOpen(false);
              }}
              className={`whitespace-nowrap text-[11px] font-bold tracking-widest uppercase transition-colors cursor-pointer ${
                currentView === 'ticket-catalog'
                  ? 'text-white' 
                  : 'text-[#8da2b0] hover:text-white'
              }`}
            >
              ESKALASI TIKET
            </button>
          )}
        </nav>

        {/* KANAN: Tools & Profile */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          {role === 'ho-department' && (
            <button
              onClick={onOpenUpload}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-400 hover:bg-amber-400 hover:text-[#00263f] transition cursor-pointer uppercase tracking-wider"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF</span>
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className="p-2 -m-2 text-[#8da2b0] hover:text-white transition cursor-pointer flex items-center justify-center"
            title="Pencarian"
          >
            <Search className="w-5 h-5 sm:w-[18px] sm:h-[18px]" />
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative p-2 -m-2 text-[#8da2b0] hover:text-white transition cursor-pointer flex items-center justify-center"
            title="Notifikasi"
          >
            <Bell className="w-5 h-5 sm:w-[18px] sm:h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            )}
          </button>

          <button 
            onClick={onOpenProfile || onLogout} 
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-full bg-[#10354f] text-sky-400 hover:bg-[#1a4666] hover:text-white transition cursor-pointer ring-1 ring-white/10"
            title={role === 'ho-department' ? 'Profil Head Office' : 'Profil Store'}
          >
            {role === 'ho-department' ? <Building className="w-3.5 h-3.5" /> : <StoreIcon className="w-3.5 h-3.5" />}
          </button>

          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 -m-2 text-[#8da2b0] hover:text-white transition cursor-pointer ml-1 mr-1 flex items-center justify-center"
            >
              <Menu className="w-6 h-6 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>
      </div>

      {/* --- LAYER 2: MEGA MENU SUB-NAVBAR (HOVER PANEL) --- */}
      <div 
        onMouseEnter={() => setIsMegaMenuOpen(true)}
        className={`hidden lg:block absolute top-full left-0 w-full bg-[#021b2d] border-b border-white/10 shadow-xl transition-all duration-200 z-10 ${
          isMegaMenuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-2 invisible pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center gap-x-6 gap-y-3 flex-wrap">
          {CATEGORIES.map((cat) => {
            const isActive = ['category', 'subcategory', 'specific-news'].includes(currentView) && selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`whitespace-nowrap text-[10px] sm:text-[11px] font-bold tracking-widest uppercase transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/5 ${
                  isActive 
                    ? 'text-white bg-white/5' 
                    : 'text-[#8da2b0] hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
};
