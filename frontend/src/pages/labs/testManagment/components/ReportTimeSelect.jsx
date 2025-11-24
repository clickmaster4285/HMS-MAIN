// components/ReportTimeSelect.js
import React from 'react';
import { REPORT_TIME_OPTIONS } from '../../../../hooks/useTestHook';

export const ReportTimeSelect = ({ 
  selectedReportTime, 
  customReportTime, 
  error, 
  onChange, 
  onCustomChange 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Report Delivery Time *
      </label>
      <select
        className={`block w-full border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md p-2`}
        value={selectedReportTime}
        onChange={onChange}
      >
        <option value="">Select time</option>
        {REPORT_TIME_OPTIONS.map((group, idx) => (
          <optgroup key={idx} label={group.label}>
            {group.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {selectedReportTime === 'Other' && (
        <input
          type="text"
          className="block w-full border border-gray-300 rounded-md p-2 mt-2"
          value={customReportTime}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Enter custom time"
        />
      )}
      {error && (
        <span className="text-red-500 text-sm">{error}</span>
      )}
    </div>
  );
};