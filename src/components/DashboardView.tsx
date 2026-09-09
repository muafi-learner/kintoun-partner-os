import React from 'react';
import { 
  BarChart3, 
  Ticket, 
  CheckSquare, 
  Coffee, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { TicketRequest } from '../types';

interface DashboardViewProps {
  dashboardName: string;
  tickets: TicketRequest[];
  onOpenTicketModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  dashboardName,
  tickets,
  onOpenTicketModal
}) => {
  return (
    <div className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-6xl mx-auto w-full font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#908371]">
            DASHBOARD OPERASIONAL STORE
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#00263f] mt-0.5">
            {dashboardName}
          </h2>
        </div>

        {dashboardName.includes('TIKETING') && (
          <button
            onClick={onOpenTicketModal}
            className="px-4 py-2 bg-[#00263f] hover:bg-[#3c586d] text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            + Buat Tiket Baru
          </button>
        )}
      </div>

      {dashboardName.includes('TIKETING') ? (
        /* Tiketing Dashboard */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#d6cfbf] shadow-xs">
              <span className="text-xs font-bold text-slate-600">Total Tiket Masuk</span>
              <p className="text-2xl font-black text-[#00263f] mt-1">{tickets.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#d6cfbf] shadow-xs">
              <span className="text-xs font-bold text-slate-600">Status Dalam Penanganan</span>
              <p className="text-2xl font-black text-amber-700 mt-1">
                {tickets.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#d6cfbf] shadow-xs">
              <span className="text-xs font-bold text-slate-600">Selesai (Resolved)</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#d6cfbf] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-800 uppercase tracking-wider">
              Daftar Permintaan Bantuan & Teknisi Khusus
            </div>
            <div className="divide-y divide-slate-100">
              {tickets.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada tiket bantuan aktif. Gunakan tombol &ldquo;BUTUH BANTUAN?&rdquo; di Beranda jika membutuhkan bantuan teknisi.
                </div>
              ) : (
                tickets.map((t) => (
                  <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          t.urgency === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {t.urgency}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{t.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{t.description}</p>
                      <span className="text-[11px] text-slate-400 mt-1 block">Gerai: {t.storeName} • {t.createdAt}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 self-start sm:self-center">
                      {t.status === 'open' ? 'Menunggu Teknisi' : 'Diproses'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Sales & Other Operational Dashboard */
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#d6cfbf] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Target Penjualan Harian</span>
              <p className="text-xl font-black text-[#00263f] mt-1">94.2%</p>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +5.4% vs kemarin
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#d6cfbf] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Cup Terjual (Daily)</span>
              <p className="text-xl font-black text-[#00263f] mt-1">482 Cups</p>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Kapasitas Maks: 600</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#d6cfbf] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Rata-rata Waktu Sajian</span>
              <p className="text-xl font-black text-[#00263f] mt-1">2.4 Menit</p>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Standar SOP: &lt; 3.0 Menit</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#d6cfbf] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Customer Satisfaction</span>
              <p className="text-xl font-black text-[#00263f] mt-1">4.9 / 5.0</p>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Berdasarkan 89 ulasan</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#d6cfbf] shadow-xs">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
              Ringkasan Operasional & Standarisasi SOP
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dashboard ini menyajikan performa gerai partner Kintoun. Seluruh materi SOP, takaran resep no ice, dan modul PPT yang diunggah oleh Administrator dapat diakses melalui menu Partner Support di bilah navigasi kiri.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
