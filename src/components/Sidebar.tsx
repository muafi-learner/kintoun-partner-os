import React, { useState } from 'react';
import {
  Home,
  Users,
  Coffee,
  Wrench,
  UserCheck,
  PackageCheck,
  Store,
  ChevronRight,
  X,
  Building,
  Store as StoreIcon,
  LogOut
} from 'lucide-react';
import { CategoryId, Role, UserProfile } from '../types';

interface SidebarProps {
  currentView: string;
  selectedCategory?: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
  onSelectHomepage: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenTicketModal?: () => void;
  role?: Role;
  user?: UserProfile;
  onLogout?: () => void;
}

interface NavItem {
  id: CategoryId | 'homepage';
  label: string;
  shortLabel: string;
  colorHex: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  selectedCategory,
  onSelectCategory,
  onSelectHomepage,
  isMobileOpen = false,
  onCloseMobile,
  role,
  user,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const navItems: NavItem[] = [
    { id: 'homepage', label: 'HOMEPAGE', shortLabel: 'Homepage', colorHex: '#00263f', icon: Home },
    { id: 'customer', label: 'CUSTOMER ISSUE', shortLabel: 'Customer', colorHex: '#059669', icon: Users },
    { id: 'product', label: 'PRODUCT ISSUE', shortLabel: 'Product', colorHex: '#d97706', icon: Coffee },
    { id: 'equipment', label: 'EQUIPMENT ISSUE', shortLabel: 'Equipment', colorHex: '#2563eb', icon: Wrench },
    { id: 'people', label: 'PEOPLE ISSUE', shortLabel: 'People', colorHex: '#7c3aed', icon: UserCheck },
    { id: 'stock', label: 'STOCK & SUPPLY', shortLabel: 'Stock', colorHex: '#ea580c', icon: PackageCheck },
    { id: 'store', label: 'STORE ISSUE', shortLabel: 'Store', colorHex: '#0891b2', icon: Store }
  ];

  return (
    <>
      {/* SIDEBAR DESKTOP KIRI (Sembunyi di Homepage) */}
      {currentView !== 'home' && (
        <aside
          id="app-partner-sidebar"
          style={{ width: isOpen ? '260px' : '68px' }}
          className="hidden md:flex shrink-0 bg-white relative self-stretch min-h-full py-4 flex-col font-sans select-none transition-all duration-200 shadow-2xs z-10"
        >
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-0 right-0 bottom-0 w-3 cursor-col-resize group flex justify-end z-20"
            title={isOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
          >
            <div className="w-[1px] h-full bg-[#d6cfbf] group-hover:bg-[#00263f] group-hover:w-[3px] transition-all duration-150" />
          </div>

          <div className="sticky top-4 flex flex-col h-fit pr-1">
            <nav className="flex flex-col space-y-1 px-2">
              {navItems.map((item) => {
                const isHomepage = item.id === 'homepage';
                const isActive = (() => {
                  if (currentView === 'main-news') return isHomepage;
                  if (isHomepage) return currentView === 'home';
                  if (currentView === 'category' || currentView === 'subcategory' || currentView === 'specific-news') {
                    return selectedCategory === item.id;
                  }
                  return false;
                })();
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (isHomepage) {
                        onSelectHomepage();
                      } else {
                        onSelectCategory(item.id as CategoryId);
                      }
                    }}
                    title={item.label}
                    className={`w-full text-left rounded-xl transition-all duration-150 flex items-center cursor-pointer group ${
                      isOpen ? 'px-3 py-2.5 gap-2.5' : 'p-2.5 justify-center'
                    } ${
                      isActive
                        ? 'bg-[#00263f] text-white font-black shadow-xs'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-[#eeebe1]/80 font-bold text-xs'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'bg-[#eeebe1]/70 text-slate-700 group-hover:bg-[#eeebe1]'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    {isOpen && (
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="text-xs font-bold whitespace-nowrap tracking-tight">
                          {item.label}
                        </span>
                        {isActive ? (
                          <span
                            className="w-2 h-2 rounded-full shrink-0 shadow-xs ml-1.5"
                            style={{ backgroundColor: item.colorHex }}
                          />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-slate-400 transition shrink-0 ml-1" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
      )}

      {/* DRAWER SIDEBAR (Berlaku global) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-150">
          <div 
            className="fixed inset-0 bg-[#00263f]/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside 
            className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-2xl py-2 z-10 select-none animate-in slide-in-from-left duration-200"
          >
            {/* Header Drawer dengan Ikon Store / Office */}
            <div className="flex items-center justify-between px-4 pb-4 mb-2 border-b border-[#d6cfbf]/60 pt-2">
              <div className="flex items-center gap-2.5 text-[#00263f]">
                <div className="w-8 h-8 rounded-lg bg-[#eeebe1] flex items-center justify-center shrink-0">
                  {role === 'admin' ? <Building className="w-4 h-4" /> : <StoreIcon className="w-4 h-4" />}
                </div>
                <span className="text-xs font-black uppercase tracking-widest truncate max-w-[150px]">
                  {role === 'admin' ? 'HEAD OFFICE ADMIN' : (user?.storeName ? user.storeName : 'STORE GERAI')}
                </span>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#00263f] hover:bg-[#eeebe1] transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* List Menu */}
            <nav className="flex-1 overflow-y-auto flex flex-col space-y-1.5 px-3">
              {navItems.map((item) => {
                const isHomepage = item.id === 'homepage';
                const isActive = (() => {
                  if (currentView === 'main-news') return false;
                  if (isHomepage) return currentView === 'home';
                  if (currentView === 'category' || currentView === 'subcategory' || currentView === 'specific-news') {
                    return selectedCategory === item.id;
                  }
                  return false;
                })();
                const IconComponent = item.icon;

                return (
                  <button
                    key={`mobile-${item.id}`}
                    onClick={() => {
                      if (isHomepage) {
                        onSelectHomepage();
                      } else {
                        onSelectCategory(item.id as CategoryId);
                      }
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full text-left rounded-xl px-3.5 py-3 transition flex items-center gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-[#00263f] text-white font-black shadow-xs'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-[#eeebe1]/80 font-bold text-xs'
                    }`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive 
                          ? 'bg-white/15 text-white' 
                          : 'bg-[#eeebe1] text-slate-700'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="text-xs font-bold truncate">
                        {item.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Footer Drawer: Log Out */}
            <div className="mt-auto pt-3 pb-2 px-3 border-t border-[#d6cfbf]/60">
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer font-bold text-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-[#eeebe1] flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>LOG OUT</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
