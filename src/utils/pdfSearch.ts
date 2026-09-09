import { CategoryId, SubcategoryCard, NewsArticle, PdfSlide } from '../types';

export interface PdfSearchResult {
  id: string;
  type: 'pdf-slide' | 'sop' | 'news' | 'category';
  documentName: string;
  title: string;
  subtitle: string;
  slideNumber?: number;
  snippet?: string;
  matchedField?: 'title' | 'slide-point' | 'case-problem' | 'react-step' | 'filename';
  categoryId?: CategoryId;
  subcategoryId?: string;
  targetView: 'main-news' | 'specific-news' | 'subcategory' | 'category';
}

/**
 * Returns slide deck for a subcategory (only if uploaded/provided)
 */
export function getSubcategorySlides(card: SubcategoryCard): PdfSlide[] {
  if (card.slideDeck && card.slideDeck.length > 0) {
    return card.slideDeck;
  }
  return [];
}

/**
 * Returns slide deck for a news article
 */
export function getNewsArticleSlides(article: NewsArticle): PdfSlide[] {
  if (article.slideDeck && article.slideDeck.length > 0) {
    return article.slideDeck;
  }

  return [
    {
      slideNumber: 1,
      title: article.title,
      points: [
        article.subtitle || 'Materi Pelatihan & Standar Operasional Prosedur Kintoun',
        `Nama Dokumen: ${article.pdfFileName || 'Materi_Resmi_Kintoun.pdf'}`,
        'Dokumen resmi untuk standarisasi operasional seluruh gerai partner Kintoun',
        `Diterbitkan oleh: ${article.uploadedBy || 'Head Office Administrator'} (${article.updatedAt || 'Terbaru'})`
      ],
      note: 'Materi presentasi resmi pusat.',
      bgColor: 'bg-[#00263f] text-white'
    },
    {
      slideNumber: 2,
      title: 'Prinsip Dasar Layanan R.E.A.C.T',
      points: [
        'R - RECOGNIZE: Kenali kebutuhan pelanggan dan dengarkan keluhan dengan empati penuh.',
        'E - ENGAGE: Tunjukkan sikap ramah, peduli, dan hindari kata negatif seperti "nggak bisa".',
        'A - ACT: Berikan solusi taktis sesuai standar resep & pedoman volume sajian.',
        'C - CONFIRM: Konfirmasikan kembali kesepakatan solusi kepada pelanggan secara jelas.',
        'T - THANK: Ucapkan terima kasih atas masukan dan kesabaran pelanggan.'
      ],
      note: 'Penerapan konsisten akan menjaga kepuasan pelanggan dan reputasi brand gerai.',
      bgColor: 'bg-[#153459] text-white'
    },
    {
      slideNumber: 3,
      title: 'Standarisasi Takaran & Kebijakan No Ice',
      points: [
        'Prinsip Utama: No Ice ≠ Tambah Volume Bebas.',
        'Volume minuman signature tetap mengacu pada gramasi resep standar untuk menjaga keseimbangan rasa.',
        'Apabila pelanggan membawa tumbler ukuran besar (contoh 600ml) dan ingin penuh tanpa es, tawarkan add-on porsi resmi.',
        'Pastikan kasir dan barista memiliki kesamaan narasi saat berkomunikasi dengan customer.'
      ],
      note: 'Kepuasan rasa adalah prioritas tertinggi dalam standar seduhan Kintoun.',
      bgColor: 'bg-[#1e4620] text-white'
    },
    {
      slideNumber: 4,
      title: 'Prosedur Eskalasi & Permintaan Bantuan',
      points: [
        'Jika terjadi kendala peralatan atau komplain yang membutuhkan persetujuan khusus, gunakan tombol "BUTUH BANTUAN?".',
        'Tiket darurat langsung tersambung ke Tim Supervisor dan Teknisi Khusus.',
        'Lakukan pencatatan log harian di buku operasional store.',
        'Update materi secara berkala dipublikasikan oleh Administrator di portal ini.'
      ],
      note: 'Dokumen ini tersimpan secara lokal dan dapat diunduh untuk arsip gerai.',
      bgColor: 'bg-[#40235e] text-white'
    }
  ];
}

/**
 * Searches across all PDF documents, slides, learning cards, and news articles
 */
export function searchInsidePdfDocuments(
  query: string,
  subcategories: SubcategoryCard[],
  mainNews: NewsArticle,
  specificNews: Record<CategoryId, NewsArticle>
): PdfSearchResult[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  const results: PdfSearchResult[] = [];

  // Helper to build excerpt snippet around match
  const makeSnippet = (fullText: string, searchTerm: string): string => {
    const idx = fullText.toLowerCase().indexOf(searchTerm);
    if (idx === -1) return fullText.slice(0, 100);
    const start = Math.max(0, idx - 40);
    const end = Math.min(fullText.length, idx + searchTerm.length + 60);
    let snippet = fullText.substring(start, end).trim();
    if (start > 0) snippet = '...' + snippet;
    if (end < fullText.length) snippet = snippet + '...';
    return snippet;
  };

  // 1. Search inside Main News PDF Slides
  const mainSlides = getNewsArticleSlides(mainNews);
  mainSlides.forEach((slide) => {
    const titleMatch = slide.title.toLowerCase().includes(q);
    const pointMatch = slide.points.find((p) => p.toLowerCase().includes(q));
    const noteMatch = slide.note?.toLowerCase().includes(q);

    if (titleMatch || pointMatch || noteMatch) {
      const matchText = pointMatch || (titleMatch ? slide.title : slide.note || '');
      results.push({
        id: `pdf-main-slide-${slide.slideNumber}`,
        type: 'pdf-slide',
        documentName: mainNews.pdfFileName || 'KINTOUN_Main_Operational_Guide_2026.pdf',
        title: `Slide ${slide.slideNumber}: ${slide.title}`,
        subtitle: `Ditemukan di Dokumen Utama Pusat • Beranda`,
        slideNumber: slide.slideNumber,
        snippet: makeSnippet(matchText, q),
        matchedField: pointMatch ? 'slide-point' : 'title',
        targetView: 'main-news'
      });
    }
  });

  // Also check Main News metadata
  if (
    mainNews.title.toLowerCase().includes(q) ||
    mainNews.subtitle.toLowerCase().includes(q) ||
    mainNews.summary.toLowerCase().includes(q)
  ) {
    // Only push if not already covered
    if (!results.some((r) => r.targetView === 'main-news' && r.slideNumber === 1)) {
      results.push({
        id: 'main-news-meta',
        type: 'news',
        documentName: mainNews.pdfFileName,
        title: mainNews.title,
        subtitle: `Dokumen Berita Utama • ${mainNews.pdfFileName}`,
        slideNumber: 1,
        snippet: makeSnippet(mainNews.summary, q),
        matchedField: 'title',
        targetView: 'main-news'
      });
    }
  }

  // 2. Search inside Category Specific News PDF Slides
  (Object.keys(specificNews) as CategoryId[]).forEach((catId) => {
    const article = specificNews[catId];
    if (!article) return;

    const slides = getNewsArticleSlides(article);
    slides.forEach((slide) => {
      const titleMatch = slide.title.toLowerCase().includes(q);
      const pointMatch = slide.points.find((p) => p.toLowerCase().includes(q));
      const noteMatch = slide.note?.toLowerCase().includes(q);

      if (titleMatch || pointMatch || noteMatch) {
        const matchText = pointMatch || (titleMatch ? slide.title : slide.note || '');
        results.push({
          id: `pdf-specific-${catId}-slide-${slide.slideNumber}`,
          type: 'pdf-slide',
          documentName: article.pdfFileName || `${catId}_issue_news.pdf`,
          title: `Slide ${slide.slideNumber}: ${slide.title}`,
          subtitle: `Dokumen Resmi Modul ${catId.toUpperCase()} ISSUE`,
          slideNumber: slide.slideNumber,
          snippet: makeSnippet(matchText, q),
          matchedField: pointMatch ? 'slide-point' : 'title',
          categoryId: catId,
          targetView: 'specific-news'
        });
      }
    });
  });

  // 3. Search inside Subcategory PDF Slides & Learning Cards
  subcategories.forEach((sub) => {
    const slides = getSubcategorySlides(sub);
    
    // Check inside each slide of this subcategory
    slides.forEach((slide) => {
      const titleMatch = slide.title.toLowerCase().includes(q);
      const pointMatch = slide.points.find((p) => p.toLowerCase().includes(q));
      const noteMatch = slide.note?.toLowerCase().includes(q);

      if (titleMatch || pointMatch || noteMatch) {
        const matchText = pointMatch || (titleMatch ? slide.title : slide.note || '');
        results.push({
          id: `pdf-sub-${sub.id}-slide-${slide.slideNumber}`,
          type: 'pdf-slide',
          documentName: sub.pdfFileName || `${sub.id}_sop_2026.pdf`,
          title: `Slide ${slide.slideNumber}: ${slide.title}`,
          subtitle: `Materi SOP ${sub.categoryId.toUpperCase()} ISSUE • ${sub.title}`,
          slideNumber: slide.slideNumber,
          snippet: makeSnippet(matchText, q),
          matchedField: pointMatch ? 'slide-point' : 'title',
          categoryId: sub.categoryId,
          subcategoryId: sub.id,
          targetView: 'subcategory'
        });
      }
    });

    // Check Subcategory Title & Description if not matched in slide 1
    const subTitleMatch = sub.title.toLowerCase().includes(q);
    const subDescMatch = sub.description.toLowerCase().includes(q);
    const filenameMatch = sub.pdfFileName?.toLowerCase().includes(q);

    if (
      (subTitleMatch || subDescMatch || filenameMatch) &&
      !results.some((r) => r.subcategoryId === sub.id && r.slideNumber === 1)
    ) {
      results.push({
        id: `sub-header-${sub.id}`,
        type: 'sop',
        documentName: sub.pdfFileName || `${sub.id}.pdf`,
        title: sub.title,
        subtitle: `Subkategori Modul ${sub.categoryId.toUpperCase()} ISSUE`,
        slideNumber: 1,
        snippet: makeSnippet(sub.description, q),
        matchedField: 'title',
        categoryId: sub.categoryId,
        subcategoryId: sub.id,
        targetView: 'subcategory'
      });
    }
  });

  return results;
}
