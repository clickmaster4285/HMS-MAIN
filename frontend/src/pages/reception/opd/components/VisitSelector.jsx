import React from 'react';
import { FaFileMedical, FaMoneyBillWave, FaCalendar, FaUserMd } from 'react-icons/fa';

const VisitSelector = ({ visits, onSelectVisit, onClose, patientName }) => {
   const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric'
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
      
      <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-lg z-50 p-4">
         <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-primary-600 text-white p-4 rounded-t-lg sticky top-0 z-10">
               <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Select Visit to Edit</h2>
                  <button
                     onClick={onClose}
                     className="text-white hover:text-gray-200 text-2xl font-thin focus:outline-none"
                     aria-label="Close"
                  >
                     &times;
                  </button>
               </div>
               <p className="text-primary-100 mt-1">Patient: {patientName}</p>
               <p className="text-primary-100">Total Visits: {visits.length}</p>
            </div>

            {/* Visit List */}
            <div className="p-4">
               {visits.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                     <FaFileMedical className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                     <p>No visits found</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-2 gap-3">
                     {visits.map((visit, index) => (
                        <div
                           key={visit._id}
                           className="border border-gray-400 rounded-md p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                           onClick={() => onSelectVisit(visit._id)}
                        >
                           <div className="flex justify-between items-start">
                              <div className="flex items-start space-x-3">
                                 <div className="w-10 h-10 border-r-4 border-primary-700 bg-primary-100 rounded-full flex items-center justify-center mt-1">
                                    <FaFileMedical className=" text-primary-600" />
                                 </div>
                                 <div>
                                    <h4 className="font-semibold text-gray-800">
                                       Visit #{visits.length - index}
                                    </h4>
                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                       <FaCalendar className="mr-1" />
                                       {formatDate(visit.visitDate)}
                                    </div>
                                    {visit.doctor?.user && (
                                       <div className="flex items-center text-sm text-gray-600 mt-1">
                                          <FaUserMd className="mr-1" />
                                          Dr. {visit.doctor.user.user_Name} 
                                       </div>
                                    )}
                                    {visit.purpose && (
                                       <p className="text-sm text-gray-600 mt-1">{visit.purpose}</p>
                                    )}
                                 </div>
                              </div>
                              <div className="text-right">
                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(visit.amountStatus)}`}>
                                    {visit.amountStatus?.toUpperCase() || 'PENDING'}
                                 </span>
                                 <p className="text-sm font-semibold text-gray-800 mt-1">
                                    {formatCurrency(visit.totalFee)}
                                 </p>
                                 <p className="text-xs text-gray-500">
                                    Paid: {formatCurrency(visit.amountPaid)}
                                 </p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 rounded-b-lg border-t border-primary-600 flex justify-end">
               <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
               >
                  Cancel
               </button>
            </div>
         </div>
      </div>
   );
};

export default VisitSelector;