// PatientInfoSection.js
import React from 'react';
import { FiUser, FiClipboard, FiCalendar, FiAlertCircle } from 'react-icons/fi';

const PatientInfoSection = ({
  patientData,
  selectedTests,
  testDefinitions,
  activeTestIndex,
  setActiveTestIndex,
  localStatuses = {}, // 👈 optimistic statuses: { [testId]: 'completed' | 'processing' | ... }
}) => {
  const getStatusColor = (status) => {
    switch ((status || 'pending').toLowerCase()) {
      case 'registered':
        return 'bg-primary-100 text-primary-800';
      case 'in_progress':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'verified':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toLabel = (s) => (s || 'pending').replace('_', ' ').toUpperCase();

  const activeTest = selectedTests?.[activeTestIndex];

  const activeEffectiveStatus =
    (activeTest &&
      (localStatuses[activeTest.test] ??
        activeTest?.testDetails?.reportStatus)) ||
    'pending';

  return (
    <div className="p-8 bg-primary-50">
      <div className="flex items-center mb-6">
        <FiUser className="w-6 h-6 text-primary-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-800">
          Patient & Test Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Patient Details Card */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <FiUser className="w-4 h-4 mr-2 text-primary-600" />
            Patient Details
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Name</span>
              <p className="font-medium text-gray-800">
                {patientData.patientName}
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <span className="text-sm text-gray-500">Gender</span>
                <p className="font-medium text-gray-800">
                  {patientData.gender}
                </p>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-500">Age</span>
                <p className="font-medium text-gray-800">{patientData.age}</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500">CNIC</span>
              <p className="font-medium text-gray-800">{patientData.cnic}</p>
            </div>
          </div>
        </div>

        {/* Test Navigation Card */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <FiClipboard className="w-4 h-4 mr-2 text-green-600" />
            Test Selection
          </h3>
          <div className="space-y-3 overflow-y-auto">
            {selectedTests.map((test, index) => {
              const testDefinition = testDefinitions.find(
                (td) => td._id === test.test
              );

              // 👇 Prefer optimistic local status; fall back to server status; else 'pending'
              const effectiveStatus =
                localStatuses[test.test] ??
                test.testDetails?.reportStatus ??
                'pending';

              return (
                <button
                  key={test.test}
                  onClick={() => setActiveTestIndex(index)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    activeTestIndex === index
                      ? 'bg-primary-100 border border-primary-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">
                      {test.testDetails.testName}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        effectiveStatus
                      )}`}
                    >
                      {toLabel(effectiveStatus)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {testDefinition?.requiresFasting && (
                      <span className="text-orange-500 flex items-center">
                        <FiAlertCircle className="mr-1" /> Fasting Required
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status & Timing Card */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <FiCalendar className="w-4 h-4 mr-2 text-purple-600" />
            Status & Timing
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Test Date</span>
              <p className="font-medium text-gray-800">
                {new Date(patientData.testDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Current Status</span>
              <div className="flex items-center mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    activeEffectiveStatus
                  )}`}
                >
                  {toLabel(activeEffectiveStatus)}
                </span>
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">Delivery Time</span>
              <p className="font-medium text-gray-800">
                {testDefinitions.find(
                  (td) => td._id === selectedTests[activeTestIndex]?.test
                )?.reportDeliveryTime || 'N/A'}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Payment Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  patientData.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {patientData.paymentStatus?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoSection;
