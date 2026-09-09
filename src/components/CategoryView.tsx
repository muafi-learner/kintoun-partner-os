import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  Newspaper, 
  ArrowRight, 
  PlusCircle, 
  FileText, 
  Upload, 
  Bell, 
  CheckCircle2, 
  Search, 
  X,
  Users,
  Coffee,
  Wrench,
  UserCheck,
  PackageCheck,
  Store,
  Layers,
  Sparkles,
  BookOpen,
  MessageSquareWarning,
  HeartHandshake,
  Smile,
  PhoneCall,
  ClipboardEdit,
  AlertOctagon,
  Utensils,
  Hammer,
  Settings,
  Droplets,
  Cpu,
  Clock,
  Calendar,
  TrendingUp,
  AlertCircle,
  ShoppingCart,
  Boxes,
  Truck,
  Trash2,
  CheckSquare,
  DoorOpen,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { CategoryId, SubcategoryCard, NewsArticle } from '../types';
import { CATEGORIES } from '../data/initialData';
import { isSubcategoryUploaded } from '../utils/uploadStatus';

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

// Helper to render appropriate matching icons for each subcategory
const renderSubcategoryIcon = (subcat: SubcategoryCard) => {
  const iconClass = "w-5 h-5 text-white shrink-0";
  const id = subcat.id.toLowerCase();
  const iconName = subcat.iconName?.toLowerCase();

  // Explicit icon name check or ID match
  if (iconName === 'message-square-warning' || id === 'customer-complaint' || id === 'product-complaint' || id.includes('complain')) {
    return <MessageSquareWarning className={iconClass} />;
  }
  if (iconName === 'heart-handshake' || id === 'service-recovery' || id.includes('concern')) {
    return <HeartHandshake className={iconClass} />;
  }
  if (iconName === 'smile' || id === 'customer-experience') {
    return <Smile className={iconClass} />;
  }
  if (iconName === 'phone-call' || id === 'escalation') {
    return <PhoneCall className={iconClass} />;
  }
  if (iconName === 'clipboard-edit' || id === 'feedback-complaint' || id.includes('feedback')) {
    return <ClipboardEdit className={iconClass} />;
  }

  // Product Issue Icons
  if (id.includes('beverage')) return <Coffee className={iconClass} />;
  if (id.includes('quality')) return <CheckCircle2 className={iconClass} />;
  if (id.includes('recipe') || id.includes('standart') || id.includes('standard')) return <BookOpen className={iconClass} />;
  if (id.includes('availability')) return <Boxes className={iconClass} />;
  if (id.includes('taste') || id.includes('presentation')) return <Sparkles className={iconClass} />;
  if (id.includes('out-of-standard')) return <AlertOctagon className={iconClass} />;
  if (id.includes('serving')) return <Utensils className={iconClass} />;

  // Equipment Issue Icons
  if (id.includes('emergency')) return <AlertOctagon className={iconClass} />;
  if (id.includes('troubleshooting')) return <Wrench className={iconClass} />;
  if (id.includes('repair')) return <Hammer className={iconClass} />;
  if (id.includes('sop') || id.includes('maintenance')) return <Settings className={iconClass} />;
  if (id.includes('cleaning')) return <Droplets className={iconClass} />;
  if (id.includes('spare-part') || id.includes('spareparts')) return <Cpu className={iconClass} />;

  // People Issue Icons
  if (id.includes('attendance') || id.includes('attednace')) return <Clock className={iconClass} />;
  if (id.includes('scheduling') || id.includes('schedule')) return <Calendar className={iconClass} />;
  if (id.includes('performance')) return <TrendingUp className={iconClass} />;
  if (id.includes('policy')) return <ShieldCheck className={iconClass} />;
  if (id.includes('coordination') || id.includes('team')) return <UserCheck className={iconClass} />;

  // Stock Issue Icons
  if (id.includes('shortage')) return <AlertCircle className={iconClass} />;
  if (id.includes('ordering') || id.includes('order')) return <ShoppingCart className={iconClass} />;
  if (id.includes('delivery')) return <Truck className={iconClass} />;
  if (id.includes('inventory')) return <Boxes className={iconClass} />;
  if (id.includes('receiving')) return <Truck className={iconClass} />;
  if (id.includes('waste') || id.includes('spoilage')) return <Trash2 className={iconClass} />;

  // Store Issue Icons
  if (id.includes('daily') || (id.includes('operation') && !id.includes('support'))) return <Store className={iconClass} />;
  if (id.includes('execution')) return <CheckSquare className={iconClass} />;
  if (id.includes('opening') || id.includes('closing') || id.includes('coling')) return <DoorOpen className={iconClass} />;
  if (id.includes('cash') || id.includes('cashier') || id.includes('pos')) return <CreditCard className={iconClass} />;
  if (id.includes('support') || id.includes('audit') || id.includes('compliance')) return <ShieldCheck className={iconClass} />;

  // Fallback icon
  return <BookOpen className={iconClass} />;
};

export const CategoryView: React.FC<CategoryViewProps> = ({
  categoryId,
  subcategories,
  specificNews,
  onSelectSubcategory,
  onSelectNews,
  onOpenUpload,
  onBackToHome,
  isAdmin,
  onOpenMobileSidebar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const currentCategory = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  const filteredSubcategories = subcategories.filter((s) => s.categoryId === categoryId);

  // Filtered by local search
  const visibleSubcategories = useMemo(() => {
    if (!searchQuery.trim()) return filteredSubcategories;
    const q = searchQuery.toLowerCase();
    return filteredSubcategories.filter(
      (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [filteredSubcategories, searchQuery]);

  // Render category icon
  const renderCategoryIcon = (size = 'w-6 h-6') => {
    switch (currentCategory.iconName) {
      case 'users':
        return <Users className={`${size} text-emerald-600`} />;
      case 'coffee':
        return <Coffee className={`${size} text-amber-600`} />;
      case 'wrench':
        return <Wrench className={`${size} text-blue-600`} />;
      case 'user-check':
        return <UserCheck className={`${size} text-purple-600`} />;
      case 'package':
        return <PackageCheck className={`${size} text-orange-600`} />;
      case 'store':
        return <Store className={`${size} text-sky-600`} />;
      default:
        return <Layers className={`${size} text-slate-600`} />;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full font-sans">
      {/* 1. TOP BREADCRUMB & HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-600">
            <button 
              id="cat-breadcrumb-beranda"
              onClick={onBackToHome}
              className="hover:text-[#00263f] transition flex items-center gap-1 cursor-pointer"
            >
              Beranda Gerai
            </button>
          </nav>

          {onOpenMobileSidebar && (
            <button
              id="cat-mobile-switch-menu-btn"
              onClick={onOpenMobileSidebar}
              className="md:hidden ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-white hover:bg-slate-100 text-[#00263f] border border-[#d6cfbf] transition cursor-pointer shadow-2xs"
              title="Ganti Modul Kategori"
            >
              <Layers className="w-3 h-3 text-[#3c586d]" />
              <span>Ganti</span>
            </button>
          )}
        </div>

        {isAdmin && (
          <button
            id="cat-admin-upload-btn"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Input PDF {currentCategory.name}</span>
          </button>
        )}
      </div>

      {/* 2. CATEGORY IDENTITY BANNER (Matching Modern Card System) */}
      <div className="bg-white rounded-2xl border border-[#d6cfbf] p-5 sm:p-6 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl border ${currentCategory.accentLight} shadow-2xs shrink-0`}>
            {renderCategoryIcon('w-8 h-8')}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              {currentCategory.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {currentCategory.tagline} — Standarisasi & modul pelatihan operasional gerai
            </p>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & SECTION TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#00263f]" />
            Modul Panduan & Prosedur {currentCategory.name}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Pilih modul masalah spesifik untuk membuka slide presentasi solusi & standar penanganan gerai
          </p>
        </div>

        {/* Local Search */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari dalam ${currentCategory.name}...`}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#d6cfbf] bg-[#eeebe1]/30 focus:bg-white text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00263f] focus:border-transparent transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 5. CARDS GRID (High-Contrast White Cards matching Homepage) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {visibleSubcategories.map((subcat) => {
          const uploaded = isSubcategoryUploaded(subcat);

          return (
            <div
              key={subcat.id}
              id={`subcat-card-${subcat.id}`}
              onClick={() => onSelectSubcategory(subcat.id)}
              className="group bg-white hover:bg-[#fdfcfb] rounded-2xl p-5 sm:p-6 border border-[#d6cfbf] hover:border-[#b8ad98] shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[220px]"
            >
              <div>
                {/* Header: Icon, Title & Status */}
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105" 
                    style={{ backgroundColor: subcat.iconBgColor || currentCategory.colorHex }}
                  >
                    {renderSubcategoryIcon(subcat)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5 mb-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide leading-snug group-hover:text-[#00263f] transition truncate">
                        {subcat.title}
                      </h4>
                    </div>

                    {/* Dynamic Role-Based Status Badge */}
                    <div className="mt-1">
                      {uploaded ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Tersedia</span>
                        </span>
                      ) : isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wide">
                          <AlertCircle className="w-3 h-3 text-amber-700" />
                          <span>Perlu Diisi</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Belum Diisi</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4 line-clamp-3">
                  {subcat.description}
                </p>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {uploaded ? 'Dokumen PPT/PDF' : (isAdmin ? 'Belum Ada File' : 'Materi Kosong')}
                  </span>
                </span>

                {uploaded ? (
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition flex items-center gap-1.5 shadow-2xs group-hover:brightness-105"
                    style={{ backgroundColor: subcat.iconBgColor || currentCategory.colorHex }}
                  >
                    <span>Pelajari Solusi</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </button>
                ) : isAdmin ? (
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Isi Materi</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5"
                  >
                    <span>Belum Diisi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Admin "+ Tambah Topik / Upload Dokumen" Card */}
        {isAdmin && (
          <div
            id="btn-admin-add-subcat"
            onClick={onOpenUpload}
            className="border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[220px]"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 shadow-2xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-amber-900 uppercase">Input Materi PDF Baru</h4>
            <p className="text-[11px] text-amber-700 mt-1 max-w-xs leading-relaxed">
              Tambahkan SOP, presentasi PPT, atau kartu belajar baru untuk kategori {currentCategory.name}
            </p>
          </div>
        )}

        {visibleSubcategories.length === 0 && (
          <div className="col-span-full py-10 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-6">
            <p className="text-xs font-bold text-slate-600">
              Tidak ada modul yang cocok dengan pencarian "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 px-3 py-1.5 bg-[#00263f] hover:bg-[#3c586d] text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
