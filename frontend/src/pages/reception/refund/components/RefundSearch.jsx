// components/RefundSearch.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientWithRefundHistory } from '../../../../features/patient/patientSlice';
import { FiSearch, FiUser, FiPhone, FiCreditCard, FiDollarSign } from 'react-icons/fi';

const RefundSearch = ({ onPatientSelect }) => {
   const dispatch = useDispatch();
   const { loading, error } = useSelector((state) => state.patients);
   const [searchTerm, setSearchTerm] = useState('');

   // components/RefundSearch.jsx
   const handleSearch = async (e) => {
      e.preventDefault();
      if (searchTerm.trim()) {
         try {
            const result = await dispatch(getPatientWithRefundHistory(searchTerm)).unwrap();

            if (result.success) {

               onPatientSelect(result.data);
            }
         } catch (error) {
            console.error('Search failed:', error);
         }
      }
   };

   return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
         <h2 className="text-xl font-semibold mb-4 text-gray-800">Search Patient for Refund</h2>

         <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
               <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <FiSearch className="text-gray-400" />
                  </div>
                  <input
                     type="text"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Enter Patient MR Number"
                     className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                     disabled={loading}
                  />
               </div>

               <button
                  type="submit"
                  disabled={loading || !searchTerm.trim()}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {loading ? 'Searching...' : 'Search'}
               </button>
            </div>
         </form>

         {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
               {error}
            </div>
         )}
      </div>
   );
};

export default RefundSearch;