import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import images from "../assets/assets";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("dashboard");

  const asideClass = `w-64 bg-sidebar text-slate-100 flex flex-col flex-shrink-0 h-full overflow-y-auto relative z-10`;

  const baseBtn = "w-full flex items-center gap-3 px-6 py-3";
  const activeClasses =
    "bg-emerald-500/15 text-emerald-300 border-l-4 border-emerald-400";
  const inactiveClasses = "hover:bg-sidebarSoft/60 transition text-slate-400";

  const links = [
    { to: "/admin/dashboard/home", label: "Dashboard" },
    { to: "/admin/dashboard/reports", label: "Collection Points" },
    { to: "/admin/dashboard/users", label: "Users" },
    { to: "/admin/dashboard/feedback", label: "Feedback" },
  ];

  return (
    <aside className={asideClass}>
      {/* Logo (Dark version, now styled differently as per the image) */}
      <div className="px-9 pt-6 pb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
          <img
            src={images.logo1}
            alt="Logo"
            className="w-10 h-10 rounded-full bg-emerald-500"
          />
        </div>
        <div>
          <p className="text-xl font-semibold tracking-wide">EcoPure</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 mt-4 ml-2 text-sm font-medium">
        <ul>
          {/* Dashboard */}
          <li>
            <Link
              to="/admin/dashboard/home"
              onClick={() => setActiveItem("dashboard")}
              className={`${baseBtn} ${
                location.pathname === "/admin/dashboard/home" ||
                location.pathname === "/admin/dashboard"
                  ? activeClasses
                  : inactiveClasses
              }`}
            >
              {/* Dashboard Icon (Active) */}
              <svg
                className="w-5 h-5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
              </svg>
              Dashboard
            </Link>
          </li>

          {/* Collection Points */}
          <li>
            <Link
              to="/admin/dashboard/reports"
              onClick={() => setActiveItem("collectionPoints")}
              className={`${baseBtn} ${
                location.pathname === "/admin/dashboard/reports"
                  ? activeClasses
                  : inactiveClasses
              }`}
            >
              {/* Collection Points Icon (Map Pin) */}
              <svg
                className="w-5 h-5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Collection Points
            </Link>
          </li>

          {/* Users */}
          <li>
            <Link
              to="/admin/dashboard/users"
              onClick={() => setActiveItem("users")}
              className={`${baseBtn} ${
                location.pathname === "/admin/dashboard/users"
                  ? activeClasses
                  : inactiveClasses
              }`}
            >
              {/* Users Icon (Users) */}
              <svg
                className="w-5 h-5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Users
            </Link>
          </li>

          {/* Feedback */}
          <li>
            <Link
              to="/admin/dashboard/feedback"
              onClick={() => setActiveItem("feedback")}
              className={`${baseBtn} ${
                location.pathname === "/admin/dashboard/feedback"
                  ? activeClasses
                  : inactiveClasses
              }`}
            >
              {/* Feedback Icon */}
              <svg
                className="w-5 h-5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.95 3.33L12 22 3.95 14.83A8.38 8.38 0 0 1 3 11.5c0-4.63 3.52-8.48 8.2-8.9a9 9 0 0 1 .8 0c4.68.42 8.2 4.27 8.2 8.9z" />
              </svg>
              Feedback
            </Link>
          </li>

          {/* Analytics */}
          <li>
            <Link
              to="/admin/dashboard/analytics"
              onClick={() => setActiveItem("analytics")}
              className={`${baseBtn} ${
                location.pathname === "/admin/dashboard/analytics"
                  ? activeClasses
                  : inactiveClasses
              }`}
            >
              {/* Analytics Icon (Bar Chart) */}
              <svg
                className="w-5 h-5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
              Analytics
            </Link>
          </li>

          {/* Notifications */}
          <li>
            <Link
              to="/admin/dashboard/notifications"
              onClick={() => setActiveItem("notifications")}
              className={`${baseBtn} ${
                location.pathname === "/admin/dashboard/notifications"
                  ? activeClasses
                  : inactiveClasses
              }`}
            >
              {/* Notifications Icon */}
              <svg
                className="w-5 h-5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notifications
            </Link>
          </li>
        </ul>
      </nav>

      <hr className="border-gray-800 mb-10" />

      <div className="ml-4 mb-10">
        <button className="w-full flex items-center gap-3 px-6 py-3 text-xs text-slate-400 hover:bg-sidebarSoft/60">
          {/* Settings Icon (Gear) */}
          <svg
            className="w-4 h-4 stroke-current"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            navigate("/admin/login");
          }}
          className="w-full flex items-center gap-3 px-6 py-4 text-xs text-red-400 hover:bg-sidebarSoft/60"
        >
          {/* Log Out Icon (Exit) */}
          <svg
            className="w-4 h-4 stroke-current"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
