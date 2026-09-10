import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  onLogin: (profile: UserProfile) => void;
  onLogout?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi input kosong
    if (!username.trim() || !password.trim()) {
      setError('Username dan Password wajib diisi.');
      return;
    }

    let authenticatedUser: UserProfile | null = null;

    // Logic Autentikasi Head Office
    if (username === 'headofficeadmin' && password === 'headofficeadmin') {
      authenticatedUser = {
        id: 'adm_01',
        name: 'Head Office Administrator',
        role: 'admin',
        storeName: 'HQ & Operational Central Kintoun',
        email: 'admin.ops@kintoun.id'
      };
      
    // Logic Autentikasi Store User
    } else if (username === 'malanggalunggung' && password === 'malanggalunggung') {
      authenticatedUser = {
        id: 'usr_02',
        name: 'Store Leader',
        role: 'user',
        storeName: 'Store Malang Galunggung',
        email: 'store.malang@kintoun.id'
      };
      
    // Gagal Login
    } else {
      setError('Username atau Password tidak valid!');
      return;
    }

    // Jika berhasil login, simpan sesi dan tutup modal
    if (authenticatedUser) {
      if (rememberMe) {
        localStorage.setItem('kintoun_session', JSON.stringify(authenticatedUser));
      } else {
        sessionStorage.setItem('kintoun_session', JSON.stringify(authenticatedUser));
      }
      
      onLogin(authenticatedUser);
      onClose();
      setUsername('');
      setPassword('');
      setRememberMe(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-5 bg-[#00263f] animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-sm px-8 py-10 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-black text-[#00263f] text-center mb-8 mt-2">Log In</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pb-2 border-b border-slate-200 bg-transparent text-sm focus:outline-none focus:border-[#927a5b] transition-colors placeholder:text-slate-400 text-slate-800"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pb-2 border-b border-slate-200 bg-transparent text-sm focus:outline-none focus:border-[#927a5b] transition-colors placeholder:text-slate-400 text-slate-800"
            />
          </div>
          
          {error && <p className="text-xs text-rose-500 font-bold -mt-2">{error}</p>}

          <div className="flex items-center gap-2 mt-2 mb-4">
            <input 
              type="checkbox" 
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-[#927a5b] focus:ring-[#927a5b] border-slate-300 cursor-pointer" 
            />
            <label htmlFor="remember" className="text-xs text-slate-500 font-medium cursor-pointer">Remember Me</label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#927a5b] hover:bg-[#7e694e] text-white font-black text-sm tracking-widest uppercase transition shadow-md cursor-pointer"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};
