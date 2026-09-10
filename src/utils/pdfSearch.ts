import { CategoryId, SubcategoryCard, NewsArticle } from '../types';

export interface PdfSearchResult {
  id: string;
  type: 'pdf-slide' | 'sop' | 'news' | 'category';
  documentName: string;
  title: string;
  subtitle: string;
  slideNumber?: number;
  snippet?: string;
  matchedField?: 'title' | 'subtitle' | 'filename' | 'description';
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

  // 1. Pencarian di Main News (Beranda)
  if (
    mainNews.title.toLowerCase().includes(q) ||
    mainNews.subtitle?.toLowerCase().includes(q) ||
    mainNews.summary?.toLowerCase().includes(q) ||
    mainNews.pdfFileName?.toLowerCase().includes(q)
  ) {
    let matchField: 'title' | 'subtitle' | 'filename' = 'title';
    let snippetText = mainNews.summary || mainNews.subtitle;
    
    if (mainNews.pdfFileName?.toLowerCase().includes(q)) matchField = 'filename';
    else if (mainNews.subtitle?.toLowerCase().includes(q)) { matchField = 'subtitle'; snippetText = mainNews.subtitle; }

    results.push({
      id: 'main-news-meta',
      type: 'news',
      documentName: mainNews.pdfFileName || 'Panduan_Utama.pdf',
      title: mainNews.title,
      subtitle: `Beranda • Dokumen Utama`,
      slideNumber: 1,
      snippet: makeSnippet(snippetText, q),
      matchedField: matchField,
      targetView: 'main-news'
    });
  }

  // 2. Pencarian di Specific News (Kategori Issue)
  (Object.keys(specificNews) as CategoryId[]).forEach((catId) => {
    const article = specificNews[catId];
    if (!article) return;

    if (
      article.title.toLowerCase().includes(q) ||
      article.subtitle?.toLowerCase().includes(q) ||
      article.summary?.toLowerCase().includes(q) ||
      article.pdfFileName?.toLowerCase().includes(q)
    ) {
      let matchField: 'title' | 'subtitle' | 'filename' = 'title';
      let snippetText = article.summary || article.subtitle;
      
      if (article.pdfFileName?.toLowerCase().includes(q)) matchField = 'filename';
      else if (article.subtitle?.toLowerCase().includes(q)) { matchField = 'subtitle'; snippetText = article.subtitle; }

      results.push({
        id: `specific-news-${catId}`,
        type: 'news',
        documentName: article.pdfFileName || `${catId}_issue.pdf`,
        title: article.title,
        subtitle: `Modul Khusus • ${catId.toUpperCase()} ISSUE`,
        slideNumber: 1,
        snippet: makeSnippet(snippetText, q),
        matchedField: matchField,
        categoryId: catId,
        targetView: 'specific-news'
      });
    }
  });

  // 3. Pencarian di Subkategori / SOP Gerai
  subcategories.forEach((sub) => {
    if (
      sub.title.toLowerCase().includes(q) ||
      sub.description.toLowerCase().includes(q) ||
      sub.pdfFileName?.toLowerCase().includes(q)
    ) {
      let matchField: 'title' | 'description' | 'filename' = 'title';
      let snippetText = sub.description;
      
      if (sub.pdfFileName?.toLowerCase().includes(q)) matchField = 'filename';
      else if (sub.description.toLowerCase().includes(q)) matchField = 'description';

      results.push({
        id: `sub-header-${sub.id}`,
        type: 'sop',
        documentName: sub.pdfFileName || `${sub.id}.pdf`,
        title: sub.title,
        subtitle: `SOP Gerai • ${sub.categoryId.toUpperCase()} ISSUE`,
        slideNumber: 1,
        snippet: makeSnippet(snippetText, q),
        matchedField: matchField,
        categoryId: sub.categoryId,
        subcategoryId: sub.id,
        targetView: 'subcategory'
      });
    }
  });

  return results;
}
