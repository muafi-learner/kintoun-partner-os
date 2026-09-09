import { NewsArticle, SubcategoryCard, AppNotification, TicketRequest } from '../types';

const DB_NAME = 'KintounDB';
const DB_VERSION = 1;
const STORE_FILES = 'uploadedFiles';

// Open or initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_FILES)) {
        db.createObjectStore(STORE_FILES, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Store a file blob or data URL in IndexedDB
export async function saveFileToDB(id: string, fileData: Blob | string, name: string, type: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_FILES, 'readwrite');
    const store = tx.objectStore(STORE_FILES);
    const item = {
      id,
      data: fileData,
      name,
      type,
      savedAt: new Date().toISOString()
    };
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Get file from IndexedDB
export async function getFileFromDB(id: string): Promise<{ id: string; data: Blob | string; name: string; type: string } | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, 'readonly');
      const store = tx.objectStore(STORE_FILES);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

// Get a valid PDF source (data URL, base64, or fallback) - menghindari createObjectURL
export async function resolvePdfSource(item: { fileId?: string; pdfDataUrl?: string; pdfUrl?: string }): Promise<string | null> {
  // 1. If explicit Base64 Data URL is present, it's immediately valid
  if (item.pdfDataUrl && item.pdfDataUrl.startsWith('data:')) {
    return item.pdfDataUrl;
  }
  if (item.pdfUrl && item.pdfUrl.startsWith('data:')) {
    return item.pdfUrl;
  }

  // 2. Try fetching from IndexedDB by fileId
  if (item.fileId) {
    const fileRecord = await getFileFromDB(item.fileId);
    if (fileRecord?.data) {
      if (fileRecord.data instanceof Blob) {
        // Hindari URL.createObjectURL yang diblokir oleh sandbox iframe
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve('');
          reader.readAsDataURL(fileRecord.data as Blob);
        });
      }
      return fileRecord.data as string;
    }
  }

  // 3. Fallback
  return item.pdfUrl || null;
}

// In-memory cache for fast zero-latency access across components
const inMemoryPdfCache = new Map<string, Uint8Array>();

export function setCachedPdf(id: string, data: Uint8Array) {
  inMemoryPdfCache.set(id, data);
}

export function getCachedPdf(id: string): Uint8Array | undefined {
  return inMemoryPdfCache.get(id);
}

// LocalStorage helpers for metadata and state
export const STORAGE_KEYS = {
  MAIN_NEWS: 'kintoun_main_news_v2',
  SPECIFIC_NEWS: 'kintoun_specific_news_v2',
  SUBCATEGORIES: 'kintoun_subcategories_v2',
  NOTIFICATIONS: 'kintoun_notifications',
  TICKETS: 'kintoun_tickets',
  CURRENT_ROLE: 'kintoun_current_role',
};

// Generate a valid base64 or Uint8Array demo PDF so the PDF viewer renders a real PDF document immediately
export function generateSamplePdfUint8Array(title: string, subtitle: string): Uint8Array {
  const safeTitle = (title || 'DOKUMEN OPERASIONAL KINTOUN').replace(/[()\\]/g, '');
  const safeSubtitle = (subtitle || 'Standar Prosedur Operasional 2026').replace(/[()\\]/g, '');

  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 260 >>
stream
BT
/F1 22 Tf
50 720 Td
(KINTOUN OPERATING SYSTEM) Tj
/F1 13 Tf
0 -40 Td
(${safeTitle.substring(0, 48)}) Tj
/F1 10 Tf
0 -30 Td
(${safeSubtitle.substring(0, 60)}) Tj
0 -25 Td
(Status: Dokumen Resmi Terverifikasi Pusat) Tj
0 -20 Td
(Administrator dapat mengganti berkas ini dengan mengunggah PDF / PPT baru.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000560 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
637
%%EOF`;

  return new TextEncoder().encode(pdfContent);
}

export function createSamplePdfBlobUrl(title: string, subtitle: string): string {
  const bytes = generateSamplePdfUint8Array(title, subtitle);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:application/pdf;base64,' + window.btoa(binary);
}
