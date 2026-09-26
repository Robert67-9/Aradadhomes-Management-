import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getOfflineQueue, syncOfflineQueue } from '../services/storage';

interface OfflineBannerProps {
  simulatedOffline: boolean;
  onToggleSimulatedOffline: (val: boolean) => void;
  onSyncComplete?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  simulatedOffline,
  onToggleSimulatedOffline,
  onSyncComplete,
}) => {
  const [realOnline, setRealOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedToast, setSyncedToast] = useState(false);

  const isActuallyOffline = !realOnline || simulatedOffline;

  useEffect(() => {
    const handleOnline = () => setRealOnline(true);
    const handleOffline = () => setRealOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkQueue = () => {
      setPendingCount(getOfflineQueue().length);
    };

    checkQueue();
    const interval = setInterval(checkQueue, 2500);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const count = syncOfflineQueue();
      setPendingCount(0);
      setIsSyncing(false);
      setSyncedToast(true);
      if (onSyncComplete) onSyncComplete();
      setTimeout(() => setSyncedToast(false), 4000);
    }, 800);
  };

  return (
    <>
      {/* Offline Mode Alert Bar */}
      {isActuallyOffline && (
        <div
          role="status"
          aria-live="polite"
          className="relative z-40 flex items-center justify-between border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900 md:px-8"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" aria-hidden="true" />
            <span className="font-medium">
              Offline Data Resilience Active:
            </span>
            <span className="text-amber-800">
              All reservation requests and reviews are safely encrypted and queued in client cache for zero data loss.
            </span>
            {pendingCount > 0 && (
              <span className="rounded bg-amber-200 px-1.5 py-0.5 font-semibold text-amber-950">
                {pendingCount} action{pendingCount > 1 ? 's' : ''} queued
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSimulatedOffline(false)}
              className="rounded border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100"
            >
              Resume Online
            </button>
          </div>
        </div>
      )}

      {/* Sync Success Toast */}
      {syncedToast && (
        <div
          role="status"
          className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-50 flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-900 shadow-lg animate-in fade-in"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Zero-loss synchronization complete. All bookings and updates persisted.</span>
        </div>
      )}

      {/* Sync control if pending queue exists and back online */}
      {!isActuallyOffline && pendingCount > 0 && (
        <div className="relative z-40 flex items-center justify-between border-b border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-900 md:px-8">
          <div className="flex items-center gap-2">
            <RefreshCw className={`h-3.5 w-3.5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Connection restored! {pendingCount} offline action(s) ready to sync.</span>
          </div>
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="rounded bg-blue-600 px-3 py-1 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSyncing ? 'Syncing...' : 'Sync Queued Data Now'}
          </button>
        </div>
      )}
    </>
  );
};
