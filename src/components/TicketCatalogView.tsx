import React, { useState } from 'react';
import { 
  ArrowRight, Search, X, Edit3, PlusCircle, 
  Clock, ShieldAlert, Wrench, UserX, FileText, Check, Trash2, HelpCircle
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
  return HelpCircle;
};

interface TicketCatalogViewProps {
  tickets: TicketTemplate[];
  isAdmin: boolean;
  onBack: () => void;
  onUpdateTickets: (newTickets: TicketTemplate[]) => void;
}

export const TicketCatalogView: React.FC<TicketCatalogViewProps> = ({ tickets, isAdmin, onBack, onUpdateTickets }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTicket, setEditingTicket] = useState<TicketTemplate | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddNew = () => {
    setIsAddingNew(true);
    setShowIconPicker(false);
    setEditingTicket({
      id: `tkt_${Date.now()}`,
      department: 'DEPARTEMEN BARU',
      title: '',
      description: '',
      sla: '1x24 Jam',
      iconName: 'file-text',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
    });
  };

  const handleSave = async (e: React.FormEvent) => {
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

      // Pastikan Anda membuat 'update-tickets.php' di Hostinger nanti
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
        alert(result.message || 'Gagal menyimpan tiket.');
      }
    } catch (error) {
      console.error("Gagal menyimpan tiket", error);
      alert('Koneksi terputus. Pastikan file update-tickets.php sudah ada.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
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
    <div className="relative flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full font-sans">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-[#00263f] uppercase tracking-tight mb-2">Katalog Tiket & Eskalasi</h1>
        <p className="text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
          Pilih kategori tiket di bawah ini untuk mengajukan permintaan ke Head Office.
        </p>
      </div>

      <div className="relative w-full md:w-96 mb-8">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari tiket (cth: SP, Mesin, Resign)..."
          className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#d6cfbf] bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00263f] shadow-2xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTickets.map((ticket) => {
          const TicketIcon = getIconComponent(ticket.iconName);
          return (
            <div key={ticket.id} className="group relative bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[220px]">
              {isAdmin && (
                <button onClick={() => { setIsAddingNew(false); setEditingTicket(ticket); }} className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-amber-400 text-slate-600 transition z-10">
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
          <div onClick={handleOpenAddNew} className="border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2"><PlusCircle className="w-5 h-5" /></div>
            <h4 className="text-xs font-black text-amber-900 uppercase">Tambah Form Tiket</h4>
          </div>
        )}
      </div>

      {editingTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-black text-[#00263f] uppercase mb-4">{isAddingNew ? 'Tambah Tiket Baru' : 'Edit Tiket'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
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
              <div className="flex items-center justify-between pt-4 mt-2">
                {!isAddingNew ? (
                  <button type="button" onClick={handleDelete} className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 flex items-center gap-1.5"><Trash2 className="w-4 h-4"/> Hapus</button>
                ) : <div></div>}
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingTicket(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100">Batal</button>
                  <button type="submit" disabled={isSaving} className="px-5 py-2 rounded-xl text-xs font-black bg-[#00263f] text-white flex items-center gap-1.5"><Check className="w-4 h-4"/> Simpan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
