import React, { useState, useEffect } from 'react';
import { EmptyModuleState } from './EmptyModuleState';
import { VisualPdfSlideViewer } from './VisualPdfSlideViewer';
import { resolvePdfSource } from '../services/storage';
import { Trash2 } from 'lucide-react';

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
  slideDeck?: any[];
  onReplacePdf?: () => void;
  onDeletePdf?: () => void; // Prop baru untuk aksi hapus
  isAdmin?: boolean;
  initialPage?: number;
  onBack?: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  title, subtitle, pdfUrl, pdfDataUrl, rawFile, pdfData, fileId, fileName, fileSize = 'File Presentasi', onReplacePdf, onDeletePdf, isAdmin = false, initialPage = 1, onBack
}) => {
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(pdfDataUrl || pdfUrl || null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const hasContent = Boolean(activePdfUrl || rawFile || pdfData || fileId);

  const handleDeleteClick = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus dokumen ini secara permanen dari server?")) return;
    if (onDeletePdf) {
      setIsDeleting(true);
      await onDeletePdf();
      setIsDeleting(false);
    }
  };

  if (!hasContent) {
    return (
      <EmptyModuleState title={title} isAdmin={isAdmin} onUpload={onReplacePdf} onBack={onBack} />
    );
  }

  return (
    <div className="w-full flex flex-col gap-2 relative">
      {/* Tombol Hapus Khusus Admin Melayang di Atas Viewer */}
      {isAdmin && onDeletePdf && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md transition cursor-pointer disabled:opacity-50"
            title="Hapus dokumen permanen"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Menghapus...' : 'Hapus Dokumen'}</span>
          </button>
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
};
