// components/DateRangeFilter.jsx
import React from 'react';
import { Calendar, Filter, RefreshCw, ChevronDown } from 'lucide-react';

const DateRangeFilter = ({ startDate, endDate, onDateChange, onReset }) => {
   const quickFilters = [
      { label: 'Today', days: 0, color: 'blue' },
      { label: 'Yesterday', days: -1, color: 'slate' },
      { label: 'Last 7 Days', days: -7, color: 'emerald' },
      { label: 'Last 30 Days', days: -30, color: 'amber' },
      {
         label: 'This Month',
         getDate: () => {
            const now = new Date();
            return {
               start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
               end: now.toISOString().split('T')[0]
            };
         },
         color: 'violet'
      },
      {
         label: 'Last Month',
         getDate: () => {
            const now = new Date();
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return {
               start: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString().split('T')[0],
               end: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString().split('T')[0]
            };
         },
         color: 'indigo'
      }
   ];

   const handleQuickFilter = (filter) => {
      if (filter.getDate) {
         const dates = filter.getDate();
         onDateChange(dates.start, dates.end);
      } else {
         const end = new Date();
         const start = new Date();
         start.setDate(end.getDate() + filter.days);
         onDateChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
      }
   };

   const getColorClass = (color) => {
      const colors = {
         blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200',
         emerald: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200',
         amber: 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200',
         violet: 'bg-violet-100 text-violet-700 hover:bg-violet-200 border-violet-200',
         indigo: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200',
         slate: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
      };
      return colors[color] || colors.slate;
   };

   return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
         <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div className="flex items-center space-x-3 mb-4 lg:mb-0">
               <div className="p-2 bg-blue-50 rounded-lg">
                  <Filter className="w-5 h-5 text-blue-600" />
               </div>
               <div>
                  <h2 className="text-lg font-semibold text-slate-800">Date Range Filter</h2>
                  <p className="text-sm text-slate-500">Filter dashboard data by date range</p>
               </div>
            </div>
            <button
               onClick={onReset}
               className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            >
               <RefreshCw className="w-4 h-4" />
               <span>Reset Filters</span>
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
               <label className="flex items-center text-sm font-medium text-slate-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Start Date
               </label>
               <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onDateChange(e.target.value, endDate)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 bg-white transition-colors"
               />
            </div>

            <div className="space-y-2">
               <label className="flex items-center text-sm font-medium text-slate-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  End Date
               </label>
               <input
                  type="date"
                  value={endDate}
                  onChange={(e) => onDateChange(startDate, e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 bg-white transition-colors"
               />
            </div>

            <div className="space-y-2">
               <label className="flex items-center text-sm font-medium text-slate-700">
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Quick Filters
               </label>
               <select
                  onChange={(e) => {
                     const filter = quickFilters.find(f => f.label === e.target.value);
                     if (filter) handleQuickFilter(filter);
                  }}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 bg-white appearance-none"
               >
                  <option value="">Select Quick Filter</option>
                  {quickFilters.map((filter) => (
                     <option key={filter.label} value={filter.label}>
                        {filter.label}
                     </option>
                  ))}
               </select>
            </div>
         </div>

         <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Quick Select</p>
            <div className="flex flex-wrap gap-2">
               {quickFilters.map((filter) => (
                  <button
                     key={filter.label}
                     onClick={() => handleQuickFilter(filter)}
                     className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5 border ${getColorClass(filter.color)}`}
                  >
                     {filter.label}
                  </button>
               ))}
            </div>
         </div>
      </div>
   );
};

export default DateRangeFilter;