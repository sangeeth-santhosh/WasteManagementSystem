import { useEffect, useState } from 'react';
import { adminService } from '../api/adminService';
import '../components/layout.css';

const AdminAnalytics = () => {
  const [zoneTotals, setZoneTotals] = useState([]);
  const [categoryByZone, setCategoryByZone] = useState([]);
  const [topZones, setTopZones] = useState([]);
  const [categoryHighLow, setCategoryHighLow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [generatorTypeFilter, setGeneratorTypeFilter] = useState('all');

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (dateRange !== 'all') {
        const now = new Date();
        if (dateRange === 'today') {
          params.from = new Date(now.setHours(0, 0, 0, 0)).toISOString();
          params.to = new Date().toISOString();
        } else if (dateRange === 'week') {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          params.from = weekAgo.toISOString();
          params.to = new Date().toISOString();
        } else if (dateRange === 'month') {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          params.from = monthAgo.toISOString();
          params.to = new Date().toISOString();
        }
      }

      if (zoneFilter !== 'all') {
        params.zone = zoneFilter;
      }

      if (generatorTypeFilter !== 'all') {
        params.generatorType = generatorTypeFilter;
      }

      const [totals, category, top, highLow] = await Promise.all([
        adminService.getZoneTotals(params),
        adminService.getCategoryByZone(params),
        adminService.getTopZones(params),
        adminService.getCategoryHighLow(params),
      ]);

      setZoneTotals(totals.data || []);
      setCategoryByZone(category.data || []);
      setTopZones(top.data || []);
      setCategoryHighLow(highLow.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [dateRange, zoneFilter, generatorTypeFilter]);

  const maxTotal = zoneTotals.length > 0 ? Math.max(...zoneTotals.map((z) => z.totalWaste)) : 1;

  const downloadCSV = () => {
    const headers = ['Zone', 'Total Waste (kg)', 'Wet (kg)', 'Dry (kg)', 'Plastic (kg)', 'E-Waste (kg)', 'Report Count'];
    const rows = zoneTotals.map((z) => [
      z.zone,
      z.totalWaste.toFixed(2),
      z.totalWet.toFixed(2),
      z.totalDry.toFixed(2),
      z.totalPlastic.toFixed(2),
      z.totalEWaste.toFixed(2),
      z.count,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waste-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>Waste Management Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #059669; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>Waste Management Analytics Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <h2>Zone Totals</h2>
          <table>
            <tr><th>Zone</th><th>Total Waste (kg)</th><th>Wet</th><th>Dry</th><th>Plastic</th><th>E-Waste</th><th>Count</th></tr>
            ${zoneTotals.map((z) => `<tr><td>${z.zone}</td><td>${z.totalWaste.toFixed(2)}</td><td>${z.totalWet.toFixed(2)}</td><td>${z.totalDry.toFixed(2)}</td><td>${z.totalPlastic.toFixed(2)}</td><td>${z.totalEWaste.toFixed(2)}</td><td>${z.count}</td></tr>`).join('')}
          </table>
          <h2>Top 5 Zones</h2>
          <table>
            <tr><th>Zone</th><th>Total Waste (kg)</th><th>Report Count</th></tr>
            ${topZones.map((z) => `<tr><td>${z.zone}</td><td>${z.totalWaste.toFixed(2)}</td><td>${z.count}</td></tr>`).join('')}
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-800 mb-4">Analytics</h1>
        <div className="text-center py-8 text-slate-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Analytics</h1>
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition"
          >
            Download CSV
          </button>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Download PDF
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">{error}</div>}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Filter by Zone</label>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Zones</option>
              <option value="A">Zone A</option>
              <option value="B">Zone B</option>
              <option value="C">Zone C</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Filter by Generator Type</label>
            <select
              value={generatorTypeFilter}
              onChange={(e) => setGeneratorTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="household">Household</option>
              <option value="shop">Shop / Store</option>
              <option value="institution">Institution</option>
              <option value="office">Office / Corporate</option>
              <option value="apartment">Apartment / Gated Community</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {generatorTypeFilter !== 'all' 
              ? `${generatorTypeFilter.charAt(0).toUpperCase() + generatorTypeFilter.slice(1)} Waste by Zone`
              : 'Total Waste per Zone'}
          </h2>
          <div className="space-y-4">
            {zoneTotals.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No data available</p>
            ) : (
              zoneTotals.map((zone) => (
                <div key={zone.zone}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Zone {zone.zone}</span>
                    <span className="text-sm text-slate-600">{zone.totalWaste.toFixed(2)} kg</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-4">
                    <div
                      className="bg-emerald-500 h-4 rounded-full transition-all"
                      style={{ width: `${(zone.totalWaste / maxTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Top 5 Zones by Total Waste</h2>
          <div className="space-y-3">
            {topZones.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No data available</p>
            ) : (
              topZones.map((zone, idx) => (
                <div key={zone.zone} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">Zone {zone.zone}</span>
                      <span className="text-sm text-slate-600">{zone.totalWaste.toFixed(2)} kg</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${(zone.totalWaste / (topZones[0]?.totalWaste || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Category Distribution by Zone</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryByZone.length === 0 ? (
            <p className="text-slate-500 text-center py-4 col-span-3">No data available</p>
          ) : (
            categoryByZone.map((zone) => {
              const total = zone.wetKg + zone.dryKg + zone.plasticKg + zone.eWasteKg;
              return (
                <div key={zone.zone} className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-700 mb-3">Zone {zone.zone}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Wet Waste</span>
                      <span className="font-medium">{zone.wetKg.toFixed(2)} kg</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${total > 0 ? (zone.wetKg / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dry Waste</span>
                      <span className="font-medium">{zone.dryKg.toFixed(2)} kg</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${total > 0 ? (zone.dryKg / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Plastic</span>
                      <span className="font-medium">{zone.plasticKg.toFixed(2)} kg</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${total > 0 ? (zone.plasticKg / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">E-Waste</span>
                      <span className="font-medium">{zone.eWasteKg.toFixed(2)} kg</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${total > 0 ? (zone.eWasteKg / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {categoryHighLow.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Category Analysis by Zone</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryHighLow.map((zone) => (
              <div key={zone.zone} className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-700 mb-3">Zone {zone.zone}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Highest: </span>
                    <span className="font-medium text-emerald-600">{zone.highest.name}</span>
                    <span className="text-slate-600 ml-2">({zone.highest.value.toFixed(2)} kg)</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Lowest: </span>
                    <span className="font-medium text-red-600">{zone.lowest.name}</span>
                    <span className="text-slate-600 ml-2">({zone.lowest.value.toFixed(2)} kg)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;

