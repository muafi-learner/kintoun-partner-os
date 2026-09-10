import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, X, ExternalLink, Edit3, PlusCircle, Trash2, Check, 
  FileText, Wrench, ShieldAlert, UserX, HelpCircle, Clock 
} from 'lucide-react';
import { TicketTemplate } from '../types';

const AVAILABLE_ICONS = [
  'wrench', 'shield-alert', 'user-x', 'file-text', 'help-circle', 'clock'
];

const IconMap: Record<string, React.ElementType> = {
  'wrench': Wrench, 'shield-alert': ShieldAlert, 'user-x': UserX, 
  'file-text': FileText, 'help-circle': HelpCircle, 'clock': Clock
};

const getIconComponent = (iconName?: string): React.ElementType => {
  if (iconName && IconMap[iconName]) return IconMap[iconName];
  return FileText;
};

interface TicketCatalogViewProps {
  tickets: TicketTemplate[];
  isAdmin: boolean;
  onBack: () => void;
  onUpdateTickets: (newTickets: TicketTemplate[]) => void;
}

export const TicketCatalogView: React.FC<TicketCatalogViewProps> = ({
  tickets, isAdmin, onBack, onUpdateTickets
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTicket, setEditingTicket] = useState<TicketTemplate | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.toLowerCase();
    return tickets.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }, [tickets, searchQuery]);

  const handleOpenAddNew = () => {
    setIsAddingNew(true);
    setEditingTicket({
      id: `tkt_${Date.now()}`,
      title: '',
      description: '',
      iconName: 'file-text',
      department: '',
      sla: '',
      badgeColor: '',
      url: ''
    } as any);
  };

  const handleSaveTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket) return;

    setIsSaving(true);
    try {
      let updatedList = [...tickets];
      if (isAddingNew) {
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
        setIsAddingNew(false);
      } else {
        alert(result.message || 'Gagal menyimpan form tiket.');
      }
    } catch (error) {
      console.error("Gagal terhubung ke server", error);
      alert('Koneksi ke server terputus.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!editingTicket) return;
    const confirmDelete = window.confirm(`Hapus form tiket "${editingTicket.title}"?`);
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
        setIsAddingNew(false);
      } else {
        alert(result.message || 'Gagal menghapus tiket.');
      }
    } catch (error) {
      console.error("Gagal menghapus tiket", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full font-sans flex flex-col justify-between min-h-full">
      <div>
        {/* TOMBOL KEMBALI (KHUSUS MOBILE) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="md:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-[#d6cfbf] hover:bg-[#eeebe1] hover:text-[#00263f] transition shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          </div>
        </div>

        {/* KOTAK HEADER UTAMA (PERSIS SEPERTI HALAMAN KATEGORI LAIN) */}
        <div className="bg-white rounded-2xl border border-[#d6cfbf] p-4 sm:p-5 mb-6 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-3 rounded-xl border bg-amber-50 text-amber-600 border-amber-200 shadow-2xs shrink-0">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight truncate">
                Eskalasi Tiket
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">
                Pilih akses di bawah ini untuk mengajukan permintaan operasional ke Head Office.
              </p>
            </div>
          </div>
        </div>

        {/* BARIS PENGANTAR & PENCARIAN */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <p className="hidden md:block text-sm text-slate-600 font-semibold">
            Pilih jenis form eskalasi untuk mengajukan kendala store secara langsung
          </p>
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari form tiket..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#d6cfbf] bg-white text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00263f] transition shadow-2xs"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* GRID KARTU TIKET */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {filteredTickets.map((ticket) => {
            const TicketIcon = getIconComponent(ticket.iconName);
            const ticketUrl = (ticket as any).url || '#';

            return (
              <div 
                key={ticket.id} 
                className="group relative bg-white hover:bg-[#fdfcfb] rounded-2xl p-5 sm:p-6 border border-[#e2dfd5] hover:border-[#b8ad98] shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[190px]"
              >
                {isAdmin && (
                  <button
                    onClick={() => { setIsAddingNew(false); setEditingTicket(ticket); }}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-amber-400 text-slate-600 hover:text-slate-950 transition shadow-xs z-10 cursor-pointer"
                    title="Edit Link Form Ini"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-3 pr-8">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-2xs">
                      <TicketIcon className="w-5 h-5 shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase truncate group-hover:text-[#00263f] transition">
                        {ticket.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3 mb-4">
                    {ticket.description}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end items-center">
                  <a 
                    href={ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#00263f] hover:bg-[#3c586d] transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Buat Tiket</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}

          {isAdmin && (
            <div 
              onClick={handleOpenAddNew} 
              className="border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[190px]"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 shadow-2xs">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-amber-900 uppercase">Tambah Link Form</h4>
              <p className="text-[11px] text-amber-700 mt-1">Tambahkan tautan formulir eskalasi baru</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL EDIT / TAMBAH TIKET */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#00263f] uppercase">
                {isAddingNew ? 'Tambah Form Tiket Baru' : 'Edit Link Form Tiket'}
              </h3>
              <button onClick={() => setEditingTicket(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTicket} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Judul Form / Tiket</label>
                <input
                  type="text"
                  value={editingTicket.title}
                  onChange={(e) => setEditingTicket({ ...editingTicket, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00263f]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Deskripsi Singkat</label>
                <textarea
                  value={editingTicket.description}
                  onChange={(e) => setEditingTicket({ ...editingTicket, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00263f] resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tautan Link Tiket (URL Eksternal)</label>
                <input
                  type="url"
                  placeholder="Contoh: https://tally.so/r/..."
                  value={(editingTicket as any).url || ''}
                  onChange={(e) => setEditingTicket({ ...editingTicket, url: e.target.value } as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00263f]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Pilih Ikon</label>
                <div className="flex gap-2">
                  {AVAILABLE_ICONS.map(icon => {
                    const IconComp = getIconComponent(icon);
                    const isSelected = editingTicket.iconName === icon;
                    return (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setEditingTicket({ ...editingTicket, iconName: icon })}
                        className={`p-2 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                          isSelected ? 'bg-[#00263f] text-white border-[#00263f]' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-700'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
                {!isAddingNew ? (
                  <button
                    type="button"
                    onClick={handleDeleteTicket}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus
                  </button>
                ) : <div></div>}
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTicket(null)}
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
    </div>
  );
};
