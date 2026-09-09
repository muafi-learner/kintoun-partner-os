import { SubcategoryCard, NewsArticle } from '../types';

/**
 * Checks whether a subcategory module has an uploaded document/presentation.
 * If not uploaded, it should be marked:
 * - Admin: "Perlu Diisi"
 * - Crew: "Belum Diisi" / "Belum Tersedia"
 */
export function isSubcategoryUploaded(card: SubcategoryCard): boolean {
  if (card.isUploaded) return true;
  if (card.pdfUrl && card.pdfUrl.trim() !== '') return true;
  if (card.slideDeck && card.slideDeck.length > 0) return true;
  return false;
}

/**
 * Checks whether a news article has an uploaded document/presentation.
 */
export function isNewsArticleUploaded(article: NewsArticle): boolean {
  if (article.pdfUrl && article.pdfUrl.trim() !== '') return true;
  if (article.slideDeck && article.slideDeck.length > 0) return true;
  return false;
}
