import { SubcategoryCard } from '../types';

export const INITIAL_SUBCATEGORIES: SubcategoryCard[] = [
  // ==========================================
  // CUSTOMER ISSUE (5 Subkategori)
  // ==========================================
  {
    id: 'customer-complaint',
    categoryId: 'customer',
    title: 'CUSTOMER COMPLAINT',
    description: 'Customer menyampaikan keluhan terkait produk, pelayanan, atau pengalaman.',
    iconBgColor: '#16a34a',
    iconName: 'message-square-warning',
    hasDetail: true,
    isUploaded: false,
    tags: ['Komplain', 'Pelayanan', 'SOP']
  },
  {
    id: 'service-recovery',
    categoryId: 'customer',
    title: 'SERVICE RECOVERY',
    description: 'Perbaiki pengalaman customer dan berikan solusi terbaik.',
    iconBgColor: '#059669',
    iconName: 'heart-handshake',
    hasDetail: true,
    isUploaded: false,
    tags: ['Solusi', 'Recovery', 'Kepuasan']
  },
  {
    id: 'customer-experience',
    categoryId: 'customer',
    title: 'CUSTOMER EXPERIENCE',
    description: 'Customer memberikan feedback, saran, atau apresiasi untuk perbaikan mutu layanan.',
    iconBgColor: '#047857',
    iconName: 'smile',
    hasDetail: true,
    isUploaded: false,
    tags: ['Feedback', 'Pengalaman', 'Apresiasi']
  },
  {
    id: 'escalation',
    categoryId: 'customer',
    title: 'ESCALATION',
    description: 'Customer meminta masalah ditangani lebih lanjut ke level Store Supervisor atau Area Manager.',
    iconBgColor: '#0f766e',
    iconName: 'phone-call',
    hasDetail: true,
    isUploaded: false,
    tags: ['Eskalasi', 'Supervisor', 'Area Manager']
  },
  {
    id: 'feedback-complaint',
    categoryId: 'customer',
    title: 'FEEDBACK & COMPLAINT',
    description: 'Gunakan form dan logbook digital untuk mencatat keluhan atau feedback customer secara akurat.',
    iconBgColor: '#065f46',
    iconName: 'clipboard-edit',
    hasDetail: true,
    isUploaded: false,
    tags: ['Logbook', 'Form Keluhan', 'Catatan']
  },

  // ==========================================
  // PRODUCT ISSUE (4 Subkategori)
  // ==========================================
  {
    id: 'product-defect',
    categoryId: 'product',
    title: 'PRODUCT DEFECT / REJECT',
    description: 'SOP penanganan cup bocor, rasa asam/basi, foreign object, atau suhu tidak sesuai standar.',
    iconBgColor: '#d97706',
    iconName: 'alert-triangle',
    hasDetail: true,
    isUploaded: false,
    tags: ['Reject', 'Cup Bocor', 'Mutu']
  },
  {
    id: 'recipe-deviation',
    categoryId: 'product',
    title: 'RECIPE DEVIATION',
    description: 'Prosedur kalibrasi takaran espresso, sirup, susu, dan toleransi modifikasi resep customer.',
    iconBgColor: '#b45309',
    iconName: 'flask-conical',
    hasDetail: true,
    isUploaded: false,
    tags: ['Resep', 'Kalibrasi', 'Gramasi']
  },
  {
    id: 'product-availability',
    categoryId: 'product',
    title: 'PRODUK AVAILABILITY',
    description: 'Manajemen status ketersediaan menu di POS, penanganan sold-out sementara, dan alternatif produk.',
    iconBgColor: '#78350f',
    iconName: 'boxes',
    hasDetail: true,
    isUploaded: false,
    tags: ['Ketersediaan', 'Sold Out', 'Menu POS']
  },
  {
    id: 'product-complain',
    categoryId: 'product',
    title: 'PRODUC COMPLAIN',
    description: 'Prosedur penanganan komplain rasa minuman, pergantian produk baru di tempat (remake), dan audit mutu.',
    iconBgColor: '#5e290c',
    iconName: 'message-square-warning',
    hasDetail: true,
    isUploaded: false,
    tags: ['Remake', 'Komplain Rasa', 'Audit']
  },

  // ==========================================
  // EQUIPMENT ISSUE (4 Subkategori)
  // ==========================================
  {
    id: 'troubleshooting',
    categoryId: 'equipment',
    title: 'EQUIPMENT TROUBLE SHOOTING',
    description: 'Pertolongan pertama saat mesin espresso bocor, steam wand mampet, atau grinder macet.',
    iconBgColor: '#3b82f6',
    iconName: 'wrench',
    hasDetail: true,
    isUploaded: false,
    tags: ['Mesin Kopi', 'Grinder', 'Troubleshoot']
  },
  {
    id: 'repair-request',
    categoryId: 'equipment',
    title: 'REPAIR REQUEST',
    description: 'Prosedur pengajuan tiket perbaikan alat ke tim teknisi internal dan logbook kerusakan alat.',
    iconBgColor: '#2563eb',
    iconName: 'hammer',
    hasDetail: true,
    isUploaded: false,
    tags: ['Tiket', 'Teknisi', 'Perbaikan']
  },
  {
    id: 'equipment-sop',
    categoryId: 'equipment',
    title: 'EQUIPMENT SOP',
    description: 'Standar Operasional Prosedur pengoperasian harian mesin kopi, grinder, ice maker, dan cup sealer.',
    iconBgColor: '#1d4ed8',
    iconName: 'settings',
    hasDetail: true,
    isUploaded: false,
    tags: ['SOP Mesin', 'Ice Maker', 'Cup Sealer']
  },
  {
    id: 'emergency-equipment',
    categoryId: 'equipment',
    title: 'EMERGENCY EQUIMPENT ISSU',
    description: 'Protokol darurat saat listrik padam total, kebocoran pipa air tekanan tinggi, atau konsleting bar.',
    iconBgColor: '#1e40af',
    iconName: 'alert-octagon',
    hasDetail: true,
    isUploaded: false,
    tags: ['Darurat', 'Listrik Padam', 'Kebocoran']
  },

  // ==========================================
  // PEOPLE ISSUE (5 Subkategori)
  // ==========================================
  {
    id: 'attendance',
    categoryId: 'people',
    title: 'ATTEDNACE',
    description: 'Kebijakan absensi digital, toleransi keterlambatan, prosedur izin sakit, dan pelaporan kru berhalangan.',
    iconBgColor: '#8b5cf6',
    iconName: 'clock',
    hasDetail: true,
    isUploaded: false,
    tags: ['Absensi', 'Izin', 'Keterlambatan']
  },
  {
    id: 'employee-concern',
    categoryId: 'people',
    title: 'EMPLOYEE CONCERN',
    description: 'Saluran pengaduan internal (whistleblower), keluhan kerja tim, mediasi Store Leader, dan resolusi konflik.',
    iconBgColor: '#7c3aed',
    iconName: 'heart-handshake',
    hasDetail: true,
    isUploaded: false,
    tags: ['Keluhan', 'Mediasi', 'Resolusi']
  },
  {
    id: 'scheduling',
    categoryId: 'people',
    title: 'SCHEDULING',
    description: 'Penetapan jadwal roster shift mingguan, batas jam lembur (overtime), dan prosedur tukar jadwal.',
    iconBgColor: '#6d28d9',
    iconName: 'calendar',
    hasDetail: true,
    isUploaded: false,
    tags: ['Roster', 'Shift', 'Overtime']
  },
  {
    id: 'grooming',
    categoryId: 'people',
    title: 'GROOMING & UNIFORM',
    description: 'Standar kebersihan diri, kelengkapan seragam apron/topi, kuku bersih, dan larangan perhiasan di area bar.',
    iconBgColor: '#5b21b6',
    iconName: 'sparkles',
    hasDetail: true,
    isUploaded: false,
    tags: ['Seragam', 'Apron', 'Kebersihan']
  },
  {
    id: 'training',
    categoryId: 'people',
    title: 'TRAINING & ONBOARDING',
    description: 'Modul dasar orientasi barista baru, checklist sertifikasi menu signature, dan evaluasi berkala.',
    iconBgColor: '#4c1d95',
    iconName: 'award',
    hasDetail: true,
    isUploaded: false,
    tags: ['Onboarding', 'Pelatihan', 'Sertifikasi']
  },

  // ==========================================
  // STOCK & SUPPLY ISSUE (5 Subkategori)
  // ==========================================
  {
    id: 'stock-shortage',
    categoryId: 'stock',
    title: 'STOCK SHORTAGE',
    description: 'Mitigasi bahan baku kritis habis mendadak (susu UHT, biji kopi, cup 16oz, atau sirup signature).',
    iconBgColor: '#f97316',
    iconName: 'alert-circle',
    hasDetail: true,
    isUploaded: false,
    tags: ['Bahan Habis', 'Susu UHT', 'Biji Kopi']
  },
  {
    id: 'ordering',
    categoryId: 'stock',
    title: 'ORDERING',
    description: 'Jadwal cut-off PO ke warehouse pusat Kintoun, minimum order quantity, dan lead time pengiriman.',
    iconBgColor: '#ea580c',
    iconName: 'shopping-cart',
    hasDetail: true,
    isUploaded: false,
    tags: ['Pemesanan', 'PO Warehouse', 'Lead Time']
  },
  {
    id: 'delivery-issue',
    categoryId: 'stock',
    title: 'DELIVERY ISSUE',
    description: 'Prosedur penanganan keterlambatan pengiriman logistik, kardus basah/rusak, dan klaim selisih berita acara.',
    iconBgColor: '#c2410c',
    iconName: 'truck',
    hasDetail: true,
    isUploaded: false,
    tags: ['Logistik', 'Barang Rusak', 'Klaim']
  },
  {
    id: 'inventory',
    categoryId: 'stock',
    title: 'INVENTORY',
    description: 'Pencatatan stock opname (SO) harian dan bulanan, selisih fisik vs sistem, dan kontrol penyimpanan FIFO.',
    iconBgColor: '#9a3412',
    iconName: 'boxes',
    hasDetail: true,
    isUploaded: false,
    tags: ['Stock Opname', 'FIFO', 'Inventaris']
  },
  {
    id: 'waste',
    categoryId: 'stock',
    title: 'WASTE',
    description: 'Prosedur pencatatan produk tumpah, bahan baku expired, dan batas toleransi waste bulanan.',
    iconBgColor: '#7c2d12',
    iconName: 'trash-2',
    hasDetail: true,
    isUploaded: false,
    tags: ['Waste', 'Expired', 'Toleransi']
  },

  // ==========================================
  // STORE ISSUE (5 Subkategori)
  // ==========================================
  {
    id: 'daily-operation',
    categoryId: 'store',
    title: 'DAILY OPERATION',
    description: 'Standar operasional kebersihan meja, area bar, playlist musik, suhu AC, dan kenyamanan tamu.',
    iconBgColor: '#0ea5e9',
    iconName: 'store',
    hasDetail: true,
    isUploaded: false,
    tags: ['Kebersihan', 'Playlist', 'Kenyamanan']
  },
  {
    id: 'store-execution',
    categoryId: 'store',
    title: 'STORE EXECUTION',
    description: 'Implementasi materi promosi baru (tent card, banner, poster) dan penataan display chiller pastry.',
    iconBgColor: '#0284c7',
    iconName: 'check-square',
    hasDetail: true,
    isUploaded: false,
    tags: ['Promo', 'Display', 'Chiller']
  },
  {
    id: 'opening-closing',
    categoryId: 'store',
    title: 'OPENING & COLING',
    description: 'Checklist 30 menit sebelum buka (turn on AC/chiller) dan 45 menit setelah tutup (sanitasi total gerai).',
    iconBgColor: '#0369a1',
    iconName: 'door-open',
    hasDetail: true,
    isUploaded: false,
    tags: ['Opening', 'Closing', 'Sanitasi']
  },
  {
    id: 'cash-management',
    categoryId: 'store',
    title: 'CASH MANAGEMENT',
    description: 'Modal awal kasir (petty cash cash-drawer), perhitungan selisih kas, rekonsiliasi settlement, dan setoran.',
    iconBgColor: '#1d4ed8',
    iconName: 'credit-card',
    hasDetail: true,
    isUploaded: false,
    tags: ['Kasir', 'Petty Cash', 'Settlement']
  },
  {
    id: 'operation-support',
    categoryId: 'store',
    title: 'OPERATION SUPPORT',
    description: 'Bantuan helpdesk operasional pusat, kepatuhan audit kebersihan makanan (Food Safety QA), dan perizinan.',
    iconBgColor: '#1e40af',
    iconName: 'shield-check',
    hasDetail: true,
    isUploaded: false,
    tags: ['Support', 'Helpdesk', 'Audit QA']
  }
];
