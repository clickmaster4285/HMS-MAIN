import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaFileMedical, FaMoneyBillWave, FaClock, FaCheckCircle } from "react-icons/fa";

const PatientDetailModal = ({ patient, loading, onClose }) => {
  const [currentVisitPage, setCurrentVisitPage] = useState(1);
  const [visitsPerPage] = useState(5); // Show 5 visits per page
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [isLoadingVisits, setIsLoadingVisits] = useState(false);

  // Reset pagination when patient changes
  useEffect(() => {
    setCurrentVisitPage(1);
    setExpandedVisit(null);
  }, [patient]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) return null;

  const visits = patient.visits || [];
  const totalVisits = visits.length;
  // Calculate pagination
  const indexOfLastVisit = currentVisitPage * visitsPerPage;
  const indexOfFirstVisit = indexOfLastVisit - visitsPerPage;
  const currentVisits = visits.slice(indexOfFirstVisit, indexOfLastVisit);
  const totalPages = Math.ceil(totalVisits / visitsPerPage);

  const toggleVisitExpand = (visitIndex) => {
    setExpandedVisit(expandedVisit === visitIndex ? null : visitIndex);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `Rs. ${amount?.toLocaleString() || '0'}`;
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-lg z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 rounded-t-lg sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Patient Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-thin focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className="flex items-center mt-2 gap-2 flex-wrap">
            <span className="bg-white text-primary-600 px-2 py-1 rounded-md text-sm font-bold">
              MR#: {patient.patient_MRNo || 'N/A'}
            </span>
            <span className="bg-white text-primary-600 px-2 py-1 rounded-md text-sm font-bold">
              Total Visits: {totalVisits}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Patient Basic Info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem label="Full Name" value={patient.patient_Name} />
              <DetailItem label="Gender" value={patient.patient_Gender} />
              <DetailItem label="Age" value={patient.patient_Age} />
              <DetailItem label="Date of Birth" value={patient.patient_DateOfBirth} />
              <DetailItem label="CNIC" value={patient.patient_CNIC} />
              <DetailItem label="Contact" value={patient.patient_ContactNo} />
            </div>
          </div>

          {/* Guardian Info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Guardian Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem label="Name" value={patient.patient_Guardian?.guardian_Name} />
              <DetailItem label="Relation" value={patient.patient_Guardian?.guardian_Relation} />
              <DetailItem label="Contact" value={patient.patient_Guardian?.guardian_Contact} />
            </div>
          </div>

          {/* Address */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Address
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700">{patient.patient_Address || 'Not provided'}</p>
            </div>
          </div>

          {/* Visit History */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
              <FaFileMedical className="w-5 h-5 mr-2 text-primary-500" />
              Visit History ({totalVisits} visits)
            </h3>

            {isLoadingVisits ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : totalVisits === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaFileMedical className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No visit history found</p>
              </div>
            ) : (
              <>
                {/* Visit List */}
                <div className="space-y-3">
                  {currentVisits.map((visit, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleVisitExpand(index)}
                        className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <FaFileMedical className="text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              Visit #{totalVisits - (indexOfFirstVisit + index)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(visit.visitDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(visit.amountStatus)}`}>
                            {visit.amountStatus?.toUpperCase() || 'PENDING'}
                          </span>
                          <span className="text-sm text-gray-600">
                            {formatCurrency(visit.totalFee)}
                          </span>
                          <FaChevronRight
                            className={`transform transition-transform ${expandedVisit === index ? 'rotate-90' : ''}`}
                          />
                        </div>
                      </button>

                      {/* Expanded Visit Details */}
                      {expandedVisit === index && (
                        <div className="p-4 bg-white border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailItem label="Doctor" value={visit.doctor?.user?.user_Name} />
                            <DetailItem label="Department" value={visit.doctor?.doctor_Department} />
                            <DetailItem label="Purpose" value={visit.purpose} />
                            <DetailItem label="Disease" value={visit.disease || 'Not specified'} />
                            <DetailItem label="Token #" value={visit.token} />
                            <DetailItem label="Referred By" value={visit.referredBy || 'Not referred'} />
                          </div>

                          {/* Payment Details */}
                          <div className="mt-4 pt-4 border-t">
                            <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                              <FaMoneyBillWave className="mr-2 text-green-500" />
                              Payment Details
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <DetailItem label="Consultation Fee" value={formatCurrency(visit.doctorFee)} />
                              <DetailItem label="Discount" value={formatCurrency(visit.discount)} />
                              <DetailItem label="Total Fee" value={formatCurrency(visit.totalFee)} />
                              <DetailItem label="Amount Paid" value={formatCurrency(visit.amountPaid)} />
                              <DetailItem label="Amount Due" value={formatCurrency(visit.amountDue)} />
                              <DetailItem label="Payment Method" value={visit.paymentMethod?.toUpperCase()} />
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center space-x-4">
                              {visit.verbalConsentObtained && (
                                <span className="flex items-center text-sm text-green-600">
                                  <FaCheckCircle className="mr-1" /> Verbal Consent Obtained
                                </span>
                              )}
                              {visit.paymentDate && (
                                <span className="flex items-center text-sm text-gray-600">
                                  <FaClock className="mr-1" /> Paid on: {formatDate(visit.paymentDate)}
                                </span>
                              )}
                            </div>
                            {visit.notes && (
                              <div className="mt-3">
                                <p className="text-sm text-gray-600"><strong>Notes:</strong> {visit.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                      onClick={() => setCurrentVisitPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentVisitPage === 1}
                      className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <FaChevronLeft />
                    </button>

                    <span className="text-sm text-gray-600">
                      Page {currentVisitPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentVisitPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentVisitPage === totalPages}
                      className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable component for detail items
const DetailItem = ({ label, value }) => (
  <div className="bg-gray-50 p-3 rounded-md">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-gray-800 font-medium mt-1">{value || 'N/A'}</p>
  </div>
);

export default PatientDetailModal;