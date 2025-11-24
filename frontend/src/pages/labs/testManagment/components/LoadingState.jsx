// components/LoadingState.js
import React from 'react';

export const LoadingState = ({ message = "Loading test details..." }) => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
      <p className="text-slate-600 text-lg">{message}</p>
    </div>
  </div>
);