import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import AdminReports from "./pages/AdminReports.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminFeedback from "./pages/AdminFeedback.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

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
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route path="home" element={<AdminHome />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route index element={<Navigate to="home" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;
