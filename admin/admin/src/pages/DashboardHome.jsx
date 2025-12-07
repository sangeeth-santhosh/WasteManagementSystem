import { useEffect, useState } from "react";
import { adminService } from "../api/adminService";
import { Link } from "react-router-dom";
import "../components/layout.css";

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [ecoPointsData, setEcoPointsData] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, ecoPointsRes, categoriesRes] = await Promise.all([
          adminService.getSummary(),
          adminService.getEcoPointsDistribution(),
          adminService.getTopWasteCategories(),
        ]);
        setStats(summaryRes.data || summaryRes);
        setEcoPointsData(ecoPointsRes.data || ecoPointsRes || []);
        setTopCategories(categoriesRes.data || categoriesRes || []);
      } catch (err) {
        setError(err.message || "Failed to load summary");
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Welcome, Admin
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-5 gap-4">
        <div className="bg-card rounded-2xl shadow-soft px-5 py-4">
          <p className="text-xs text-slate-500">
            Total E-waste Collection Points
          </p>
          <p className="text-2xl font-semibold text-emerald-500 mt-2">
            {stats?.totalReports || 0}
          </p>
          <div className="flex items-center gap-3 mt-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active {stats?.verifiedReports || 0}
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              Inactive {stats?.cancelledReports || 0}
            </span>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-soft px-5 py-4">
          <p className="text-xs text-slate-500">Total Users</p>
          <p className="text-2xl font-semibold text-emerald-500 mt-2">
            {stats?.totalUsers || 0}
          </p>
          <p className="mt-3 text-[11px] text-emerald-500">
            ↑ 6.5% Since Last Month
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-soft px-5 py-4">
          <p className="text-xs text-slate-500">Total Reports</p>
          <p className="text-2xl font-semibold text-emerald-500 mt-2">
            {stats?.totalReports || 0}
          </p>
          <p className="mt-3 text-[11px] text-emerald-500">
            ↑ 3.5% Since Last Month
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-soft px-5 py-4">
          <p className="text-xs text-slate-500">Total Feedback</p>
          <p className="text-2xl font-semibold text-emerald-500 mt-2">
            {stats?.feedbackCount || 0}
          </p>
          <p className="mt-3 text-[11px] text-emerald-500">
            ↑ 2.4% Since Last Month
          </p>
        </div>

        <div className="rounded-2xl shadow-soft px-5 py-4 border border-emerald-500 bg-emerald-500 text-white flex flex-col justify-center">
          <p className="text-xs font-semibold mb-2">Top E-waste Types</p>
          <div className="space-y-1 text-xs font-medium">
            {topCategories.length > 0 ? (
              topCategories.slice(0, 5).map((cat, idx) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between"
                >
                  <span className="truncate">
                    {idx + 1}. {cat.name}
                  </span>
                  <span className="text-xs">{cat.percentage}%</span>
                </div>
              ))
            ) : (
              <div className="text-xs opacity-75">No data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Link
          to="/admin/dashboard/users"
          className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700 hover:shadow-md transition cursor-pointer"
        >
          <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <svg
              className="w-4 h-4 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
          Manage Users
        </Link>

        <Link
          to="/admin/dashboard/reports"
          className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700 hover:shadow-md transition cursor-pointer"
        >
          <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <svg
              className="w-4 h-4 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
            >
              <path d="M12 20a8 8 0 0 0 0-16v16" />
            </svg>
          </span>
          Manage Reports
        </Link>

        <div className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700 hover:shadow-md transition cursor-pointer">
          <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <svg
              className="w-4 h-4 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
            >
              <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
            </svg>
          </span>
          Manage Partnerships
        </div>

        <Link
          to="/admin/dashboard/analytics"
          className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700 hover:shadow-md transition cursor-pointer"
        >
          <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <svg
              className="w-4 h-4 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
            >
              <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
            </svg>
          </span>
          Manage Analytics
        </Link>

        <Link
          to="/admin/dashboard/feedback"
          className="bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 text-xs text-slate-700 hover:shadow-md transition cursor-pointer"
        >
          <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <svg
              className="w-4 h-4 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.95 3.33L12 22 3.95 14.83A8.38 8.38 0 0 1 3 11.5c0-4.63 3.52-8.48 8.2-8.9a9 9 0 0 1 .8 0c4.68.42 8.2 4.27 8.2 8.9z" />
            </svg>
          </span>
          View Feedback
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl shadow-soft px-5 py-4 flex flex-col col-span-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500">
              Eco Points Balance Distribution
            </p>
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
          <div className="flex-1 flex items-end gap-2 mt-2">
            {ecoPointsData.length > 0 ? (
              (() => {
                const maxValue = Math.max(
                  ...ecoPointsData.map((d) =>
                    Math.max(d.positive || 0, d.negative || 0)
                  ),
                  1
                );
                const maxHeight = 120;
                return ecoPointsData.map((day, i) => {
                  const positiveHeight =
                    maxValue > 0 ? (day.positive / maxValue) * maxHeight : 0;
                  const negativeHeight =
                    maxValue > 0 ? (day.negative / maxValue) * maxHeight : 0;
                  const date = new Date(day.date);
                  const dayLabel = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <div
                      key={day.date || i}
                      className="flex flex-col items-center flex-1 gap-1"
                    >
                      <div
                        className="w-full rounded-t-lg bg-emerald-400"
                        style={{ height: `${Math.max(positiveHeight, 4)}px` }}
                      ></div>
                      <div
                        className="w-full rounded-t-lg bg-red-400"
                        style={{ height: `${Math.max(negativeHeight, 4)}px` }}
                      ></div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {dayLabel}
                      </p>
                    </div>
                  );
                });
              })()
            ) : (
              <div className="w-full text-center text-xs text-slate-400 py-8">
                No data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-soft px-5 py-4 col-span-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500">Distribution of Reports</p>
            <button className="px-3 py-1 text-[11px] rounded-full border border-slate-200 text-slate-500">
              Filter
            </button>
          </div>
          <div className="flex items-center gap-6 mt-2">
            <div className="space-y-1 text-[11px] flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-600">Pending</span>
                </div>
                <span className="text-slate-500">
                  {stats?.pendingReports || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-slate-600">Verified</span>
                </div>
                <span className="text-slate-500">
                  {stats?.verifiedReports || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-300"></span>
                  <span className="text-slate-600">Collected</span>
                </div>
                <span className="text-slate-500">
                  {stats?.collectedReports || 0}
                </span>
              </div>
            </div>
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(#22c55e_0_40%,#4ade80_40%_65%,#86efac_65%_80%)]"></div>
              <div className="absolute inset-3 rounded-full bg-card flex flex-col items-center justify-center text-[11px]">
                <span className="text-slate-400">Total</span>
                <span className="text-lg font-semibold text-slate-800">
                  {stats?.totalReports || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="rounded-2xl shadow-soft bg-gradient-to-t from-emerald-600 to-emerald-500 px-4 py-3 text-white">
          <p className="text-[11px] opacity-90">E-waste Collection</p>
          <p className="mt-2 text-xl font-semibold">
            {stats?.collectedReports || 0}
          </p>
          <p className="mt-1 text-[11px] opacity-90">↑ 20%</p>
        </div>
        <div className="rounded-2xl shadow-soft bg-gradient-to-t from-emerald-600 to-emerald-500 px-4 py-3 text-white">
          <p className="text-[11px] opacity-90">Pending Reports</p>
          <p className="mt-2 text-xl font-semibold">
            {stats?.pendingReports || 0}
          </p>
          <p className="mt-1 text-[11px] opacity-90">↑ 3.5%</p>
        </div>
        <div className="rounded-2xl shadow-soft bg-gradient-to-t from-rose-500 to-rose-400 px-4 py-3 text-white">
          <p className="text-[11px] opacity-90">Cancelled</p>
          <p className="mt-2 text-xl font-semibold">
            {stats?.cancelledReports || 0}
          </p>
          <p className="mt-1 text-[11px] opacity-90">↓ 10%</p>
        </div>
        <div className="rounded-2xl shadow-soft bg-gradient-to-t from-emerald-600 to-emerald-500 px-4 py-3 text-white">
          <p className="text-[11px] opacity-90">Verified</p>
          <p className="mt-2 text-xl font-semibold">
            {stats?.verifiedReports || 0}
          </p>
          <p className="mt-1 text-[11px] opacity-90">↑ 20%</p>
        </div>
        <div className="rounded-2xl shadow-soft bg-gradient-to-t from-emerald-600 to-emerald-500 px-4 py-3 text-white">
          <p className="text-[11px] opacity-90">Total Users</p>
          <p className="mt-2 text-xl font-semibold">{stats?.totalUsers || 0}</p>
          <p className="mt-1 text-[11px] opacity-90">↑ 2.8%</p>
        </div>
        <div className="rounded-2xl shadow-soft bg-gradient-to-t from-emerald-600 to-emerald-500 px-4 py-3 text-white">
          <p className="text-[11px] opacity-90">Feedback</p>
          <p className="mt-2 text-xl font-semibold">
            {stats?.feedbackCount || 0}
          </p>
          <p className="mt-1 text-[11px] opacity-90">↑ 25%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
