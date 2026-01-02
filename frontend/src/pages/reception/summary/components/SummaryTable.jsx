// components/SummaryTable.jsx
import React from 'react';
import { ArrowUpDown, Download, Filter, Search } from 'lucide-react';

const SummaryTable = ({
   title,
   columns,
   data,
   emptyMessage = "No data available",
   searchable = false,
   downloadable = false,
   sortable = false
}) => {
   const [searchTerm, setSearchTerm] = React.useState('');
   const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

   if (!data || data.length === 0) {
      return (
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Filter className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">{emptyMessage}</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters or search criteria</p>
         </div>
      );
   }

   // Filter data based on search term
   const filteredData = searchTerm
      ? data.filter(row =>
         columns.some(column => {
            const value = row[column.key];
            return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
         })
      )
      : data;

   // Sort data
   const sortedData = [...filteredData];
   if (sortConfig.key) {
      sortedData.sort((a, b) => {
         if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
         }
         if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
         }
         return 0;
      });
   }

   const handleSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
         direction = 'desc';
      }
      setSortConfig({ key, direction });
   };

   const handleDownload = () => {
      // Implement download functionality
      console.log('Downloading data...');
   };

   return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         {/* Table Header */}
         <div className="px-6 py-4 bg-linear-to-r from-slate-50 to-white border-b border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                  <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                  <p className="text-sm text-slate-500 mt-1">
                     Showing {sortedData.length} of {data.length} records
                  </p>
               </div>

               <div className="flex items-center space-x-3">
                  {searchable && (
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                           type="text"
                           placeholder="Search..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                        />
                     </div>
                  )}

                  {downloadable && (
                     <button
                        onClick={handleDownload}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg border border-slate-300 transition-colors"
                     >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                     </button>
                  )}
               </div>
            </div>
         </div>

         {/* Table Content */}
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
               <thead className="bg-slate-50">
                  <tr>
                     {columns.map((column) => (
                        <th
                           key={column.key}
                           scope="col"
                           className={`px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider ${sortable ? 'cursor-pointer hover:bg-slate-100' : ''
                              }`}
                           onClick={sortable ? () => handleSort(column.key) : undefined}
                        >
                           <div className="flex items-center space-x-1">
                              <span>{column.title}</span>
                              {sortable && (
                                 <ArrowUpDown className="w-3 h-3 text-slate-400" />
                              )}
                           </div>
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 bg-white">
                  {sortedData.map((row, rowIndex) => (
                     <tr
                        key={rowIndex}
                        className="hover:bg-slate-50 transition-colors duration-150"
                     >
                        {columns.map((column) => (
                           <td
                              key={column.key}
                              className={`px-6 py-4 whitespace-nowrap ${column.cellClassName || ''}`}
                           >
                              {column.render ? column.render(row[column.key], row) : (
                                 <div className="text-sm text-slate-700">
                                    {row[column.key]}
                                 </div>
                              )}
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Table Footer */}
         <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm text-slate-500">
               <div>
                  Page 1 of 1
               </div>
               <div className="flex items-center space-x-4">
                  <button className="hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                     Previous
                  </button>
                  <button className="hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                     Next
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default SummaryTable;