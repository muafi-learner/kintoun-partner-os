import { CategoryId, NewsArticle, SubcategoryCard, AppNotification } from '../types';

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  titleLines: [string, string];
  solveButtonText: string;
  colorHex: string;
  badgeBg: string;
  items: string[];
  tagline: string;
  iconName: 'users' | 'coffee' | 'wrench' | 'user-check' | 'package' | 'store';
  accentLight: string;
  accentText: string;
  accentBorder: string;
  badgeText?: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'customer',
    name: 'CUSTOMER ISSUE',
    titleLines: ['CUSTOMER', 'ISSUE'],
    solveButtonText: 'SOLVE CUSTOMER ISSUE',
    colorHex: '#059669',
    badgeBg: 'bg-emerald-600',
    tagline: 'Komplain, Tamu & Service Recovery',
    iconName: 'users',
    accentLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentText: 'text-emerald-700',
    accentBorder: 'border-emerald-500',
    badgeText: '5 Panduan',
    items: [
      'Customer Complaint',
      'Service Recovery',
      'Customer Experience',
      'Escalation',
      'Feedback & Complaint Form'
    ]
  },
  {
    id: 'product',
    name: 'PRODUCT ISSUE',
    titleLines: ['PRODUCT', 'ISSUE'],
    solveButtonText: 'SOLVE PRODUCT ISSUE',
    colorHex: '#d97706',
    badgeBg: 'bg-amber-600',
    tagline: 'Resep, Mutu Rasa & Kualitas Minuman',
    iconName: 'coffee',
    accentLight: 'bg-amber-50 text-amber-700 border-amber-200',
    accentText: 'text-amber-700',
    accentBorder: 'border-amber-500',
    badgeText: '5 Standar',
    items: [
      'Product Quality Issue',
      'Recipe & Standart',
      'Beverage Quality',
      'Product Availability',
      'Product Complaint'
    ]
  },
  {
    id: 'equipment',
    name: 'EQUIPMENT ISSUE',
    titleLines: ['EQUIPMENT', 'ISSUE'],
    solveButtonText: 'SOLVE EQUIPMENT ISSUE',
    colorHex: '#2563eb',
    badgeBg: 'bg-blue-600',
    tagline: 'Mesin Kopi, Grinder & Alat Rusak',
    iconName: 'wrench',
    accentLight: 'bg-blue-50 text-blue-700 border-blue-200',
    accentText: 'text-blue-700',
    accentBorder: 'border-blue-500',
    badgeText: '4 Troubleshooting',
    items: [
      'Equipment Troubleshooting',
      'Repair Request',
      'Equipment SOP',
      'Emergency Equipment Issue'
    ]
  },
  {
    id: 'people',
    name: 'PEOPLE ISSUE',
    titleLines: ['PEOPLE', 'ISSUE'],
    solveButtonText: 'SOLVE PEOPLE ISSUE',
    colorHex: '#7c3aed',
    badgeBg: 'bg-purple-600',
    tagline: 'Absensi, Shift Kru & Kebijakan Tim',
    iconName: 'user-check',
    accentLight: 'bg-purple-50 text-purple-700 border-purple-200',
    accentText: 'text-purple-700',
    accentBorder: 'border-purple-500',
    badgeText: '5 Aturan',
    items: [
      'Attendance',
      'Employee Concern',
      'Scheduling',
      'Performance',
      'People Policy'
    ]
  },
  {
    id: 'stock',
    name: 'STOCK & SUPPLY ISSUE',
    titleLines: ['STOCK &', 'SUPPLY ISSUE'],
    solveButtonText: 'SOLVE STOCK ISSUE',
    colorHex: '#ea580c',
    badgeBg: 'bg-orange-600',
    tagline: 'Bahan Baku Habis, Order & Inventory',
    iconName: 'package',
    accentLight: 'bg-orange-50 text-orange-700 border-orange-200',
    accentText: 'text-orange-700',
    accentBorder: 'border-orange-500',
    badgeText: '5 Prosedur',
    items: [
      'Stock Shortage',
      'Ordering',
      'Delivery Issue',
      'Inventory',
      'Waste'
    ]
  },
  {
    id: 'store',
    name: 'STORE ISSUE',
    titleLines: ['STORE', 'ISSUE'],
    solveButtonText: 'SOLVE STORE ISSUE',
    colorHex: '#0284c7',
    badgeBg: 'bg-sky-600',
    tagline: 'Buka-Tutup, Kasir & SOP Gerai',
    iconName: 'store',
    accentLight: 'bg-sky-50 text-sky-700 border-sky-200',
    accentText: 'text-sky-700',
    accentBorder: 'border-sky-500',
    badgeText: '5 SOP Toko',
    items: [
      'Daily Operation',
      'Store Execution',
      'Opening & Closing',
      'Cash Management',
      'Operation Support'
    ]
  }
];

export const INITIAL_MAIN_NEWS: NewsArticle = {
  id: 'main-news-1',
  type: 'main',
  title: 'KINTOUN OPERATING SYSTEM - PANDUAN UTAMA 2026',
  subtitle: 'Standar Operasional Prosedur, Alur Pelayanan & Kualitas Produk Partner Kintoun',
  summary: 'Materi sosialisasi terbaru dari pusat mengenai standar kerja, penanganan pelanggan, dan SOP kebersihan gerai.',
  thumbnailUrl: '',
  pdfUrl: '',
  pdfFileName: 'KINTOUN_Main_Operational_Guide_2026.pdf',
  pdfFileSize: '2.4 MB',
  uploadedBy: 'Head Office Administrator',
  updatedAt: 'Hari ini, 09:30 WIB'
};

export const INITIAL_SPECIFIC_NEWS: Record<CategoryId, NewsArticle> = {
  customer: {
    id: 'specific-news-customer',
    type: 'specific',
    categoryId: 'customer',
    title: 'SOP SERVICE EXCELLENCE & PENANGANAN KOMPLAIN PELANGGAN',
    subtitle: 'Modul Pelatihan Barista & Cashier: Framework R.E.A.C.T Kintoun',
    summary: 'Prosedur praktis menghadapi komplain pelanggan, penanganan ukuran tumbler, dan permintaan variasi resep.',
    thumbnailUrl: '',
    pdfUrl: '',
    pdfFileName: 'Customer_Issue_Resolution_SOP_v2.pdf',
    pdfFileSize: '1.8 MB',
    uploadedBy: 'Customer Experience Lead',
    updatedAt: 'Kemarin, 14:15 WIB'
  },
  product: {
    id: 'specific-news-product',
    type: 'specific',
    categoryId: 'product',
    title: 'STANDARISASI RESEP & KUALITAS BAHAN BAKU 2026',
    subtitle: 'Panduan Kalibrasi Mesin Kopi, Suhu Air, dan Pengadukan Sirup',
    summary: 'Panduan teknis pencegahan penurunan rasa dan kalibrasi takaran produk signature Kintoun.',
    thumbnailUrl: '',
    pdfUrl: '',
    pdfFileName: 'Product_Recipe_Quality_Standard.pdf',
    pdfFileSize: '3.1 MB',
    uploadedBy: 'Quality Assurance Admin',
    updatedAt: '2 hari lalu'
  },
  equipment: {
    id: 'specific-news-equipment',
    type: 'specific',
    categoryId: 'equipment',
    title: 'PANDUAN TROUBLESHOOTING MESIN ESPRESSO & SEALER',
    subtitle: 'Checklist Pembersihan Harian, Kalibrasi Tekanan, dan Permintaan Teknisi',
    summary: 'Langkah darurat ketika mesin kopi macet atau cup sealer tidak merekat sempurna.',
    thumbnailUrl: '',
    pdfUrl: '',
    pdfFileName: 'Equipment_Maintenance_Checklist.pdf',
    pdfFileSize: '1.5 MB',
    uploadedBy: 'Technical Support Head',
    updatedAt: '3 hari lalu'
  },
  people: {
    id: 'specific-news-people',
    type: 'specific',
    categoryId: 'people',
    title: 'KEBIJAKAN JADWAL KERJA & DISIPLIN STAFF OUTLET',
    subtitle: 'Pengaturan Shift, Absensi, Cuti, dan Standard Seragam Partner',
    summary: 'Kebijakan ketenagakerjaan dan panduan etika kerja barista di seluruh cabang gerai.',
    thumbnailUrl: '',
    pdfUrl: '',
    pdfFileName: 'People_Ops_Store_Policy_2026.pdf',
    pdfFileSize: '1.2 MB',
    uploadedBy: 'People & Culture Team',
    updatedAt: '4 hari lalu'
  },
  stock: {
    id: 'specific-news-stock',
    type: 'specific',
    categoryId: 'stock',
    title: 'PROSEDUR PENERIMAAN BARANG & LAPORAN WASTE INVENTARIS',
    subtitle: 'Cut-off Pemesanan Bahan Baku, FIFO, dan Dokumentasi Kerusakan Barang',
    summary: 'Petunjuk pencatatan stok harian dan panduan klaim barang rusak saat pengiriman.',
    thumbnailUrl: '',
    pdfUrl: '',
    pdfFileName: 'Inventory_Supply_Chain_Manual.pdf',
    pdfFileSize: '2.0 MB',
    uploadedBy: 'Supply Chain Ops',
    updatedAt: '5 hari lalu'
  },
  store: {
    id: 'specific-news-store',
    type: 'specific',
    categoryId: 'store',
    title: 'CHECKLIST OPENING & CLOSING STORE KINTOUN',
    subtitle: 'Prosedur Kasir, Kebersihan Area Bar, dan Keamanan Gerai',
    summary: 'Panduan lengkap serah terima kas, pengecekan inventaris sebelum buka dan setelah tutup toko.',
    thumbnailUrl: '',
    pdfUrl: '',
    pdfFileName: 'Store_Execution_Opening_Closing_SOP.pdf',
    pdfFileSize: '1.6 MB',
    uploadedBy: 'Store Operations Manager',
    updatedAt: '1 minggu lalu'
  }
};

export { INITIAL_SUBCATEGORIES } from './subcategoriesData';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Dokumen Baru Diperbarui oleh Admin',
    message: 'Administrator baru saja memperbarui modul "Customer Complaint: Panduan No Ice & Tumbler" dengan materi terbaru.',
    category: 'Customer Issue',
    timestamp: '10 menit yang lalu',
    read: false,
    targetPage: {
      view: 'subcategory',
      categoryId: 'customer',
      subcategoryId: 'customer-complaint'
    }
  },
  {
    id: 'notif-2',
    title: 'Main News: Panduan Operasional 2026',
    message: 'Materi presentasi PDF terbaru untuk standar operasional store partner Kintoun telah dirilis.',
    category: 'Main News',
    timestamp: '2 jam yang lalu',
    read: false,
    targetPage: {
      view: 'main-news'
    }
  },
  {
    id: 'notif-3',
    title: 'Pengingat Kalibrasi Mesin Kopi',
    message: 'Seluruh outlet diharapkan melakukan kalibrasi grinder dan mencatat checklist harian.',
    category: 'Equipment Issue',
    timestamp: 'Kemarin',
    read: true,
    targetPage: {
      view: 'category',
      categoryId: 'equipment'
    }
  }
];
