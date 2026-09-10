import React, { useState, useEffect } from 'react';
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
  slideDeck?: any[];
  onReplacePdf?: () => void;
  onDeletePdf?: () => void;
  isAdmin?: boolean;
  initialPage?: number;
  onBack?: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  title, subtitle, pdfUrl, pdfDataUrl, rawFile, pdfData, fileId, fileName, fileSize = 'File Presentasi', onReplacePdf, onDeletePdf, isAdmin = false, initialPage = 1, onBack
}) => {
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(pdfDataUrl || pdfUrl || null);

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

  if (!hasContent) {
    return (
      <EmptyModuleState title={title} isAdmin={isAdmin} onUpload={onReplacePdf} onBack={onBack} />
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
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
        onDeletePdf={onDeletePdf}
        onBack={onBack}
      />
    </div>
  );
};
