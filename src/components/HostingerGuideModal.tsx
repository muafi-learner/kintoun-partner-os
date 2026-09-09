import React from 'react';
import { X, Globe, CheckCircle2, Server, FolderUp, ShieldCheck, Terminal, Copy } from 'lucide-react';

interface HostingerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostingerGuideModal: React.FC<HostingerGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="modal-hostinger-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        id="modal-hostinger-card"
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-[#673ab7] text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">Panduan Deployment ke Hostinger</h3>
              <p className="text-xs text-purple-200">Aplikasi siap dipublikasikan ke hosting produksi Hostinger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto text-xs text-slate-700">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">Arsitektur Siap Hostinger Out-of-the-Box</p>
              <p className="text-emerald-700 mt-0.5">
                Proyek ini telah dikonfigurasi dengan Vite SPA standard dan file <code>.htaccess</code> otomatis di folder <code>public/</code> sehingga tidak akan error 404 saat di-refresh di web server Apache/Litespeed Hostinger.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
              Langkah Upload ke Hostinger:
            </h4>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-[#673ab7] text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </span>
              <div>
                <p className="font-bold text-slate-900">Build Proyek</p>
                <p className="text-slate-600 mt-0.5">
                  Jalankan perintah <code>npm run build</code> di terminal Anda. Seluruh file HTML, JavaScript, CSS, dan file <code>.htaccess</code> akan ter-compile ke dalam folder <code>dist/</code>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-[#673ab7] text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </span>
              <div>
                <p className="font-bold text-slate-900">Buka hPanel Hostinger</p>
                <p className="text-slate-600 mt-0.5">
                  Masuk ke dashboard akun Hostinger Anda, pilih <strong>Websites</strong> &gt; klik <strong>Manage</strong> pada domain Anda &gt; buka menu <strong>File Manager</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-[#673ab7] text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </span>
              <div>
                <p className="font-bold text-slate-900">Upload isi folder <code>dist/</code> ke <code>public_html</code></p>
                <p className="text-slate-600 mt-0.5">
                  Masuk ke folder <code>public_html</code> di File Manager Hostinger. Upload semua isi file dari folder <code>dist/</code> (yaitu <code>index.html</code>, folder <code>assets/</code>, dan <code>.htaccess</code>).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-[#673ab7] text-white flex items-center justify-center font-bold text-xs shrink-0">
                4
              </span>
              <div>
                <p className="font-bold text-slate-900">Aplikasi Langsung Aktif!</p>
                <p className="text-slate-600 mt-0.5">
                  Buka nama domain Anda di browser. Semua fitur portal Kintoun, navigasi kartu SOP, input PDF dari frontend akun Administrator, dan storage IndexedDB langsung aktif tanpa perlu setup database server yang rumit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
