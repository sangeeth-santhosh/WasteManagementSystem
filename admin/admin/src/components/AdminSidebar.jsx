import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
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
    { to: "/admin/dashboard/adashboard", label: "Admin Dashboard" },
  ];

  return (
    <aside className={asideClass}>
      {/* Logo (Dark version, now styled differently as per the image) */}
      <div className="px-10 pt-6 pb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 10 4 10 14" />
            <path d="M10 4V20" />
            <path d="M10 14h13v-4h-5v-4h-3" />
            <path d="M13 20v-4" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide">Waste</p>
          <p className="text-xs text-slate-400">Solutions</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 mt-4 ml-2 text-sm font-medium">
        <ul>
          {/* Dashboard */}
          <li>
            <button
              onClick={() => setActiveItem("dashboard")}
              className={`${baseBtn} ${
                activeItem === "dashboard" ? activeClasses : inactiveClasses
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
            </button>
          </li>

          {/* Collection Points */}
          <li>
            <button
              onClick={() => setActiveItem("collectionPoints")}
              className={`${baseBtn} ${
                activeItem === "collectionPoints"
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
              <Link to="/admin/dashboard/reports">Collection Points</Link>
            </button>
          </li>

          {/*  */}
          <li>
            <button
              onClick={() => setActiveItem("donations")}
              className={`${baseBtn} ${
                activeItem === "donations" ? activeClasses : inactiveClasses
              }`}
            >
              {/* Donations Icon (Gift) */}
              <svg
                className="w-5 h-5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M12 8v13" />
                <path d="M19 12v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6" />
                <path d="M19 12v-4a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v4" />
              </svg>
              Donations
            </button>
          </li>

          {/* Users */}
          <li>
            <button
              onClick={() => setActiveItem("users")}
              className={`${baseBtn} ${
                activeItem === "users" ? activeClasses : inactiveClasses
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
              <Link to="/admin/dashboard/users">Users</Link>
            </button>
          </li>

          {/* Analytics */}
          <li>
            <button
              onClick={() => setActiveItem("analytics")}
              className={`${baseBtn} ${
                activeItem === "analytics" ? activeClasses : inactiveClasses
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
            </button>
          </li>

          {/* Partnerships */}
          <li>
            <button
              onClick={() => setActiveItem("partnerships")}
              className={`${baseBtn} ${
                activeItem === "partnerships" ? activeClasses : inactiveClasses
              }`}
            >
              {/* Feedbacks */}
              <svg
                className="w-5 h-5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                <path d="m7 21 1.6-1.4" />
                <path d="M17 21v-7h-3" />
                <path d="M17 14h.5c.5 0 1 .5 1 1s-.5 1-1 1H17v1" />
                <path d="M21 12v2a4 4 0 0 1-4 4H3" />
                <path d="M15 12h2" />
              </svg>
              <Link to="/admin/dashboard/feedback">Feedbacks</Link>
            </button>
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
        <button className="w-full flex items-center gap-3 px-6 py-4 text-xs text-red-400 hover:bg-sidebarSoft/60">
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
