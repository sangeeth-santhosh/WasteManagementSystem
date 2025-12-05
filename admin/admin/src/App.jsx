import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminReports from "./pages/AdminReports.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminFeedback from "./pages/AdminFeedback.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import DashboardHome from "./pages/DashboardHome.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import AdminNotifications from "./pages/AdminNotifications.jsx";
import AdminZoneManagement from "./pages/AdminZoneManagement.jsx";

const RequireAdmin = () => {
  const token = localStorage.getItem("adminToken");
  const location = useLocation();
  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
};

const App = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className="select-none">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route path="home" element={<DashboardHome />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="zones" element={<AdminZoneManagement />} />
            <Route index element={<Navigate to="home" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;
