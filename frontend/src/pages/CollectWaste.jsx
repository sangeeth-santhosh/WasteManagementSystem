import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { wasteService } from "../services/wasteService";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Verified: "bg-blue-100 text-blue-800 border-blue-200",
  Collected: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

const CollectWaste = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [monthlyHistory, setMonthlyHistory] = useState(null);
  const [loadingSummaries, setLoadingSummaries] = useState(false);
  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  useEffect(() => {
    loadReports();
    if (!isAdmin) {
      loadSummaries();
    }
  }, [isAdmin]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = isAdmin ? await wasteService.getAllReports() : await wasteService.getMyReports();
      setReports(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const loadSummaries = async () => {
    try {
      setLoadingSummaries(true);
      const [weekly, monthly, history] = await Promise.all([
        wasteService.getWeeklySummary(),
        wasteService.getMonthlySummary(),
        wasteService.getMonthlyHistory(),
      ]);
      setWeeklySummary(weekly.data || null);
      setMonthlySummary(monthly.data || null);
      setMonthlyHistory(history.data || null);
    } catch (err) {
      console.error("Failed to load summaries:", err);
    } finally {
      setLoadingSummaries(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!isAdmin) return;
    try {
      const res = await wasteService.updateReportStatus(id, newStatus);
      setReports((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } catch (err) {
      setError(err.message || "Failed to update status");
    }
  };

  const getFilteredReports = () => {
    if (activeTab === "all") return reports;
    if (activeTab === "week") {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return reports.filter((r) => new Date(r.createdAt) >= startOfWeek);
    }
    if (activeTab === "month") {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return reports.filter((r) => new Date(r.createdAt) >= startOfMonth);
    }
    if (activeTab === "zone") {
      const grouped = {};
      reports.forEach((report) => {
        const zone = report.zoneNameSnapshot || report.zone || "Unknown Zone";
        if (!grouped[zone]) {
          grouped[zone] = [];
        }
        grouped[zone].push(report);
      });
      return grouped;
    }
    return reports;
  };

  const calculateTotalWaste = (reportList) => {
    return reportList.reduce((sum, r) => {
      return sum + (r.wetKg || 0) + (r.dryKg || 0) + (r.plasticKg || 0) + (r.eWasteKg || 0);
    }, 0);
  };

  const filteredData = getFilteredReports();
  const isZoneView = activeTab === "zone";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">History</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Your waste reports</h1>
          <p className="text-gray-600 mt-1">Track statuses. Admins can update a report status.</p>
        </div>
      </div>

      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">This Week</p>
            <p className="text-2xl font-bold text-green-600">
              {loadingSummaries ? "—" : `${weeklySummary?.totalWaste || "0.00"} kg`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {weeklySummary?.reportCount || 0} {weeklySummary?.reportCount === 1 ? "report" : "reports"}
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">This Month</p>
            <p className="text-2xl font-bold text-green-600">
              {loadingSummaries ? "—" : `${monthlySummary?.totalWaste || "0.00"} kg`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {monthlySummary?.reportCount || 0} {monthlySummary?.reportCount === 1 ? "report" : "reports"}
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">All Time</p>
            <p className="text-2xl font-bold text-green-600">
              {loadingSummaries ? "—" : `${monthlyHistory?.allTimeTotal || "0.00"} kg`}
            </p>
            <p className="text-xs text-gray-500 mt-1">{reports.length} total reports</p>
          </div>
        </div>
      )}

      {!isAdmin && monthlyHistory && monthlyHistory.monthlyHistory && monthlyHistory.monthlyHistory.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Totals</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Month</th>
                  <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Total Waste</th>
                  <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Reports</th>
                </tr>
              </thead>
              <tbody>
                {monthlyHistory.monthlyHistory.map((month, idx) => (
                  <tr key={month.monthKey} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 text-sm text-gray-900">{month.month}</td>
                    <td className="py-3 px-3 text-sm font-semibold text-gray-900 text-right">{month.totalWaste} kg</td>
                    <td className="py-3 px-3 text-sm text-gray-600 text-right">{month.reportCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isAdmin && (
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "all"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setActiveTab("week")}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "week"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setActiveTab("month")}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "month"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setActiveTab("zone")}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "zone"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            By Zone
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading reports...</div>
      ) : isZoneView ? (
        Object.keys(filteredData).length === 0 ? (
          <div className="text-gray-600">No reports yet.</div>
        ) : (
          <div className="space-y-6">
            {Object.entries(filteredData).map(([zone, zoneReports]) => (
              <div key={zone} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {zone} ({zoneReports.length} {zoneReports.length === 1 ? "report" : "reports"})
                </h3>
                <div className="space-y-3">
                  {zoneReports.map((report) => (
                    <div key={report._id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Created</p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {new Date(report.createdAt).toLocaleString()}
                          </p>
                          {report.placeNameSnapshot && (
                            <p className="text-xs text-gray-600">{report.placeNameSnapshot}</p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <div className="px-2 py-1 bg-green-50 rounded text-xs text-green-700 font-semibold">
                            Wet: {report.wetKg} kg
                          </div>
                          <div className="px-2 py-1 bg-blue-50 rounded text-xs text-blue-700 font-semibold">
                            Dry: {report.dryKg} kg
                          </div>
                          <div className="px-2 py-1 bg-amber-50 rounded text-xs text-amber-700 font-semibold">
                            Plastic: {report.plasticKg} kg
                          </div>
                          <div className="px-2 py-1 bg-purple-50 rounded text-xs text-purple-700 font-semibold">
                            E-Waste: {report.eWasteKg} kg
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[report.status]}`}
                          >
                            {report.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : Array.isArray(filteredData) && filteredData.length === 0 ? (
        <div className="text-gray-600">No reports yet.</div>
      ) : (
        <div className="space-y-4">
          {Array.isArray(filteredData) &&
            filteredData.map((report) => (
              <div key={report._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-semibold text-gray-900">{new Date(report.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">
                      {report.zoneNameSnapshot || report.zone || "Unknown Zone"}
                      {report.placeNameSnapshot && ` • ${report.placeNameSnapshot}`}
                    </p>
                    {report.generatorType && (
                      <p className="text-xs text-gray-500 mt-1">
                        Generator: {report.generatorType.charAt(0).toUpperCase() + report.generatorType.slice(1)}
                        {report.generatorDetails?.houseNumber && ` • ${report.generatorDetails.houseNumber}`}
                        {report.generatorDetails?.shopName && ` • ${report.generatorDetails.shopName}`}
                        {report.generatorDetails?.institutionName && ` • ${report.generatorDetails.institutionName}`}
                        {report.generatorDetails?.officeName && ` • ${report.generatorDetails.officeName}`}
                        {report.generatorDetails?.apartmentName && ` • ${report.generatorDetails.apartmentName}`}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="px-3 py-2 bg-green-50 rounded-lg text-sm text-green-700 font-semibold">
                      Wet: {report.wetKg} kg
                    </div>
                    <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700 font-semibold">
                      Dry: {report.dryKg} kg
                    </div>
                    <div className="px-3 py-2 bg-amber-50 rounded-lg text-sm text-amber-700 font-semibold">
                      Plastic: {report.plasticKg} kg
                    </div>
                    <div className="px-3 py-2 bg-purple-50 rounded-lg text-sm text-purple-700 font-semibold">
                      E-Waste: {report.eWasteKg} kg
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusStyles[report.status]}`}
                    >
                      {report.status}
                    </span>
                    {isAdmin && (
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report._id, e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Collected">Collected</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CollectWaste;
