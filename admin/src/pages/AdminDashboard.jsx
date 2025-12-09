import React from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import AdminMain from "../components/AdminMain";

class AdminDashboard extends React.Component {
  render() {
    return (
      // Body is now the root div
      <div className="h-screen flex bg-[#dfeff7] font-sans">

        {/* SIDEBAR (left column, full height) */}
        <AdminSidebar />

        {/* RIGHT COLUMN: header on top, main content below */}
        <div className="flex-1 flex flex-col">
          <AdminHeader />

          {/* MAIN CONTENT - Takes remaining height and allows internal scrolling */}
          <div className="flex-1 overflow-y-auto">
            <AdminMain />
          </div>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
