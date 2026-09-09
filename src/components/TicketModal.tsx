import React, { useState } from 'react';
import { X, Wrench, AlertTriangle, CheckCircle, Send, PhoneCall } from 'lucide-react';
import { CategoryId, TicketRequest } from '../types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTicket: (ticket: Omit<TicketRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  onSubmitTicket
}) => {
  const [storeName, setStoreName] = useState('Gerai Kintoun Merdeka - Bandung');
  const [category, setCategory] = useState<CategoryId>('equipment');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmitTicket({
      storeName,
      category,
      urgency,
      title: title.trim(),
      description: description.trim()
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setTitle('');
      setDescription('');
      onClose();
    }, 1800);
  };

  return (
    <div 
      id="modal-ticket-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        id="modal-ticket-card"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-[#00263f] text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">Pusat Bantuan & Tiket Teknisi</h3>
              <p className="text-xs text-[#c0c9ce]">Permintaan penanganan teknisi khusus & eskalasi gerai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Tiket Bantuan Berhasil Dibuat!</h4>
            <p className="text-xs text-slate-600">
              Tim Teknisi & Operasional Pusat Kintoun telah menerima laporan ini dan segera menghubungi gerai.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Gerai / Outlet
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kategori Kendala
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="equipment">Peralatan / Mesin (Equipment)</option>
                  <option value="product">Kualitas Bahan / Produk (Product)</option>
                  <option value="stock">Stok & Logistik (Stock & Supply)</option>
                  <option value="customer">Eskalasi Pelanggan (Customer)</option>
                  <option value="store">Fasilitas Gerai (Store)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tingkat Urgensi
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="low">Rendah (Pengecekan Berkala)</option>
                  <option value="medium">Sedang (Dalam 24 Jam)</option>
                  <option value="high">Tinggi (Mempengaruhi Penjualan)</option>
                  <option value="critical">Darurat (Toko Stop Operasional)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Judul Masalah / Perbaikan
              </label>
              <input
                type="text"
                placeholder="Contoh: Mesin Grinder Bunyi Kasar / Cup Sealer Bocor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Deskripsi Kendala & Kronologi
              </label>
              <textarea
                rows={3}
                placeholder="Jelaskan detail kendala yang dialami dan langkah awal yang sudah dicoba oleh barista..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900">
              <PhoneCall className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Untuk kondisi darurat mendesak, teknisi on-call Kintoun dapat dihubungi via hotline 24/7 di <strong>0812-KINTOUN-SOP</strong>.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#00263f] hover:bg-[#3c586d] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Tiket ke Teknisi</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
