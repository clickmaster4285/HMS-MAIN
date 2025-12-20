// components/VisitSelection.jsx
import React, { useState, useEffect } from 'react';
import { FiCalendar, FiDollarSign, FiUser, FiCheck, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

const VisitSelection = ({ patientData, visits, onVisitSelect, onCancel }) => {
   const [selectedVisitId, setSelectedVisitId] = useState(null);

   const handleVisitSelect = (visitId) => {
      setSelectedVisitId(visitId);
   };

   const handleConfirm = () => {
      if (selectedVisitId) {
         const selectedVisit = visits.find(v => v._id === selectedVisitId);
         onVisitSelect(selectedVisit);
      }
   };

   const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PK', {
         style: 'currency',
         currency: 'PKR'
      }).format(amount || 0);
   };

   // Show loading state
   if (!patientData || !visits) {
      return (
         <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center py-12">
               <FiRefreshCw className="animate-spin h-8 w-8 text-primary-600 mr-3" />
               <span>Loading patient data...</span>
            </div>
         </div>
      );
   }

   // Show empty state if no visits
   if (visits.length === 0) {
      return (
         <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
               <FiAlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
               <h3 className="text-lg font-semibold text-gray-800 mb-2">No Visits Found</h3>
               <p className="text-gray-600">This patient has no visit records.</p>
               <button
                  onClick={onCancel}
                  className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
               >
                  Back to Search
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="bg-white rounded-lg shadow-md p-6">
         {/* DEBUG INFO - Remove in production */}
         {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="text-sm text-yellow-700">
               <strong>Debug Info:</strong> {visits.length} visit(s) found
            </div>
         </div> */}

         {/* Patient Header */}
         <div className="flex items-center justify-between mb-6">
            <div>
               <h2 className="text-xl font-semibold text-gray-800">
                  {patientData.patient_Name || 'Unknown Patient'}
               </h2>
               <p className="text-gray-600">MR: {patientData.patient_MRNo || 'N/A'}</p>
            </div>
            <div className="text-right">
               <p className="text-sm text-gray-600">Total Visits: {patientData.totalVisits || 0}</p>
               {patientData.lastVisit && (
                  <p className="text-xs text-gray-500">
                     Last visit: {new Date(patientData.lastVisit).toLocaleDateString()}
                  </p>
               )}
            </div>
         </div>

         {/* Visits List */}
         <div className="grid gap-4 mb-6">
            {visits.map((visit, index) => {
               return (
                  <div
                     key={visit._id || index}
                     className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedVisitId === visit._id
                           ? 'border-primary-500 bg-primary-50'
                           : visit.canRefund
                              ? 'border-gray-200 hover:border-primary-300'
                              : 'border-gray-100 bg-gray-50 opacity-75'
                        }`}
                     onClick={() => visit.canRefund && handleVisitSelect(visit._id)}
                  >
                     <div className="flex items-center justify-between">
                        <div className="flex-1">
                           <div className="flex items-center gap-3 mb-2">
                              <FiCalendar className="text-gray-400" />
                              <span className="font-medium">
                                 {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : 'Date not available'}
                              </span>
                              {visit.token && (
                                 <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                    Token: {visit.token}
                                 </span>
                              )}
                           </div>

                           {visit.doctor?.user?.user_Name && (
                              <div className="flex items-center gap-3 mb-2 text-sm text-gray-600">
                                 <FiUser className="text-gray-400" />
                                 <span>Dr. {visit.doctor.user.user_Name}</span>
                                 {visit.doctor.doctor_Department && (
                                    <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded text-xs">
                                       {visit.doctor.doctor_Department}
                                    </span>
                                 )}
                              </div>
                           )}

                           {visit.purpose && (
                              <div className="text-sm text-gray-600 mb-2">
                                 Purpose: {visit.purpose}
                              </div>
                           )}

                           <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                 <FiDollarSign className="text-gray-400" />
                                 <span>Paid: {formatCurrency(visit.amountPaid)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                 <span>Refunded: {formatCurrency(visit.totalRefunded)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                 <span className="font-semibold">
                                    Available: {formatCurrency(visit.refundable)}
                                 </span>
                              </div>
                              <div className="flex items-center gap-1">
                                 <span className={`px-2 py-1 rounded text-xs ${visit.isFullyRefunded ? 'bg-green-100 text-green-800' :
                                       visit.refundable > 0 ? 'bg-sky-100 text-sky-800' :
                                          'bg-gray-100 text-gray-800'
                                    }`}>
                                    {visit.isFullyRefunded ? 'FULLY REFUNDED' :
                                       visit.refundable > 0 ? 'REFUND AVAILABLE' : 'NO REFUND'}
                                 </span>
                              </div>
                           </div>

                           {visit.refunds && visit.refunds.length > 0 && (
                              <div className="mt-2 text-xs text-gray-500">
                                 Previous refunds: {visit.refunds.length}
                              </div>
                           )}
                        </div>

                        <div className="ml-4">
                           {selectedVisitId === visit._id ? (
                              <FiCheck className="h-6 w-6 text-primary-600" />
                           ) : (
                              <div className={`h-6 w-6 rounded-full border-2 ${visit.canRefund ? 'border-gray-300' : 'border-gray-200'
                                 }`}></div>
                           )}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

         <div className="flex justify-end gap-3">
            <button
               onClick={onCancel}
               className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
               Cancel
            </button>
            <button
               onClick={handleConfirm}
               disabled={!selectedVisitId}
               className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               Select Visit
            </button>
         </div>
      </div>
   );
};

export default VisitSelection;