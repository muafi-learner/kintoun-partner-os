import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Upload, ExternalLink 
} from 'lucide-react';
import { 
  CategoryId, 
  Role, 
  UserProfile, 
  NewsArticle, 
  SubcategoryCard, 
  AppNotification, 
  TicketRequest,
  PdfSlide,
  TicketTemplate
} from './types';
import { 
  INITIAL_MAIN_NEWS, 
  INITIAL_SPECIFIC_NEWS, 
  INITIAL_SUBCATEGORIES, 
  CATEGORIES as DEFAULT_CATEGORIES,
  INITIAL_TICKET_TEMPLATES
} from './data/initialData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { NewsDetailView } from './components/NewsDetailView';
import { LearningCardsView } from './components/LearningCardsView';
import { DashboardView } from './components/DashboardView';
import { AdminUploadModal } from './components/AdminUploadModal';
import { NotificationModal } from './components/NotificationModal';
import { SearchModal } from './components/SearchModal';
import { TicketModal } from './components/TicketModal';
import { HostingerGuideModal } from './components/HostingerGuideModal';
import { LoginModal } from './components/LoginModal';
import { PdfViewer } from './components/PdfViewer';
import { EmptyModuleState } from './components/EmptyModuleState';
import { STORAGE_KEYS } from './services/storage';
import { TicketCatalogView } from './components/TicketCatalogView';

const generateSlideDeck = (title: string, fileName: string, fileSize: string, date: string, extractedText: string = ''): PdfSlide[] => [
  {
    slideNumber: 1,
    title: title.toUpperCase(),
    points: [
      'Modul Presentasi PPT Yang Diubah Menjadi PDF Resmi',
      `Nama Berkas: ${fileName}`,
      `Ukuran Dokumen: ${fileSize || 'N/A'}`,
      'Format Berkas: PPT / PDF Standar Operasional Kintoun',
      `Diupload pada: ${date}`
    ],
    note: extractedText || 'Materi presentasi terbaru dari Tim Operasional Head Office.',
    bgColor: 'bg-[#00263f] text-white'
  }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('kintoun_is_authenticated') === 'true';
  });

  const [currentView, setCurrentView] = useState<'home' | 'main-news' | 'category' | 'specific-news' | 'subcategory' | 'dashboard' | 'ticket-catalog'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('customer');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('customer-complaint');
  const [activeDashboard, setActiveDashboard] = useState<string | null>(null);
  const [targetPdfSlide, setTargetPdfSlide] = useState<number>(1);

  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) as Role) || 'crew';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const sessionData = sessionStorage.getItem('kintoun_session');
    if (sessionData) {
      try { return JSON.parse(sessionData); } catch (e) { console.error(e); }
    }
    const localData = localStorage.getItem('kintoun_session');
    if (localData) {
      try { return JSON.parse(localData); } catch (e) { console.error(e); }
    }
    return { id: '', name: '', role: 'crew', storeName: '', email: '' };
  });

  const [isLoginOpen, setIsLoginOpen] = useState(!isAuthenticated);

  const [mainNews, setMainNews] = useState<NewsArticle>(INITIAL_MAIN_NEWS);
  const [specificNews, setSpecificNews] = useState<Record<CategoryId, NewsArticle>>(INITIAL_SPECIFIC_NEWS);
  const [subcategories, setSubcategories] = useState<SubcategoryCard[]>(INITIAL_SUBCATEGORIES);
  const [ticketTemplates, setTicketTemplates] = useState<TicketTemplate[]>(INITIAL_TICKET_TEMPLATES);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [tickets, setTickets] = useState<TicketRequest[]>([]);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTargetType, setUploadTargetType] = useState<'main-news' | 'subcategory' | undefined>(undefined);
  const [uploadCategoryId, setUploadCategoryId] = useState<CategoryId | undefined>(undefined);
  const [uploadSubcategoryId, setUploadSubcategoryId] = useState<string | undefined>(undefined);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isHostingerGuideOpen, setIsHostingerGuideOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleOpenUpload = (targetType?: 'main-news' | 'subcategory', categoryId?: CategoryId, subcategoryId?: string) => {
    setUploadTargetType(targetType);
    setUploadCategoryId(categoryId);
    setUploadSubcategoryId(subcategoryId);
    setIsUploadOpen(true);
  };

  const syncFromServer = useCallback(async () => {
    try {
      let latestSubcategories = INITIAL_SUBCATEGORIES;
      try {
        const subResponse = await fetch(`https://kintouncoffee.id/partner/api/subcategories.json?t=${Date.now()}`);
        if (subResponse.ok) {
          const subText = await subResponse.text();
          if (subText && subText.trim() !== '') {
            const parsedSubs = JSON.parse(subText);
            if (Array.isArray(parsedSubs) && parsedSubs.length > 0) {
              latestSubcategories = parsedSubs;
            }
          }
        }
      } catch (e) {
        console.error("Gagal mengambil teks subkategori dari server", e);
      }

      let latestTickets = INITIAL_TICKET_TEMPLATES;
      try {
        const tktResponse = await fetch(`https://kintouncoffee.id/partner/api/tickets.json?t=${Date.now()}`);
        if (tktResponse.ok) {
          const tktText = await tktResponse.text();
          if (tktText && tktText.trim() !== '') {
            const parsedTkts = JSON.parse(tktText);
            if (Array.isArray(parsedTkts) && parsedTkts.length > 0) {
              latestTickets = parsedTkts;
            }
          }
        }
      } catch (e) {
        console.error("Gagal mengambil data tiket dari server", e);
      }
      setTicketTemplates(latestTickets);

      const response = await fetch(`https://kintouncoffee.id/partner/api/upload.php?t=${Date.now()}`);
      const textResponse = await response.text();
      
      if (!textResponse || textResponse.trim() === '') return;

      const items = JSON.parse(textResponse);
      if (!Array.isArray(items)) return;

      if (items.length === 0) {
        setMainNews(INITIAL_MAIN_NEWS);
        setSpecificNews(INITIAL_SPECIFIC_NEWS);
        setSubcategories(latestSubcategories);
        return;
      }

      let newMainNews = { ...INITIAL_MAIN_NEWS };
      let newSpecificNews = { ...INITIAL_SPECIFIC_NEWS };
      
      let newSubcategories = latestSubcategories.map(sub => ({
        ...sub,
        isUploaded: false,
        pdfUrl: undefined,
        pdfFileName: undefined,
        fileId: undefined,
        slideDeck: undefined
      }));

      const reversedItems = [...items].reverse();

      reversedItems.forEach(payload => {
        const uploadDate = new Date(payload.uploadedAt).toLocaleDateString('id-ID');
        const slideDeck = generateSlideDeck(payload.title, payload.fileName, 'N/A', uploadDate, payload.extractedText);

        if (payload.targetType === 'main-news') {
          newMainNews = {
            ...newMainNews,
            title: payload.title,
            pdfUrl: payload.pdfUrl,
            pdfFileName: payload.fileName,
            fileId: payload.id,
            slideDeck: slideDeck,
            uploadedBy: 'Administrator Pusat',
            updatedAt: uploadDate
          };
        } else if (payload.targetType === 'subcategory') {
          let subIndex = newSubcategories.findIndex(s => s.id === payload.subcategoryId);
          if (subIndex === -1 && payload.categoryId) {
            subIndex = newSubcategories.findIndex(s => s.categoryId === payload.categoryId);
          }

          if (subIndex > -1) {
            newSubcategories[subIndex] = {
              ...newSubcategories[subIndex],
              title: payload.title,
              pdfUrl: payload.pdfUrl,
              pdfFileName: payload.fileName,
              fileId: payload.id,
              slideDeck: slideDeck,
              isUploaded: true,
              uploadedAt: uploadDate
            };
          }
        }
      });

      setMainNews(newMainNews);
      setSpecificNews(newSpecificNews);
      setSubcategories(newSubcategories);

    } catch (error) {
      console.error("Gagal sinkronisasi dengan server Hostinger", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      syncFromServer();
      const interval = setInterval(() => {
        syncFromServer();
      }, 10000); 
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, syncFromServer]);

  const handleLogin = (newProfile: UserProfile) => {
    setUser(newProfile);
    setRole(newProfile.role);
    setIsAuthenticated(true);
    setIsLoginOpen(false);
    localStorage.setItem('kintoun_is_authenticated', 'true');
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, newProfile.role);
  };

  const handleLogout = () => {
    setUser({ id: '', name: '', role: 'crew', storeName: '', email: '' });
    setRole('crew');
    setIsAuthenticated(false);
    setIsLoginOpen(true);
    localStorage.removeItem('kintoun_is_authenticated');
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, 'crew');
    setCurrentView('home');
    setActiveDashboard(null);
  };

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

  const handleUploadSuccess = async (payload: any) => {
    syncFromServer(); 
    
    if (payload.notifyUsers) {
      // 1. Notifikasi In-App (Web)
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        title: `Materi Baru: ${payload.title}`,
        message: `Administrator telah mengunggah file PDF "${payload.fileName}". Seluruh partner gerai dapat mengakses materi ini.`,
        category: payload.targetType === 'main-news' ? 'Main News' : (payload.categoryId?.toUpperCase() || 'Materi SOP'),
        timestamp: 'Baru saja',
        read: false,
        targetPage: {
          view: payload.targetType === 'main-news' ? 'main-news' : 'subcategory',
          categoryId: payload.categoryId,
          subcategoryId: payload.subcategoryId
        }
      };
      setNotifications(prev => [newNotif, ...prev]);

      // 2. Trigger Webhook n8n
      try {
        // GANTI URL INI DENGAN URL WEBHOOK N8N ANDA NANTI
        const N8N_WEBHOOK_URL = 'https://n8n-h238.srv1866922.hstgr.cloud/webhook-test/kintoun-partner';
        
        await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'new_module_uploaded',
            moduleTitle: payload.title,
            fileName: payload.fileName,
            category: payload.targetType === 'main-news' ? 'PANDUAN UTAMA' : (payload.categoryId?.toUpperCase() || 'SOP'),
            uploadedBy: user.name,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error("Gagal mengirim trigger webhook ke n8n:", error);
      }
    }
  };

  const handleDeletePdf = async (targetFileId?: string) => {
    try {
      const fileIdToDelete = targetFileId || mainNews.fileId;
      
      if (!fileIdToDelete) {
        syncFromServer(); 
        setCurrentView('home'); 
        return;
      }

      const response = await fetch('https://kintouncoffee.id/partner/api/delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fileIdToDelete })
      });

      const result = await response.json();
      
      syncFromServer(); 
      setCurrentView('home'); 
      
    } catch (err) {
      console.error("Gagal menghapus dokumen ke server", err);
      syncFromServer();
      setCurrentView('home');
    }
  };

  const handleSelectNotification = (notif: AppNotification) => {
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

  const currentSubcategory = subcategories.find(s => s.id === selectedSubcategoryId) || subcategories[0];
  const currentSpecificNews = specificNews[selectedCategory] || specificNews['customer'];
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // LOGIKA OTORISASI MUTLAK YANG BARU (Hanya 3 Role)
  const isUserAdmin = role === 'ho-department';
  const canViewTickets = role === 'store-leader' || role === 'ho-department';

  return (
    <div className="min-h-screen bg-[#eeebe1] text-slate-800 flex flex-col font-sans selection:bg-[#00263f] selection:text-white">
      
      {!isAuthenticated && (
        <div className="fixed inset-0 z-50 bg-[#00263f] flex items-center justify-center">
           <LoginModal
            isOpen={isLoginOpen}
            onClose={() => {}} 
            currentUser={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </div>
      )}

      {isAuthenticated && (
        <>
          <Header
            currentView={currentView}
            role={role}
            user={user}
            notifications={notifications}
            unreadCount={unreadNotifCount}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setActiveDashboard(null);
              setCurrentView('category');
            }}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotifOpen(true)}
            onOpenUpload={() => handleOpenUpload()}
            onLogout={handleLogout}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
            onGoHome={() => {
              setCurrentView('home');
              setActiveDashboard(null);
            }}
            onOpenTicketCatalog={() => {
              setCurrentView('ticket-catalog');
              setActiveDashboard(null);
            }}
            canViewTickets={canViewTickets}
          />

          <main className="flex-1 flex flex-col">
            <div className="flex-1 flex w-full relative">
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
                onOpenTicketModal={() => {
                  setCurrentView('ticket-catalog');
                  setActiveDashboard(null);
                  setIsMobileSidebarOpen(false);
                }}
                role={role}
                user={user}
                onLogout={handleLogout}
                canViewTickets={canViewTickets}
              />

              <div className="flex-1 w-full min-w-0 flex flex-col overflow-y-auto">
                {currentView === 'home' && (
                  <HomeView
                    mainNews={mainNews}
                    subcategories={subcategories}
                    tickets={ticketTemplates}
                    onSelectMainNews={() => {
                      setTargetPdfSlide(1);
                      setCurrentView('main-news');
                    }}
                    onSelectCategory={(catId) => {
                      setSelectedCategory(catId);
                      setActiveDashboard(null);
                      setCurrentView('category');
                    }}
                    onOpenTicketModal={() => setCurrentView('ticket-catalog')}
                    onOpenUpload={() => handleOpenUpload()}
                    onUpdateTickets={(newTickets) => setTicketTemplates(newTickets)}
                    isAdmin={isUserAdmin}
                    canViewTickets={canViewTickets}
                  />
                )}

                {currentView === 'main-news' && (
                  <div className="relative flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full font-sans pb-20">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentView('home')}
                          className="md:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-[#d6cfbf] hover:bg-[#eeebe1] hover:text-[#00263f] transition shadow-xs cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Kembali</span>
                        </button>
                      </div>
                    </div>

                    <div id="main-news-viewer-wrapper" className="w-full">
                      {!mainNews.pdfUrl && !mainNews.pdfDataUrl && !mainNews.pdfData && !mainNews.rawFile && !mainNews.fileId ? (
                        <EmptyModuleState
                          title={mainNews.title}
                          categoryName="PANDUAN UTAMA"
                          isAdmin={isUserAdmin}
                          onUpload={() => handleOpenUpload('main-news')}
                          onBack={() => setCurrentView('home')}
                        />
                      ) : (
                        <PdfViewer
                          title={`PRESENTASI PPT: ${mainNews.title}`}
                          subtitle={mainNews.summary}
                          fileName={mainNews.pdfFileName || 'Panduan_Utama_2026.pdf'}
                          pdfUrl={mainNews.pdfUrl}
                          pdfDataUrl={mainNews.pdfDataUrl}
                          rawFile={mainNews.rawFile}
                          pdfData={mainNews.pdfData}
                          fileId={mainNews.fileId}
                          fileSize={mainNews.pdfFileSize}
                          isAdmin={isUserAdmin}
                          initialPage={targetPdfSlide}
                          onReplacePdf={() => handleOpenUpload('main-news')}
                          onDeletePdf={() => handleDeletePdf(mainNews.fileId)}
                          onBack={() => setCurrentView('home')}
                        />
                      )}
                    </div>
                  </div>
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
                    onOpenUpload={(catId, subId) => {
                      if (catId && subId) {
                        handleOpenUpload('subcategory', catId as CategoryId, subId);
                      } else {
                        handleOpenUpload();
                      }
                    }}
                    onBackToHome={() => setCurrentView('home')}
                    onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                    isAdmin={isUserAdmin}
                  />
                )}

                {currentView === 'specific-news' && (
                  <NewsDetailView
                    article={currentSpecificNews}
                    categoryId={selectedCategory}
                    targetSlide={targetPdfSlide}
                    onBack={() => setCurrentView('category')}
                    onOpenUpload={() => handleOpenUpload()}
                    isAdmin={isUserAdmin}
                  />
                )}

                {currentView === 'subcategory' && (
                  <LearningCardsView
                    cardData={currentSubcategory}
                    targetSlide={targetPdfSlide}
                    onBack={() => setCurrentView('category')}
                    onOpenUpload={() => handleOpenUpload('subcategory', selectedCategory, selectedSubcategoryId)}
                    onDeletePdf={(subId) => handleDeletePdf(subcategories.find(s => s.id === subId)?.fileId)}
                    isAdmin={isUserAdmin}
                  />
                )}

                {currentView === 'dashboard' && activeDashboard && (
                  <DashboardView
                    dashboardName={activeDashboard}
                    tickets={tickets}
                    onOpenTicketModal={() => setIsTicketOpen(true)}
                  />
                )}

                {currentView === 'ticket-catalog' && (
                  <TicketCatalogView 
                    tickets={ticketTemplates} 
                    isAdmin={isUserAdmin} 
                    onBack={() => setCurrentView('home')} 
                    onUpdateTickets={(newTickets) => setTicketTemplates(newTickets)} 
                  />
                )}
              </div>
            </div>
          </main>

          <AdminUploadModal
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            onUploadSuccess={handleUploadSuccess}
            initialTargetType={uploadTargetType}
            initialCategoryId={uploadCategoryId}
            initialSubcategoryId={uploadSubcategoryId}
            subcategories={subcategories}
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
        </>
      )}
    </div>
  );
}
