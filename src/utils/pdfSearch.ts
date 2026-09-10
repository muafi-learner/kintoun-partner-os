import { CategoryId, SubcategoryCard, NewsArticle, PdfSlide } from '../types';

export interface PdfSearchResult {
  id: string;
  type: 'pdf-slide' | 'sop' | 'news' | 'category';
  documentName: string;
  title: string;
  subtitle: string;
  slideNumber?: number;
  snippet?: string;
  matchedField?: 'title' | 'slide-point' | 'case-problem' | 'react-step' | 'filename' | 'pdf-content';
  categoryId?: CategoryId;
  subcategoryId?: string;
  targetView: 'main-news' | 'specific-news' | 'subcategory' | 'category';
}

export function searchInsidePdfDocuments(
  query: string,
  subcategories: SubcategoryCard[],
  mainNews: NewsArticle,
  specificNews: Record<CategoryId, NewsArticle>
): PdfSearchResult[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  const results: PdfSearchResult[] = [];

  // Pembuat Snippet: Memotong teks panjang di sekitar kata yang dicari
  const makeSnippet = (fullText: string, searchTerm: string): string => {
    if (!fullText) return '';
    const idx = fullText.toLowerCase().indexOf(searchTerm);
    if (idx === -1) return fullText.slice(0, 100);
    const start = Math.max(0, idx - 40);
    const end = Math.min(fullText.length, idx + searchTerm.length + 60);
    let snippet = fullText.substring(start, end).trim();
    if (start > 0) snippet = '...' + snippet;
    if (end < fullText.length) snippet = snippet + '...';
    return snippet;
  };

  // Fungsi Inti: Memindai slide dan mencari kecocokan pada teks ekstraksi
  const checkSlides = (slides: PdfSlide[] | undefined, docName: string, catId?: CategoryId, subId?: string, targetView?: any) => {
    if (!slides) return;
    slides.forEach(slide => {
      const titleMatch = slide.title.toLowerCase().includes(q);
      const pointMatch = slide.points.find(p => p.toLowerCase().includes(q));
      // "note" kini berisi teks raw PDF hasil ekstraksi dari Hostinger
      const noteMatch = slide.note?.toLowerCase().includes(q); 

      if (titleMatch || pointMatch || noteMatch) {
        let matchField: any = 'title';
        let matchText = slide.title;

        if (noteMatch) {
          matchField = 'pdf-content';
          matchText = slide.note!;
        } else if (pointMatch) {
          matchField = 'slide-point';
          matchText = pointMatch;
        }

        results.push({
          id: `pdf-slide-${Date.now()}-${Math.random()}`,
          type: 'pdf-slide',
          documentName: docName,
          title: `Kecocokan Isi PDF: ${docName}`,
          subtitle: `Ditemukan di dalam konten dokumen`,
          slideNumber: slide.slideNumber,
          snippet: makeSnippet(matchText, q),
          matchedField: matchField,
          categoryId: catId,
          subcategoryId: subId,
          targetView: targetView
        });
      }
    });
  };

  // Eksekusi Pencarian
  checkSlides(mainNews.slideDeck, mainNews.pdfFileName || 'Panduan_Utama.pdf', undefined, undefined, 'main-news');

  (Object.keys(specificNews) as CategoryId[]).forEach(catId => {
    const article = specificNews[catId];
    checkSlides(article.slideDeck, article.pdfFileName || `${catId}_issue.pdf`, catId, undefined, 'specific-news');
  });

  subcategories.forEach(sub => {
    checkSlides(sub.slideDeck, sub.pdfFileName || `${sub.id}.pdf`, sub.categoryId, sub.id, 'subcategory');
  });

  return results;
}
