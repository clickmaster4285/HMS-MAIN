import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { User, Mail, Phone, Home, Fingerprint, Calendar, Shield, BadgeCheck } from 'lucide-react';

const Profile = () => {
  const currentUser = useSelector(selectCurrentUser);
  
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your profile</h2>
          <p className="text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  // Format the createdAt date
  const joinDate = new Date(currentUser.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-linear-to-r from-primary-600 to-primary-700 h-32"></div>
          <div className="px-6 pb-6 -mt-16 relative">
            <div className="flex items-end justify-between">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-full shadow-lg">
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-4xl font-bold">
                    {currentUser.user_Name.charAt(0)}
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-gray-900">{currentUser.user_Name}</h1>
                  <p className="text-primary-600 font-medium capitalize">{currentUser.user_Access}</p>
                  <div className="flex items-center mt-1">
                    <BadgeCheck className="w-5 h-5 text-primary-500" />
                    <span className="ml-1 text-sm text-gray-600">Verified Account</span>
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="mt-1 text-gray-900">{currentUser.user_Name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CNIC</p>
                <p className="mt-1 text-gray-900">{currentUser.user_CNIC}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Identifier</p>
                <p className="mt-1 text-gray-900">{currentUser.user_Identifier}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-primary-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="mt-1 text-gray-900">{currentUser.user_Email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="mt-1 text-gray-900">{currentUser.user_Contact}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="mt-1 text-gray-900">{currentUser.user_Address}</p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary-600" />
              Account Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">User Role</p>
                <p className="mt-1 text-gray-900 capitalize">{currentUser.user_Access}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Account Status</p>
                <p className="mt-1 text-gray-900">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="mt-1 text-gray-900">{joinDate}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Fingerprint className="w-5 h-5 mr-2 text-primary-600" />
              Additional Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">User ID</p>
                <p className="mt-1 text-gray-900 font-mono text-sm">{currentUser.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="mt-1 text-gray-900">
                  {new Date(currentUser.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Profile Section (conditionally rendered) */}
        {currentUser.doctorProfile && (
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Doctor Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display doctor-specific information here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;