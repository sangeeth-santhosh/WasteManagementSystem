import { useEffect, useState } from 'react';
import { adminService } from '../api/adminService';
import '../components/layout.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data || res);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (id, isActive) => {
    try {
      await adminService.updateUserStatus(id, { isActive: !isActive });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: !isActive } : u)));
    } catch (err) {
      setError(err.message || 'Failed to update user');
    }
  };

  return (
    <div>
      <h1 className="topbar-title" style={{ marginBottom: 16 }}>Users</h1>
      {error && <div className="error">{error}</div>}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <span className={u.isActive ? 'badge green' : 'badge red'}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="actions">
                    <button className="select" onClick={() => toggleActive(u._id, u.isActive)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

