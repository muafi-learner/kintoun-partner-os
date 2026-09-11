export type Role = 'crew' | 'store-leader' | 'ho-department' | 'admin' | 'user';

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  storeName: string;
  email: string;
  avatarUrl?: string;
}

export type CategoryId = 
  | 'customer' 
  | 'product' 
  | 'equipment' 
  | 'people' 
  | 'stock' 
  | 'store';

export interface PdfSlide {
  slideNumber: number;
  title: string;
  points: string[];
  note?: string;
  bgColor?: string;
}

export interface SubcategoryCard {
  id: string;
  categoryId: CategoryId;
  title: string;
  description: string;
  iconBgColor: string;
  iconName?: string;
  hasDetail: boolean;
  pdfUrl?: string;
  pdfDataUrl?: string;
  rawFile?: File | Blob;
  pdfData?: Uint8Array;
  fileId?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  fileSize?: string;
  uploadedAt?: string;
  isUploaded?: boolean;
  tags?: string[];
  slideDeck?: PdfSlide[];
  learningCards?: LearningCardCase[];
}

export interface LearningCardCase {
  id: string;
  number: string;
  title: string;
  problem: string;
  reactSteps: {
    letter: 'R' | 'E' | 'A' | 'C' | 'T';
    title: string;
    description: string;
  }[];
  focus: string[];
  bestPractices: string[];
}

export interface NewsArticle {
  id: string;
  type: 'main' | 'specific';
  categoryId?: CategoryId;
  title: string;
  subtitle: string;
  summary: string;
  thumbnailUrl: string;
  pdfUrl: string;
  pdfDataUrl?: string;
  rawFile?: File | Blob;
  pdfData?: Uint8Array;
  fileId?: string;
  pdfFileName: string;
  pdfFileSize?: string;
  slideDeck?: PdfSlide[];
  uploadedBy: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  timestamp: string;
  read: boolean;
  targetPage?: {
    view: 'home' | 'category' | 'subcategory' | 'main-news' | 'specific-news';
    categoryId?: CategoryId;
    subcategoryId?: string;
  };
}

export interface TicketRequest {
  id: string;
  title: string;
  category: CategoryId;
  storeName: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface TicketTemplate {
  id: string;
  department: string;
  title: string;
  description: string;
  sla: string;
  iconName: string;
  badgeColor: string;
}
