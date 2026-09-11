import React from 'react';
import { 
  Home, 
  Users, 
  Coffee, 
  Wrench, 
  UserCheck, 
  PackageCheck, 
  Store, 
  X, 
  Building, 
  Store as StoreIcon, 
  LogOut,
  LifeBuoy
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
  canViewTickets?: boolean; // Prop otorisasi tiket
}

interface NavItem {
  id: CategoryId | 'homepage' | 'ticket-catalog';
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
  onOpenTicketModal,
  role,
  user,
  onLogout,
  canViewTickets
}) => {
  const navItems: NavItem[] = [
    { id: 'homepage', label: 'HOMEPAGE', shortLabel: 'Homepage', colorHex: '#00263f', icon: Home },
    { id: 'customer', label: 'CUSTOMER ISSUE', shortLabel: 'Customer', colorHex: '#059669', icon: Users },
    { id: 'product', label: 'PRODUCT ISSUE', shortLabel: 'Product', colorHex: '#d97706', icon: Coffee },
    { id: 'equipment', label: 'EQUIPMENT ISSUE', shortLabel: 'Equipment', colorHex: '#2563eb', icon: Wrench },
    { id: 'people', label: 'PEOPLE ISSUE', shortLabel: 'People', colorHex: '#7c3aed', icon: UserCheck },
    { id: 'stock', label: 'STOCK & SUPPLY', shortLabel: 'Stock', colorHex: '#ea580c', icon: PackageCheck },
    { id: 'store', label: 'STORE ISSUE', shortLabel: 'Store', colorHex: '#0891b2', icon: Store }
  ];

  // Tambahkan menu Eskalasi Tiket hanya jika diizinkan
  if (canViewTickets) {
    navItems.push({ id: 'ticket-catalog', label: 'ESKALASI TIKET', shortLabel: 'Tiket', colorHex: '#d97706', icon: LifeBuoy });
  }

  return (
    <>
      {/* DRAWER SIDEBAR MOBILE (MUNCUL DARI KANAN) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-150">
          <div 
            className="fixed inset-0 bg-[#00263f]/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside 
            className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-2xl py-2 z-10 select-none animate-in slide-in-from-right duration-200"
          >
            <div className="flex items-center justify-between px-4 pb-4 mb-2 border-b border-[#d6cfbf]/60 pt-2">
              <div className="flex items-center gap-2.5 text-[#00263f]">
                <div className="w-8 h-8 rounded-lg bg-[#eeebe1] flex items-center justify-center shrink-0">
                  {role === 'ho-department' ? <Building className="w-4 h-4" /> : <StoreIcon className="w-4 h-4" />}
                </div>
                <span className="text-xs font-black uppercase tracking-widest truncate max-w-[150px]">
                  {role === 'ho-department' ? 'HEAD OFFICE' : (user?.storeName ? user.storeName : 'STORE GERAI')}
                </span>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#00263f] hover:bg-[#eeebe1] transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto flex flex-col space-y-1.5 px-3">
              {navItems.map((item) => {
                const isHomepage = item.id === 'homepage';
                const isTicketCatalog = item.id === 'ticket-catalog';
                
                const isActive = (() => {
                  if (currentView === 'main-news') return false;
                  if (isHomepage) return currentView === 'home';
                  if (isTicketCatalog) return currentView === 'ticket-catalog';
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
                      } else if (isTicketCatalog) {
                        if (onOpenTicketModal) onOpenTicketModal();
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

            {/* Footer Drawer: LOGOUT */}
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
                <span>LOGOUT</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
