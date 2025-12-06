// src/components/notification/NotificationBell.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { notificationService } from '../../services/notificationService';

const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleString();
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'REPORT_STATUS', label: 'Report Updates' },
  { key: 'GENERAL', label: 'General' },
];

const NotificationBell = ({ onReportStatusHighlightChange }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const hasUnread = useMemo(() => unreadCount > 0, [unreadCount]);
  const prevUnreadRef = useRef(0);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'REPORT_STATUS') {
      return notifications.filter((n) => n.type === 'REPORT_STATUS');
    }
    return notifications.filter((n) => n.type !== 'REPORT_STATUS');
  }, [notifications, activeFilter]);

  const updateReportStatusHighlight = (list) => {
    if (!onReportStatusHighlightChange) return;
    const hasReportStatusUnread = list.some(
      (n) => n.type === 'REPORT_STATUS' && !n.isRead
    );
    onReportStatusHighlightChange(hasReportStatusUnread);
  };

  const refreshUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(150);
      setNotifications(data);
      updateReportStatusHighlight(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Manage new-notification animation trigger
  useEffect(() => {
    if (prevUnreadRef.current === 0 && unreadCount > 0) {
      setHasNewNotification(true);
    }
    if (unreadCount === 0) {
      setHasNewNotification(false);
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount]);

  // Initial load + faster polling (8s) + focus re-fetch
  useEffect(() => {
    let alive = true;

    const kickOff = async () => {
      await refreshUnreadCount();
    };

    kickOff();

    const intervalId = setInterval(() => {
      if (alive) refreshUnreadCount();
    }, 8000);

    const handleFocus = () => {
      refreshUnreadCount();
      if (open) loadNotifications();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      alive = false;
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [open]);

  // Preload for highlight state on mount
  useEffect(() => {
    const preload = async () => {
      try {
        const list = await notificationService.getNotifications(80);
        updateReportStatusHighlight(list);
      } catch (err) {
        console.error('Failed to preload notifications:', err);
      }
    };
    preload();
  }, [onReportStatusHighlightChange]);

  const handleBellClick = async () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen) {
      await Promise.all([loadNotifications(), refreshUnreadCount()]);
    }
  };

  const handleMarkOne = async (notification) => {
    if (notification.isRead) return;
    try {
      await notificationService.markAsRead(notification._id);
      setNotifications((prev) => {
        const next = prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n
        );
        updateReportStatusHighlight(next);
        return next;
      });
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAll = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
    if (unreadIds.length === 0) return;
    try {
      await notificationService.markAllAsRead(unreadIds);
      setNotifications((prev) => {
        const next = prev.map((n) => ({ ...n, isRead: true }));
        updateReportStatusHighlight(next);
        return next;
      });
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const badgeLabel = unreadCount > 9 ? '9+' : unreadCount;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleBellClick}
        className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none ${
          hasUnread
            ? 'bg-emerald-500 text-white shadow-lg ring-2 ring-emerald-200'
            : 'text-gray-700 hover:bg-gray-100'
        } ${hasNewNotification ? 'animate-pulse' : ''}`}
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 17h-4m6-6a4 4 0 10-8 0c0 4-2 5-2 5h12s-2-1-2-5z"
          />
        </svg>

        {hasUnread && (
          <span className="absolute -top-1 -right-1 inline-flex min-w-[18px] h-5 items-center justify-center px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold ring-2 ring-white">
            {badgeLabel}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="absolute inset-0 flex items-start justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
            <div className="relative mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl w-[95%] max-h-[85vh] flex flex-col border border-gray-100">
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                  <p className="text-sm text-gray-600">Stay updated on your waste report status and alerts.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                    {hasUnread ? `${unreadCount} unread` : 'All read'}
                  </span>
                  <button
                    type="button"
                    onClick={handleMarkAll}
                    className="text-xs font-semibold text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-50 border border-emerald-100"
                    disabled={!hasUnread}
                  >
                    Mark all as read
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-gray-500 hover:text-gray-800 text-lg leading-none"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setActiveFilter(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                      activeFilter === f.key
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto pt-4 space-y-3">
                {loading ? (
                  <div className="p-6 text-sm text-gray-500">Loading notifications…</div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="p-10 text-center text-sm text-gray-500 space-y-2">
                    <div className="text-3xl">📭</div>
                    <div className="font-semibold text-gray-800">No notifications yet</div>
                    <div className="text-gray-500">You’ll see updates about your reports and activity here.</div>
                  </div>
                ) : (
                  filteredNotifications.map((n) => (
                    <div
                      key={n._id}
                      className={`flex flex-col sm:flex-row sm:items-start gap-3 p-4 rounded-xl border shadow-sm ${
                        n.isRead ? 'bg-white' : 'bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                              n.type === 'REPORT_STATUS'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {n.type === 'REPORT_STATUS' ? 'Report update' : n.type || 'General'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                {n.title || 'Notification'}
                              </div>
                              <div className="text-sm text-gray-700 leading-snug break-words">
                                {n.message}
                              </div>
                            </div>
                            <div className="text-[11px] text-gray-500 whitespace-nowrap">
                              {formatRelativeTime(n.createdAt)}
                            </div>
                          </div>
                          {!n.isRead && (
                            <div className="flex items-center gap-2 mt-3">
                              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                              <button
                                type="button"
                                onClick={() => handleMarkOne(n)}
                                className="inline-flex items-center text-xs font-semibold text-emerald-700 px-3 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200"
                              >
                                OK, mark as read
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
