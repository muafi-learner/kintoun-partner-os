import React, { useState } from 'react';
import { X, ShieldCheck, User, Store, KeyRound, Check, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { Role, UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSwitchRole: (newRole: Role) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSwitchRole
}) => {
  const [adminPasscode, setAdminPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-configured easy demo admin passcode or quick switch
    if (adminPasscode.trim().toLowerCase() === 'admin' || adminPasscode.trim() === '123456' || adminPasscode.trim() === 'kintoun') {
      onSwitchRole('admin');
      setAdminPasscode('');
      setLoginError('');
      onClose();
    } else {
      setLoginError('Passcode salah. Gunakan: "admin" atau klik tombol demo di bawah.');
    }
  };

  const handleQuickSwitch = (targetRole: Role) => {
    onSwitchRole(targetRole);
    onClose();
  };

  return (
    <div 
      id="modal-profile-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        id="modal-profile-card"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-[#00263f] text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
              user.role === 'admin' ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-300' : 'bg-white/20 text-white border border-white/30'
            }`}>
              {user.role === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold">{user.name}</h3>
              <p className="text-xs text-[#c0c9ce] flex items-center gap-1 mt-0.5">
                <Store className="w-3.5 h-3.5" /> {user.storeName}
              </p>
            </div>
          </div>
          <button
            id="btn-close-profile-modal"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Authority Information */}
        <div className="p-6 space-y-5">
          {/* Current Authority Level */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tingkat Otoritas Akun
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                user.role === 'admin' 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'bg-blue-100 text-blue-900 border border-blue-300'
              }`}>
                {user.role === 'admin' ? 'Level 1: Administrator' : 'Level 2: Partner Store Staff'}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-1">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Membaca SOP & Kartu Belajar
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Mengajukan Tiket Bantuan & Teknisi
              </p>
              <p className="flex items-center gap-2">
                {user.role === 'admin' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block" />
                )}
                <span className={user.role === 'admin' ? 'font-bold text-slate-800' : 'text-slate-400'}>
                  Input / Upload Dokumen PDF & PPT (Frontend)
                </span>
              </p>
              <p className="flex items-center gap-2">
                {user.role === 'admin' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block" />
                )}
                <span className={user.role === 'admin' ? 'font-bold text-slate-800' : 'text-slate-400'}>
                  Broadcast Notifikasi Materi ke Gerai
                </span>
              </p>
            </div>
          </div>

          {/* Switch Role Section */}
          {user.role === 'user' ? (
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Masuk Sebagai Administrator</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Login sebagai Administrator untuk mengaktifkan tombol input PDF di frontend dan mengedit materi gerai.
              </p>

              <form onSubmit={handleAdminLogin} className="space-y-2">
                <input
                  id="admin-passcode-input"
                  type="password"
                  placeholder="Masukkan Passcode Admin (ketik: admin)"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                {loginError && (
                  <p className="text-[11px] text-rose-600 font-semibold">{loginError}</p>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    id="btn-login-admin"
                    className="flex-1 py-2 px-3 bg-[#00263f] hover:bg-[#3c586d] text-white font-bold text-xs rounded-lg transition cursor-pointer"
                  >
                    Masuk Mode Admin
                  </button>
                  <button
                    type="button"
                    id="btn-quick-admin-switch"
                    onClick={() => handleQuickSwitch('admin')}
                    className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg transition"
                  >
                    1-Klik Admin (Demo)
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <p className="text-xs text-slate-600">
                Anda sedang dalam <strong>Mode Administrator Penuh</strong>. Anda dapat mengunggah file PDF/PPT baru kapan saja melalui tombol di header atau kartu belajar.
              </p>
              <button
                id="btn-logout-admin"
                onClick={() => handleQuickSwitch('user')}
                className="w-full py-2 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Beralih Kembali ke Akun Barista / Partner</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
