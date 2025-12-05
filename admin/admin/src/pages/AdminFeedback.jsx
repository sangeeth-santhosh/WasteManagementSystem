import { useEffect, useState } from 'react';
import { adminService } from '../api/adminService';
import '../components/layout.css';

const AdminFeedback = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await adminService.getFeedback();
      setItems(res.data || res);
    } catch (err) {
      setError(err.message || 'Failed to load feedback');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resolve = async (id) => {
    try {
      await adminService.resolveFeedback(id);
      setItems((prev) => prev.map((f) => (f._id === id ? { ...f, resolved: true } : f)));
    } catch (err) {
      setError(err.message || 'Failed to resolve feedback');
    }
  };

  return (
    <div>
      <h1 className="topbar-title" style={{ marginBottom: 16 }}>Feedback</h1>
      {error && <div className="error">{error}</div>}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Created</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((f) => (
              <tr key={f._id}>
                <td>{f.user?.email || '—'}</td>
                <td>{f.subject || '—'}</td>
                <td>{f.message}</td>
                <td>{new Date(f.createdAt).toLocaleString()}</td>
                <td>
                  <span className={f.resolved ? 'badge green' : 'badge yellow'}>
                    {f.resolved ? 'Resolved' : 'Open'}
                  </span>
                </td>
                <td>
                  {!f.resolved && (
                    <button className="select" onClick={() => resolve(f._id)}>
                      Mark resolved
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFeedback;

