import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle, 
  Image as ImageIcon, 
  AlertCircle,
  FolderOpen,
  Send
} from 'lucide-react';
import { CategoryId } from '../types';
import { saveFileToDB, setCachedPdf } from '../services/storage';

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
    pdfDataUrl?: string;
    rawFile?: File | Blob;
    pdfData?: Uint8Array;
    fileId?: string;
    fileName: string;
    fileSize: string;
    thumbnailUrl?: string;
    notifyUsers: boolean;
  }) => void;
}

export const AdminUploadModal: React.FC<AdminUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [targetType, setTargetType] = useState<'main-news' | 'specific-news' | 'subcategory'>('main-news');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('customer');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('customer-complaint');
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [summary, setSummary] = useState('');
  const [notifyUsers, setNotifyUsers] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      validateAndSetFile(selected);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    setErrorMessage('');
    const extension = f.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf' && extension !== 'pptx' && extension !== 'ppt') {
      setErrorMessage('Hanya mendukung format .pdf, .pptx, atau .ppt');
      return;
    }
    setFile(f);
    if (!title) {
      // Auto fill title from filename
      const cleanName = f.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setTitle(cleanName.toUpperCase());
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imgFile = e.target.files[0];
      setThumbnailFile(imgFile);
      // Baca thumbnail menggunakan FileReader data URL (hindari createObjectURL)
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(imgFile);
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
      const fileId = `file_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

      // 1. Membaca objek File mentah menggunakan FileReader API (metode readAsArrayBuffer)
      // untuk mempersiapkan typedArray data biner
      const arrayBuffer: ArrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(new Error('Gagal membaca berkas PDF'));
        reader.readAsArrayBuffer(file);
      });
      const typedArray = new Uint8Array(arrayBuffer);

      // 2. Simpan typedArray ke memory cache untuk akses instan di PDF Viewer
      setCachedPdf(fileId, typedArray);

      // 3. Simpan objek File mentah ke IndexedDB
      await saveFileToDB(fileId, file, file.name, file.type);

      const formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      onUploadSuccess({
        targetType,
        categoryId: targetType !== 'main-news' ? selectedCategory : undefined,
        subcategoryId: targetType === 'subcategory' ? selectedSubcategory : undefined,
        title: title.trim(),
        subtitle: subtitle.trim() || 'Modul Operasional Resmi Kintoun 2026',
        summary: summary.trim() || `Diunggah oleh Administrator pada ${new Date().toLocaleDateString('id-ID')}`,
        pdfUrl: '',
        rawFile: file,
        pdfData: typedArray,
        fileId,
        fileName: file.name,
        fileSize: formattedSize,
        thumbnailUrl: thumbnailPreview,
        notifyUsers
      });

      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('Gagal menyimpan file ke database lokal browser. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      id="modal-admin-upload-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        id="modal-admin-upload-card"
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-[#00263f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Input Dokumen PDF / PPT (Admin)</h3>
              <p className="text-xs text-[#c0c9ce]">Konten akan langsung tampil ke seluruh user partner</p>
            </div>
          </div>
          <button
            id="btn-close-upload-modal"
            onClick={onClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Destination Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Pilih Penempatan Materi
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="target-main-news"
                onClick={() => setTargetType('main-news')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition cursor-pointer ${
                  targetType === 'main-news'
                    ? 'bg-[#00263f] text-white border-[#00263f] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Main News (Beranda)
              </button>
              <button
                type="button"
                id="target-specific-news"
                onClick={() => setTargetType('specific-news')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition cursor-pointer ${
                  targetType === 'specific-news'
                    ? 'bg-[#00263f] text-white border-[#00263f] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Specific News
              </button>
              <button
                type="button"
                id="target-subcategory"
                onClick={() => setTargetType('subcategory')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition cursor-pointer ${
                  targetType === 'subcategory'
                    ? 'bg-[#00263f] text-white border-[#00263f] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Topik Masalah / SOP
              </button>
            </div>
          </div>

          {/* Category Dropdown if specific or subcategory */}
          {targetType !== 'main-news' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Kategori Utama
                </label>
                <select
                  id="select-upload-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as CategoryId)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Sub-Topik / Kartu
                  </label>
                  <select
                    id="select-upload-subcategory"
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="customer-complaint">Customer Complaint (Kartu Belajar No Ice)</option>
                    <option value="service-recovery">Service Recovery</option>
                    <option value="customer-experience">Customer Experience</option>
                    <option value="escalation">Escalation</option>
                    <option value="feedback-complaint">Feedback & Complaint Form</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* File Drag & Drop Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              2. Pilih File PDF / PPT
            </label>
            <div
              id="upload-dropzone"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50'
                  : file
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.pptx,.ppt"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center justify-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{file.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Visual slide siap dirender langsung
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <FolderOpen className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-700">
                    Klik untuk pilih file atau tarik file ke sini
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Mendukung berkas PDF hasil ekspor PowerPoint (PPT) & PDF Dokumen Resmi
                  </p>
                </div>
              )}
            </div>
            <div className="mt-2 p-2.5 bg-sky-50 border border-sky-200/80 rounded-xl text-[11px] text-sky-900 flex items-start gap-2">
              <span className="text-sm shrink-0">💡</span>
              <p className="leading-relaxed">
                <strong>Tips Tampilan Sempurna:</strong> Ekspor presentasi PPT Anda ke format <strong>PDF</strong> (di PowerPoint: <em>File &gt; Export / Save As PDF</em>). Seluruh slide, gambar, tata letak, dan diagram akan langsung tampil tajam dan interaktif di layar gerai!
              </p>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                3. Judul Dokumen
              </label>
              <input
                id="input-upload-title"
                type="text"
                placeholder="Contoh: STANDARISASI PENYAJIAN NO ICE KINTOUN 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sub-Judul / Ringkasan Singkat
              </label>
              <input
                id="input-upload-subtitle"
                type="text"
                placeholder="Contoh: Modul Pelatihan Barista & Panduan Resep"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Optional Thumbnail Image */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              4. Gambar Thumbnail Banner (Opsional)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="btn-pick-thumbnail"
                onClick={() => thumbnailInputRef.current?.click()}
                className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition"
              >
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <span>Pilih Gambar Thumbnail</span>
              </button>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              {thumbnailPreview && (
                <div className="flex items-center gap-2">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-10 h-10 object-cover rounded-md border border-slate-300" 
                  />
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Thumbnail Terpasang
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Broadcast Notification Checkbox */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                id="checkbox-notify-users"
                type="checkbox"
                checked={notifyUsers}
                onChange={(e) => setNotifyUsers(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-700">
                Kirim notifikasi otomatis ke semua akun partner/staff bahwa materi baru telah dirilis
              </span>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              id="btn-cancel-upload"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-submit-upload"
              disabled={isProcessing}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              {isProcessing ? (
                <span>Menyimpan Dokumen...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publikasikan Dokumen PDF</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
