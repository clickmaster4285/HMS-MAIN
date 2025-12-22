// layouts/DynamicLayout.jsx
import React, { useState, useCallback, memo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { Outlet, useNavigate } from "react-router-dom";

import DynamicNavbar from "./DynamicNavbar";
import DynamicSidebar from "./DynamicSidebar";

const DynamicLayout = () => {
  const navigate = useNavigate();

  // ✅ Prevent unnecessary re-renders
  const user = useSelector(selectCurrentUser, shallowEqual);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Memoized handlers
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("jwtLoginToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="flex h-screen bg-primary-50">
      {/* Sidebar */}
      <MemoSidebar
        userRole={user?.user_Access}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <MemoNavbar
          userRole={user?.user_Access}
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto bg-primary-50 p-2 lg:p-4"
          role="main"
        >
          {/* ✅ LCP content renders immediately */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

/* ================= Memoized Components ================= */

const MemoSidebar = memo(DynamicSidebar);
const MemoNavbar = memo(DynamicNavbar);

export default DynamicLayout;
