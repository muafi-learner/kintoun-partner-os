import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Upload, FileText, AlertCircle, FolderOpen
} from 'lucide-react';
import { CategoryId } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

// Menggunakan CDN untuk worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface AdminUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTargetType?: 'main-news' | 'subcategory';
  initialCategoryId?: CategoryId;
  initialSubcategoryId?: string;
  subcategories: any[];
  onUploadSuccess: (payload: {
    targetType: 'main-news' | 'subcategory';
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
    extractedText?: string;
  }) => void;
}

export const AdminUploadModal: React.FC<AdminUploadModalProps> = ({
  isOpen, onClose, onUploadSuccess, initialTargetType, initialCategoryId, initialSubcategoryId, subcategories
}) => {
  const [targetType, setTargetType] = useState<'main-news' | 'subcategory'>('main-news');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('customer');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [summary, setSummary] = useState('');
  const [notifyUsers, setNotifyUsers] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Mengunggah...');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSpecificUpload = !!initialSubcategoryId;

  useEffect(() => {
    if (isOpen) {
      setTargetType(initialTargetType || 'main-news');
      setSelectedCategory(initialCategoryId || 'customer');
      setSelectedSubcategory(initialSubcategoryId || '');
      setFile(null);
      setErrorMessage('');
      setIsProcessing(false);
      setTitle('');
      setSubtitle('');
    }
  }, [isOpen, initialTargetType, initialCategoryId, initialSubcategoryId]);

  const filteredSubcategories = subcategories.filter(sub => sub.categoryId === selectedCategory);

  useEffect(() => {
    if (!isSpecificUpload && filteredSubcategories.length > 0) {
      if (!filteredSubcategories.find(s => s.id === selectedSubcategory)) {
        setSelectedSubcategory(filteredSubcategories[0].id);
      }
    } else if (!isSpecificUpload) {
      setSelectedSubcategory('');
    }
  }, [selectedCategory, filteredSubcategories, selectedSubcategory, isSpecificUpload]);

  if (!isOpen) return null;

  const validateAndSetFile = (f: File) => {
    setErrorMessage('');
    const extension = f.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf' && extension !== 'pptx' && extension !== 'ppt') {
      setErrorMessage('Hanya mendukung format .pdf, .pptx, atau .ppt');
      return;
    }
    setFile(f);
    if (!title && !isSpecificUpload) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Silakan pilih file PDF atau PPT yang ingin diupload.');
      return;
    }

    let finalTitle = title;
    let finalSubtitle = subtitle;
    let finalSummary = summary;

    if (targetType === 'subcategory') {
      const selectedSubObj = subcategories.find(s => s.id === selectedSubcategory);
      if (!selectedSubObj) {
        setErrorMessage('Pilih sub-topik yang valid terlebih dahulu.');
        return;
      }
      finalTitle = selectedSubObj.title;
      finalSubtitle = selectedSubObj.description || '';
      finalSummary = selectedSubObj.note || '';
    } else {
      if (!title.trim()) {
        setErrorMessage('Judul dokumen wajib diisi.');
        return;
      }
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      let extractedText = '';
      
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setProcessingStatus('Mengekstrak teks PDF...');
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          
          const maxPages = Math.min(pdf.numPages, 20); 
          for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            extractedText += pageText + ' ';
          }
        } catch (extractErr) {
          console.warn('Gagal mengekstrak teks:', extractErr);
        }
      }

      setProcessingStatus('Mengirim ke server...');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', finalTitle.trim());
      formData.append('targetType', targetType);
      formData.append('extractedText', extractedText.trim());
      
      if (targetType === 'subcategory') {
        formData.append('categoryId', selectedCategory);
        formData.append('subcategoryId', selectedSubcategory);
      }

      const response = await fetch('https://kintouncoffee.id/partner/api/upload.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
         throw new Error('Gagal merespons dari server Hostinger.');
      }

      const result = await response.json();

      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal mengunggah file.');
      }

      const formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      onUploadSuccess({
        targetType,
        categoryId: targetType === 'subcategory' ? selectedCategory : undefined,
        subcategoryId: targetType === 'subcategory' ? selectedSubcategory : undefined,
        title: finalTitle.trim(),
        subtitle: finalSubtitle.trim() || 'Modul Operasional Resmi Kintoun 2026',
        summary: finalSummary.trim() || `Diunggah oleh Administrator pada ${new Date().toLocaleDateString('id-ID')}`,
        pdfUrl: result.fileUrl,
        fileName: file.name,
        fileSize: formattedSize,
        thumbnailUrl: thumbnailPreview,
        notifyUsers,
        extractedText: extractedText.trim()
      });

      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Koneksi terputus. Pastikan API tersedia.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('Mengunggah...');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-white rounded-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in duration-150 ${isSpecificUpload ? 'max-w-sm' : 'max-w-xl'}`}>
        
        {/* //code: Sembunyikan header biru jika ini mode pop-up minimalis */}
        {!isSpecificUpload && (
          <div className="bg-[#00263f] text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div>
                <h3 className="text-base font-bold">Input Dokumen</h3>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-white/70 hover:text-white transition cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMessage}
            </div>
          )}

          {!isSpecificUpload && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">1. Pilih Penempatan Materi</label>
                <div className="grid grid-cols-2 gap-2">
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
                    onClick={() => setTargetType('subcategory')}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition cursor-pointer ${
                      targetType === 'subcategory' ? 'bg-[#00263f] text-white border-[#00263f]' : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    Kategori
                  </button>
                </div>
              </div>

              {targetType === 'subcategory' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
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
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Sub-Kategori</label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none"
                      disabled={filteredSubcategories.length === 0}
                    >
                      {filteredSubcategories.length > 0 ? (
                        filteredSubcategories.map(sub => (
                          <option key={sub.id} value={sub.id}>
                            {sub.title}
                          </option>
                        ))
                      ) : (
                        <option value="">Belum ada sub-kategoriopik</option>
                      )}
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            {!isSpecificUpload && (
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                2. Pilih File PDF
              </label>
            )}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              // //code: Tambahkan py-16 atau h-48 untuk membuat kotaknya lebih tinggi (persegi)
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
                isSpecificUpload ? 'py-16 px-6' : 'p-6' 
              } ${
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
                  <p className="text-xs font-bold text-slate-500">Klik atau tarik file .pdf ke sini</p>
                </div>
              )}
            </div>
          </div>

          {!isSpecificUpload && targetType === 'main-news' && (
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
          )}

          <div className={`flex items-center justify-end gap-2 ${!isSpecificUpload ? 'pt-3 border-t border-slate-200 mt-4' : 'mt-2'}`}>
            <button type="button" onClick={onClose} disabled={isProcessing} className="px-4 py-2 text-xs font-bold text-slate-600">Batal</button>
            <button type="submit" disabled={isProcessing} className="px-5 py-2.5 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2">
              {isProcessing ? processingStatus : <><Upload className="w-4 h-4" /> Publikasikan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
