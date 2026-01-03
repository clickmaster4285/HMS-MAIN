// components/ServiceCategoriesTable.jsx
import React from 'react';
import { Tag } from 'lucide-react';

const ServiceCategoriesTable = ({ title, data, formatCurrency }) => {
   if (!data || data.length === 0) {
      return (
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <p className="text-slate-500">No service category data available</p>
         </div>
      );
   }

   // Calculate totals
   const totalPatients = data.reduce((sum, cat) => sum + (cat.patientCount || 0), 0);
   const totalRevenue = data.reduce((sum, cat) => sum + (cat.revenue || 0), 0);
   const totalDiscount = data.reduce((sum, cat) => sum + (cat.discount || 0), 0);
   const totalFees = data.reduce((sum, cat) => sum + (cat.totalFees || cat.revenue || 0), 0);

   return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
               <div className="text-sm text-slate-500">
                  Total Patients: {totalPatients} | Revenue: {formatCurrency(totalRevenue)}
               </div>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
               <thead className="bg-slate-50">
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Service Category
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Patients
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Revenue
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Discount
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Percentage
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 bg-white">
                  {data.map((category, index) => {
                     const percentage = totalPatients > 0 ? ((category.patientCount / totalPatients) * 100).toFixed(1) : 0;
                     const discountRate = category.totalFees > 0 ? ((category.discount || 0) / category.totalFees * 100).toFixed(1) : 0;

                     return (
                        <tr key={index} className="hover:bg-slate-50">
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-slate-900 capitalize">
                                 {category.category}
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                                 {category.patientCount}
                              </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                 <div className="font-semibold text-slate-900">
                                    {formatCurrency(category.revenue)}
                                 </div>
                                 {category.totalFees > category.revenue && (
                                    <div className="text-xs text-slate-500">
                                       Fees: {formatCurrency(category.totalFees)}
                                    </div>
                                 )}
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              {(category.discount || 0) > 0 ? (
                                 <div className="flex items-center space-x-1">
                                    <Tag className="w-3 h-3 text-amber-500" />
                                    <span className="text-sm text-amber-600">
                                       {formatCurrency(category.discount)}
                                    </span>
                                    {discountRate > 0 && (
                                       <span className="text-xs text-slate-500">
                                          ({discountRate}%)
                                       </span>
                                    )}
                                 </div>
                              ) : (
                                 <span className="text-sm text-slate-400">-</span>
                              )}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                 <span className="text-sm text-slate-500">{percentage}%</span>
                                 <div className="ml-2 w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                       className="h-full bg-sky-500 rounded-full"
                                       style={{ width: `${percentage}%` }}
                                    ></div>
                                 </div>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
               {/* Footer with totals */}
               <tfoot className="bg-slate-50">
                  <tr>
                     <td className="px-6 py-3 text-sm font-medium text-slate-900">TOTAL</td>
                     <td className="px-6 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                           {totalPatients}
                        </span>
                     </td>
                     <td className="px-6 py-3 text-sm font-semibold text-slate-900">
                        {formatCurrency(totalRevenue)}
                     </td>
                     <td className="px-6 py-3">
                        {totalDiscount > 0 ? (
                           <div className="flex items-center space-x-1">
                              <Tag className="w-3 h-3 text-amber-500" />
                              <span className="text-sm font-medium text-amber-600">
                                 {formatCurrency(totalDiscount)}
                              </span>
                           </div>
                        ) : (
                           <span className="text-sm text-slate-400">-</span>
                        )}
                     </td>
                     <td className="px-6 py-3 text-sm font-medium text-slate-900">
                        100%
                     </td>
                  </tr>
               </tfoot>
            </table>
         </div>
      </div>
   );
};

export default ServiceCategoriesTable;