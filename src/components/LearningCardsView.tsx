import React from 'react';
import { ChevronRight } from 'lucide-react';
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
  onBackToHome?: () => void;
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
      <div className="flex items-center gap-2.5 text-sm md:text-[15px] font-bold text-[#00263f] mb-5 sm:mb-6 tracking-wide">
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
    </div>
  );
};
