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
  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  useEffect(() => {
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
    loadReports();
  }, [isAdmin]);

  const handleStatusChange = async (id, newStatus) => {
    if (!isAdmin) return;
    try {
      const res = await wasteService.updateReportStatus(id, newStatus);
      setReports((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } catch (err) {
      setError(err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">History</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Your waste reports</h1>
          <p className="text-gray-600 mt-1">Track statuses. Admins can update a report status.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-gray-600">No reports yet.</div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
          <div key={report._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-semibold text-gray-900">{new Date(report.createdAt).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Zone {report.zone}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="px-3 py-2 bg-green-50 rounded-lg text-sm text-green-700 font-semibold">Wet: {report.wetKg} kg</div>
                <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700 font-semibold">Dry: {report.dryKg} kg</div>
                <div className="px-3 py-2 bg-amber-50 rounded-lg text-sm text-amber-700 font-semibold">Plastic: {report.plasticKg} kg</div>
                <div className="px-3 py-2 bg-purple-50 rounded-lg text-sm text-purple-700 font-semibold">E-Waste: {report.eWasteKg} kg</div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusStyles[report.status]}`}>
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

