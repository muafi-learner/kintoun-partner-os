import React from 'react';
import { ChevronRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { SubcategoryCard } from '../types';
import { PdfViewer } from './PdfViewer';
import { EmptyModuleState } from './EmptyModuleState';
import { isSubcategoryUploaded } from '../utils/uploadStatus';

const formatTitleCase = (text: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface LearningCardsViewProps {
  cardData: SubcategoryCard;
  onBack: () => void;
  onOpenUpload: () => void;
  onDeletePdf?: (subcategoryId: string) => void;
  isAdmin: boolean;
  targetSlide?: number;
}

export const LearningCardsView: React.FC<LearningCardsViewProps> = ({
  cardData,
  onBack,
  onOpenUpload,
  onDeletePdf,
  isAdmin,
  targetSlide = 1
}) => {
  const isUploaded = isSubcategoryUploaded(cardData);
  const slideDeck = cardData.slideDeck && cardData.slideDeck.length > 0 ? cardData.slideDeck : undefined;

  return (
    <div className="relative flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full font-sans pb-20">
      {/* Top Breadcrumb Row (Tanpa tombol oranye yang sesak) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            id="btn-back-to-category"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-[#d6cfbf] hover:bg-[#eeebe1] hover:text-[#00263f] transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          
          <nav className="hidden sm:flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-800 ml-2">
            <button
              onClick={onBack}
              className="hover:text-[#00263f] transition cursor-pointer"
            >
              Homepage
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            
            <button
              onClick={onBack}
              className="hover:text-[#00263f] transition cursor-pointer"
            >
              {formatTitleCase(`${cardData.categoryId} Issue`)}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            
            <span className="text-[#00263f] font-bold truncate max-w-[200px] sm:max-w-none">
              {formatTitleCase(cardData.title)}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content Viewer */}
      <div id="ppt-viewer-wrapper" className="w-full">
        {!isUploaded ? (
          <EmptyModuleState
            title={cardData.title}
            categoryName={`${cardData.categoryId.toUpperCase()} ISSUE`}
            isAdmin={isAdmin}
            onUpload={onOpenUpload}
            onBack={onBack}
          />
        ) : (
          <PdfViewer
            title={`PRESENTASI PPT: ${formatTitleCase(cardData.title)}`}
            subtitle={cardData.description}
            fileName={cardData.pdfFileName || `${cardData.title.replace(/\s+/g, '_')}_Presentation.pdf`}
            pdfUrl={cardData.pdfUrl}
            pdfDataUrl={cardData.pdfDataUrl}
            rawFile={cardData.rawFile}
            pdfData={cardData.pdfData}
            fileId={cardData.fileId}
            fileSize={cardData.pdfFileSize || cardData.fileSize}
            slideDeck={slideDeck}
            isAdmin={isAdmin}
            initialPage={targetSlide}
            onReplacePdf={onOpenUpload}
            onDeletePdf={onDeletePdf ? () => onDeletePdf(cardData.id) : undefined}
            onBack={onBack}
          />
        )}
      </div>

      {/* TOMBOL BANTUAN TEKNISI FLOATING OVERLAPPING DI POJOK KANAN BAWAH */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://helpdesk.kintouncoffee.id"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4.5 py-2.5 rounded-xl bg-[#00263f] hover:bg-[#3c586d] text-white font-black text-xs tracking-wider uppercase shadow-xl hover:shadow-2xl transition transform hover:scale-105 flex items-center gap-2 cursor-pointer border border-white/10"
        >
          <span>Bantuan Teknisi</span>
          <ExternalLink className="w-4 h-4 text-slate-300" />
        </a>
      </div>
    </div>
  );
};
