import React from 'react';
import { X, CheckCheck, AlertTriangle, Info, ShoppingBag, Sparkles, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    markNotificationRead,
    clearAllNotifications,
    setActiveView,
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#DE7E36]" />;
      case 'shopping':
        return <ShoppingBag className="w-4 h-4 text-sky-600" />;
      case 'success':
        return <Sparkles className="w-4 h-4 text-[#3F6E4E]" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div
      id="notification-modal-overlay"
      className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={() => setIsNotificationDrawerOpen(false)}
    >
      <div
        id="notification-drawer-content"
        className="w-full max-w-md bg-[#FBF9F5] h-full shadow-2xl border-l border-[#E8E4DA] flex flex-col p-6 animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DA]">
          <div>
            <h2 className="text-lg font-bold text-[#1A2820] flex items-center gap-2">
              Notifications & Alerts
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#EAE5D9] text-[#2F543C] font-semibold">
                {notifications.length}
              </span>
            </h2>
            <p className="text-xs text-[#52685B]">Smart pantry triggers & reminders</p>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-[#62776A] hover:text-[#1A2820] px-2 py-1 rounded hover:bg-[#EAE5D9] transition-colors"
                id="clear-all-notifs-btn"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-1.5 rounded-lg text-[#52685B] hover:bg-[#EAE5D9] transition-colors"
              id="close-notif-drawer-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-[#EAF1EC] text-[#3F6E4E] flex items-center justify-center mb-3">
                <CheckCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#1A2820]">All caught up!</h3>
              <p className="text-xs text-[#62776A] mt-1 max-w-xs">
                No active warnings. Items with upcoming expiry dates will trigger smart notifications here.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                id={`notification-card-${n.id}`}
                className={`p-3.5 rounded-xl border transition-all ${
                  n.isRead
                    ? 'bg-white/60 border-[#E8E4DA]/60 opacity-80'
                    : 'bg-white border-[#D8E4DC] shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-[#F7F4EC]">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#1A2820] leading-snug">
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#DE7E36] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#4F6457] mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#F2EEE4]">
                      <span className="text-[10px] text-[#788C80] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {n.date}
                      </span>

                      <div className="flex items-center gap-2">
                        {n.actionView && (
                          <button
                            onClick={() => {
                              setActiveView(n.actionView as any);
                              setIsNotificationDrawerOpen(false);
                            }}
                            className="text-[11px] font-semibold text-[#3F6E4E] hover:underline"
                          >
                            View
                          </button>
                        )}
                        {!n.isRead && (
                          <button
                            onClick={() => markNotificationRead(n.id)}
                            className="text-[11px] text-[#788C80] hover:text-[#1A2820]"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
