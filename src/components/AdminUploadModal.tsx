import React, { useState, useRef } from 'react';
import { 
  X, Upload, FileText, CheckCircle, Image as ImageIcon, 
  AlertCircle, FolderOpen
} from 'lucide-react';
import { CategoryId } from '../types';

interface AdminUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (payload: {
    targetType: 'main-news' | 'specific-news' | 'subcategory';
    categoryId?: CategoryId;
    subcategoryId?: string;
    title: string;
    subtitle: string;
    summary: string;
    pdfUrl: string;
    fileName: string;
    fileSize: string;
    thumbnailUrl?: string;
    notifyUsers: boolean;
  }) => void;
}

export const AdminUploadModal: React.FC<AdminUploadModalProps> = ({
  isOpen, onClose, onUploadSuccess
}) => {
  const [targetType, setTargetType] = useState<'main-news' | 'specific-news' | 'subcategory'>('main-news');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('customer');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('customer-complaint');
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [summary, setSummary] = useState('');
  const [notifyUsers, setNotifyUsers] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateAndSetFile = (f: File) => {
    setErrorMessage('');
    const extension = f.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf' && extension !== 'pptx' && extension !== 'ppt') {
      setErrorMessage('Hanya mendukung format .pdf, .pptx, atau .ppt');
      return;
    }
    setFile(f);
    if (!title) {
      const cleanName = f.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setTitle(cleanName.toUpperCase());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) validateAndSetFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Silakan pilih file PDF atau PPT yang ingin diupload.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Judul dokumen wajib diisi.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Bungkus file mentah ke FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());

      // 2. Tembak langsung ke API Hostinger Anda
      const response = await fetch('https://kintouncoffee.id/partner/api/upload.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
         throw new Error('Gagal merespons dari server Hostinger. Pastikan API PHP tersedia.');
      }

      const result = await response.json();

      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal mengunggah file ke server Hostinger.');
      }

      const formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      // 3. Update UI dengan URL asli dari Hostinger
      onUploadSuccess({
        targetType,
        categoryId: targetType !== 'main-news' ? selectedCategory : undefined,
        subcategoryId: targetType === 'subcategory' ? selectedSubcategory : undefined,
        title: title.trim(),
        subtitle: subtitle.trim() || 'Modul Operasional Resmi Kintoun 2026',
        summary: summary.trim() || `Diunggah oleh Administrator pada ${new Date().toLocaleDateString('id-ID')}`,
        pdfUrl: result.fileUrl, // <-- File dipanggil langsung dari server
        fileName: file.name,
        fileSize: formattedSize,
        thumbnailUrl: thumbnailPreview,
        notifyUsers
      });

      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Koneksi terputus. Pastikan file upload.php sudah ada di Hostinger.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in duration-150">
        <div className="bg-[#00263f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Input Dokumen (Hostinger API)</h3>
              <p className="text-xs text-[#c0c9ce]">Otomatis sinkron ke seluruh gerai</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/70 hover:text-white transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">1. Pilih Penempatan Materi</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetType('main-news')}
                className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition cursor-pointer ${
                  targetType === 'main-news' ? 'bg-[#00263f] text-white border-[#00263f]' : 'bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                Beranda
              </button>
              <button
                type="button"
                onClick={() => setTargetType('specific-news')}
                className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition cursor-pointer ${
                  targetType === 'specific-news' ? 'bg-[#00263f] text-white border-[#00263f]' : 'bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                Specific News
              </button>
              <button
                type="button"
                onClick={() => setTargetType('subcategory')}
                className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition cursor-pointer ${
                  targetType === 'subcategory' ? 'bg-[#00263f] text-white border-[#00263f]' : 'bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                SOP Gerai
              </button>
            </div>
          </div>

          {targetType !== 'main-news' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori Utama</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as CategoryId)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none"
                >
                  <option value="customer">CUSTOMER ISSUE</option>
                  <option value="product">PRODUCT ISSUE</option>
                  <option value="equipment">EQUIPMENT ISSUE</option>
                  <option value="people">PEOPLE ISSUE</option>
                  <option value="stock">STOCK & SUPPLY ISSUE</option>
                  <option value="store">STORE ISSUE</option>
                </select>
              </div>
              {targetType === 'subcategory' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Sub-Topik</label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none"
                  >
                    <option value="customer-complaint">Customer Complaint</option>
                    <option value="service-recovery">Service Recovery</option>
                    <option value="customer-experience">Customer Experience</option>
                    <option value="escalation">Escalation</option>
                    <option value="feedback-complaint">Feedback & Complaint Form</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">2. Pilih File PDF</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                isDragging ? 'border-blue-500 bg-blue-50/50' : file ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-300 bg-slate-50/50'
              }`}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.pptx,.ppt" onChange={handleFileChange} className="hidden" />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">{file.name}</p>
                    <p className="text-[11px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Klik atau tarik file ke sini</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">3. Judul Dokumen</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Sub-Judul / Ringkasan Singkat</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 mt-4">
            <button type="button" onClick={onClose} disabled={isProcessing} className="px-4 py-2 text-xs font-bold text-slate-600">Batal</button>
            <button type="submit" disabled={isProcessing} className="px-5 py-2.5 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2">
              {isProcessing ? 'Mengunggah ke Hostinger...' : <><Upload className="w-4 h-4" /> Publikasikan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
