import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { getFileFromDB, getCachedPdf, setCachedPdf, generateSamplePdfUint8Array } from '../services/storage';
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Maximize2, Minimize2,
  FileText, AlertCircle, RefreshCw, Loader2, Upload
} from 'lucide-react';

if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  } catch (err) {
    console.warn('PDF.js worker setup warning:', err);
  }
}

interface VisualPdfSlideViewerProps {
  title: string;
  subtitle?: string;
  pdfUrl?: string;
  pdfDataUrl?: string;
  pdfData?: Uint8Array | ArrayBuffer;
  rawFile?: File | Blob;
  fileId?: string;
  fileName: string;
  fileSize?: string;
  isAdmin?: boolean;
  initialPage?: number;
  onReplacePdf?: () => void;
  onBack?: () => void;
}

export const VisualPdfSlideViewer: React.FC<VisualPdfSlideViewerProps> = ({
  title, subtitle, pdfUrl, pdfDataUrl, pdfData, rawFile, fileId, fileName, fileSize = 'File PDF', isAdmin = false, initialPage = 1, onReplacePdf, onBack
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    if (initialPage && initialPage >= 1 && initialPage <= (numPages || 999)) {
      setCurrentPage(initialPage);
    }
  }, [initialPage, numPages]);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setErrorMessage(null);

    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch { }
    }

    const initPdfWithTypedArray = (typedArray: Uint8Array) => {
      if (isCancelled) return;
      try {
        const loadingTask = pdfjsLib.getDocument({
          data: typedArray,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/'
        });

        loadingTask.promise
          .then((pdf) => {
            if (isCancelled) return;
            pdfDocRef.current = pdf;
            setNumPages(pdf.numPages);
            setCurrentPage((prev) => Math.min(Math.max(prev, 1), pdf.numPages));
            setIsLoading(false);
          })
          .catch((err: any) => {
            if (isCancelled) return;
            setIsLoading(false);
            setErrorMessage(err?.message || 'Tidak dapat memproses visual berkas PDF.');
          });
      } catch (err: any) {
        if (isCancelled) return;
        setIsLoading(false);
        setErrorMessage(err?.message || 'Gagal memuat dokumen PDF.');
      }
    };

    const readRawFileAsArrayBuffer = (fileToRead: File | Blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (isCancelled) return;
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          initPdfWithTypedArray(new Uint8Array(arrayBuffer));
        } catch (err: any) {
          if (isCancelled) return;
          setIsLoading(false);
          setErrorMessage('Gagal mengonversi data berkas PDF.');
        }
      };
      reader.onerror = () => {
        if (isCancelled) return;
        setIsLoading(false);
        setErrorMessage('Gagal membaca berkas file PDF via FileReader API.');
      };
      reader.readAsArrayBuffer(fileToRead);
    };

    const loadPdf = async () => {
      try {
        if (fileId) {
          const cachedData = getCachedPdf(fileId);
          if (cachedData) { initPdfWithTypedArray(cachedData); return; }
        }
        if (rawFile instanceof Blob || (typeof File !== 'undefined' && rawFile instanceof File)) {
          readRawFileAsArrayBuffer(rawFile); return;
        }
        if (pdfData) {
          if (pdfData instanceof Uint8Array) {
            if (fileId) setCachedPdf(fileId, pdfData);
            initPdfWithTypedArray(pdfData); return;
          }
          if (pdfData instanceof ArrayBuffer) {
            const bytes = new Uint8Array(pdfData);
            if (fileId) setCachedPdf(fileId, bytes);
            initPdfWithTypedArray(bytes); return;
          }
        }
        if (fileId) {
          const fileRecord = await getFileFromDB(fileId);
          if (fileRecord?.data) {
            const dataObj = fileRecord.data as any;
            if (dataObj instanceof Blob || (typeof File !== 'undefined' && dataObj instanceof File)) {
              readRawFileAsArrayBuffer(dataObj); return;
            }
            if (typeof fileRecord.data === 'string' && fileRecord.data.startsWith('data:')) {
              const base64Data = fileRecord.data.split(',')[1] || fileRecord.data;
              const binaryString = window.atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
              setCachedPdf(fileId, bytes);
              initPdfWithTypedArray(bytes); return;
            }
          }
        }
        const sourceUrl = pdfDataUrl || pdfUrl;
        if (sourceUrl && sourceUrl.startsWith('data:')) {
          const base64Data = sourceUrl.split(',')[1] || sourceUrl;
          const binaryString = window.atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
          if (fileId) setCachedPdf(fileId, bytes);
          initPdfWithTypedArray(bytes); return;
        }
        if (sourceUrl && sourceUrl.trim() !== '' && !sourceUrl.startsWith('blob:')) {
          try {
            const response = await fetch(sourceUrl);
            if (response.ok) {
              readRawFileAsArrayBuffer(await response.blob()); return;
            }
          } catch (fetchErr) {
            console.warn('Gagal fetch sourceUrl', fetchErr);
          }
        }
        const samplePdf = generateSamplePdfUint8Array(title, subtitle || 'Standar Prosedur Operasional');
        initPdfWithTypedArray(samplePdf);
      } catch (err: any) {
        if (isCancelled) return;
        setIsLoading(false);
        setErrorMessage(err?.message || 'Gagal memproses visual berkas PDF.');
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) { try { renderTaskRef.current.cancel(); } catch { } }
    };
  }, [pdfUrl, pdfDataUrl, pdfData, rawFile, fileId]);

  useEffect(() => {
    let isCancelled = false;
    const renderPage = async () => {
      if (!pdfDocRef.current || !canvasRef.current || numPages === 0) return;
      try {
        if (renderTaskRef.current) { try { renderTaskRef.current.cancel(); } catch { } }

        const page = await pdfDocRef.current.getPage(currentPage);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Ambil dimensi kontainer aktual saat ini
        const containerWidth = containerRef.current?.clientWidth || 900;
        const containerHeight = containerRef.current?.clientHeight || 600;
        
        const unscaledViewport = page.getViewport({ scale: 1, rotation });
        
        // Cek ruang tersedia dengan mengurangi area toolbar
        const availableWidth = Math.max(containerWidth - 48, 320);
        const availableHeight = Math.max(containerHeight - 140, 320); 

        // Kunci rasio agar fit-to-screen bekerja sempurna dari lebar dan tinggi
        const fitWidthScale = availableWidth / unscaledViewport.width;
        const fitHeightScale = availableHeight / unscaledViewport.height;
        const autoFitScale = Math.min(fitWidthScale, fitHeightScale) * 0.98;
        
        const effectiveScale = autoFitScale * scale;

        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: effectiveScale, rotation });

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);

        const renderTask = page.render({ canvasContext: ctx, viewport: viewport });
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') console.error(err);
      }
    };
    renderPage();
    return () => { isCancelled = true; };
  }, [currentPage, scale, rotation, numPages, isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        if (currentPage < numPages) setCurrentPage((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, numPages]);

  const toggleFullscreen = () => {
    const element = containerRef.current;
    if (!element) return;
    if (!document.fullscreenElement) {
      element.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      id="visual-pdf-viewer-container"
      className={`w-full flex flex-col overflow-hidden select-none transition-all ${
        isFullscreen ? 'bg-slate-950 rounded-none border-none' : 'bg-[#f6f4ee] rounded-2xl border border-[#d6cfbf] shadow-sm'
      }`}
    >
      {/* Top Toolbar */}
      <div className="bg-[#00263f] text-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#3c586d]/40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <FileText className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h4 className="text-xs sm:text-sm font-black text-white truncate max-w-[220px] sm:max-w-md">
              {fileName || title}
            </h4>
            <p className="text-[11px] text-[#c0c9ce] flex items-center gap-1.5 font-medium">
              <span>{fileSize}</span> <span>•</span> <span className="text-emerald-400 font-bold">Visual Slide PPT</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-1 text-xs border border-slate-700/50">
            <button onClick={() => setScale((prev) => Math.max(prev - 0.15, 0.6))} className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition cursor-pointer" title="Perkecil Slide">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-slate-300">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale((prev) => Math.min(prev + 0.15, 1.8))} className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition cursor-pointer" title="Perbesar Slide">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {isAdmin && pdfUrl && (
            <a href={pdfUrl} download={fileName} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs text-slate-200 hover:text-white font-semibold transition border border-slate-700/50 cursor-pointer" title="Unduh Berkas Asli">
              <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Unduh</span>
            </a>
          )}

          <button onClick={toggleFullscreen} className="p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition cursor-pointer border border-slate-700/50" title="Layar Penuh">
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {isAdmin && onReplacePdf && (
            <button onClick={onReplacePdf} className="ml-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg transition shadow-sm cursor-pointer flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Ganti File</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Display Area */}
      <div className={`flex-1 p-4 sm:p-6 flex items-center justify-center overflow-auto ${
        isFullscreen ? 'bg-slate-950 h-screen' : 'bg-[#e7e3d8]/50 min-h-[420px] max-h-[720px]'
      }`}>
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-600">
            <Loader2 className="w-8 h-8 animate-spin text-[#00263f] mb-3" />
            <p className="text-sm font-bold text-slate-800">Menyiapkan Visual Slide...</p>
          </div>
        )}
        {errorMessage && !isLoading && (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 max-w-md text-center shadow-md">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-slate-900 mb-1">Gagal Membuka Visual Slide</h4>
            <p className="text-xs text-slate-600 mb-4">{errorMessage}</p>
          </div>
        )}
        
        <div className={`flex justify-center items-center ${isLoading || errorMessage ? 'hidden' : 'block'}`}>
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-300/80">
            <canvas ref={canvasRef} className="block max-w-full h-auto cursor-default" />
          </div>
        </div>
      </div>

      {/* Bottom Navigation Toolbar */}
      {numPages > 0 && !isLoading && !errorMessage && (
        <div className="bg-white px-4 py-3 border-t border-[#d6cfbf] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage <= 1} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-[#d6cfbf] bg-white text-slate-700 hover:bg-[#eeebe1] disabled:opacity-40 transition cursor-pointer">
              <ChevronLeft className="w-4 h-4" /> <span>Sebelumnya</span>
            </button>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numPages))} disabled={currentPage >= numPages} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-[#d6cfbf] bg-white text-slate-700 hover:bg-[#eeebe1] disabled:opacity-40 transition cursor-pointer">
              <span>Selanjutnya</span> <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs font-bold text-slate-600">
            Slide <span className="text-[#00263f] font-extrabold text-sm">{currentPage}</span> dari <span className="text-slate-800">{numPages}</span>
          </div>
        </div>
      )}
    </div>
  );
};
