// components/InfoCard.js
import React from 'react';

export const InfoCard = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 ${className}`}>
    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
      {icon}
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export const InfoItem = ({ label, value, children }) => (
  <div>
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <div className="text-slate-800 mt-1">
      {children || value || 'Not specified'}
    </div>
  </div>
);