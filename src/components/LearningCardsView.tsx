import React from 'react';
import { ChevronRight, ArrowLeft, Upload, AlertCircle, Clock } from 'lucide-react';
import { SubcategoryCard } from '../types';
import { PdfViewer } from './PdfViewer';
import { EmptyModuleState } from './EmptyModuleState';
import { isSubcategoryUploaded } from '../utils/uploadStatus';

interface LearningCardsViewProps {
  cardData: SubcategoryCard;
  onBack: () => void;
  onOpenUpload: () => void;
  isAdmin: boolean;
  targetSlide?: number;
}

export const LearningCardsView: React.FC<LearningCardsViewProps> = ({
  cardData,
  onBack,
  onOpenUpload,
  isAdmin,
  targetSlide = 1
}) => {
  const isUploaded = isSubcategoryUploaded(cardData);

  // If card has explicit uploaded slideDeck, use it
  const slideDeck = cardData.slideDeck && cardData.slideDeck.length > 0 ? cardData.slideDeck : undefined;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            id="btn-back-to-category"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-[#d6cfbf] hover:bg-[#eeebe1] hover:text-[#00263f] transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <nav className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-800 ml-2">
            <button 
              id="breadcrumb-beranda-btn"
              onClick={onBack}
              className="hover:text-[#00263f] transition cursor-pointer"
            >
              Beranda
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button 
              id="breadcrumb-category-btn"
              onClick={onBack}
              className="hover:text-[#00263f] transition capitalize cursor-pointer"
            >
              {cardData.categoryId} Issue
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#00263f] font-extrabold truncate max-w-[200px] sm:max-w-none">
              {cardData.title}
            </span>
          </nav>
        </div>

        {/* Status Indicator & Admin Upload Action */}
        <div className="flex items-center gap-2">
          {isUploaded ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Dokumen Tersedia
            </span>
          ) : (
            isAdmin ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                <AlertCircle className="w-3 h-3 text-amber-700" />
                <span>Perlu Diisi</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Belum Diisi</span>
              </span>
            )
          )}

          {isAdmin && (
            <button
              id="btn-admin-upload-ppt"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition cursor-pointer"
              title={isUploaded ? "Ganti file PPT/PDF untuk materi ini" : "Unggah file PPT/PDF untuk materi ini"}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploaded ? 'Ganti File PPT/PDF' : 'Unggah File PDF / PPT'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Either Empty State or Real Document Presentation */}
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
            title={`PRESENTASI PPT: ${cardData.title}`}
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
            onBack={onBack}
          />
        )}
      </div>
    </div>
  );
};
