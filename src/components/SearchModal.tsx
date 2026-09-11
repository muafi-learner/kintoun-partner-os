import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  FileText, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  Presentation
} from 'lucide-react';
import { CategoryId, SubcategoryCard, NewsArticle } from '../types';
import { CATEGORIES } from '../data/initialData';
import { searchInsidePdfDocuments, PdfSearchResult } from '../utils/pdfSearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  subcategories: SubcategoryCard[];
  mainNews: NewsArticle;
  specificNews: Record<CategoryId, NewsArticle>;
  onNavigateToCategory: (catId: CategoryId) => void;
  onNavigateToSubcategory: (catId: CategoryId, subcatId: string, targetSlide?: number) => void;
  onNavigateToMainNews: (targetSlide?: number) => void;
  onNavigateToSpecificNews: (catId: CategoryId, targetSlide?: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  subcategories,
  mainNews,
  specificNews,
  onNavigateToCategory,
  onNavigateToSubcategory,
  onNavigateToMainNews,
  onNavigateToSpecificNews
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pdf' | 'sop'>('all');

  // Deep search results including inside PDF documents and slides
  const pdfResults = useMemo(() => {
    return searchInsidePdfDocuments(query, subcategories, mainNews, specificNews);
  }, [query, subcategories, mainNews, specificNews]);

  // General category matches
  const categoryResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: {
      id: string;
      title: string;
      subtitle: string;
      categoryId: CategoryId;
    }[] = [];

    CATEGORIES.forEach((cat) => {
      if (cat.name.toLowerCase().includes(q) || cat.items.some((it) => it.toLowerCase().includes(q))) {
        results.push({
          id: `cat-${cat.id}`,
          title: cat.name,
          subtitle: `Rubrik Operasional: ${cat.items.slice(0, 3).join(', ')}...`,
          categoryId: cat.id
        });
      }
    });

    return results;
  }, [query]);

  // Filtered by active tab
  const filteredPdfResults = useMemo(() => {
    if (activeTab === 'all') return pdfResults;
    if (activeTab === 'pdf') {
      return pdfResults.filter((r) => r.type === 'pdf-slide');
    }
    return pdfResults.filter((r) => r.type !== 'pdf-slide');
  }, [pdfResults, activeTab]);

  const pdfMatchCount = useMemo(() => {
    return pdfResults.filter((r) => r.type === 'pdf-slide').length;
  }, [pdfResults]);

  if (!isOpen) return null;

  const handleSelectResult = (res: PdfSearchResult) => {
    if (res.targetView === 'subcategory' && res.categoryId && res.subcategoryId) {
      onNavigateToSubcategory(res.categoryId, res.subcategoryId, res.slideNumber);
    } else if (res.targetView === 'main-news') {
      onNavigateToMainNews(res.slideNumber);
    } else if (res.targetView === 'specific-news' && res.categoryId) {
      onNavigateToSpecificNews(res.categoryId, res.slideNumber);
    }
    onClose();
  };

  // Helper to highlight query inside text
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-amber-200 text-slate-900 font-extrabold px-1 rounded-xs">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div 
      id="modal-search-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-20"
    >
      <div 
        id="modal-search-card"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#d6cfbf] overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <input
                id="global-search-input"
                type="text"
                placeholder="Ketik kata kunci materi..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="font-poppins w-full text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <button
              id="btn-close-search"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filter Tabs when there is query */}
          {query.trim() && (
            <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100 overflow-x-auto">
              <button
                id="search-tab-all"
                onClick={() => setActiveTab('all')}
                className={`font-poppins px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-[#3c586d] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Hasil ({pdfResults.length + categoryResults.length})
              </button>
              <button
                id="search-tab-pdf"
                onClick={() => setActiveTab('pdf')}
                className={`font-poppins px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'pdf'
                    ? 'bg-[#3c586d] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dokumen PDF ({pdfMatchCount})</span>
              </button>
              <button
                id="search-tab-sop"
                onClick={() => setActiveTab('sop')}
                className={`font-poppins px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'sop'
                    ? 'bg-[#3c586d] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Kategori ({pdfResults.filter(r => r.type !== 'pdf-slide').length + categoryResults.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Container - HANYA MUNCUL JIKA ADA KATA KUNCI */}
        {query.trim() !== '' && (
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-3">
            {filteredPdfResults.length === 0 && categoryResults.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <p className="font-poppins font-semibold text-slate-700 text-sm mb-1">Tidak Ada Hasil Ditemukan</p>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Category Results if on 'all' or 'sop' */}
                {activeTab !== 'pdf' && categoryResults.length > 0 && (
                  <div className="mb-2">
                    {categoryResults.map((cat) => (
                      <div
                        key={cat.id}
                        id={`search-res-cat-${cat.categoryId}`}
                        onClick={() => {
                          onNavigateToCategory(cat.categoryId);
                          onClose();
                        }}
                        className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#eeebe1] text-[#00263f] flex items-center justify-center shrink-0">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-extrabold text-slate-900 truncate">
                              {highlightText(cat.title, query)}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">{cat.subtitle}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {/* PDF Documents & Slide Matches */}
              {filteredPdfResults.map((res) => {
                return (
                  <div
                    key={res.id}
                    id={`search-res-${res.id}`}
                    onClick={() => handleSelectResult(res)}
                    className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Ikon PDF Simple (Seragam dengan Kategori) */}
                      <div className="w-8 h-8 rounded-lg bg-[#eeebe1] text-[#00263f] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>

                      <div className="truncate flex-1">
                        {/* Judul Dokumen / Sub-Kategori */}
                        <h4 className="text-xs font-extrabold text-slate-900 truncate">
                          {highlightText(res.documentName || res.title, query)}
                        </h4>
                        
                        {/* Deskripsi Singkat / Kutipan (Truncate 1 Baris) */}
                        <p className="text-[11px] text-slate-500 truncate">
                          {res.snippet ? highlightText(res.snippet, query) : highlightText(res.subtitle, query)}
                        </p>
                      </div>
                    </div>
                    
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                );
              })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
