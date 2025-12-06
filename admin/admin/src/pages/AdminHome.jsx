import { useEffect, useState } from "react";
import { adminService } from "../api/adminService";
import { Link } from "react-router-dom";
import "../components/layout.css";

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminService.getSummary();
        setStats(res.data || res);
      } catch (err) {
        setError(err.message || "Failed to load summary");
      }
    };
    load();
  }, []);

  const cards = [
    {
      label: "Total E-waste Collection Points",
      key: "totalReports",
      sub: "Active 190 · Inactive 10",
      valuePrefix: "",
      color: "green",
    },
    {
      label: "Total Users",
      key: "totalUsers",
      sub: "+6.5% Since Last Month",
      valuePrefix: "",
      color: "mint",
    },
    {
      label: "Total Reports",
      key: "totalReports",
      sub: "+3.5% Since Last Month",
      valuePrefix: "",
      color: "mint",
    },
    {
      label: "Pending Reports",
      key: "pendingReports",
      sub: "+2.4% Since Last Month",
      valuePrefix: "",
      color: "mint",
    },
  ];

  const quickActions = [
    { label: "Create Campaign", path: "/admin/dashboard/campaigns" },
    { label: "Manage Users", path: "/admin/dashboard/users" },
    { label: "View Reports", path: "/admin/dashboard/reports" },
    { label: "Manage Partnerships", path: "/admin/dashboard/partnerships" },
    { label: "Manage Inventory", path: "/admin/dashboard/inventory" },
    { label: "View Feedbacks", path: "/admin/dashboard/feedback" },
  ];

  return (
    <div>
      <h1 className="topbar-title" style={{ marginBottom: 16 }}>
        Welcome, Admin
      </h1>
      {error && <div className="error">{error}</div>}

      <div className="card-grid">
        {cards.map((card, idx) => (
          <div key={card.label + idx} className="card">
            <div className="card-title">{card.label}</div>
            <div className="card-value">
              {stats ? `${card.valuePrefix}${stats[card.key] || 0}` : "—"}
            </div>
            <div className="card-sub">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="panel-header">Quick Actions</div>
        <div
          className="card-grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="card"
              style={{
                boxShadow: "none",
                border: "1px dashed #e5e7eb",
                cursor: "pointer",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="big-grid">
        <div className="panel">
          <div className="panel-header">
            <span>Eco Points Balance Distribution Among Users</span>
            <span className="badge blue">Chart</span>
          </div>
          <div className="fake-chart">Bar/Line Chart Placeholder</div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <span>Distribution of Reports</span>
            <span className="badge green">Live</span>
          </div>
          <div className="fake-chart">Donut/Legend Placeholder</div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
