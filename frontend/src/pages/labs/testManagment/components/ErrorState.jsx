// components/ErrorState.js
import React from 'react';

export const ErrorState = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
    <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Test</h3>
    <p className="text-red-600">{error}</p>
  </div>
);