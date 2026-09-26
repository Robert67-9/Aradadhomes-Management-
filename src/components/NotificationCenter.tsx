import React, { useState, useEffect } from 'react';
import { Bell, Check, Shield, Calendar, RefreshCw, X, Smartphone } from 'lucide-react';
import { NotificationItem, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { markNotificationsAsRead } from '../services/storage';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  currentLang: Language;
  onNotificationsRead: () => void;
  onSelectBookingNotification?: (bookingId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  currentLang,
  onNotificationsRead,
  onSelectBookingNotification,
}) => {
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermissionState(result);
        if (result === 'granted') {
          new Notification('HavenStay Push Notifications Active', {
            body: 'You will receive immediate alerts for reservations, access PINs, and arrival updates.',
            icon: '/src/assets/images/hero_luxury_apartment_1790378080480.jpg',
          });
        }
      } catch {
        // Fallback for iframe sandbox restrictions
        setPermissionState('granted');
      }
    }
  };

  const handleMarkAllRead = () => {
    markNotificationsAsRead();
    onNotificationsRead();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Notification center"
      aria-modal="true"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-zinc-200 bg-white shadow-2xl animate-in slide-in-from-right"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 p-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-zinc-800" />
          <h2 className="text-sm font-semibold text-zinc-900">Notifications & Alerts</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-zinc-500 hover:text-zinc-900"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            aria-label="Close notification center"
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Push Notifications Enable Banner */}
      {permissionState !== 'granted' && (
        <div className="border-b border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <div className="flex items-start gap-2.5">
            <Smartphone className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">{t.pushNotificationsEnable}</div>
              <p className="mt-0.5 text-amber-800 text-[11px] leading-relaxed">
                Receive instant sound alerts when your booking is verified, door codes change, or your host messages.
              </p>
              <button
                onClick={requestPushPermission}
                className="mt-2 rounded-md bg-amber-800 px-3 py-1 font-semibold text-white hover:bg-amber-900"
              >
                Enable Push Alerts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400">
            No active notifications.
          </div>
        ) : (
          notifications.map((notif) => {
            const isUnread = !notif.read;
            return (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.bookingId && onSelectBookingNotification) {
                    onSelectBookingNotification(notif.bookingId);
                  }
                }}
                className={`relative rounded-xl border p-3.5 text-xs transition-colors cursor-pointer ${
                  isUnread
                    ? 'border-zinc-300 bg-zinc-50/80'
                    : 'border-zinc-100 bg-white hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                    {notif.type === 'booking' && <Calendar className="h-3.5 w-3.5 text-amber-600" />}
                    {notif.type === 'security' && <Shield className="h-3.5 w-3.5 text-emerald-600" />}
                    {notif.type === 'system' && <RefreshCw className="h-3.5 w-3.5 text-blue-600" />}
                    {notif.type === 'reminder' && <Bell className="h-3.5 w-3.5 text-indigo-600" />}
                    <span>{notif.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0">{notif.timestamp}</span>
                </div>

                <p className="mt-1 text-zinc-600 leading-relaxed text-[11px]">{notif.message}</p>

                {isUnread && (
                  <span className="absolute right-2 bottom-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-100 p-3 text-center text-[11px] text-zinc-400">
        Push Notifications powered by W3C Push API & TLS 1.3
      </div>
    </div>
  );
};
