import React, { useState, useEffect } from 'react';
import { 
  CategoryId, 
  Role, 
  UserProfile, 
  NewsArticle, 
  SubcategoryCard, 
  AppNotification, 
  TicketRequest,
  PdfSlide
} from './types';
import { 
  CATEGORIES, 
  INITIAL_MAIN_NEWS, 
  INITIAL_SPECIFIC_NEWS, 
  INITIAL_SUBCATEGORIES, 
  INITIAL_NOTIFICATIONS 
} from './data/initialData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { NewsDetailView } from './components/NewsDetailView';
import { LearningCardsView } from './components/LearningCardsView';
import { DashboardView } from './components/DashboardView';
import { AdminUploadModal } from './components/AdminUploadModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationModal } from './components/NotificationModal';
import { SearchModal } from './components/SearchModal';
import { TicketModal } from './components/TicketModal';
import { HostingerGuideModal } from './components/HostingerGuideModal';
import { LoginModal } from './components/LoginModal';
import { STORAGE_KEYS } from './services/storage';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'main-news' | 'category' | 'specific-news' | 'subcategory' | 'dashboard'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('customer');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('customer-complaint');
  const [activeDashboard, setActiveDashboard] = useState<string | null>(null);
  const [targetPdfSlide, setTargetPdfSlide] = useState<number>(1);

  // User & Authority State
  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) as Role) || 'user';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const savedRole = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) as Role;
    if (savedRole === 'admin') {
      return {
        id: 'adm_01',
        name: 'Head Office Administrator',
        role: 'admin',
        storeName: 'HQ & Operational Central Kintoun',
        email: 'admin.ops@kintoun.id'
      };
    }
    return {
      id: 'usr_01',
      name: 'Budi Santoso',
      role: 'user',
      storeName: 'Gerai Kintoun Merdeka - Bandung',
      email: 'barista.merdeka@kintoun.id'
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
  }, [role]);

  // Content State
  const [mainNews, setMainNews] = useState<NewsArticle>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MAIN_NEWS);
    return saved ? JSON.parse(saved) : INITIAL_MAIN_NEWS;
  });

  const [specificNews, setSpecificNews] = useState<Record<CategoryId, NewsArticle>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPECIFIC_NEWS);
    return saved ? JSON.parse(saved) : INITIAL_SPECIFIC_NEWS;
  });

  const [subcategories, setSubcategories] = useState<SubcategoryCard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBCATEGORIES);
    if (!saved) return INITIAL_SUBCATEGORIES;
    try {
      const parsed: SubcategoryCard[] = JSON.parse(saved);
      // Merge: apply latest color and default data from INITIAL_SUBCATEGORIES while preserving user custom cards
      const updated = INITIAL_SUBCATEGORIES.map((initSub) => {
        const found = parsed.find((p) => p.id === initSub.id);
        if (found) {
          return {
            ...found,
            iconBgColor: initSub.iconBgColor,
            title: initSub.title,
            description: initSub.description,
          };
        }
        return initSub;
      });
      const customOnes = parsed.filter((p) => !INITIAL_SUBCATEGORIES.some((init) => init.id === p.id));
      return [...updated, ...customOnes];
    } catch {
      return INITIAL_SUBCATEGORIES;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [tickets, setTickets] = useState<TicketRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'tkt-01',
        title: 'Penggantian Seal Karet Group Head Mesin Kopi',
        category: 'equipment',
        storeName: 'Gerai Kintoun Merdeka - Bandung',
        urgency: 'high',
        description: 'Terjadi sedikit rembesan air panas saat ekstraksi espresso.',
        status: 'in_progress',
        createdAt: 'Hari ini, 08:15 WIB'
      }
    ];
  });

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isHostingerGuideOpen, setIsHostingerGuideOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MAIN_NEWS, JSON.stringify(mainNews));
  }, [mainNews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPECIFIC_NEWS, JSON.stringify(specificNews));
  }, [specificNews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBCATEGORIES, JSON.stringify(subcategories));
  }, [subcategories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  // Auth Handlers
  const handleLogin = (newProfile: UserProfile) => {
    setUser(newProfile);
    setRole(newProfile.role);
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, newProfile.role);
  };

  const handleLogout = () => {
    const defaultKru: UserProfile = {
      id: `usr_${Date.now()}`,
      name: 'Kru Tamu Gerai',
      role: 'user',
      storeName: 'Gerai Kintoun Merdeka - Bandung',
      email: 'kru@partner.kintoun.id'
    };
    setUser(defaultKru);
    setRole('user');
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, 'user');
  };

  const handleSwitchRole = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setUser({
        id: 'adm_01',
        name: 'Head Office Administrator',
        role: 'admin',
        storeName: 'HQ & Operational Central Kintoun',
        email: 'admin.ops@kintoun.id'
      });
    } else {
      setUser({
        id: 'usr_01',
        name: 'Budi Santoso',
        role: 'user',
        storeName: 'Gerai Kintoun Merdeka - Bandung',
        email: 'barista.merdeka@kintoun.id'
      });
    }
  };

  // Search Navigation Handlers
  const handleNavigateToSubcategory = (catId: CategoryId, subcatId: string, targetSlide?: number) => {
    setSelectedCategory(catId);
    setSelectedSubcategoryId(subcatId);
    setTargetPdfSlide(targetSlide || 1);
    setActiveDashboard(null);
    setCurrentView('subcategory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToMainNews = (targetSlide?: number) => {
    setTargetPdfSlide(targetSlide || 1);
    setActiveDashboard(null);
    setCurrentView('main-news');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToSpecificNews = (catId: CategoryId, targetSlide?: number) => {
    setSelectedCategory(catId);
    setTargetPdfSlide(targetSlide || 1);
    setActiveDashboard(null);
    setCurrentView('specific-news');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers
  const handleUploadSuccess = (payload: {
    targetType: 'main-news' | 'specific-news' | 'subcategory';
    categoryId?: CategoryId;
    subcategoryId?: string;
    title: string;
    subtitle: string;
    summary: string;
    pdfUrl: string;
    pdfDataUrl?: string;
    fileId?: string;
    fileName: string;
    fileSize: string;
    thumbnailUrl?: string;
    notifyUsers: boolean;
  }) => {
    const uploadedSlideDeck: PdfSlide[] = [
      {
        slideNumber: 1,
        title: payload.title.toUpperCase(),
        points: [
          payload.subtitle || 'Modul Presentasi PPT Yang Diubah Menjadi PDF Resmi 2026',
          `Nama Berkas: ${payload.fileName}`,
          `Ukuran Dokumen: ${payload.fileSize}`,
          'Format Berkas: PPT / PDF Standar Operasional Kintoun',
          `Diupload oleh: Administrator Pusat (${new Date().toLocaleDateString('id-ID')})`
        ],
        note: 'Materi presentasi terbaru dari Tim Operasional Head Office.',
        bgColor: 'bg-[#00263f] text-white'
      },
      {
        slideNumber: 2,
        title: 'INSTRUKSI STANDAR OPERASIONAL TERBARU',
        points: [
          payload.summary || 'Pelajari materi ini secara seksama untuk diterapkan di seluruh gerai.',
          '1. Seluruh kru barista wajib memahami alur kerja dan standar kualitas sajian.',
          '2. Gunakan takaran resep dan gramasi yang telah dibakukan.',
          '3. Hubungi supervisor bila terdapat keraguan dalam penerapan di lapangan.'
        ],
        note: 'Penerapan standar menjamin konsistensi rasa dan layanan di seluruh gerai.',
        bgColor: 'bg-[#153459] text-white'
      },
      {
        slideNumber: 3,
        title: 'PENANGANAN SITUASI & KONTROL KUALITAS',
        points: [
          'Lakukan checklist berkala sebelum jam sibuk (peak hours).',
          'Pastikan alat dan mesin selalu dikalibrasi sesuai standar temperatur.',
          'Laporkan jika terjadi deviasi melalui sistem tiket bantuan.'
        ],
        note: 'Kualitas dan kepuasan pelanggan adalah prioritas utama Kintoun.',
        bgColor: 'bg-[#1e4620] text-white'
      }
    ];

    if (payload.targetType === 'main-news') {
      const updated: NewsArticle = {
        ...mainNews,
        title: payload.title,
        subtitle: payload.subtitle,
        summary: payload.summary,
        pdfUrl: payload.pdfUrl,
        pdfDataUrl: payload.pdfDataUrl,
        fileId: payload.fileId,
        pdfFileName: payload.fileName,
        pdfFileSize: payload.fileSize,
        thumbnailUrl: payload.thumbnailUrl || mainNews.thumbnailUrl,
        slideDeck: uploadedSlideDeck,
        uploadedBy: 'Administrator Pusat',
        updatedAt: 'Baru saja'
      };
      setMainNews(updated);
      setTargetPdfSlide(1);
      setCurrentView('main-news');
    } else if (payload.targetType === 'specific-news' && payload.categoryId) {
      const existing = specificNews[payload.categoryId];
      const updated: NewsArticle = {
        ...existing,
        title: payload.title,
        subtitle: payload.subtitle,
        summary: payload.summary,
        pdfUrl: payload.pdfUrl,
        pdfDataUrl: payload.pdfDataUrl,
        fileId: payload.fileId,
        pdfFileName: payload.fileName,
        pdfFileSize: payload.fileSize,
        thumbnailUrl: payload.thumbnailUrl || existing.thumbnailUrl,
        slideDeck: uploadedSlideDeck,
        uploadedBy: 'Administrator Pusat',
        updatedAt: 'Baru saja'
      };
      setSpecificNews(prev => ({ ...prev, [payload.categoryId!]: updated }));
      setSelectedCategory(payload.categoryId);
      setTargetPdfSlide(1);
      setCurrentView('specific-news');
    } else if (payload.targetType === 'subcategory' && payload.subcategoryId) {
      setSubcategories(prev => prev.map(s => {
        if (s.id === payload.subcategoryId) {
          return {
            ...s,
            title: payload.title || s.title,
            description: payload.subtitle || s.description,
            pdfUrl: payload.pdfUrl,
            pdfDataUrl: payload.pdfDataUrl,
            fileId: payload.fileId,
            pdfFileName: payload.fileName,
            pdfFileSize: payload.fileSize,
            slideDeck: uploadedSlideDeck,
            isUploaded: true,
            uploadedAt: 'Baru saja'
          };
        }
        return s;
      }));
      if (payload.categoryId) setSelectedCategory(payload.categoryId);
      setSelectedSubcategoryId(payload.subcategoryId);
      setTargetPdfSlide(1);
      setCurrentView('subcategory');
    }

    // Generate broadcast notification if requested
    if (payload.notifyUsers) {
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        title: `Materi Baru: ${payload.title}`,
        message: `Administrator telah mengunggah file PDF "${payload.fileName}". Seluruh partner gerai dapat mengakses materi ini.`,
        category: payload.targetType === 'main-news' ? 'Main News' : (payload.categoryId?.toUpperCase() || 'Materi SOP'),
        timestamp: 'Baru saja',
        read: false,
        targetPage: {
          view: payload.targetType === 'main-news' ? 'main-news' : payload.targetType === 'specific-news' ? 'specific-news' : 'subcategory',
          categoryId: payload.categoryId,
          subcategoryId: payload.subcategoryId
        }
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const handleSelectNotification = (notif: AppNotification) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setIsNotifOpen(false);

    if (notif.targetPage) {
      if (notif.targetPage.categoryId) {
        setSelectedCategory(notif.targetPage.categoryId);
      }
      if (notif.targetPage.subcategoryId) {
        setSelectedSubcategoryId(notif.targetPage.subcategoryId);
      }
      setCurrentView(notif.targetPage.view);
      setActiveDashboard(null);
    }
  };

  const handleCreateTicket = (ticketData: Omit<TicketRequest, 'id' | 'createdAt' | 'status'>) => {
    const newTicket: TicketRequest = {
      ...ticketData,
      id: `tkt_${Date.now()}`,
      createdAt: 'Baru saja',
      status: 'open'
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  // Find active subcategory data
  const currentSubcategory = subcategories.find(s => s.id === selectedSubcategoryId) || subcategories[0];
  const currentSpecificNews = specificNews[selectedCategory] || specificNews['customer'];

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#eeebe1] text-slate-800 flex flex-col font-sans selection:bg-[#00263f] selection:text-white">
      {/* Top Header */}
      <Header
        variant={currentView === 'home' ? 'home' : 'subpage'}
        role={role}
        user={user}
        notifications={notifications}
        unreadCount={unreadNotifCount}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenHostingerGuide={() => setIsHostingerGuideOpen(true)}
        onToggleMobileSidebar={currentView !== 'home' ? () => setIsMobileSidebarOpen(prev => !prev) : undefined}
        onGoHome={() => {
          setCurrentView('home');
          setActiveDashboard(null);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' ? (
          <HomeView
            mainNews={mainNews}
            onSelectMainNews={() => {
              setTargetPdfSlide(1);
              setCurrentView('main-news');
            }}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setActiveDashboard(null);
              setCurrentView('category');
            }}
            onOpenTicketModal={() => setIsTicketOpen(true)}
            onOpenUpload={() => setIsUploadOpen(true)}
            isAdmin={role === 'admin'}
          />
        ) : (
          /* Subpage Layout: Responsive Desktop Sidebar + Full-width Content Router */
          <div className="flex-1 flex flex-row w-full min-h-0 relative items-stretch">
            <Sidebar
              currentView={currentView}
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setActiveDashboard(null);
                setCurrentView('category');
              }}
              onSelectHomepage={() => {
                setCurrentView('home');
                setActiveDashboard(null);
              }}
              isMobileOpen={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              onOpenTicketModal={() => setIsTicketOpen(true)}
            />

            {/* Subpage Content Router: Full width on mobile and flex-1 on desktop */}
            <div className="flex-1 w-full min-w-0 flex flex-col overflow-y-auto">
              {currentView === 'main-news' && (
                <NewsDetailView
                  article={mainNews}
                  targetSlide={targetPdfSlide}
                  onBack={() => setCurrentView('home')}
                  onOpenUpload={() => setIsUploadOpen(true)}
                  isAdmin={role === 'admin'}
                />
              )}

              {currentView === 'category' && (
                <CategoryView
                  categoryId={selectedCategory}
                  subcategories={subcategories}
                  specificNews={currentSpecificNews}
                  onSelectSubcategory={(subcatId) => handleNavigateToSubcategory(selectedCategory, subcatId)}
                  onSelectNews={() => {
                    setTargetPdfSlide(1);
                    setCurrentView('specific-news');
                  }}
                  onOpenUpload={() => setIsUploadOpen(true)}
                  onBackToHome={() => setCurrentView('home')}
                  onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                  isAdmin={role === 'admin'}
                />
              )}

              {currentView === 'specific-news' && (
                <NewsDetailView
                  article={currentSpecificNews}
                  categoryId={selectedCategory}
                  targetSlide={targetPdfSlide}
                  onBack={() => setCurrentView('category')}
                  onOpenUpload={() => setIsUploadOpen(true)}
                  isAdmin={role === 'admin'}
                />
              )}

              {currentView === 'subcategory' && (
                <LearningCardsView
                  cardData={currentSubcategory}
                  targetSlide={targetPdfSlide}
                  onBack={() => setCurrentView('category')}
                  onOpenUpload={() => setIsUploadOpen(true)}
                  isAdmin={role === 'admin'}
                />
              )}

              {currentView === 'dashboard' && activeDashboard && (
                <DashboardView
                  dashboardName={activeDashboard}
                  tickets={tickets}
                  onOpenTicketModal={() => setIsTicketOpen(true)}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals & Dialogs */}
      <AdminUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onSwitchRole={handleSwitchRole}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onSelectNotification={handleSelectNotification}
        onMarkAllRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        subcategories={subcategories}
        mainNews={mainNews}
        specificNews={specificNews}
        onNavigateToCategory={(catId) => {
          setSelectedCategory(catId);
          setActiveDashboard(null);
          setCurrentView('category');
        }}
        onNavigateToSubcategory={handleNavigateToSubcategory}
        onNavigateToMainNews={handleNavigateToMainNews}
        onNavigateToSpecificNews={handleNavigateToSpecificNews}
      />

      <TicketModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        onSubmitTicket={handleCreateTicket}
      />

      <HostingerGuideModal
        isOpen={isHostingerGuideOpen}
        onClose={() => setIsHostingerGuideOpen(false)}
      />
    </div>
  );
}
