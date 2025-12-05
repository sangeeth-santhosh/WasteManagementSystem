import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './layout.css';

const links = [
  { to: '/admin/dashboard/home', label: 'Dashboard' },
  { to: '/admin/dashboard/reports', label: 'Collection Points' },
  { to: '/admin/dashboard/users', label: 'Users' },
  { to: '/admin/dashboard/feedback', label: 'Feedback' },
];

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-dot">WS</div>
          <div>
            <div className="brand-title">Waste Solutions</div>
            <div className="brand-sub">Admin Console</div>
          </div>
        </div>
        <nav className="admin-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>
          Log Out
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">Welcome, Admin</div>
          <div className="search-box">
            <span role="img" aria-label="search">🔍</span>
            <input placeholder="Search" />
          </div>
          <button className="action-btn">Add Collection Point</button>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

