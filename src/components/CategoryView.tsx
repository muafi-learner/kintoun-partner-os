import React, { useState, useMemo } from 'react';
import { 
  FileText, Search, X, Users, Coffee, Wrench, 
  UserCheck, PackageCheck, Store, Layers, BookOpen, 
  MessageSquareWarning, HeartHandshake, Smile, PhoneCall, ClipboardEdit, 
  AlertOctagon, Utensils, Hammer, Settings, Droplets, Cpu, Clock, 
  Calendar, TrendingUp, AlertCircle, ShoppingCart, Truck, Trash2, 
  CheckSquare, DoorOpen, CreditCard, ShieldCheck, CheckCircle2, PlusCircle, ExternalLink, Boxes, Sparkles, ArrowLeft, LifeBuoy, Edit3, Check
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
  categoryId, subcategories: initialSubcategories, onSelectSubcategory, onOpenUpload, onBackToHome, isAdmin, onOpenMobileSidebar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subcategoriesList, setSubcategoriesList] = useState<SubcategoryCard[]>(initialSubcategories);
  const [editingSubcat, setEditingSubcat] = useState<SubcategoryCard | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sinkronisasi data saat props berubah dari App.tsx
  React.useEffect(() => {
    setSubcategoriesList(initialSubcategories);
  }, [initialSubcategories]);

  const currentCategory = useMemo(() => CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0], [categoryId]);
  
  const visibleSubcategories = useMemo(() => {
    const filtered = subcategoriesList.filter((s) => s.categoryId === categoryId);
    if (!searchQuery.trim()) return filtered;
    const q = searchQuery.toLowerCase();
    return filtered.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }, [subcategoriesList, categoryId, searchQuery]);

  // Fungsi menyimpan editan judul/deskripsi
  const handleSaveSubcatEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubcat) return;

    setIsSaving(true);
    try {
      const updatedList = subcategoriesList.map(sub => 
        sub.id === editingSubcat.id ? editingSubcat : sub
      );

      const response = await fetch('https://kintouncoffee.id/partner/api/update-subcategories.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subcategories: updatedList })
      });

      const result = await response.json();
      if (result.status === 'success') {
        setSubcategoriesList(updatedList);
        setEditingSubcat(null);
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

  // Fungsi baru untuk MENGHAPUS kartu sub-topik
  const handleDeleteSubcat = async () => {
    if (!editingSubcat) return;
    
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus sub-topik "${editingSubcat.title}" secara permanen?`);
    if (!confirmDelete) return;

    setIsSaving(true);
    try {
      const updatedList = subcategoriesList.filter(sub => sub.id !== editingSubcat.id);

      const response = await fetch('https://kintouncoffee.id/partner/api/update-subcategories.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subcategories: updatedList })
      });

      const result = await response.json();
      if (result.status === 'success') {
        setSubcategoriesList(updatedList);
        setEditingSubcat(null);
      } else {
        alert(result.message || 'Gagal menghapus kartu.');
      }
    } catch (error) {
      console.error("Gagal terhubung ke server", error);
      alert('Koneksi ke server terputus.');
    } finally {
      setIsSaving(false);
    }
  };

  const CategoryIcon = getIconComponent(currentCategory.iconName);

  return (
    <div className="relative flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full font-sans flex flex-col justify-between min-h-full">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHome}
              className="md:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-[#d6cfbf] hover:bg-[#eeebe1] hover:text-[#00263f] transition shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#d6cfbf] p-4 sm:p-5 mb-6 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className={`p-3 rounded-xl border ${currentCategory.accentLight} shadow-2xs shrink-0`}>
              <CategoryIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight truncate">{currentCategory.name}</h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">{currentCategory.tagline} — Standarisasi & modul pelatihan operasional</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <p className="hidden md:block text-sm text-slate-600 font-semibold">
            Pilih modul masalah spesifik untuk membuka slide presentasi solusi & standar penanganan
          </p>
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari dalam ${currentCategory.name}...`}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#d6cfbf] bg-white text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00263f] transition shadow-2xs"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {visibleSubcategories.map((subcat) => {
            const uploaded = isSubcategoryUploaded(subcat);
            const SubcatIcon = getIconComponent(subcat.iconName, subcat.id);

            return (
              <div 
                key={subcat.id} 
                onClick={() => onSelectSubcategory(subcat.id)} 
                className="group relative bg-white hover:bg-[#fdfcfb] rounded-2xl p-5 sm:p-6 border border-[#d6cfbf] hover:border-[#b8ad98] shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between min-h-[220px]"
              >
                {/* TOMBOL EDIT KARTU SUB-TOPIK KHUSUS ADMIN */}
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSubcat(subcat);
                    }}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-amber-400 text-slate-600 hover:text-slate-950 transition shadow-xs z-10 cursor-pointer"
                    title="Edit Kartu Sub-Topik Ini"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div>
                  <div className="flex items-start gap-3 mb-3 pr-6">
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

      {/* MODAL EDIT KARTU SUB-TOPIK DENGAN TOMBOL HAPUS */}
      {editingSubcat && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#00263f] uppercase">Edit Sub-Topik</h3>
              <button onClick={() => setEditingSubcat(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubcatEdit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Judul Sub-Topik (Title)</label>
                <input
                  type="text"
                  value={editingSubcat.title}
                  onChange={(e) => setEditingSubcat({ ...editingSubcat, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00263f]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Deskripsi Singkat</label>
                <textarea
                  value={editingSubcat.description}
                  onChange={(e) => setEditingSubcat({ ...editingSubcat, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00263f] resize-none"
                  required
                />
              </div>

              {/* FOOTER MODAL DENGAN LAYOUT TERPISAH (HAPUS DI KIRI, SIMPAN DI KANAN) */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={handleDeleteSubcat}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" /> Hapus Kartu
                </button>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSubcat(null)}
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
                        <Check className="w-4 h-4" /> Simpan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION BANTUAN TEKNISI STATIS DI TENGAH BAWAH */}
      <section className="mt-8 mb-12 sm:mb-16 w-full max-w-2xl mx-auto text-center bg-white rounded-3xl border border-[#d6cfbf] p-6 sm:p-10 shadow-sm">
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
  );
};
