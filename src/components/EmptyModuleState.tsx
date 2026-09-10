import React, { useState, useRef } from 'react';
import { 
  Upload, 
  ArrowLeft, 
  Clock, 
  HelpCircle,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  AlertCircle
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
  // Jika user adalah Kru (Bukan Admin), tampilkan tampilan info biasa
  if (!isAdmin) {
    return (
      <div 
        id="empty-module-container"
        className="w-full bg-white rounded-2xl border border-[#d6cfbf] shadow-sm overflow-hidden flex flex-col items-center justify-center p-8 sm:p-14 text-center my-2"
      >
        <div className="mb-5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs tracking-wide uppercase">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Materi Belum Diisi / Belum Tersedia</span>
          </span>
        </div>

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-6 shadow-xs bg-[#eeebe1] text-slate-600 border border-[#d6cfbf]">
          <FileSpreadsheet className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase max-w-xl">
          Materi Belum Diisi
        </h2>

        <p className="text-sm font-semibold text-slate-500 mb-2">
          Topik: <span className="text-[#00263f] font-bold">{title}</span>
          {categoryName ? ` • ${categoryName}` : ''}
        </p>

        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg leading-relaxed mb-8">
          Dokumen panduan dan materi pelatihan untuk topik ini belum diunggah oleh Administrator Pusat. Materi akan langsung tampil setelah dipublikasikan.
        </p>

        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Topik</span>
          </button>
        )}
      </div>
    );
  }

  // TAMPILAN MINIMALIS KHUSUS ADMIN (Langsung Kotak Dropzone Sederhana)
  return (
    <div 
      id="empty-module-container"
      className="w-full bg-white rounded-2xl border border-[#d6cfbf] shadow-sm overflow-hidden flex flex-col items-center justify-center p-8 sm:p-12 text-center my-2 max-w-xl mx-auto"
    >
      <div className="w-full space-y-4 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-[#00263f] uppercase mt-0.5">{title}</h2>
          </div>
        </div>

        {/* Kotak Dropzone Minimalis yang langsung memicu modal upload utama */}
        <div
          onClick={onUpload}
          className="border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/30 rounded-xl py-14 px-6 flex flex-col items-center justify-center text-center cursor-pointer transition group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
            <FolderOpen className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-700">Klik atau tarik file .pdf ke sini</p>
        </div>
      </div>
    </div>
  );
};
