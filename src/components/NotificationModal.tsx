import React from 'react';
import { X, Bell, FileText, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onSelectNotification: (notif: AppNotification) => void;
  onMarkAllRead: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectNotification,
  onMarkAllRead
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="modal-notifications-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        id="modal-notifications-card"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-[#00263f] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 text-[#c0c9ce] flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Pemberitahuan Sistem & Materi</h3>
              <p className="text-xs text-[#c0c9ce]">Update berkala dari Tim Administrator Pusat Kintoun</p>
            </div>
          </div>
          <button
            id="btn-close-notif-modal"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">
            {notifications.length} Notifikasi Tersimpan
          </span>
          <button
            id="btn-mark-all-read"
            onClick={onMarkAllRead}
            className="text-[#00263f] hover:text-[#3c586d] font-bold transition cursor-pointer"
          >
            Tandai Semua Sudah Dibaca
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Tidak ada notifikasi baru saat ini.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-4 transition cursor-pointer hover:bg-[#eeebe1]/50 flex items-start gap-3 ${
                  !notif.read ? 'bg-[#eeebe1]/80' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                  !notif.read ? 'bg-[#00263f] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#00263f]">
                      {notif.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <h4 className={`text-xs mt-0.5 ${!notif.read ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 self-center shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            Setiap kali Administrator mengunggah PDF atau memperbarui materi, notifikasi otomatis muncul di sini.
          </p>
        </div>
      </div>
    </div>
  );
};
