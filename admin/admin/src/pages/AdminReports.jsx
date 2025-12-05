import { useEffect, useState } from 'react';
import { adminService } from '../api/adminService';
import '../components/layout.css';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [flippedCards, setFlippedCards] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await adminService.getReports();
        setReports(res.data || res || []);
      } catch (err) {
        setError(err.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateStatus = async (id, newStatus) => {
    // Store previous status for potential rollback
    const previousStatus = reports.find(r => r._id === id)?.status;
    
    try {
      setError('');
      setSuccess('');
      setUpdating(id);
      
      // Optimistic update
      setReports((prev) => prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r)));
      
      await adminService.updateReportStatus(id, newStatus);
      setSuccess('Status updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Revert on error
      if (previousStatus) {
        setReports((prev) => prev.map((r) => (r._id === id ? { ...r, status: previousStatus } : r)));
      }
      setError(err.message || 'Failed to update status');
      console.error('Status update error:', err);
      setTimeout(() => setError(''), 5000);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Verified: 'bg-blue-100 text-blue-800 border-blue-300',
      Collected: 'bg-green-100 text-green-800 border-green-300',
      Cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      Verified: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      Collected: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      Cancelled: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    };
    return icons[status] || null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleFlip = (reportId) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };

  const getGeneratorTypeLabel = (type) => {
    const labels = {
      household: 'Household',
      shop: 'Shop / Store',
      institution: 'Institution',
      office: 'Office / Corporate',
      apartment: 'Apartment / Gated Community',
    };
    return labels[type] || type;
  };

  const renderGeneratorDetails = (report) => {
    if (!report.generatorType || !report.generatorDetails) {
      return <p className="text-sm text-slate-500">No generator details available</p>;
    }

    const details = report.generatorDetails;
    const type = report.generatorType;

    switch (type) {
      case 'household':
        return (
          <div className="space-y-2 text-sm">
            {details.houseNumber && (
              <div className="flex justify-between">
                <span className="text-slate-600">House Number:</span>
                <span className="font-medium text-slate-800">{details.houseNumber}</span>
              </div>
            )}
            {details.familySize && (
              <div className="flex justify-between">
                <span className="text-slate-600">Family Size:</span>
                <span className="font-medium text-slate-800">{details.familySize} people</span>
              </div>
            )}
            {details.hasCompostBin && (
              <div className="flex justify-between">
                <span className="text-slate-600">Compost Bin:</span>
                <span className="font-medium text-slate-800 capitalize">{details.hasCompostBin}</span>
              </div>
            )}
          </div>
        );

      case 'shop':
        return (
          <div className="space-y-2 text-sm">
            {details.shopName && (
              <div className="flex justify-between">
                <span className="text-slate-600">Shop Name:</span>
                <span className="font-medium text-slate-800">{details.shopName}</span>
              </div>
            )}
            {details.businessType && (
              <div className="flex justify-between">
                <span className="text-slate-600">Business Type:</span>
                <span className="font-medium text-slate-800 capitalize">{details.businessType}</span>
              </div>
            )}
            {details.dailyCustomerEstimate && (
              <div className="flex justify-between">
                <span className="text-slate-600">Daily Customers:</span>
                <span className="font-medium text-slate-800">~{details.dailyCustomerEstimate}</span>
              </div>
            )}
          </div>
        );

      case 'institution':
        return (
          <div className="space-y-2 text-sm">
            {details.institutionName && (
              <div className="flex justify-between">
                <span className="text-slate-600">Institution:</span>
                <span className="font-medium text-slate-800">{details.institutionName}</span>
              </div>
            )}
            {details.institutionType && (
              <div className="flex justify-between">
                <span className="text-slate-600">Type:</span>
                <span className="font-medium text-slate-800 capitalize">{details.institutionType}</span>
              </div>
            )}
            {details.peopleCount && (
              <div className="flex justify-between">
                <span className="text-slate-600">People Count:</span>
                <span className="font-medium text-slate-800">{details.peopleCount}</span>
              </div>
            )}
          </div>
        );

      case 'office':
        return (
          <div className="space-y-2 text-sm">
            {details.officeName && (
              <div className="flex justify-between">
                <span className="text-slate-600">Office Name:</span>
                <span className="font-medium text-slate-800">{details.officeName}</span>
              </div>
            )}
            {details.floor && (
              <div className="flex justify-between">
                <span className="text-slate-600">Floor / Unit:</span>
                <span className="font-medium text-slate-800">{details.floor}</span>
              </div>
            )}
            {details.employeeCount && (
              <div className="flex justify-between">
                <span className="text-slate-600">Employees:</span>
                <span className="font-medium text-slate-800">{details.employeeCount}</span>
              </div>
            )}
          </div>
        );

      case 'apartment':
        return (
          <div className="space-y-2 text-sm">
            {details.apartmentName && (
              <div className="flex justify-between">
                <span className="text-slate-600">Apartment Name:</span>
                <span className="font-medium text-slate-800">{details.apartmentName}</span>
              </div>
            )}
            {details.flatCount && (
              <div className="flex justify-between">
                <span className="text-slate-600">Number of Flats:</span>
                <span className="font-medium text-slate-800">{details.flatCount}</span>
              </div>
            )}
            {details.hasCentralBins && (
              <div className="flex justify-between">
                <span className="text-slate-600">Central Bins:</span>
                <span className="font-medium text-slate-800 capitalize">{details.hasCentralBins}</span>
              </div>
            )}
          </div>
        );

      default:
        return <p className="text-sm text-slate-500">No details available</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Collection Points</h1>
        <div className="text-sm text-slate-500">
          Total: <span className="font-semibold text-slate-700">{reports.length}</span> reports
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-sm">
          {success}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12 text-slate-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <p className="mt-4">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-card rounded-xl border border-slate-200">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="mt-4 text-lg font-medium">No collection points found</p>
          <p className="mt-2 text-sm">Reports will appear here once users submit waste collection requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reports.map((report) => {
            const isFlipped = flippedCards.has(report._id);
            return (
            <div
              key={report._id}
              className="relative h-full"
              style={{ perspective: '1000px' }}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front of Card */}
                <div
                  className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 p-6 space-y-4 backface-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                >
              {/* Header: User Info & Status */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 truncate">
                    {report.user?.name || 'Unknown User'}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-1">
                    {report.user?.email || 'No email'}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(report.status)} whitespace-nowrap ml-2`}>
                  {getStatusIcon(report.status)}
                  {report.status}
                </span>
              </div>

              {/* Zone & Location */}
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-slate-700">
                  {report.zoneNameSnapshot || report.zone || 'Unknown Zone'}
                </span>
                {report.placeNameSnapshot && (
                  <span className="text-slate-500 text-xs truncate">• {report.placeNameSnapshot}</span>
                )}
                {!report.placeNameSnapshot && report.details && (
                  <span className="text-slate-500 text-xs truncate">• {report.details}</span>
                )}
              </div>

              {/* Waste Quantities */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Waste Quantities</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Wet Waste</span>
                    <span className="text-sm font-semibold text-slate-800">{report.wetKg || 0} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Dry Waste</span>
                    <span className="text-sm font-semibold text-slate-800">{report.dryKg || 0} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Plastic</span>
                    <span className="text-sm font-semibold text-slate-800">{report.plasticKg || 0} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">E-Waste</span>
                    <span className="text-sm font-semibold text-slate-800">{report.eWasteKg || 0} kg</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Total</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {((report.wetKg || 0) + (report.dryKg || 0) + (report.plasticKg || 0) + (report.eWasteKg || 0)).toFixed(1)} kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Date & Status Update */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(report.createdAt)}</span>
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">Update Status</label>
                <select
                  value={report.status}
                  onChange={(e) => updateStatus(report._id, e.target.value)}
                  disabled={updating === report._id}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-colors"
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Collected">Collected</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {updating === report._id && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-500"></div>
                    <span>Updating...</span>
                  </div>
                )}
              </div>

              {/* View Details Button */}
              <button
                onClick={() => toggleFlip(report._id)}
                className="w-full mt-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </button>
                </div>

                {/* Back of Card */}
                <div
                  className="absolute inset-0 bg-white rounded-xl border border-gray-200 shadow-md p-6 space-y-4 backface-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800">Generator Details</h3>
                    <button
                      onClick={() => toggleFlip(report._id)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Generator Type</span>
                      <p className="text-sm font-medium text-slate-800 mt-1">
                        {getGeneratorTypeLabel(report.generatorType) || 'Not specified'}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-3">
                        Details
                      </span>
                      {renderGeneratorDetails(report)}
                    </div>

                    {report.details && (
                      <div>
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">
                          Additional Notes
                        </span>
                        <p className="text-sm text-slate-700">{report.details}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleFlip(report._id)}
                    className="w-full mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-sm font-medium"
                  >
                    Back to Report
                  </button>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminReports;
