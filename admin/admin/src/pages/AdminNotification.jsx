import { useEffect, useMemo, useState } from 'react';
import { adminService } from '../api/adminService';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString();
};

const AdminNotifications = () => {
  const [zones, setZones] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // filters
  const [zoneId, setZoneId] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // notification form
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('SYSTEM');
  const [sendEmailToo, setSendEmailToo] = useState(false);

  const loadBaseData = async () => {
    try {
      setLoading(true);
      const [zonesRes, reportsRes] = await Promise.all([
        adminService.getZones(),
        adminService.getReports(),
      ]);
      setZones(zonesRes?.data || zonesRes || []);
      setReports(reportsRes?.data || reportsRes || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const res = await adminService.getNotifications(25);
      const list = res?.notifications || res?.data || res || [];
      setNotifications(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    loadBaseData();
    loadRecentNotifications();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      let ok = true;

      if (zoneId !== 'all') {
        ok = ok && r.zoneId === zoneId;
      }

      if (statusFilter !== 'all') {
        ok = ok && r.status === statusFilter;
      }

      if (fromDate) {
        const from = new Date(fromDate);
        const created = new Date(r.createdAt);
        ok = ok && created >= from;
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        const created = new Date(r.createdAt);
        ok = ok && created <= to;
      }

      return ok;
    });
  }, [reports, zoneId, statusFilter, fromDate, toDate]);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !message.trim()) {
      setError('Title and message are required');
      return;
    }

    try {
      setSending(true);

      const payload = {
        title: title.trim(),
        message: message.trim(),
        type,
        deliveryMethod: sendEmailToo ? 'IN_APP_EMAIL' : 'IN_APP',
      };

      if (zoneId !== 'all') {
        payload.zoneId = zoneId;
      }
      if (statusFilter !== 'all') {
        payload.status = statusFilter;
      }
      if (fromDate) {
        payload.startDate = fromDate;
      }
      if (toDate) {
        payload.endDate = toDate;
      }

      const res = await adminService.sendNotification(payload);

      setSuccess(
        res?.message ||
          `Notification sent successfully to ${res?.count || 'selected'} users`
      );
      setError('');
      loadRecentNotifications();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send notification');
      setSuccess('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold mb-1">
            Notifications
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">Send updates to users</h1>
          <p className="text-sm text-gray-600">
            Target users by zone, date, and report status. Preview the impacted reports and see recent sends.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Send Notification Card */}
        <form
          onSubmit={handleSendNotification}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Send notification</h2>
              <p className="text-sm text-gray-500">Craft a message and target users based on their report activity.</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
              Admin action
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">Title</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-200"
                placeholder="Collection scheduled for tomorrow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">Type</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="SYSTEM">System</option>
                <option value="REPORT_STATUS">Report Status</option>
                <option value="REMINDER">Reminder</option>
                <option value="ZONE_ALERT">Zone Alert</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Message</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm min-h-[120px] resize-y focus:outline-none focus:ring focus:ring-emerald-200"
              placeholder={`Include clear info like: date, time, zone, collection type, etc.

Example:
Dear resident, your e-waste collection in Zone A is scheduled for 10 AM - 12 PM tomorrow. Please keep items ready at the designated collection point.`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">Target zone</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
              >
                <option value="all">All zones</option>
                {zones.map((z) => (
                  <option key={z._id} value={z._id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">Report status</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Collected">Collected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">From date</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">To date</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <input
              id="send-email-too"
              type="checkbox"
              className="h-4 w-4"
              checked={sendEmailToo}
              onChange={(e) => setSendEmailToo(e.target.checked)}
            />
            <label htmlFor="send-email-too" className="text-gray-700 cursor-pointer">
              Also send as email (if enabled on server)
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {sending ? 'Sending…' : 'Send Notification'}
            </button>
          </div>
        </form>

        {/* Recent Notifications Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent notifications</h2>
              <p className="text-sm text-gray-500">Latest 25 sent items.</p>
            </div>
            <button
              type="button"
              onClick={loadRecentNotifications}
              className="text-xs font-semibold text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-50 border border-emerald-100"
            >
              Refresh
            </button>
          </div>

          {loadingNotifications ? (
            <div className="text-sm text-gray-500">Loading notifications…</div>
          ) : notifications.length === 0 ? (
            <div className="text-sm text-gray-500">No notifications sent yet.</div>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b">
                    <th className="py-2 px-2">Title</th>
                    <th className="py-2 px-2">Type</th>
                    <th className="py-2 px-2">Target</th>
                    <th className="py-2 px-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((n) => (
                    <tr key={n._id} className="border-b last:border-0">
                      <td className="py-2 px-2 font-semibold text-gray-900 max-w-[180px] truncate" title={n.title}>
                        {n.title || '—'}
                      </td>
                      <td className="py-2 px-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                          {n.type || 'SYSTEM'}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700">
                        {n.zoneNameSnapshot || n.zoneId ? 'Zone targeted' : 'All users'}
                      </td>
                      <td className="py-2 px-2 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(n.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reports preview table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-gray-900">
            Filtered Reports ({filteredReports.length})
          </h2>
          <p className="text-xs text-gray-500">
            Users are targeted when their reports match these filters (zone, date, status).
          </p>
        </div>

        {loading ? (
          <div className="text-sm text-gray-500">Loading reports…</div>
        ) : filteredReports.length === 0 ? (
          <div className="text-sm text-gray-500">No reports match the selected filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Zone</th>
                  <th className="py-2 pr-4">Waste</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.slice(0, 50).map((r) => (
                  <tr key={r._id} className="border-b last:border-0">
                    <td className="py-2 pr-4">
                      {r.user?.name || 'Unknown'}{' '}
                      <span className="text-xs text-gray-500 block">{r.user?.email}</span>
                    </td>
                    <td className="py-2 pr-4">{r.zoneNameSnapshot || r.zone || '—'}</td>
                    <td className="py-2 pr-4 text-xs">
                      Wet: {r.wetKg || 0} kg · Dry: {r.dryKg || 0} kg · Plastic: {r.plasticKg || 0} kg · E-waste: {r.eWasteKg || 0} kg
                    </td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border">{r.status}</span>
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredReports.length > 50 && (
              <p className="mt-2 text-xs text-gray-500">Showing first 50 reports. Refine filters for a narrower segment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
