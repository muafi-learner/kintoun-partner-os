import React, { useState, useMemo } from 'react';
import { 
  Upload, FileText, Search, X, Users, Coffee, Wrench, 
  UserCheck, PackageCheck, Store, Layers, BookOpen, 
  MessageSquareWarning, HeartHandshake, Smile, PhoneCall, ClipboardEdit, 
  AlertOctagon, Utensils, Hammer, Settings, Droplets, Cpu, Clock, 
  Calendar, TrendingUp, AlertCircle, ShoppingCart, Truck, Trash2, 
  CheckSquare, DoorOpen, CreditCard, ShieldCheck, CheckCircle2, PlusCircle, ExternalLink 
} from 'lucide-react';
import { CategoryId, SubcategoryCard, NewsArticle } from '../types';
import { CATEGORIES } from '../data/initialData';
import { isSubcategoryUploaded } from '../utils/uploadStatus';

const IconMap: Record<string, React.ElementType> = {
  'message-square-warning': MessageSquareWarning, 'heart-handshake': HeartHandshake, 'smile': Smile,
  'phone-call': PhoneCall, 'clipboard-edit': ClipboardEdit, 'coffee': Coffee, 'check-circle-2': CheckCircle2,
  'book-open': BookOpen, 'boxes': Boxes, 'sparkles': Sparkles, 'alert-octagon': AlertOctagon,
  'utensils': Utensils, 'wrench': Wrench, 'hammer': Hammer, 'settings': Settings, 'droplets': Droplets,
  'cpu': Cpu, 'clock': Clock, 'calendar': Calendar, 'trending-up': TrendingUp, 'shield-check': ShieldCheck,
  'alert-circle': AlertCircle, 'shopping-cart': ShoppingCart, 'truck': Truck, 'trash-2': Trash2,
  'store': Store, 'check-square': CheckSquare, 'door-open': DoorOpen, 'credit-card': CreditCard,
  'users': Users, 'user-check': UserCheck, 'package': PackageCheck, 'layers': Layers
};

const getIconComponent = (iconName?: string, id?: string): React.ElementType => {
  if (iconName && IconMap[iconName]) return IconMap[iconName];
  if (!id) return BookOpen;
  const idLower = id.toLowerCase();
  if (idLower.includes('complain')) return MessageSquareWarning;
  if (idLower.includes('beverage')) return Coffee;
  if (idLower.includes('repair')) return Hammer;
  if (idLower.includes('delivery')) return Truck;
  if (idLower.includes('cash')) return CreditCard;
  return BookOpen;
};

interface CategoryViewProps {
  categoryId: CategoryId;
  subcategories: SubcategoryCard[];
  specificNews: NewsArticle;
  onSelectSubcategory: (subcatId: string) => void;
  onSelectNews: () => void;
  onOpenUpload: () => void;
  onBackToHome: () => void;
  isAdmin: boolean;
  onOpenMobileSidebar?: () => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  categoryId, subcategories, onSelectSubcategory, onOpenUpload, onBackToHome, isAdmin, onOpenMobileSidebar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentCategory = useMemo(() => CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0], [categoryId]);
  
  const visibleSubcategories = useMemo(() => {
    const filtered = subcategories.filter((s) => s.categoryId === categoryId);
    if (!searchQuery.trim()) return filtered;
    const q = searchQuery.toLowerCase();
    return filtered.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }, [subcategories, categoryId, searchQuery]);

  const CategoryIcon = getIconComponent(currentCategory.iconName);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full font-sans flex flex-col justify-between min-h-full">
      <div>
        {/* TOP BREADCRUMB & ADMIN UPLOAD BUTTON */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <nav className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-600">
              <button onClick={onBackToHome} className="hover:text-[#00263f] transition flex items-center gap-1 cursor-pointer">
                Beranda Gerai
              </button>
            </nav>
            {onOpenMobileSidebar && (
              <button onClick={onOpenMobileSidebar} className="md:hidden ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-white hover:bg-slate-100 text-[#00263f] border border-[#d6cfbf] transition cursor-pointer shadow-2xs">
                <Layers className="w-3 h-3 text-[#3c586d]" /><span>Ganti</span>
              </button>
            )}
          </div>
          {isAdmin && (
            <button onClick={onOpenUpload} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition cursor-pointer">
              <Upload className="w-3.5 h-3.5" /><span>Input PDF {currentCategory.name}</span>
            </button>
          )}
        </div>

        {/* COMPACT HORIZONTAL CATEGORY BANNER (Sesuai Coretan Gambar) */}
        <div className="bg-white rounded-2xl border border-[#d6cfbf] p-4 sm:p-5 mb-6 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className={`p-3 rounded-xl border ${currentCategory.accentLight} shadow-2xs shrink-0`}>
              <CategoryIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight truncate">{currentCategory.name}</h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">{currentCategory.tagline} — Standarisasi & modul pelatihan operasional gerai</p>
            </div>
          </div>
        </div>

        {/* SEARCH & SECTION TITLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <p className="text-xs text-slate-500 font-medium">
            Pilih modul masalah spesifik untuk membuka slide presentasi solusi & standar penanganan gerai
          </p>
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari dalam ${currentCategory.name}...`}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#d6cfbf] bg-[#eeebe1]/30 focus:bg-white text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00263f] transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {visibleSubcategories.map((subcat) => {
            const uploaded = isSubcategoryUploaded(subcat);
            const SubcatIcon = getIconComponent(subcat.iconName, subcat.id);

            return (
              <div 
                key={subcat.id} 
                onClick={() => onSelectSubcategory(subcat.id)} 
                className="group bg-white hover:bg-[#fdfcfb] rounded-2xl p-5 sm:p-6 border border-[#d6cfbf] hover:border-[#b8ad98] shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs" style={{ backgroundColor: subcat.iconBgColor || currentCategory.colorHex }}>
                      <SubcatIcon className="w-5 h-5 text-white shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase truncate">{subcat.title}</h4>
                      <div className="mt-1">
                        {uploaded ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase"><CheckCircle2 className="w-3 h-3" />Tersedia</span>
                        ) : isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 uppercase"><AlertCircle className="w-3 h-3" />Perlu Diisi</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase"><Clock className="w-3 h-3" />Belum Diisi</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4 line-clamp-3">{subcat.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />{uploaded ? 'Dokumen PDF' : 'Belum Ada File'}</span>
                  <button className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 cursor-pointer ${uploaded ? 'text-white shadow-2xs' : isAdmin ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : 'bg-slate-100 text-slate-500'}`} style={uploaded ? { backgroundColor: subcat.iconBgColor || currentCategory.colorHex } : {}}>
                    <span>{uploaded ? 'Pelajari' : isAdmin ? 'Isi Materi' : 'Belum Diisi'}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {isAdmin && (
            <div onClick={onOpenUpload} className="border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[220px]">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 shadow-2xs"><PlusCircle className="w-5 h-5" /></div>
              <h4 className="text-xs font-black text-amber-900 uppercase">Input Materi PDF Baru</h4>
              <p className="text-[11px] text-amber-700 mt-1 max-w-xs leading-relaxed">Tambahkan SOP atau kartu belajar baru untuk kategori {currentCategory.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* TOMBOL HUBUNGI BANTUAN TEKNISI DI POJOK KANAN BAWAH */}
      <div className="flex justify-end pt-8 pb-4">
        <a
          href="https://helpdesk.kintouncoffee.id"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-[#00263f] hover:bg-[#3c586d] text-white font-black text-xs tracking-wider uppercase shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <span>Hubungi Bantuan Teknisi</span>
          <ExternalLink className="w-4 h-4 text-slate-300" />
        </a>
      </div>
    </div>
  );
};
