import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, ChevronRight, FileText, ExternalLink, 
  Search, Users, Coffee, Wrench, UserCheck, PackageCheck, Store, 
  X, Layers 
} from 'lucide-react';
import { CategoryId, NewsArticle } from '../types';
import { CATEGORIES } from '../data/initialData';

interface HomeViewProps {
  mainNews: NewsArticle;
  onSelectMainNews: () => void;
  onSelectCategory: (catId: CategoryId) => void;
  onOpenTicketModal: () => void;
  onOpenUpload: () => void;
  isAdmin: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  mainNews,
  onSelectMainNews,
  onSelectCategory,
  isAdmin
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const renderCategoryIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 shrink-0";
    switch (iconName) {
      case 'users': return <Users className={`${iconClass} text-emerald-600`} />;
      case 'coffee': return <Coffee className={`${iconClass} text-amber-600`} />;
      case 'wrench': return <Wrench className={`${iconClass} text-blue-600`} />;
      case 'user-check': return <UserCheck className={`${iconClass} text-purple-600`} />;
      case 'package': return <PackageCheck className={`${iconClass} text-orange-600`} />;
      case 'store': return <Store className={`${iconClass} text-sky-600`} />;
      default: return <Layers className={`${iconClass} text-slate-600`} />;
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIES;
    const q = searchQuery.toLowerCase();
    return CATEGORIES.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(q);
      const matchTagline = cat.tagline?.toLowerCase().includes(q);
      const matchItems = cat.items.some((item) => item.toLowerCase().includes(q));
      return matchName || matchTagline || matchItems;
    });
  }, [searchQuery]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans min-h-full pb-20">
      <div>
        <section className="mb-6 sm:mb-8">
          <div
            id="main-news-banner"
            onClick={onSelectMainNews}
            className="group relative w-full rounded-2xl bg-white hover:bg-slate-50/90 border border-[#d6cfbf] p-5 sm:p-7 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00263f] via-[#3c586d] to-[#908371]"></div>
            {isAdmin && (
              <div className="flex justify-end mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                  Admin Editable
                </span>
              </div>
            )}
            <div className="py-2 max-w-4xl">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 group-hover:text-[#00263f] transition leading-snug">
                {mainNews.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5 leading-relaxed line-clamp-2">
                {mainNews.subtitle} • {mainNews.summary}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 bg-[#eeebe1]/80 px-2.5 py-1 rounded-md text-slate-800 font-mono text-[11px] border border-[#d6cfbf]/60">
                  <FileText className="w-3.5 h-3.5 text-[#00263f]" />
                  {mainNews.pdfFileName} ({mainNews.pdfFileSize || '2.4 MB'})
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Klik untuk menampilkan slide materi langsung
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[#00263f] group-hover:text-[#3c586d] font-bold text-xs group-hover:translate-x-1 transition">
                Buka Materi Slide Presentasi <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </section>

        <section className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
          <p className="text-xs sm:text-sm text-slate-600 font-semibold">
            Pilih topik di bawah atau ketik kata kunci kendala untuk menemukan solusi
          </p>
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kendala (cth: mesin, resep, komplain)..."
              className="w-full pl-9.5 pr-8 py-2 rounded-xl border border-[#d6cfbf] bg-white text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00263f] transition shadow-2xs"
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
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              id={`issue-card-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-white hover:bg-[#fdfcfb] rounded-2xl p-5 sm:p-6 border border-[#d6cfbf] hover:border-[#b8ad98] flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg shadow-xs min-h-[330px] select-none"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 sm:p-3 rounded-xl border ${cat.accentLight} shadow-2xs shrink-0`}>
                    {renderCategoryIcon(cat.iconName)}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight leading-snug group-hover:text-[#00263f] transition">
                      {cat.name}
                    </h3>
                  </div>
                </div>
                <div className="h-px bg-slate-100 my-3"></div>
                <div className="mb-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Daftar Panduan & Prosedur:
                  </p>
                  <ul className="space-y-2">
                    {cat.items.map((item, idx) => {
                      const isMatched = searchQuery && item.toLowerCase().includes(searchQuery.toLowerCase());
                      return (
                        <li 
                          key={idx}
                          className={`text-xs font-semibold flex items-center justify-between p-1.5 rounded-lg transition ${
                            isMatched 
                              ? 'bg-amber-100 text-amber-900 font-bold' 
                              : 'text-slate-700 group-hover:text-slate-900 group-hover:bg-slate-100/70'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span 
                              className="w-1.5 h-1.5 rounded-full shrink-0" 
                              style={{ backgroundColor: cat.colorHex }}
                            />
                            <span className="truncate">{item}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0" />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white transition flex items-center justify-between shadow-xs group-hover:brightness-105 active:scale-[0.98] mt-2 cursor-pointer"
                style={{ backgroundColor: cat.colorHex }}
              >
                <span className="tracking-wider uppercase">{cat.solveButtonText}</span>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
              <p className="text-sm font-bold text-slate-600">
                Tidak ada panduan yang cocok dengan pencarian "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-[#00263f] hover:bg-[#3c586d] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </section>
      </div>

      {/* TOMBOL BANTUAN TEKNISI FLOATING OVERLAPPING DI POJOK KANAN BAWAH */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://helpdesk.kintouncoffee.id"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4.5 py-2.5 rounded-xl bg-[#00263f] hover:bg-[#3c586d] text-white font-black text-xs tracking-wider uppercase shadow-xl hover:shadow-2xl transition transform hover:scale-105 flex items-center gap-2 cursor-pointer border border-white/10"
        >
          <span>Bantuan Teknisi</span>
          <ExternalLink className="w-4 h-4 text-slate-300" />
        </a>
      </div>
    </div>
  );
};
