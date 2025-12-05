import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="flex-shrink-0 h-16 bg-white shadow-sm flex items-center justify-start px-8 border-b border-slate-100 z-0">
      {/* Search and utility elements (aligned right) */}
      <div className="ml-auto flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          {/* Search Icon */}
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 stroke-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="pl-10 pr-4 py-2 text-xs rounded-full bg-slate-50 outline-none border border-slate-200 w-56"
            placeholder="Search"
          />
        </div>

        {/* Add button */}
        <button
          onClick={() => navigate('/admin/dashboard/zones')}
          className="px-4 py-2 rounded-full bg-emerald-500 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600 transition"
        >
          Add Collection Point
        </button>

        {/* Profile (Icon embedded in shape) */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 ring-2 ring-emerald-400 shadow-lg"></div>
      </div>
    </header>
  );
};

export default AdminHeader;
