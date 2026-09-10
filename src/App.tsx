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
  PdfSlide
} from './types';
import { 
  INITIAL_MAIN_NEWS, 
  INITIAL_SPECIFIC_NEWS, 
  INITIAL_SUBCATEGORIES, 
  CATEGORIES as DEFAULT_CATEGORIES
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

  const [currentView, setCurrentView] = useState<'home' | 'main-news' | 'category' | 'specific-news' | 'subcategory' | 'dashboard'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('customer');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('customer-complaint');
  const [activeDashboard, setActiveDashboard] = useState<string | null>(null);
  const [targetPdfSlide, setTargetPdfSlide] = useState<number>(1);

  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) as Role) || 'user';
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
    return { id: '', name: '', role: 'user', storeName: '', email: '' };
  });

  const [isLoginOpen, setIsLoginOpen] = useState(!isAuthenticated);

  const [mainNews, setMainNews] = useState<NewsArticle>(INITIAL_MAIN_NEWS);
  const [specificNews, setSpecificNews] = useState<Record<CategoryId, NewsArticle>>(INITIAL_SPECIFIC_NEWS);
  const [subcategories, setSubcategories] = useState<SubcategoryCard[]>(INITIAL_SUBCATEGORIES);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [tickets, setTickets] = useState<TicketRequest[]>([]);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isHostingerGuideOpen, setIsHostingerGuideOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // SINKRONISASI DATA DARI HOSTINGER
  const syncFromServer = useCallback(async () => {
    try {
      // 1. AMBIL TEKS SUB-TOPIK TERBARU DARI SERVER (BUKAN DARI LOKAL)
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

      // 2. AMBIL STATUS FILE PDF DARI UPLOAD.PHP
      const response = await fetch(`https://kintouncoffee.id/partner/api/upload.php?t=${Date.now()}`);
      const textResponse = await response.text();
      
      if (!textResponse || textResponse.trim() === '') return;

      const items = JSON.parse(textResponse);
      if (!Array.isArray(items)) return;

      if (items.length === 0) {
        setMainNews(INITIAL_MAIN_NEWS);
        setSpecificNews(INITIAL_SPECIFIC_NEWS);
        setSubcategories(latestSubcategories); // Pakai data server terbaru
        return;
      }

      let newMainNews = { ...INITIAL_MAIN_NEWS };
      let newSpecificNews = { ...INITIAL_SPECIFIC_NEWS };
      
      // GUNAKAN DATA SERVER TERBARU SEBAGAI CETAKAN DASAR
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
        } else if (payload.targetType === 'specific-news' && payload.categoryId) {
          const catId = payload.categoryId as CategoryId;
          if (newSpecificNews[catId]) {
            newSpecificNews[catId] = {
              ...newSpecificNews[catId],
              title: payload.title,
              pdfUrl: payload.pdfUrl,
              pdfFileName: payload.fileName,
              fileId: payload.id,
              slideDeck: slideDeck,
              uploadedBy: 'Administrator Pusat',
              updatedAt: uploadDate
            };
          }
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
    setUser({ id: '', name: '', role: 'user', storeName: '', email: '' });
    setRole('user');
    setIsAuthenticated(false);
    setIsLoginOpen(true);
    localStorage.removeItem('kintoun_is_authenticated');
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, 'user');
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

  const handleUploadSuccess = (payload: any) => {
    syncFromServer(); 
    
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

  const handleDeletePdf = async (targetFileId?: string) => {
    try {
      const fileIdToDelete = targetFileId || mainNews.fileId;
      if (!fileIdToDelete) {
        alert('ID dokumen tidak ditemukan.');
        return;
      }

      const response = await fetch('https://kintouncoffee.id/partner/api/delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fileIdToDelete })
      });

      const result = await response.json();
      if (result.status === 'success') {
        syncFromServer(); 
        setCurrentView('home'); 
      } else {
        alert(result.message || 'Gagal menghapus dokumen.');
      }
    } catch (err) {
      console.error("Gagal menghapus dokumen ke server", err);
      alert('Koneksi ke server terputus.');
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
            onOpenUpload={() => setIsUploadOpen(true)}
            onLogout={handleLogout}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
            onGoHome={() => {
              setCurrentView('home');
              setActiveDashboard(null);
            }}
          />

          <main className="flex-1 flex flex-col">
            {currentView === 'home' ? (
              <>
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
                  role={role}
                  user={user}
                  onLogout={handleLogout}
                />
                <HomeView
                  mainNews={mainNews}
                  subcategories={subcategories} // -> TAMBAHKAN BARIS INI
                  onSelectMainNews={() => {
                    setTargetPdfSlide(1);
                    setCurrentView('main-news');
                  }}
// ... kode sisanya biarkan sama
                  onSelectCategory={(catId) => {
                    setSelectedCategory(catId);
                    setActiveDashboard(null);
                    setCurrentView('category');
                  }}
                  onOpenTicketModal={() => setIsTicketOpen(true)}
                  onOpenUpload={() => setIsUploadOpen(true)}
                  isAdmin={role === 'admin'}
                />
              </>
            ) : (
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
                  onOpenTicketModal={() => setIsTicketOpen(true)}
                  role={role}
                  user={user}
                  onLogout={handleLogout}
                />

                <div className="flex-1 w-full min-w-0 flex flex-col overflow-y-auto">
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
                            isAdmin={role === 'admin'}
                            onUpload={() => setIsUploadOpen(true)}
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
                            isAdmin={role === 'admin'}
                            initialPage={targetPdfSlide}
                            onReplacePdf={() => setIsUploadOpen(true)}
                            onDeletePdf={() => handleDeletePdf(mainNews.fileId)}
                            onBack={() => setCurrentView('home')}
                          />
                        )}
                      </div>

                      <div className="fixed bottom-6 right-6 z-40">
                        <a
                          href="https://helpdesk.kintouncoffee.id"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4.5 py-2.5 rounded-xl bg-[#00263f] hover:bg-[#3c586d] text-white font-black text-xs tracking-wider uppercase shadow-xl hover:shadow-2xl transition transform hover:scale-105 flex items-center gap-2 cursor-pointer border border-white/10"
                        >
                          <span>Bantuan Teknisi</span>
                          <ExternalLink className="w-4 h-4 text-slate-300" />
                        </a>
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
                      onDeletePdf={(subId) => handleDeletePdf(subcategories.find(s => s.id === subId)?.fileId)}
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

          <AdminUploadModal
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            onUploadSuccess={handleUploadSuccess}
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
