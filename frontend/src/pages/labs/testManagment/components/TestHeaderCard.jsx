// components/TestHeaderCard.js
import React from 'react';

export const TestHeaderCard = ({ test }) => {
  if (!test) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
      <div className="bg-linear-to-r from-primary-600 to-teal-600 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{test.testName}</h2>
            <div className="flex items-center space-x-4 text-primary-100">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                Code: {test.testCode}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                Rs {test.testPrice}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                test.requiresFasting 
                  ? 'bg-orange-500/20 text-orange-100' 
                  : 'bg-green-500/20 text-green-100'
              }`}>
                {test.requiresFasting ? 'Fasting Required' : 'No Fasting'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};