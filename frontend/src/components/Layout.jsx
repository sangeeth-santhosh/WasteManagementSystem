import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { wasteService } from "../services/wasteService";
import NotificationBell from "./notification/NotificationBell.jsx";
import images from "../assets/assets";

const navItems = [
  {
    to: "/",
    label: "Home",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    to: "/report",
    label: "Report Waste",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    to: "/collect",
    label: "Collect Waste",
    icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  },
  { to: "/feedback", label: "Feedback", icon: "M7 8h10M7 12h6m-6 4h4" },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [hasNewReport, setHasNewReport] = useState(false);
  const [hasNotificationCollectHighlight, setHasNotificationCollectHighlight] =
    useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef(null);

  // Load pending count and local "new report" flag
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await wasteService.getPendingCount();
        setPendingCount(res.data.count || 0);
      } catch (error) {
        console.error("Failed to load pending count", error);
      }
    };
    fetchPending();

    const stored = localStorage.getItem("hasNewReport");
    if (stored === "true") {
      setHasNewReport(true);
    }
  }, []);

  // When Collect page is opened, clear the "new report" red dot from local storage
  useEffect(() => {
    if (location.pathname === "/collect") {
      setHasNewReport(false);
      localStorage.setItem("hasNewReport", "false");
      // You could also clear report-status notification highlight here if you want
      // setHasNotificationCollectHighlight(false);
    }
  }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Combine conditions for red dot on "Collect Waste"
  const showCollectDot =
    pendingCount > 0 || hasNewReport || hasNotificationCollectHighlight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex">
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-xl border-r border-slate-700">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12">
              <img
                src={images.logo1}
                alt="Logo"
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div>
              <p className="text-lg font-bold text-white">EcoPure</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }`
                }
                end={item.to === "/"}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={item.icon}
                  />
                </svg>
                <span className="font-semibold flex items-center gap-2">
                  {item.label}
                  {item.to === "/collect" && showCollectDot && (
                    <span
                      className="w-2 h-2 rounded-full bg-red-400 inline-block animate-pulse"
                      aria-hidden
                    />
                  )}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150 border border-red-500/20"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
              </p>
              <h1 className="text-xl font-bold text-gray-900 mt-0.5">
                Waste Management Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell
                onReportStatusHighlightChange={
                  setHasNotificationCollectHighlight
                }
              />
              <div
                className="flex items-center gap-3 relative"
                ref={profileDropdownRef}
              >
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 hover:opacity-90 transition-opacity bg-gray-50 rounded-lg px-3 py-2 border border-gray-200"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md text-white font-bold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="text-sm text-gray-700 text-left hidden md:block">
                    <div className="font-semibold">{user?.name || "User"}</div>
                    <div className="text-xs text-gray-500">
                      {user?.email || ""}
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-150 ${
                      showProfileDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      View Profile
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-white">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
