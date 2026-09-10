import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, ChevronRight, ExternalLink, 
  Search, Users, Coffee, Wrench, UserCheck, PackageCheck, Store, 
  X, Layers, Edit3, Check, PlusCircle, Clock, ShieldAlert, UserX, FileText, HelpCircle, Trash2
} from 'lucide-react';
import { CategoryId, NewsArticle, CategoryConfig, SubcategoryCard, TicketTemplate } from '../types';
import { CATEGORIES } from '../data/initialData';

const AVAILABLE_ICONS = [
  'wrench', 'shield-alert', 'user-x', 'file-text', 'help-circle', 'clock'
];

const IconMap: Record<string, React.ElementType> = {
  'wrench': Wrench, 'shield-alert': ShieldAlert, 'user-x': UserX, 
  'file-text': FileText, 'help-circle': HelpCircle, 'clock': Clock
};

const getIconComponent = (iconName?: string): React.ElementType => {
  if (iconName && IconMap[iconName]) return IconMap[iconName];
  return HelpCircle;
};

interface HomeViewProps {
  mainNews: NewsArticle;
  subcategories: SubcategoryCard[];
  tickets: TicketTemplate[];
  onSelectMainNews: () => void;
  onSelectCategory: (catId: CategoryId) => void;
  onOpenTicketModal: () => void;
  onOpenUpload: () => void;
  onUpdateTickets: (newTickets: TicketTemplate[]) => void;
  isAdmin: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  mainNews,
  subcategories,
  tickets,
  onSelectMainNews,
  onSelectCategory,
  onUpdateTickets,
  isAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
   
  const [categoriesList, setCategoriesList] = useState<CategoryConfig[]>(CATEGORIES);
  const [editingCategory, setEditingCategory] = useState<CategoryConfig | null>(null);
   
  // State untuk Edit/Add Tiket langsung di Homepage
  const [editingTicket, setEditingTicket] = useState<TicketTemplate | null>(null);
  const [isAddingNewTicket, setIsAddingNewTicket] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  // Fungsi simpan tiket (Add/Edit)
  const handleSaveTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket) return;

    setIsSaving(true);
    try {
      let updatedList = [...tickets];
      if (isAddingNewTicket) {
        updatedList.push(editingTicket);
      } else {
        updatedList = updatedList.map(t => t.id === editingTicket.id ? editingTicket : t);
      }

      const response = await fetch('https://kintouncoffee.id/partner/api/update-tickets.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets: updatedList })
      });

      const result = await response.json();
      if (result.status === 'success') {
        onUpdateTickets(updatedList);
        setEditingTicket(null);
        setIsAddingNewTicket(false);
        setShowIconPicker(false);
      } else {
        alert(result.message || 'Gagal menyimpan tiket.');
      }
    } catch (error) {
      console.error("Gagal menyimpan tiket", error);
      alert('Koneksi ke server terputus.');
    } finally {
      setIsSaving(false);
    }
  };

  // Fungsi hapus tiket
  const handleDeleteTicket = async () => {
    if (!editingTicket) return;
    const confirmDelete = window.confirm(`Hapus template tiket "${editingTicket.title}"?`);
    if (!confirmDelete) return;

    setIsSaving(true);
    try {
      const updatedList = tickets.filter(t => t.id !== editingTicket.id);
      const response = await fetch('https://kintouncoffee.id/partner/api/update-tickets.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets: updatedList })
      });

      const result = await response.json();
      if (result.status === 'success') {
        onUpdateTickets(updatedList);
        setEditingTicket(null);
        setIsAddingNewTicket(false);
      } else {
        alert(result.message || 'Gagal menghapus tiket.');
      }
    } catch (error) {
      console.error("Gagal menghapus tiket", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAddNewTicket = () => {
    setIsAddingNewTicket(true);
    setShowIconPicker(false);
    setEditingTicket({
      id: `tkt_${Date.now()}`,
      department: 'DEPARTEMEN',
      title: '',
      description: '',
      sla: '1x24 Jam',
      iconName: 'file-text',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200'
    });
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
      const categoryModules = subcategories.filter(sub => sub.categoryId === cat.id);
      const matchItems = categoryModules.some((sub) => sub.title.toLowerCase().includes(q));
      return matchName || matchTagline || matchItems;
    });
  }, [searchQuery, categoriesList, subcategories]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30 font-sans min-h-full flex flex-col justify-between">
      <div>
        {/* HERO SECTION */}
        {/* //code: Ubah nilai mb-12 di bawah ini untuk mengatur jarak kuning */}
        <section className="mb-32 px-2 max-w-3xl">
          <h1 className="font-poppins text-4xl sm:text-6xl lg:text-7xl text-[#00263f] leading-[1.1] mb-6">
            <span className="font-medium">Welcome to</span><br />
            <span className="font-black tracking-tight uppercase">KINTOUN</span> <span className="font-medium">Partner!</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-lg">
            Temukan SOP, panduan alat, dan solusi cepat untuk kelancaran operasional store Kintoun.
          </p>
        </section>

        {/* RECENT UPDATE */}
        <section className="mb-10 sm:mb-14">
          {/* //code: Ubah nilai mb-3 di bawah ini untuk mengatur jarak merah */}
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Recent Update
            </h3>
          </div>
          <div
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

        {/* SEARCH & CATEGORY GRID */}
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

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16">
          {filteredCategories.map((cat) => {
            const categoryModules = subcategories.filter(sub => sub.categoryId === cat.id);

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative bg-white hover:bg-[#fdfcfb] rounded-2xl p-5 sm:p-6 border border-[#d6cfbf] hover:border-[#b8ad98] flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg shadow-xs min-h-[330px] select-none"
              >
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
                      {categoryModules.map((module) => {
                        const isMatched = searchQuery && module.title.toLowerCase().includes(searchQuery.toLowerCase());
                        return (
                          <li 
                            key={module.id}
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
                              <span className="truncate">{module.title}</span>
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
            );
          })}
        </section>

        {/* BAGIAN BARU: KATALOG TIKET & ESKALASI DI HOMEPAGE */}
        <section className="mb-16 pt-8 border-t border-[#d6cfbf]/60">
          <div className="mb-6 px-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#00263f] uppercase tracking-tight mb-1">
              KATALOG TIKET & ESKALASI
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Pilih kategori tiket di bawah ini untuk mengajukan permintaan ke Head Office.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tickets.map((ticket) => {
              const TicketIcon = getIconComponent(ticket.iconName);
              return (
                <div key={ticket.id} className="group relative bg-white hover:bg-slate-50 border border-[#d6cfbf] rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[220px]">
                  {isAdmin && (
                    <button 
                      onClick={() => { setIsAddingNewTicket(false); setEditingTicket(ticket); }} 
                      className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-amber-400 text-slate-600 hover:text-slate-950 transition z-10 cursor-pointer"
                      title="Edit Tiket Ini"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div>
                    <div className="mb-4 pr-8">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-black uppercase border ${ticket.badgeColor}`}>{ticket.department}</span>
                    </div>
                    <div className="flex gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <TicketIcon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-black text-slate-900 uppercase leading-snug">{ticket.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{ticket.description}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">SLA: {ticket.sla}</span>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-[#00263f] text-white text-xs font-black flex items-center gap-1.5 hover:bg-[#3c586d] transition shadow-2xs cursor-pointer">
                      Buat Tiket <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {isAdmin && (
              <div 
                onClick={handleOpenAddNewTicket} 
                className="border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] transition"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 shadow-2xs">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black text-amber-900 uppercase">TAMBAH FORM TIKET</h4>
                <p className="text-[11px] text-amber-700 mt-1">Buat template tiket eskalasi baru</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* MODAL EDIT / TAMBAH KATEGORI */}
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

      {/* MODAL EDIT / TAMBAH TIKET */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#00263f] uppercase">{isAddingNewTicket ? 'Tambah Tiket Baru' : 'Edit Tiket'}</h3>
              <button onClick={() => setEditingTicket(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
             
            <form onSubmit={handleSaveTicket} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Departemen (Label)</label>
                <input type="text" value={editingTicket.department} onChange={(e) => setEditingTicket({ ...editingTicket, department: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#00263f]" required />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Judul Tiket</label>
                <input type="text" value={editingTicket.title} onChange={(e) => setEditingTicket({ ...editingTicket, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#00263f]" required />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Deskripsi & Instruksi</label>
                <textarea value={editingTicket.description} onChange={(e) => setEditingTicket({ ...editingTicket, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#00263f] resize-none" required />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">SLA (Target Waktu)</label>
                  <input type="text" value={editingTicket.sla} onChange={(e) => setEditingTicket({ ...editingTicket, sla: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#00263f]" required />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Warna Label</label>
                  <select value={editingTicket.badgeColor} onChange={(e) => setEditingTicket({ ...editingTicket, badgeColor: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold">
                    <option value="bg-blue-100 text-blue-700 border-blue-200">Biru (Maintenance)</option>
                    <option value="bg-rose-100 text-rose-700 border-rose-200">Merah (Kritikal/HC)</option>
                    <option value="bg-emerald-100 text-emerald-700 border-emerald-200">Hijau (Operasional)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Ikon</label>
                <div className="flex gap-2">
                  {AVAILABLE_ICONS.map(icon => {
                    const IconComp = getIconComponent(icon);
                    return (
                      <button key={icon} type="button" onClick={() => setEditingTicket({ ...editingTicket, iconName: icon })} className={`p-2 rounded-lg border flex items-center justify-center ${editingTicket.iconName === icon ? 'bg-[#00263f] text-white' : 'bg-slate-50 text-slate-400'}`}>
                        <IconComp className="w-4 h-4" />
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                {!isAddingNewTicket ? (
                  <button type="button" onClick={handleDeleteTicket} className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 flex items-center gap-1.5 cursor-pointer"><Trash2 className="w-4 h-4"/> Hapus</button>
                ) : <div></div>}
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingTicket(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 cursor-pointer">Batal</button>
                  <button type="submit" disabled={isSaving} className="px-5 py-2 rounded-xl text-xs font-black bg-[#00263f] text-white flex items-center gap-1.5 cursor-pointer"><Check className="w-4 h-4"/> Simpan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
