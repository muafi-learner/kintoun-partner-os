import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, ChevronRight, ExternalLink, 
  Search, Users, Coffee, Wrench, UserCheck, PackageCheck, Store, 
  X, Layers, LifeBuoy, Edit3, Check
} from 'lucide-react';
import { CategoryId, NewsArticle, CategoryConfig } from '../types';
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
  isAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk data kategori yang bisa diedit secara lokal/server
  const [categoriesList, setCategoriesList] = useState<CategoryConfig[]>(CATEGORIES);
  const [editingCategory, setEditingCategory] = useState<CategoryConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Ambil data kategori terbaru dari server saat pertama kali dimuat DENGAN ANTI-CACHE
  React.useEffect(() => {
    fetch(`https://kintouncoffee.id/partner/api/get-categories.php?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategoriesList(data);
        }
      })
      .catch(err => console.error("Gagal memuat kategori dari server", err));
  }, []);

  const handleSaveCategoryEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setIsSaving(true);
    try {
      const updatedList = categoriesList.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      );

      const response = await fetch('https://kintouncoffee.id/partner/api/update-categories.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: updatedList })
      });

      const result = await response.json();
      if (result.status === 'success') {
        setCategoriesList(updatedList);
        setEditingCategory(null);
      } else {
        alert(result.message || 'Gagal menyimpan perubahan.');
      }
    } catch (error) {
      console.error("Gagal terhubung ke server", error);
      alert('Koneksi ke server terputus.');
    } finally {
      setIsSaving(false);
    }
  };

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
    if (!searchQuery.trim()) return categoriesList;
    const q = searchQuery.toLowerCase();
    return categoriesList.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(q);
      const matchTagline = cat.tagline?.toLowerCase().includes(q);
      const matchItems = cat.items.some((item) => item.toLowerCase().includes(q));
      return matchName || matchTagline || matchItems;
    });
  }, [searchQuery, categoriesList]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-47 sm:py-51 font-sans min-h-full flex flex-col justify-between">
      <div>
        {/* HERO SECTION */}
        <section className="mb-41 sm:mb-45 px-2 max-w-3xl">
          <h1 className="font-poppins text-4xl sm:text-6xl lg:text-7xl text-[#00263f] leading-[1.1] mb-6">
            <span className="font-medium">Welcome to</span><br />
            <span className="font-black tracking-tight uppercase">KINTOUN</span> <span className="font-medium">Partner!</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-lg">
            Temukan SOP, panduan alat, dan solusi cepat untuk kelancaran operasional store Kintoun.
          </p>
        </section>

        {/* SECTION RECENT UPDATE */}
        <section className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Recent Update
            </h3>
          </div>
          <div
            id="main-news-banner"
            onClick={onSelectMainNews}
            className="group relative w-full rounded-2xl bg-white hover:bg-slate-50/90 border border-[#d6cfbf] p-5 sm:p-7 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00263f] via-[#3c586d] to-[#908371]"></div>
            
            <div className="py-2 max-w-4xl">
              <h2 className="text-lg sm:text-xl font-black text-[#00263f] transition leading-snug mb-2">
                {mainNews.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
                {mainNews.subtitle}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs gap-3">
              <div className="flex items-center gap-3"></div>
              <span className="inline-flex items-center gap-1.5 text-[#00263f] font-bold text-xs group-hover:translate-x-1 transition">
                Buka Materi <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </section>

        {/* SECTION CARI & GRID KATEGORI */}
        <section className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
          <p className="hidden md:block text-xs sm:text-sm text-slate-600 font-semibold">
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
              onClick={() => onSelectCategory(cat.id)}
              className="group relative bg-white hover:bg-[#fdfcfb] rounded-2xl p-5 sm:p-6 border border-[#d6cfbf] hover:border-[#b8ad98] flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg shadow-xs min-h-[330px] select-none"
            >
              {/* TOMBOL EDIT KATEGORI KHUSUS ADMIN */}
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCategory(cat);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 hover:bg-amber-400 text-slate-600 hover:text-slate-950 transition shadow-xs z-10 cursor-pointer"
                  title="Edit Judul Kategori"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}

              <div>
                <div className="flex items-center gap-3 mb-3 pr-8">
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
        </section>
      </div>

      {/* MODAL EDIT KATEGORI */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-[#00263f] uppercase">Edit Kategori: {editingCategory.id}</h3>
              <button onClick={() => setEditingCategory(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategoryEdit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Judul Kategori (Name)</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00263f]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tagline / Keterangan Singkat</label>
                <input
                  type="text"
                  value={editingCategory.tagline || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00263f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Teks Tombol Aksi (Solve Button)</label>
                <input
                  type="text"
                  value={editingCategory.solveButtonText}
                  onChange={(e) => setEditingCategory({ ...editingCategory, solveButtonText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00263f]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#00263f] hover:bg-[#3c586d] text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : (
                    <>
                      <Check className="w-4 h-4" /> Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION BANTUAN TEKNISI STATIS DI TENGAH BAWAH */}
      <div className="snap-start snap-always shrink-0 pt-[160px] pb-[20px]">
        <section className="mt-8 mb-12 w-full max-w-2xl mx-auto text-center bg-white rounded-3xl border border-[#d6cfbf] p-6 sm:p-10 shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 rounded-full bg-[#eeebe1] flex items-center justify-center">
              <LifeBuoy className="w-5 h-5 text-[#00263f]" />
            </div>
          </div>
          <h3 className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">
            Eskalasi & Bantuan Cepat
          </h3>
          <h4 className="text-base sm:text-lg font-black text-[#00263f] mb-3">
            Kendala Tidak Ditemukan di Panduan Gerai?
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 px-2 leading-relaxed">
            Jika terjadi kerusakan darurat pada mesin, atau kondisi operasional yang membutuhkan penanganan langsung dari teknisi Kintoun, gunakan portal khusus eskalasi ini.
          </p>
          <a
            href="https://helpdesk.kintouncoffee.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 sm:py-3.5 rounded-xl bg-[#00263f] hover:bg-[#3c586d] text-white font-black text-xs tracking-wider uppercase transition shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Hubungi Bantuan Teknisi</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>
      </div>
    </div>
  );
};
