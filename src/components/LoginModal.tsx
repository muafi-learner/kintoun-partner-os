import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Eye, 
  User, 
  Store, 
  KeyRound, 
  CheckCircle2, 
  Lock, 
  LogOut, 
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Role, UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

const STORE_LIST = [
  'Gerai Kintoun Senopati - Jakarta Selatan',
  'Gerai Kintoun Merdeka - Bandung',
  'Gerai Kintoun Grand Indonesia - Jakarta Pusat',
  'Gerai Kintoun Tunjungan - Surabaya',
  'Gerai Kintoun Diponegoro - Yogyakarta',
  'Gerai Kintoun Kemang - Jakarta Selatan',
  'Gerai Kintoun Dago - Bandung'
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout
}) => {
  const [selectedTab, setSelectedTab] = useState<'kru' | 'admin'>(
    currentUser.role === 'admin' ? 'admin' : 'kru'
  );

  // Kru Form State
  const [kruName, setKruName] = useState(
    currentUser.role === 'user' ? currentUser.name : 'Budi Santoso'
  );
  const [kruStore, setKruStore] = useState(
    currentUser.role === 'user' ? currentUser.storeName : STORE_LIST[1]
  );

  // Admin Form State
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isOpen) return null;

  const handleKruLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = kruName.trim() || 'Kru Barista';
    const profile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      role: 'user',
      storeName: kruStore,
      email: `${cleanName.toLowerCase().replace(/\s+/g, '.')}@partner.kintoun.id`
    };
    onLogin(profile);
    onClose();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const pass = adminPassword.trim().toLowerCase();
    if (pass === 'admin' || pass === 'admin123' || pass === 'kintoun' || pass === '123456') {
      const profile: UserProfile = {
        id: 'admin_ops',
        name: 'Head Office Administrator',
        role: 'admin',
        storeName: 'HQ & Operational Central Kintoun',
        email: 'admin.ops@kintoun.id'
      };
      onLogin(profile);
      setAdminPassword('');
      onClose();
    } else {
      setAdminError('Passcode salah. Gunakan kata sandi: "admin" atau klik 1-Klik Masuk Admin.');
    }
  };

  const handleOneClickAdmin = () => {
    const profile: UserProfile = {
      id: 'admin_ops',
      name: 'Head Office Administrator',
      role: 'admin',
      storeName: 'HQ & Operational Central Kintoun',
      email: 'admin.ops@kintoun.id'
    };
    onLogin(profile);
    onClose();
  };

  const handleOneClickKru = () => {
    const profile: UserProfile = {
      id: 'usr_kru_demo',
      name: 'Andi Barista',
      role: 'user',
      storeName: STORE_LIST[0],
      email: 'andi.barista@kintoun.id'
    };
    onLogin(profile);
    onClose();
  };

  return (
    <div 
      id="modal-login-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        id="modal-login-card"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#d6cfbf] overflow-hidden my-8"
      >
        {/* Modal Top Header */}
        <div className="bg-[#00263f] text-white p-6 relative">
          <button
            id="btn-close-login-modal"
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-black tracking-wider text-white">KINTOUN</span>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full text-slate-200">
              SISTEM OTORITAS
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-white">
            Masuk Portal Operasional & SOP Gerai
          </h3>
          <p className="text-xs text-[#c0c9ce] mt-1">
            Pilih level otoritas akun sesuai peran Anda di gerai atau kantor pusat.
          </p>
        </div>

        {/* Current Status Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${currentUser.role === 'admin' ? 'bg-amber-500' : 'bg-sky-500'}`} />
            <span className="text-xs font-bold text-slate-700">
              Akun Aktif: <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.role === 'admin' ? 'Administrator' : 'Kru Gerai'})
            </span>
          </div>
          <button
            id="btn-logout-current-user"
            onClick={() => {
              onLogout();
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>

        {/* Authority Level Selector Tabs */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              id="tab-login-kru"
              onClick={() => setSelectedTab('kru')}
              className={`py-2.5 px-3 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedTab === 'kru'
                  ? 'bg-white text-[#00263f] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye className="w-4 h-4 text-sky-600" />
              <span>1. Level Kru (View Only)</span>
            </button>

            <button
              type="button"
              id="tab-login-admin"
              onClick={() => setSelectedTab('admin')}
              className={`py-2.5 px-3 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedTab === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>2. Level Administrator</span>
            </button>
          </div>

          {/* TAB 1: KRU GERAI (VIEW ONLY) */}
          {selectedTab === 'kru' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/60 text-xs text-sky-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sky-900">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Akses Hak Baca (View-Only) untuk Barista & Kru Gerai</span>
                </div>
                <ul className="text-[11px] text-sky-800 space-y-1 pl-6 list-disc">
                  <li>Membaca seluruh SOP operasional dan studi kasus interaktif</li>
                  <li>Membuka materi visual slide presentasi PPT & PDF resmi</li>
                  <li><strong>Mencari kata kunci di dalam dokumen PDF</strong> (seperti &apos;no ice&apos;, &apos;tumbler&apos;)</li>
                  <li>Mengajukan tiket perbaikan mesin & bantuan teknisi darurat</li>
                  <li className="text-slate-500 font-semibold">Tidak memiliki akses mengedit atau mengunggah materi baru</li>
                </ul>
              </div>

              <form onSubmit={handleKruLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Kru / Barista:
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="input-kru-name"
                      type="text"
                      value={kruName}
                      onChange={(e) => setKruName(e.target.value)}
                      placeholder="Masukkan nama Anda (contoh: Andi Pratama)"
                      className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00263f] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cabang Gerai Kintoun:
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      id="select-kru-store"
                      value={kruStore}
                      onChange={(e) => setKruStore(e.target.value)}
                      className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00263f] focus:outline-none bg-white"
                    >
                      {STORE_LIST.map((store) => (
                        <option key={store} value={store}>
                          {store}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="submit"
                    id="btn-submit-kru-login"
                    className="flex-1 py-2.5 px-4 bg-[#00263f] hover:bg-[#3c586d] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Masuk Sebagai Kru (View Only)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    id="btn-quick-kru"
                    onClick={handleOneClickKru}
                    className="py-2.5 px-3 bg-sky-100 hover:bg-sky-200 text-sky-900 font-extrabold text-xs rounded-xl transition cursor-pointer"
                  >
                    1-Klik Kru Demo
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ADMINISTRATOR (FULL EDITOR) */}
          {selectedTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Akses Penuh Administrator: Editor & Pengelola File</span>
                </div>
                <ul className="text-[11px] text-amber-900 space-y-1 pl-6 list-disc">
                  <li><strong>Mengunggah materi presentasi PPT yang diubah ke PDF terbaru</strong></li>
                  <li>Mengedit, merevisi, dan mengganti file PDF operasional di setiap modul</li>
                  <li>Menyiarkan notifikasi update materi baru ke seluruh kru gerai</li>
                  <li>Mengelola tiket bantuan dan memvalidasi penyelesaian masalah gerai</li>
                </ul>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username / Email Admin:
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="input-admin-username"
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Passcode / Password Admin:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="input-admin-password"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Ketik: admin (atau klik 1-Klik Demo)"
                      className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {adminError && (
                  <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{adminError}</span>
                  </p>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="submit"
                    id="btn-submit-admin-login"
                    className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Masuk Sebagai Administrator</span>
                  </button>
                  <button
                    type="button"
                    id="btn-quick-admin-login"
                    onClick={handleOneClickAdmin}
                    className="py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    1-Klik Admin (Demo)
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
