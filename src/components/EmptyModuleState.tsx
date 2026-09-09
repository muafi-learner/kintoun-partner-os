import React from 'react';
import { 
  Upload, 
  ArrowLeft, 
  FileQuestion, 
  Clock, 
  HelpCircle,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface EmptyModuleStateProps {
  title: string;
  categoryName?: string;
  isAdmin: boolean;
  onUpload?: () => void;
  onBack?: () => void;
}

export const EmptyModuleState: React.FC<EmptyModuleStateProps> = ({
  title,
  categoryName,
  isAdmin,
  onUpload,
  onBack
}) => {
  return (
    <div 
      id="empty-module-container"
      className="w-full bg-white rounded-2xl border border-[#d6cfbf] shadow-sm overflow-hidden flex flex-col items-center justify-center p-8 sm:p-14 text-center my-2"
    >
      {/* Status Badge */}
      <div className="mb-5">
        {isAdmin ? (
          <span 
            id="badge-admin-perlu-diisi"
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs tracking-wide uppercase"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Materi Kosong • Perlu Diisi</span>
          </span>
        ) : (
          <span 
            id="badge-crew-belum-diisi"
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs tracking-wide uppercase"
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Materi Belum Diisi / Belum Tersedia</span>
          </span>
        )}
      </div>

      {/* Icon */}
      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-6 shadow-xs ${
        isAdmin 
          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
          : 'bg-[#eeebe1] text-slate-600 border border-[#d6cfbf]'
      }`}>
        {isAdmin ? (
          <FileQuestion className="w-8 h-8 sm:w-10 sm:h-10" />
        ) : (
          <FileSpreadsheet className="w-8 h-8 sm:w-10 sm:h-10" />
        )}
      </div>

      {/* Title & Description */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase max-w-xl">
        {isAdmin ? 'Materi Belum Diunggah (Perlu Diisi)' : 'Materi Belum Diisi'}
      </h2>

      <p className="text-sm font-semibold text-slate-500 mb-2">
        Topik: <span className="text-[#00263f] font-bold">{title}</span>
        {categoryName ? ` • ${categoryName}` : ''}
      </p>

      <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg leading-relaxed mb-8">
        {isAdmin
          ? 'Modul panduan dan materi presentasi untuk topik ini belum memiliki dokumen resmi. Silakan unggah file PDF atau PPT dari komputer Anda untuk melengkapi standarisasi operasional gerai.'
          : 'Dokumen panduan dan materi pelatihan untuk topik ini belum diunggah oleh Administrator Pusat. Materi akan langsung tampil setelah dipublikasikan.'
        }
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {isAdmin && onUpload && (
          <button
            id="btn-empty-admin-upload"
            onClick={onUpload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-sm hover:shadow cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Unggah Dokumen PDF / PPT Sekarang</span>
          </button>
        )}

        {onBack && (
          <button
            id="btn-empty-back"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Topik</span>
          </button>
        )}
      </div>

      {/* Helper Footer Notice */}
      <div className="mt-8 pt-6 border-t border-slate-100 max-w-md w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          {isAdmin 
            ? 'Format didukung: .pdf, .pptx, atau .ppt. Ukuran maksimal 50 MB.'
            : 'Butuh bantuan penanganan cepat di gerai? Tanyakan via tombol Bantuan.'
          }
        </span>
      </div>
    </div>
  );
};
