import React from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { SubcategoryCard } from '../types';
import { PdfViewer } from './PdfViewer';
import { EmptyModuleState } from './EmptyModuleState';

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
  onBackToHome?: () => void; // Opsional: Untuk navigasi langsung ke Home
  onOpenUpload: () => void;
  onDeletePdf?: (subcategoryId: string) => void;
  isAdmin: boolean;
  targetSlide?: number;
}

export const LearningCardsView: React.FC<LearningCardsViewProps> = ({
  cardData,
  onBack,
  onBackToHome,
  onOpenUpload,
  onDeletePdf,
  isAdmin,
  targetSlide = 1
}) => {
  // Validasi ketat murni berdasarkan ada tidaknya URL atau ID file fisik
  const isUploaded = Boolean(cardData.pdfUrl || cardData.pdfDataUrl || cardData.fileId || cardData.isUploaded);
  const slideDeck = cardData.slideDeck && cardData.slideDeck.length > 0 ? cardData.slideDeck : undefined;

  return (
    <div className="relative flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full font-sans pb-20">
      
      {/* --- BREADCRUMB HEADER BARU --- */}
      <div className="font-poppins flex items-center gap-2.5 text-sm md:text-[15px] font-semibold text-[#00263f] opacity-70 mb-5 sm:mb-6 tracking-wide">
        <span 
          onClick={onBackToHome || onBack}
          className="cursor-pointer hover:opacity-70 transition"
        >
          Homepage
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2.5]" />
        <span 
          onClick={onBack}
          className="cursor-pointer hover:opacity-70 transition"
        >
          {formatTitleCase(`${cardData.categoryId} Issue`)}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2.5]" />
        <span>
          {formatTitleCase(cardData.title)}
        </span>
      </div>
      {/* --- END OF BREADCRUMB --- */}

      {/* Main Content Viewer / Empty Dropzone */}
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

      {/* TOMBOL BANTUAN TEKNISI FLOATING */}
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
