import React from 'react';
import { ChevronRight, FileText, ArrowLeft, Upload, Share2, Calendar, User } from 'lucide-react';
import { NewsArticle, CategoryId } from '../types';
import { PdfViewer } from './PdfViewer';

interface NewsDetailViewProps {
  article: NewsArticle;
  categoryId?: CategoryId;
  onBack: () => void;
  onOpenUpload: () => void;
  isAdmin: boolean;
  targetSlide?: number;
}

export const NewsDetailView: React.FC<NewsDetailViewProps> = ({
  article,
  categoryId,
  onBack,
  onOpenUpload,
  isAdmin,
  targetSlide = 1
}) => {
  const isMain = article.type === 'main';

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full font-sans">
      {/* Breadcrumb row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <nav className="flex items-center space-x-2 text-sm sm:text-base font-bold text-slate-800">
          {isMain ? (
            <>
              <button 
                id="news-breadcrumb-home"
                onClick={onBack} 
                className="hover:text-[#00263f] transition"
              >
                Homepage
              </button>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="text-[#00263f] font-extrabold">Main News</span>
            </>
          ) : (
            <>
              <button 
                id="news-breadcrumb-beranda"
                onClick={onBack} 
                className="hover:text-[#00263f] transition"
              >
                Beranda
              </button>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button 
                id="news-breadcrumb-cat"
                onClick={onBack} 
                className="hover:text-[#00263f] transition uppercase"
              >
                {categoryId ? `${categoryId} Issue` : 'Category'}
              </button>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="text-[#00263f] font-extrabold">
                {categoryId ? `${categoryId.toUpperCase()} ISSUE NEWS` : 'Issue News'}
              </span>
            </>
          )}
        </nav>

        {isAdmin && (
          <button
            id="btn-admin-replace-news-pdf"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition"
          >
            <Upload className="w-4 h-4" />
            <span>Ganti PDF / PPT News</span>
          </button>
        )}
      </div>

      {/* DOKUMEN PRESENTASI PPT & PDF RESMI (Langsung tampil tanpa banner thumbnail redundan) */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00263f]" />
            <span>KONTEN PRESENTASI PPT & DOKUMEN PDF RESMI</span>
          </h3>
        </div>

        <PdfViewer
          title={article.title}
          subtitle={article.subtitle}
          pdfUrl={article.pdfUrl}
          pdfDataUrl={article.pdfDataUrl}
          rawFile={article.rawFile}
          pdfData={article.pdfData}
          fileId={article.fileId}
          fileName={article.pdfFileName}
          fileSize={article.pdfFileSize}
          slideDeck={article.slideDeck}
          isAdmin={isAdmin}
          initialPage={targetSlide}
          onReplacePdf={onOpenUpload}
          onBack={onBack}
        />
      </div>
    </div>
  );
};
