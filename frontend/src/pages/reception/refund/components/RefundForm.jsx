// components/RefundForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRefund } from '../../../../features/refund/refundopdSlice';
import { FiDollarSign, FiFileText, FiAlertCircle, FiLoader } from 'react-icons/fi';

const RefundForm = ({ patient, visit, onCancel, onSuccess }) => {
   const dispatch = useDispatch();
   const { loading, error } = useSelector((state) => state.refund);

   const [formData, setFormData] = useState({
      refundAmount: Math.max(0, visit.amountPaid || 0),
      refundReason: '',
      refundDescription: '',
      originalPaymentMethod: visit.paymentMethod || 'cash',
      refundMethod: 'cash',
      notes: ''
   });

   const [localError, setLocalError] = useState(null);

   const refundReasons = [
      { value: 'service_not_rendered', label: 'Service Not Rendered' },
      { value: 'overpayment', label: 'Overpayment' },
      { value: 'cancellation', label: 'Cancellation' },
      { value: 'dissatisfaction', label: 'Patient Dissatisfaction' },
      { value: 'duplicate_payment', label: 'Duplicate Payment' },
      { value: 'other', label: 'Other' }
   ];

   const paymentMethods = [
      { value: 'cash', label: 'Cash' },
      { value: 'card', label: 'Card' },
      { value: 'bank_transfer', label: 'Bank Transfer' },
      { value: 'online', label: 'Online' },
      { value: 'other', label: 'Other' }
   ];

   const refundMethods = [
      { value: 'cash', label: 'Cash' },
      { value: 'bank_transfer', label: 'Bank Transfer' },
      { value: 'credit_note', label: 'Credit Note' },
      { value: 'adjustment', label: 'Adjustment' },
      { value: 'other', label: 'Other' }
   ];

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLocalError(null);

      // Validate form
      if (!formData.refundReason) {
         setLocalError('Please select a refund reason');
         return;
      }

      if (!formData.refundAmount || formData.refundAmount <= 0) {
         setLocalError('Please enter a valid refund amount');
         return;
      }

      if (formData.refundAmount > (visit.amountPaid || 0)) {
         setLocalError(`Refund amount cannot exceed paid amount of ${formatCurrency(visit.amountPaid)}`);
         return;
      }

      const refundData = {
         patientMRNo: patient.patient_MRNo,
         visitId: visit._id,
         ...formData,
         refundAmount: parseFloat(formData.refundAmount)
      };

      try {
         const result = await dispatch(createRefund(refundData)).unwrap();
         if (result.success) {
            onSuccess(result.data);
         } else {
            setLocalError(result.message || 'Failed to create refund');
         }
      } catch (error) {
         console.error('Failed to create refund:', error);
         setLocalError(error.message || 'An error occurred while processing the refund');
      }
   };

   const handleInputChange = (field, value) => {
      setFormData(prev => ({
         ...prev,
         [field]: value
      }));
      // Clear error when user starts typing
      if (localError) {
         setLocalError(null);
      }
   };

   const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PK', {
         style: 'currency',
         currency: 'PKR'
      }).format(amount || 0);
   };

   return (
      <div className="bg-white rounded-lg shadow-md p-6">
         <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Process Refund</h2>
            <div className="text-sm text-gray-600 mt-1">
               For {patient.patient_Name} (MR: {patient.patient_MRNo}) -
               Visit on {new Date(visit.visitDate).toLocaleDateString()}
            </div>
         </div>

         {/* Visit Summary */}
         <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Visit Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
               <div>
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium ml-2">{formatCurrency(visit.amountPaid)}</span>
               </div>
               <div>
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium ml-2 capitalize">{visit.paymentMethod}</span>
               </div>
               <div>
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`font-medium ml-2 capitalize ${visit.amountStatus === 'paid' ? 'text-green-600' :
                        visit.amountStatus === 'partial' ? 'text-yellow-600' : 'text-red-600'
                     }`}>
                     {visit.amountStatus}
                  </span>
               </div>
               {visit.doctor?.user?.user_Name && (
                  <div>
                     <span className="text-gray-600">Doctor:</span>
                     <span className="font-medium ml-2">Dr. {visit.doctor.user.user_Name}</span>
                  </div>
               )}
            </div>
         </div>

         {/* Error Messages */}
         {(error || localError) && (
            <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center">
               <FiAlertCircle className="mr-2 shrink-0" />
               <span>{error || localError}</span>
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-4">
            {/* Refund Amount */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Amount (Max: {formatCurrency(visit.amountPaid)})
               </label>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                     type="number"
                     value={formData.refundAmount}
                     onChange={(e) => handleInputChange('refundAmount',
                        Math.min(parseFloat(e.target.value) || 0, visit.amountPaid || 0)
                     )}
                     min="0"
                     max={visit.amountPaid || 0}
                     step="0.01"
                     className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                     required
                  />
               </div>
               <div className="text-sm text-gray-500 mt-1">
                  Maximum refundable amount: {formatCurrency(visit.amountPaid)}
               </div>
            </div>

            {/* Refund Reason */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Reason *
               </label>
               <select
                  value={formData.refundReason}
                  onChange={(e) => handleInputChange('refundReason', e.target.value)}
                  className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
               >
                  <option value="">Select reason</option>
                  {refundReasons.map(reason => (
                     <option key={reason.value} value={reason.value}>
                        {reason.label}
                     </option>
                  ))}
               </select>
            </div>

            {/* Description */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
               </label>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                     <FiFileText className="text-gray-400" />
                  </div>
                  <textarea
                     value={formData.refundDescription}
                     onChange={(e) => handleInputChange('refundDescription', e.target.value)}
                     rows={3}
                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                     placeholder="Provide details about the refund..."
                  />
               </div>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Original Payment Method
                  </label>
                  <select
                     value={formData.originalPaymentMethod}
                     onChange={(e) => handleInputChange('originalPaymentMethod', e.target.value)}
                     className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                     required
                  >
                     {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>
                           {method.label}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Refund Method *
                  </label>
                  <select
                     value={formData.refundMethod}
                     onChange={(e) => handleInputChange('refundMethod', e.target.value)}
                     className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                     required
                  >
                     {refundMethods.map(method => (
                        <option key={method.value} value={method.value}>
                           {method.label}
                        </option>
                     ))}
                  </select>
               </div>
            </div>

            {/* Notes */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
               </label>
               <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={2}
                  className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Any additional information..."
               />
            </div>

            <div className="flex justify-end gap-3 pt-4">
               <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={loading}
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
               >
                  {loading ? (
                     <>
                        <FiLoader className="animate-spin mr-2" />
                        Processing...
                     </>
                  ) : (
                     'Process Refund'
                  )}
               </button>
            </div>
         </form>
      </div>
   );
};

export default RefundForm;