// layouts/DynamicLayout.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import DynamicNavbar from './DynamicNavbar';
import DynamicSidebar from './DynamicSidebar';
import { useNavigate  , Outlet} from 'react-router-dom';

const DynamicLayout = () => {
  const user = useSelector(selectCurrentUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtLoginToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-primary-50">
      {/* Dynamic Sidebar */}
      <DynamicSidebar 
        userRole={user?.user_Access} 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dynamic Navbar */}
        <DynamicNavbar 
          userRole={user?.user_Access} 
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-primary-50 p-2 lg:p-4">
           <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DynamicLayout;