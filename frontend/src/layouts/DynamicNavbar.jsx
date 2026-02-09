import React, { useState } from "react";
import { LogOut, Menu, User, Settings, ChevronDown } from "lucide-react";
import HospitalLogo from "../assets/images/logo1.png";
import { Link } from 'react-router-dom';
import AnimatedHeading from "./AnimationHeading";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

const DynamicNavbar = ({ toggleSidebar, onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const currentUser = useSelector(selectCurrentUser);

  // Role-specific configurations
  const roleConfig = {
    admin: {
      dashboardPath: "/admin/dashboard",
      title: "Admin Dashboard",
      color: "bg-gray-600"
    },
    receptionist: {
      dashboardPath: "/reception/dashboard",
      title: "Reception Dashboard",
      color: "bg-primary-600"
    },
    lab: {
      dashboardPath: "/lab/dashboard",
      title: "Lab Dashboard",
      color: "bg-primary-600"
    },
    doctor: {
      dashboardPath: "/doctor/dashboard",
      title: "Doctor Dashboard",
      color: "bg-purple-600"
    },
    patient: {
      dashboardPath: "/patient/dashboard",
      title: "Patient Dashboard",
      color: "bg-sky-700"
    },
  };
  const config = roleConfig[currentUser?.user_Access] || roleConfig.receptionist;

  // User initials for avatar
  const getUserInitials = () => {
    if (!currentUser?.user_Email) return "U";
    const names = currentUser.user_Email.split('@')[0].split('.');
    return names.map(name => name[0]?.toUpperCase()).join('');
  };

  return (
    <div className={`${config.color} border-b border-gray-200 shadow-sm`}>
      <div className="px-4 sm:px-6 py-2 flex items-center justify-between">
        {/* Left side - Menu button and logo */}
        <div className="flex items-center">
          <button
            className="lg:hidden mr-3 text-white hover:bg-white/10 p-2 rounded-md focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link className="group bg-white/30 backdrop-blur-lg border border-primary-300 p-2 rounded-full flex items-center">
            <img
              className="w-10 h-auto transition-transform group-hover:scale-110"
              src={HospitalLogo}
              alt="Hospital Logo"
            />
            {/* <span className="ml-3 text-white font-semibold text-lg hidden md:block">
              Al-Shahbaz
            </span> */}
          </Link>
        </div>

        {/* Center - Dashboard title */}
        <div className="hidden xl:block mx-4 flex-1">
          <AnimatedHeading text={config.title} />
        </div>

        {/* Right side - User profile and actions */}
        <div className="flex items-center space-x-4">
          {/* Desktop User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="backdrop-blur-sm bg-white/10 rounded-lg p-2 flex items-center space-x-2 border border-primary-300 shadow-sm hover:bg-white/20 transition-all">
                <div className="w-9 h-9 rounded-full bg-primary-900/40 flex items-center border justify-center text-primary-300 font-medium lg:text-xl">
                  {getUserInitials()}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium text-white">
                    {currentUser?.user_Email}
                  </p>
                  <p className="text-xs text-white/80 capitalize">
                    {currentUser?.user_Access}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-primary-900/50 backdrop-blur-lg shadow-lg border border-white/20 focus:outline-none z-50 overflow-hidden">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-white/20">
                    <p className="text-sm font-medium text-white">{currentUser?.user_Email}</p>
                    <p className="text-xs text-white/80 capitalize">{currentUser?.user_Access}</p>
                  </div>
                  <Link
                    to='/profile'
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/20"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/20"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowLogoutModal(true);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-white hover:bg-white/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden border border-white/20">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-sm text-gray-700">Are you sure you want to logout from your account?</p>
            </div>
            <div className="bg-gray-50/80 px-4 py-3 flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100/80 rounded-md"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                onClick={() => {
                  onLogout();
                  setShowLogoutModal(false);
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicNavbar;