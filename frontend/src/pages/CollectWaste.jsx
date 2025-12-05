import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { wasteService } from "../services/wasteService";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const getStatusVariant = (status) => {
  const map = {
    Pending: 'pending',
    Verified: 'verified',
    Collected: 'collected',
    Cancelled: 'cancelled',
  };
  return map[status] || 'default';
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
      <div>
        <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold mb-1">Waste History</p>
        <h1 className="text-2xl font-bold text-gray-900">Your Waste Reports</h1>
        <p className="text-gray-600 mt-1">Track your waste collection status and history.</p>
      </div>

      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5" hover>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-600">This Week</p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {loadingSummaries ? "—" : `${weeklySummary?.totalWaste || "0.00"} kg`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {weeklySummary?.reportCount || 0} {weeklySummary?.reportCount === 1 ? "report" : "reports"}
            </p>
          </Card>
          <Card className="p-5" hover>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-600">This Month</p>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {loadingSummaries ? "—" : `${monthlySummary?.totalWaste || "0.00"} kg`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {monthlySummary?.reportCount || 0} {monthlySummary?.reportCount === 1 ? "report" : "reports"}
            </p>
          </Card>
          <Card className="p-5" hover>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-600">All Time</p>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⭐</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {loadingSummaries ? "—" : `${monthlyHistory?.allTimeTotal || "0.00"} kg`}
            </p>
            <p className="text-xs text-gray-500 mt-1">{reports.length} total reports</p>
          </Card>
        </div>
      )}

      {!isAdmin && monthlyHistory && monthlyHistory.monthlyHistory && monthlyHistory.monthlyHistory.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Totals</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Waste</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Reports</th>
                </tr>
              </thead>
              <tbody>
                {monthlyHistory.monthlyHistory.map((month, idx) => (
                  <tr key={month.monthKey} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900">{month.month}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">{month.totalWaste} kg</td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-right">{month.reportCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!isAdmin && (
        <div className="flex gap-2 border-b border-gray-200 pb-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2.5 text-sm font-semibold transition-all duration-150 rounded-t-lg ${
              activeTab === "all"
                ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setActiveTab("week")}
            className={`px-4 py-2.5 text-sm font-semibold transition-all duration-150 rounded-t-lg ${
              activeTab === "week"
                ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setActiveTab("month")}
            className={`px-4 py-2.5 text-sm font-semibold transition-all duration-150 rounded-t-lg ${
              activeTab === "month"
                ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setActiveTab("zone")}
            className={`px-4 py-2.5 text-sm font-semibold transition-all duration-150 rounded-t-lg ${
              activeTab === "zone"
                ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
              <Card key={zone} className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {zone} ({zoneReports.length} {zoneReports.length === 1 ? "report" : "reports"})
                </h3>
                <div className="space-y-3">
                  {zoneReports.map((report) => (
                    <Card key={report._id} className="p-4 bg-gray-50/50" hover>
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {report.placeNameSnapshot && (
                            <p className="text-xs text-gray-600">📍 {report.placeNameSnapshot}</p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <div className="px-2.5 py-1 bg-green-50 rounded-lg text-xs text-green-700 font-semibold border border-green-100">
                            Wet: {report.wetKg} kg
                          </div>
                          <div className="px-2.5 py-1 bg-blue-50 rounded-lg text-xs text-blue-700 font-semibold border border-blue-100">
                            Dry: {report.dryKg} kg
                          </div>
                          <div className="px-2.5 py-1 bg-amber-50 rounded-lg text-xs text-amber-700 font-semibold border border-amber-100">
                            Plastic: {report.plasticKg} kg
                          </div>
                          <div className="px-2.5 py-1 bg-purple-50 rounded-lg text-xs text-purple-700 font-semibold border border-purple-100">
                            E-Waste: {report.eWasteKg} kg
                          </div>
                        </div>

                        <Badge variant={getStatusVariant(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )
      ) : Array.isArray(filteredData) && filteredData.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No reports yet. Start by reporting your waste!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {Array.isArray(filteredData) &&
            filteredData.map((report) => (
              <Card key={report._id} className="p-6" hover>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <Badge variant={getStatusVariant(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      📍 {report.zoneNameSnapshot || report.zone || "Unknown Zone"}
                      {report.placeNameSnapshot && ` • ${report.placeNameSnapshot}`}
                    </p>
                    {report.generatorType && (
                      <p className="text-xs text-gray-500">
                        Generator: {report.generatorType.charAt(0).toUpperCase() + report.generatorType.slice(1)}
                        {report.generatorDetails?.houseNumber && ` • ${report.generatorDetails.houseNumber}`}
                        {report.generatorDetails?.shopName && ` • ${report.generatorDetails.shopName}`}
                        {report.generatorDetails?.institutionName && ` • ${report.generatorDetails.institutionName}`}
                        {report.generatorDetails?.officeName && ` • ${report.generatorDetails.officeName}`}
                        {report.generatorDetails?.apartmentName && ` • ${report.generatorDetails.apartmentName}`}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1.5 bg-green-50 rounded-lg text-xs text-green-700 font-semibold border border-green-100">
                      Wet: {report.wetKg} kg
                    </div>
                    <div className="px-3 py-1.5 bg-blue-50 rounded-lg text-xs text-blue-700 font-semibold border border-blue-100">
                      Dry: {report.dryKg} kg
                    </div>
                    <div className="px-3 py-1.5 bg-amber-50 rounded-lg text-xs text-amber-700 font-semibold border border-amber-100">
                      Plastic: {report.plasticKg} kg
                    </div>
                    <div className="px-3 py-1.5 bg-purple-50 rounded-lg text-xs text-purple-700 font-semibold border border-purple-100">
                      E-Waste: {report.eWasteKg} kg
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="w-full md:w-auto">
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report._id, e.target.value)}
                        className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Collected">Collected</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  )}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default CollectWaste;
