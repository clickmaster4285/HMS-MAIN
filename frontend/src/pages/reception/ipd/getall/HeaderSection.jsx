import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { GiHospital } from 'react-icons/gi';

const HeaderSection = ({
  patientsList,
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
  handleDateRangeChange
}) => {
  return (
    <div className="mb-8">
      <div className="bg-primary-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex flex-col 2xl:flex-row justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <GiHospital className="mr-2" /> Admitted Patients Management
            </h1>
            <p className="text-primary-100 mt-1 flex flex-wrap gap-2">
              <span className="bg-green-500/20 text-green-100 px-2 py-1 rounded-full text-xs flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1"></span>
                {patientsList?.filter(p => p.status === 'Admitted').length || 0} Admitted
              </span>
              <span className="bg-red-500/20 text-red-100 px-2 py-1 rounded-full text-xs flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1"></span>
                {patientsList?.filter(p => p.status === 'Discharged').length || 0} Discharged
              </span>
              <span className="bg-primary-500/20 text-primary-100 px-2 py-1 rounded-full text-xs flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-300 mr-1"></span>
                {patientsList?.length || 0} Total
              </span>
            </p>
          </div>

          <div className="mt-4 flex flex-col lg:flex-row gap-4 w-full md:w-auto">
            <div className="relative grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-primary-700" />
              </div>
              <input
                type="text"
                placeholder="Search patients..."
                className="block text-primary-700 w-full pl-10 pr-3 py-2 border border-primary-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white bg-white/90"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex text-gray-600 gap-2 items-center">
              <div className="flex gap-2">
                <input
                  type="date"
                  className="block w-full pl-3 pr-3 py-2 border border-primary-300 rounded-lg bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={dateRange.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  placeholder="Start date"
                  max={dateRange.end}
                />
                <input
                  type="date"
                  className="block w-full pl-3 pr-3 py-2 border border-primary-300 rounded-lg bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={dateRange.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  placeholder="End date"
                  min={dateRange.start}
                />
              </div>
              <div className="grid items-center grid-cols-2 gap-1">
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    setDateRange({ start: today, end: today });
                  }}
                  className="text-xs text-primary-900 px-2 py-0.5 bg-primary-100 rounded hover:bg-primary-200"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                    setDateRange({
                      start: weekStart.toISOString().split('T')[0],
                      end: new Date().toISOString().split('T')[0]
                    });
                  }}
                  className="text-xs px-2 text-primary-900 py-0.5 bg-primary-100 rounded hover:bg-primary-200"
                >
                  This Week
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    setDateRange({
                      start: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
                      end: new Date().toISOString().split('T')[0]
                    });
                  }}
                  className="col-span-2 text-xs px-2 text-primary-900 py-0.5 bg-primary-100 rounded hover:bg-primary-200"
                >
                  This Month
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;