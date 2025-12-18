// src/components/notification/NotificationBell.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { notificationService } from "../../services/notificationService";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleString();
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "REPORT_STATUS", label: "Report Updates" },
  { key: "GENERAL", label: "General" },
];

const NotificationBell = ({ onReportStatusHighlightChange }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // NEW: track expanded messages
  const [expandedIds, setExpandedIds] = useState({});

  const hasUnread = useMemo(() => unreadCount > 0, [unreadCount]);
  const prevUnreadRef = useRef(0);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    if (activeFilter === "REPORT_STATUS") {
      return notifications.filter((n) => n.type === "REPORT_STATUS");
    }
    return notifications.filter((n) => n.type !== "REPORT_STATUS");
  }, [notifications, activeFilter]);

  const updateReportStatusHighlight = (list) => {
    if (!onReportStatusHighlightChange) return;
    const hasReportStatusUnread = list.some(
      (n) => n.type === "REPORT_STATUS" && !n.isRead
    );
    onReportStatusHighlightChange(hasReportStatusUnread);
  };

  const refreshUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to load unread count:", err);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(150);
      setNotifications(data);
      updateReportStatusHighlight(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
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
    window.addEventListener("focus", handleFocus);

    return () => {
      alive = false;
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [open]);

  // Preload for highlight state on mount
  useEffect(() => {
    const preload = async () => {
      try {
        const list = await notificationService.getNotifications(80);
        updateReportStatusHighlight(list);
      } catch (err) {
        console.error("Failed to preload notifications:", err);
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
      console.error("Failed to mark notification as read:", err);
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
      console.error("Failed to mark all as read:", err);
    }
  };

  const badgeLabel = unreadCount > 9 ? "" : "";

  const getIconForType = (type) => {
    if (type === "REPORT_STATUS") return "🗑️";
    return "🔔";
  };

  const getTypeLabel = (type) => {
    if (type === "REPORT_STATUS") return "Report update";
    if (!type || type === "GENERAL") return "General";
    return type;
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        type="button"
        onClick={handleBellClick}
        className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none ${
          hasUnread
            ? "bg-emerald-500 text-white shadow-lg ring-2 ring-emerald-200"
            : "text-slate-600 hover:bg-slate-100"
        } ${hasNewNotification ? "animate-pulse" : ""}`}
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {hasUnread && <span className="">{badgeLabel}</span>}
      </button>

      {/* Overlay for outside click */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}>
          {/* Transparent overlay so we can still see the page; clicking closes */}
          <div className="absolute inset-0" />

          {/* Dropdown panel */}
          <div
            // FIXED: better alignment + no weird mr-73
            className="absolute right-3 top-16 mt-7 sm:right-6 sm:top-16 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* slightly bigger + more modern canvas but same style */}
            <div className="lg:w-[530px] sm:w-[460px] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-900">
                    Notifications
                  </span>
                  <span className="text-xs text-slate-500">
                    Updates about your waste reports & alerts
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-1 font-semibold border border-emerald-100 whitespace-nowrap">
                    {hasUnread ? `${unreadCount} unread` : "All caught up"}
                  </span>
                  <button
                    type="button"
                    onClick={handleMarkAll}
                    disabled={!hasUnread}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 disabled:text-slate-300"
                  >
                    Mark all
                  </button>
                </div>
              </div>

              {/* Filters as pill tabs */}
              <div className="px-4 pt-3 pb-2 border-b border-slate-100">
                <div className="inline-flex items-center rounded-full bg-slate-50 p-1 text-xs font-medium">
                  {FILTERS.map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setActiveFilter(f.key)}
                      className={`px-3 py-1 rounded-full transition-all ${
                        activeFilter === f.key
                          ? "bg-white shadow-sm text-slate-900"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                {loading ? (
                  <div className="px-3 py-6 text-xs text-slate-500">
                    Loading notifications…
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="px-4 py-10 text-center text-xs text-slate-500 space-y-2">
                    <div className="text-3xl mb-1">📭</div>
                    <div className="text-sm font-semibold text-slate-800">
                      No notifications
                    </div>
                    <div>
                      You’ll see waste report updates and system alerts here.
                    </div>
                  </div>
                ) : (
                  filteredNotifications.map((n) => {
                    const isExpanded = !!expandedIds[n._id];
                    const shouldTruncate = n.message && n.message.length > 160;
                    const displayMessage =
                      isExpanded || !shouldTruncate
                        ? n.message
                        : `${n.message.slice(0, 160)}...`;

                    return (
                      <div
                        key={n._id}
                        className={`group flex gap-3 rounded-xl px-3 py-3 text-sm transition border ${
                          n.isRead
                            ? "bg-white hover:bg-slate-50 border-transparent"
                            : "bg-emerald-50/60 border-emerald-100 hover:bg-emerald-50"
                        }`}
                      >
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500/90 to-emerald-600 flex items-center justify-center text-base shadow-sm text-white">
                            {getIconForType(n.type)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[13px] font-semibold text-slate-900 truncate max-w-[190px]">
                                  {n.title || "Notification"}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wide">
                                  {getTypeLabel(n.type)}
                                </span>
                              </div>
                              <p className="mt-0.5 text-[13px] text-slate-700 leading-snug break-words whitespace-pre-line">
                                {displayMessage}
                              </p>
                              {shouldTruncate && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(n._id)}
                                  className="mt-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
                                >
                                  {isExpanded ? "View less" : "View more"}
                                </button>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {formatRelativeTime(n.createdAt)}
                              </span>
                              {!n.isRead && (
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              )}
                            </div>
                          </div>

                          {!n.isRead && (
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleMarkOne(n)}
                                className="inline-flex items-center text-[11px] font-semibold text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200"
                              >
                                Mark as read
                              </button>
                              {n.type === "REPORT_STATUS" && (
                                <span className="text-[11px] text-slate-500">
                                  Check your report status in{" "}
                                  <span className="font-semibold">
                                    My Reports
                                  </span>
                                  .
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Notifications are kept for the last 30 days.
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
