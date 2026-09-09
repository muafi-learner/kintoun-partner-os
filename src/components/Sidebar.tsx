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
  X
} from 'lucide-react';
import { CategoryId } from '../types';

interface SidebarProps {
  currentView: string;
  selectedCategory?: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
  onSelectHomepage: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenTicketModal?: () => void;
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
  onCloseMobile
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (currentView === 'home') {
    return null;
  }

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
                  id={`sidebar-item-${item.id}`}
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

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-150">
          <div 
            className="fixed inset-0 bg-[#00263f]/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside 
            id="app-mobile-sidebar-drawer"
            className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-2xl py-4 z-10 select-none animate-in slide-in-from-left duration-200"
          >
            <div className="flex items-center justify-between px-4 pb-3 mb-2 border-b border-[#d6cfbf]/60">
              <span className="text-xs font-black uppercase tracking-widest text-[#00263f]">
                KINTOUN PARTNER
              </span>
              <button
                id="btn-close-mobile-sidebar"
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-500 hover:text-[#00263f] hover:bg-[#eeebe1] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col space-y-1.5 px-3 overflow-y-auto">
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
                    id={`mobile-sidebar-item-${item.id}`}
                    onClick={() => {
                      if (isHomepage) {
                        onSelectHomepage();
                      } else {
                        onSelectCategory(item.id as CategoryId);
                      }
                      if (onCloseMobile) {
                        onCloseMobile();
                      }
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
                      {isActive ? (
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" 
                          style={{ backgroundColor: item.colorHex }}
                        />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
};
