import React from "react";

const AdminMain = () => {
  return (
    <main className="flex-1 bg-paleBg overflow-y-auto">
      {/* Container for all main content with padding */}
      <div className="px-8 py-6 space-y-6">
        {/* GREETING (Now just the welcome message, search/profile is in the fixed header) */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Welcome, Sangeeth</h1>
        </div>

        {/* KPI CARDS + QUICK ACTIONS */}
        <div className="space-y-4">
          {/* Top statistics (Now 5 columns) */}
          <div className="grid grid-cols-5 gap-4">
            {/* Card 1 (Total E-waste Collection Points) */}
            <div className="bg-card rounded-2xl shadow-soft px-5 py-4">
              <p className="text-xs text-slate-500">
                Total E-waste Collection Points
              </p>
              <p className="text-2xl font-semibold text-emerald-500 mt-2">200</p>
              <div className="flex items-center gap-3 mt-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active 190
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  Inactive 10
                </span>
              </div>
            </div>

            {/* Card 2 (Total Users) */}
            <div className="bg-card rounded-2xl shadow-soft px-5 py-4">
              <p className="text-xs text-slate-500">Total Users</p>
              <p className="text-2xl font-semibold text-emerald-500 mt-2">
                2,000
              </p>
              <p className="mt-3 text-[11px] text-emerald-500">
                ↑ 6.5% Since Last Month
              </p>
            </div>

            {/* Card 3 (Total Donations) */}
            <div className="bg-card rounded-2xl shadow-soft px-5 py-4">
              <p className="text-xs text-slate-500">Total Donations</p>
              <p className="text-2xl font-semibold text-emerald-500 mt-2">
                1,000
              </p>
              <p className="mt-3 text-[11px] text-emerald-500">
                ↑ 3.5% Since Last Month
              </p>
            </div>

            {/* Card 4 (Total Partnerships) */}
            <div className="bg-card rounded-2xl shadow-soft px-5 py-4">
              <p className="text-xs text-slate-500">Total Partnerships</p>
              <p className="text-2xl font-semibold text-emerald-500 mt-2">
                150
              </p>
              <p className="mt-3 text-[11px] text-emerald-500">
                ↑ 2.4% Since Last Month
              </p>
            </div>

            {/* 2. NEW GREEN CARD (Top Ewaste Donated) */}
            <div className="rounded-2xl shadow-soft px-5 py-4 border border-emerald-500 bg-emerald-500 text-white flex flex-col justify-center">
              <p className="text-xs font-semibold mb-2">Top Ewaste Donated</p>
              <div className="space-y-1 text-xs font-medium">
                <div className="flex items-center justify-between">
                  <span className="truncate">1. Computers and laptops</span>
                  <span className="text-xs">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate">
                    2. Screens/monitors and tablets
                  </span>
                  <span className="text-xs">28%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate">3. Televisions</span>
                  <span className="text-xs">20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate">4. Printers and scanners</span>
                  <span className="text-xs">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate">5. Gaming consoles</span>
                  <span className="text-xs">7%</span>
                </div>
                
              </div>
            </div>
          </div>

          {/* Quick actions (5 columns to match the new KPI grid) */}
          <div className="grid grid-cols-5 gap-4">
            
            <button className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                {/* Users Icon (Manage Users) */}
                <svg
                  className="w-4 h-4 stroke-current"
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
              </span>
              Manage Users
            </button>
            <button className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                {/* Dollar/Money Icon (Manage Donations) */}
                <svg
                  className="w-4 h-4 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20a8 8 0 0 0 0-16v16" />
                  <path d="M18.8 13.4a6 6 0 0 1-7.8 0" />
                  <path d="M5.2 10.6a6 6 0 0 1 7.8 0" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                </svg>
              </span>
              Manage Donations
            </button>
            <button className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                {/* Handshake Icon (Manage Partnerships) */}
                <svg
                  className="w-4 h-4 stroke-current"
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
              </span>
              Manage Partnerships
            </button>
            <button className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                {/* Box Icon (Manage Inventory) */}
                <svg
                  className="w-4 h-4 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
                  <path d="M3 10h18" />
                  <path d="M8 6V4h8v2" />
                </svg>
              </span>
              Manage Inventory
            </button>
          </div>

          {/* Second row of Quick actions (3 columns) */}
          <div className="grid grid-cols-5 gap-4">
            <button className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                {/* Leaf Icon (Create Imagery) */}
                <svg
                  className="w-4 h-4 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 19.49c-1.35.32-2.79.44-4.24.32-3.15-.25-5.9-1.92-7.5-4.52C3.51 12.87 3.33 9.4 4.54 6.75A7.8 7.8 0 0 1 7.2 4.09c1.94-1.2 4.1-1.39 6.27-.61 2.17.77 3.9 2.5 4.83 4.6 1.07 2.44.8 5.25-.77 7.54l-1.63 2.87z" />
                  <path d="M11 15s1.25-.5 3 0" />
                </svg>
              </span>
              Create Imagery
            </button>
            <button className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                {/* Trophy/Tear Drop Icon (Manage Rewards) */}
                <svg
                  className="w-4 h-4 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7c0 1.66 1.34 3 3 3s3-1.34 3-3V5a3 3 0 0 0-3-3z" />
                  <path d="M19.4 17.9l-1.8-1.7" />
                  <path d="M21 13H15" />
                  <path d="M4.6 17.9l1.8-1.7" />
                  <path d="M3 13h6" />
                </svg>
              </span>
              Manage Rewards
            </button>
            <button className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                {/* Message Icon (View User Feedback) */}
                <svg
                  className="w-4 h-4 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.95 3.33L12 22 3.95 14.83A8.38 8.38 0 0 1 3 11.5c0-4.63 3.52-8.48 8.2-8.9a9 9 0 0 1 .8 0c4.68.42 8.2 4.27 8.2 8.9z" />
                </svg>
              </span>
              View User Feedback
            </button>
            <button className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                {/* Credit Card Icon (Manage Payments) */}
                <svg
                  className="w-4 h-4 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </span>
              Manage Payments
            </button>
            {/* Empty slot to maintain 5-column grid alignment */}
            <div></div>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left chart card */}
          <div className="bg-card rounded-2xl shadow-soft px-5 py-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-slate-500">
                  Eco Points Balance Distribution Among Users
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-500">Positive</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span className="text-slate-500">Negative</span>
                </div>
              </div>
            </div>

            {/* Mock bar chart */}
            <div className="flex-1 flex items-end gap-2 mt-2">
              {/* repeat sample bars (heights adjusted to make vertical space more compact) */}
              <div className="flex flex-col items-center flex-1 gap-1">
                <div className="w-full rounded-t-lg bg-emerald-400 h-20"></div>
                <div className="w-full rounded-t-lg bg-red-400 h-7"></div>
                <p className="text-[10px] text-slate-400 mt-1">May 1</p>
              </div>
              <div className="flex flex-col items-center flex-1 gap-1">
                <div className="w-full rounded-t-lg bg-emerald-400 h-16"></div>
                <div className="w-full rounded-t-lg bg-red-400 h-6"></div>
                <p className="text-[10px] text-slate-400 mt-1">May 3</p>
              </div>
              <div className="flex flex-col items-center flex-1 gap-1">
                <div className="w-full rounded-t-lg bg-emerald-400 h-24"></div>
                <div className="w-full rounded-t-lg bg-red-400 h-8"></div>
                <p className="text-[10px] text-slate-400 mt-1">May 5</p>
              </div>
              <div className="flex flex-col items-center flex-1 gap-1">
                <div className="w-full rounded-t-lg bg-emerald-400 h-18"></div>
                <div className="w-full rounded-t-lg bg-red-400 h-6"></div>
                <p className="text-[10px] text-slate-400 mt-1">May 9</p>
              </div>
              <div className="flex flex-col items-center flex-1 gap-1">
                <div className="w-full rounded-t-lg bg-emerald-400 h-20"></div>
                <div className="w-full rounded-t-lg bg-red-400 h-5"></div>
                <p className="text-[10px] text-slate-400 mt-1">May 11</p>
              </div>
              <div className="flex flex-col items-center flex-1 gap-1">
                <div className="w-full rounded-t-lg bg-emerald-400 h-22"></div>
                <div className="w-full rounded-t-lg bg-red-400 h-7"></div>
                <p className="text-[10px] text-slate-400 mt-1">May 15</p>
              </div>
              <div className="flex flex-col items-center flex-1 gap-1">
                <div className="w-full rounded-t-lg bg-emerald-400 h-18"></div>
                <div className="w-full rounded-t-lg bg-red-400 h-6"></div>
                <p className="text-[10px] text-slate-400 mt-1">May 17</p>
              </div>
            </div>
          </div>

          {/* Right chart card (Distribution of E-waste Donations) */}
          <div className="bg-card rounded-2xl shadow-soft px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500">
                Distribution of E-waste Donations
              </p>
              <button className="px-3 py-1 text-[11px] rounded-full border border-slate-200 text-slate-500">
                Filter
              </button>
            </div>

            <div className="flex items-center gap-6 mt-2">
              {/* Legend */}
              <div className="space-y-1 text-[11px] flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-600">
                      Computers and accessories
                    </span>
                  </div>
                  <span className="text-slate-500">35%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-slate-600">
                      Mobile phones and tablets
                    </span>
                  </div>
                  <span className="text-slate-500">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-300"></span>
                    <span className="text-slate-600">TVs and monitors</span>
                  </div>
                  <span className="text-slate-500">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-200"></span>
                    <span className="text-slate-600">Batteries</span>
                  </div>
                  <span className="text-slate-500">10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span className="text-slate-600">
                      Other electronic devices
                    </span>
                  </div>
                  <span className="text-slate-500">10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
                    <span className="text-slate-600">Appliances</span>
                  </div>
                  <span className="text-slate-500">5%</span>
                </div>
              </div>

              {/* Donut chart */}
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(#22c55e_0_40%,#4ade80_40%_65%,#86efac_65%_80%,#bbf7d0_80%_100%)]"></div>
                <div className="absolute inset-3 rounded-full bg-card flex flex-col items-center justify-center text-[11px]">
                  <span className="text-slate-400">Total Donations</span>
                  <span className="text-lg font-semibold text-slate-800">
                    1,000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM KPI STRIP (Updated to use 5 columns for consistency, using an empty slot) */}
        <div className="grid grid-cols-6 gap-4">
          <div className="rounded-2xl shadow-soft bg-gradient-to-t from-emerald-600 to-emerald-500 px-4 py-3 text-white">
            <p className="text-[11px] opacity-90">E-waste Collection</p>
            <p className="mt-2 text-xl font-semibold">20k</p>
            <p className="mt-1 text-[11px] opacity-90">↑ 20%</p>
          </div>
          <div className="rounded-2xl shadow-soft bg-gradient-to-t from-emerald-600 to-emerald-500 px-4 py-3 text-white">
            <p className="text-[11px] opacity-90">E-waste Donation</p>
            <p className="mt-2 text-xl font-semibold">1k</p>
            <p className="mt-1 text-[11px] opacity-90">↑ 3.5%</p>
          </div>
          <div className="rounded-2xl shadow-soft bg-gradient-to-t from-rose-500 to-rose-400 px-4 py-3 text-white">
            <p className="text-[11px] opacity-90">User Engagement</p>
            <p className="mt-2 text-xl font-semibold">5k</p>
            <p className="mt-1 text-[11px] opacity-90">↓ 10%</p>
          </div>
          <div className="rounded-2xl shadow-soft bg-gradient-to-t from-emerald-600 to-emerald-500 px-4 py-3 text-white">
            <p className="text-[11px] opacity-90">Eco Points Activity</p>
            <p className="mt-2 text-xl font-semibold">5k</p>
            <p className="mt-1 text-[11px] opacity-90">↑ 20%</p>
          </div>
          <div className="rounded-2xl shadow-soft bg-gradient-to-t from-emerald-600 to-emerald-500 px-4 py-3 text-white">
            <p className="text-[11px] opacity-90">Corporate Engagement</p>
            <p className="mt-2 text-xl font-semibold">5k</p>
            <p className="mt-1 text-[11px] opacity-90">↑ 2.8%</p>
          </div>
          <div className="rounded-2xl shadow-soft bg-gradient-to-t from-emerald-600 to-emerald-500 px-4 py-3 text-white">
            <p className="text-[11px] opacity-90">Campaign Effectiveness</p>
            <p className="mt-2 text-xl font-semibold">30k</p>
            <p className="mt-1 text-[11px] opacity-90">↑ 25%</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminMain;
