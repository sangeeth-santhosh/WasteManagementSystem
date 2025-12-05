import { useEffect, useState } from 'react';
import { adminService } from '../api/adminService';
import '../components/layout.css';

const AdminFeedback = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminService.getFeedback();
      setItems(res.data || res || []);
    } catch (err) {
      setError(err.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resolve = async (id) => {
    try {
      setError('');
      setSuccess('');
      await adminService.resolveFeedback(id);
      setItems((prev) => prev.map((f) => (f._id === id ? { ...f, resolved: true, resolvedAt: new Date() } : f)));
      setSuccess('Feedback marked as resolved');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to resolve feedback');
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-800 mb-4">Feedback Management</h1>
        <div className="text-center py-8 text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">Feedback Management</h1>
      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg mb-4">{success}</div>}

      {items.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">No feedback found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((f) => (
            <div
              key={f._id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-semibold">
                      {f.user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{f.user?.email || 'Unknown User'}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(f.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  {f.subject && (
                    <p className="text-sm font-semibold text-slate-700 mb-2 mt-3">Subject: {f.subject}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      f.resolved
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}
                  >
                    {f.resolved ? 'Resolved' : 'Open'}
                  </span>
                  {!f.resolved && (
                    <button
                      onClick={() => resolve(f._id)}
                      className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{f.message}</p>
              </div>

              {f.resolved && f.resolvedAt && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Resolved on:{' '}
                    {new Date(f.resolvedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
