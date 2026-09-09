import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Maximize2, 
  FileText, 
  Presentation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { EmptyModuleState } from './EmptyModuleState';
import { VisualPdfSlideViewer } from './VisualPdfSlideViewer';
import { resolvePdfSource } from '../services/storage';

interface PdfViewerProps {
  title: string;
  subtitle?: string;
  pdfUrl?: string;
  pdfDataUrl?: string;
  rawFile?: File | Blob;
  pdfData?: Uint8Array;
  fileId?: string;
  fileName: string;
  fileSize?: string;
  slideDeck?: {
    slideNumber: number;
    title: string;
    points: string[];
    note?: string;
    bgColor?: string;
  }[];
  onReplacePdf?: () => void;
  isAdmin?: boolean;
  initialPage?: number;
  onBack?: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  title,
  subtitle,
  pdfUrl,
  pdfDataUrl,
  rawFile,
  pdfData,
  fileId,
  fileName,
  fileSize = 'File Presentasi',
  slideDeck,
  onReplacePdf,
  isAdmin = false,
  initialPage = 1,
  onBack
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(pdfDataUrl || pdfUrl || null);
  
  // Prefer visual canvas mode if PDF is present, else fall back to text slides
  const [viewMode, setViewMode] = useState<'visual' | 'cards'>(() => {
    return (rawFile || pdfData || fileId || pdfDataUrl || pdfUrl) ? 'visual' : (slideDeck && slideDeck.length > 0 ? 'cards' : 'visual');
  });

  // Resolve valid PDF source (handles IndexedDB restoring and avoids dead blob URLs)
  useEffect(() => {
    let isCancelled = false;
    async function checkSource() {
      const source = await resolvePdfSource({ fileId, pdfDataUrl, pdfUrl });
      if (!isCancelled && source) {
        setActivePdfUrl(source);
      }
    }
    checkSource();
    return () => { isCancelled = true; };
  }, [fileId, pdfDataUrl, pdfUrl]);

  useEffect(() => {
    if (initialPage && initialPage >= 1) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  // If no PDF and no slideDeck, render the clean empty state
  const hasContent = Boolean(activePdfUrl || (slideDeck && slideDeck.length > 0));

  if (!hasContent) {
    return (
      <EmptyModuleState
        title={title}
        isAdmin={isAdmin}
        onUpload={onReplacePdf}
        onBack={onBack}
      />
    );
  }

  // If in visual PDF mode, use the high-fidelity Canvas renderer!
  if (viewMode === 'visual') {
    return (
      <div className="w-full flex flex-col gap-2">
        {/* If text cards are also available, show view switcher */}
        {slideDeck && slideDeck.length > 0 && (
          <div className="flex items-center justify-end gap-2 px-1">
            <div className="flex items-center gap-1 bg-[#eeebe1] p-1 rounded-xl text-xs font-bold border border-[#d6cfbf]">
              <button
                onClick={() => setViewMode('visual')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'visual'
                    ? 'bg-[#00263f] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Visual Slide PPT</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#00263f] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Rangkuman Poin</span>
              </button>
            </div>
          </div>
        )}

        <VisualPdfSlideViewer
          title={title}
          subtitle={subtitle}
          rawFile={rawFile}
          pdfData={pdfData}
          pdfUrl={activePdfUrl || pdfUrl || undefined}
          pdfDataUrl={pdfDataUrl}
          fileId={fileId}
          fileName={fileName}
          fileSize={fileSize}
          isAdmin={isAdmin}
          initialPage={initialPage}
          onReplacePdf={onReplacePdf}
          onBack={onBack}
        />
      </div>
    );
  }

  // Otherwise, render structured card deck display
  const slides = slideDeck || [];
  const totalPages = Math.max(slides.length, 1);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const currentSlide = slides[currentPage - 1] || slides[0] || {
    slideNumber: 1,
    title: title,
    points: ['Materi sedang dipersiapkan...'],
    bgColor: 'bg-slate-900 text-white'
  };

  return (
    <div 
      id="pdf-viewer-container"
      className={`w-full bg-[#f2eee7] rounded-2xl border border-[#d6cfbf] overflow-hidden shadow-xs flex flex-col select-none transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 bg-slate-900 shadow-2xl' : ''
      }`}
    >
      {/* Top Toolbar */}
      <div className="bg-[#00263f] text-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#3c586d]/40">
        {/* Document Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded bg-white/10 text-white flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{fileName}</h4>
            <p className="text-[11px] text-[#c0c9ce]">Ukuran: {fileSize} • Format: Rangkuman Modul PPT</p>
          </div>
        </div>

        {/* View mode switcher */}
        {activePdfUrl && (
          <div className="flex items-center gap-1 bg-[#001726] p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('visual')}
              className="px-2.5 py-1 rounded text-slate-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Visual Slide PPT</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className="px-2.5 py-1 rounded bg-[#3c586d] text-white shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Rangkuman Poin</span>
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 rounded-lg p-1 text-xs">
            <button 
              id="pdf-zoom-out"
              onClick={() => setZoom((prev) => Math.max(prev - 15, 75))} 
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-slate-300">{zoom}%</span>
            <button 
              id="pdf-zoom-in"
              onClick={() => setZoom((prev) => Math.min(prev + 15, 160))} 
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="pdf-rotate"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition cursor-pointer"
            title="Putar 90 Derajat"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Download button */}
          {activePdfUrl && (
            <a
              id="pdf-download-btn"
              href={activePdfUrl}
              download={fileName}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-200 hover:text-white font-medium transition cursor-pointer"
              title="Unduh Berkas"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh</span>
            </a>
          )}

          {/* Fullscreen toggle */}
          <button
            id="pdf-fullscreen-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition cursor-pointer"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Admin Replace Button */}
          {isAdmin && onReplacePdf && (
            <button
              id="admin-replace-pdf-btn"
              onClick={onReplacePdf}
              className="ml-2 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer"
            >
              Ganti PDF/PPT
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-8 flex items-center justify-center overflow-auto min-h-[420px] max-h-[640px] bg-[#dcd5c9]/50">
        <div 
          className="w-full max-w-3xl transition-transform duration-200"
          style={{ 
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'center center'
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden flex flex-col">
            {/* Slide Header */}
            <div className={`p-6 sm:p-8 ${currentSlide.bgColor || 'bg-[#00263f] text-white'}`}>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2">
                <span>KINTOUN OPERATING SYSTEM • SLIDE PRESENTASI</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono">
                  SLIDE {currentPage} / {totalPages}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">{currentSlide.title}</h3>
            </div>

            {/* Slide Body */}
            <div className="p-6 sm:p-8 bg-white text-slate-800 space-y-4">
              <ul className="space-y-3">
                {currentSlide.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>

              {currentSlide.note && (
                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{currentSlide.note}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Toolbar */}
      <div className="bg-white px-4 py-3 border-t border-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            id="pdf-prev-slide-btn"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>
          <button
            id="pdf-next-slide-btn"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Page status */}
        <div className="text-xs font-bold text-slate-600">
          Slide <span className="text-[#00263f] font-extrabold">{currentPage}</span> dari <span className="text-slate-800">{totalPages}</span>
        </div>

        {/* Thumbnail quick jump */}
        <div className="hidden md:flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center transition cursor-pointer ${
                currentPage === idx + 1
                  ? 'bg-[#00263f] text-white shadow'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
