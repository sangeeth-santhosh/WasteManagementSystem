import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { wasteService } from "../services/wasteService";
import images from "../assets/assets";
import NotificationBell from "./notification/NotificationBell.jsx";

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

  // derive display name + first alphabet
  const displayName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    (user?.email ? user.email.split("@")[0] : "User");
  const initial = displayName?.charAt(0)?.toUpperCase() || "U";

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

  // When Collect page is opened, clear the "new report" flag
  useEffect(() => {
    if (location.pathname === "/collect") {
      setHasNewReport(false);
      localStorage.setItem("hasNewReport", "false");
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

  // Dot for Collect & bell
  const showCollectDot =
    pendingCount > 0 || hasNewReport || hasNotificationCollectHighlight;

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    // Reattach reveal logic on every route change
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => {
      el.classList.remove("reveal-visible"); // reset old reveal
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const navLinkClasses = ({ isActive }) =>
    `px-5 py-2 rounded-full text-[12px] font-medium transition ${
      isActive
        ? "bg-white shadow-sm text-slate-900"
        : "bg-white/80 text-slate-600 hover:bg-white hover:shadow-sm"
    }`;

  return (
    <>
      <div className="min-h-screen pt-4">
        {/* full-width content card */}
        <div className="relative bg-rings w-full">
          {/* HEADER + HERO */}
          {/* Header */}
          <header className="flex items-center justify-between gap-4 px-8 sm:px-12 xl:px-30 pt-6">
            {/* Left: logo + brand */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-semibold overflow-hidden">
                <img
                  src={images.logo1}
                  alt="Logo"
                  className="w-10 h-10 rounded-full bg-emerald-500"
                />
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <p className="text-2xl font-sans tracking-normal font-semibold text-slate-900">
                  EcoPure
                </p>
              </div>
            </div>

            {/* Center: pill nav */}
            <nav className="hidden md:flex items-center gap-3 text-[12px]">
              <NavLink to="/" end className={navLinkClasses}>
                Home
              </NavLink>

              <NavLink to="/report" className={navLinkClasses}>
                Report
              </NavLink>

              <div className="relative">
                <NavLink to="/collect" className={navLinkClasses}>
                  Collect
                </NavLink>
                {showCollectDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>

              <NavLink to="/feedback" className={navLinkClasses}>
                Feedback
              </NavLink>

              <NavLink to="/about" className={navLinkClasses}>
                About
              </NavLink>
            </nav>

            {/* Right: Notifications + Profile */}
            <div className="flex items-center gap-3">
              {/* Notification bell with indicator */}
              <button
                type="button"
                className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white shadow-sm transition"
              >
                <NotificationBell
                  onReportStatusHighlightChange={
                    setHasNotificationCollectHighlight
                  }
                />
                {showCollectDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </button>

              {/* Profile button + dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() =>
                    setShowProfileDropdown((prevOpen) => !prevOpen)
                  }
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 sm:px-6 py-2 text-[12px] font-medium text-slate-800 bg-white hover:bg-slate-900 hover:text-white transition"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                      {initial}
                    </div>
                    <span className="hidden sm:inline-block truncate max-w-[120px]">
                      {displayName}
                    </span>
                  </div>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-lg border border-slate-100 py-2 text-sm z-20">
                    <div className="px-4 pb-2 border-b border-slate-100">
                      <p className="text-[11px] text-slate-500">Signed in as</p>
                      <p className="mt-0.5 text-[13px] font-medium text-slate-900 truncate">
                        {displayName}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
          {/* Routed content below header */}
          <main className="px-8 sm:px-12 xl:px-31 pb-10 mt-7">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
