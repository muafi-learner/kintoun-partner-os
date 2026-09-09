import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  FileText, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  Sparkles,
  Presentation,
  CheckCircle2,
  FileCheck
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

  // Popular quick tags for barista/kru
  const popularKeywords = [
    'no ice',
    'tumbler 600ml',
    'kalibrasi espresso',
    'cup sealer',
    'grinder macet',
    'checklist opening',
    'resep signature',
    'komplain'
  ];

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
            <div className="w-9 h-9 rounded-xl bg-[#00263f] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Search className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <input
                id="global-search-input"
                type="text"
                placeholder="Ketik kata kunci dokumen PDF (contoh: 'no ice', 'tumbler', 'espresso', 'kalibrasi')..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            {query && (
              <button 
                id="btn-clear-search"
                onClick={() => setQuery('')}
                className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 cursor-pointer font-bold"
              >
                Hapus
              </button>
            )}
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
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-[#00263f] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Hasil ({pdfResults.length + categoryResults.length})
              </button>
              <button
                id="search-tab-pdf"
                onClick={() => setActiveTab('pdf')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'pdf'
                    ? 'bg-rose-700 text-white shadow-2xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Di Dalam Dokumen PDF ({pdfMatchCount})</span>
              </button>
              <button
                id="search-tab-sop"
                onClick={() => setActiveTab('sop')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'sop'
                    ? 'bg-[#3c586d] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Modul & SOP ({pdfResults.filter(r => r.type !== 'pdf-slide').length + categoryResults.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-3">
          {!query.trim() ? (
            <div className="p-6 text-center text-slate-500">
              <div className="w-12 h-12 rounded-2xl bg-[#eeebe1] text-[#00263f] flex items-center justify-center mx-auto mb-3">
                <FileCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 mb-1">
                Pencarian Teks Cerdas Dokumen PDF & SOP
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
                Sistem kami dapat membaca langsung teks, poin standar, dan aturan di dalam slide presentasi PDF/PPT yang diunggah.
              </p>

              {/* Quick Suggestion Chips */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Kata Kunci Populer Barista:
                </span>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-md mx-auto">
                  {popularKeywords.map((kw) => (
                    <button
                      key={kw}
                      id={`btn-kw-${kw.replace(/\s+/g, '-')}`}
                      onClick={() => setQuery(kw)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#eeebe1]/80 hover:bg-[#d6cfbf] text-[#00263f] transition cursor-pointer"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredPdfResults.length === 0 && categoryResults.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <p className="font-bold text-slate-700 text-sm mb-1">Tidak Ada Hasil Ditemukan</p>
              <p>Tidak ada teks di dalam PDF atau SOP yang cocok dengan &ldquo;{query}&rdquo;.</p>
              <p className="mt-2 text-slate-400">Coba ketik kata kunci lain seperti: <span className="font-bold text-slate-600">no ice</span>, <span className="font-bold text-slate-600">tumbler</span>, atau <span className="font-bold text-slate-600">espresso</span>.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Category Results if on 'all' or 'sop' */}
              {activeTab !== 'pdf' && categoryResults.length > 0 && (
                <div className="mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1 block">
                    KATEGORI OPERASIONAL
                  </span>
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
                const isPdfSlide = res.type === 'pdf-slide';
                return (
                  <div
                    key={res.id}
                    id={`search-res-${res.id}`}
                    onClick={() => handleSelectResult(res)}
                    className="p-3 sm:p-3.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-start justify-between gap-3 transition group"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                        isPdfSlide 
                          ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                          : 'bg-[#eeebe1] text-[#00263f]'
                      }`}>
                        {isPdfSlide ? <Presentation className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Tags Header */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          {isPdfSlide && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-rose-600 text-white tracking-wider">
                              DI DALAM PDF • SLIDE {res.slideNumber}
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-slate-500 truncate max-w-[220px]">
                            📄 {res.documentName}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight group-hover:text-[#00263f] transition">
                          {highlightText(res.title, query)}
                        </h4>

                        {/* Snippet / Excerpt with Match */}
                        {res.snippet && (
                          <p className="text-xs text-slate-600 mt-1 bg-slate-50/80 p-1.5 rounded-md border border-slate-100 leading-relaxed">
                            <span className="text-slate-400 font-bold mr-1">Kutipan:</span>
                            {highlightText(res.snippet, query)}
                          </p>
                        )}

                        {/* Subtitle / Path */}
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <span>{res.subtitle}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 self-center">
                      <span className="text-[11px] font-bold text-slate-400 hidden sm:inline group-hover:text-[#00263f]">
                        Buka Slide
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00263f] group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          💡 Klik hasil pencarian untuk langsung melompat ke halaman slide dokumen PDF yang dimaksud.
        </div>
      </div>
    </div>
  );
};
