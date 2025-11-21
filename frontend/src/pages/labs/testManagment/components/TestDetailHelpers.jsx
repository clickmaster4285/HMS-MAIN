// components/TestDetailHelpers.js
import React from 'react';

// Helper functions for test details
export const formatRangeValue = (value) => {
  if (value === undefined || value === null) return 'N/A';
  if (typeof value === 'number') {
    return value % 1 === 0 ? value.toString() : value.toFixed(2);
  }
  return value.toString();
};

export const convertRangesToObject = (ranges) => {
  if (!ranges) return {};
  return ranges instanceof Map ? Object.fromEntries(ranges) : ranges;
};

export const getReferenceRangeText = (range) => {
  if (!range) return 'N/A';
  const ranges = convertRangesToObject(range);
  return Object.entries(ranges)
    .map(([label, values]) => {
      const rangeText = `${formatRangeValue(values.min)} - ${formatRangeValue(values.max)}`;
      return `${label}: ${rangeText} ${values.unit || ''}`.trim();
    })
    .join(' | ');
};

export const getInputTypeDisplay = (field) => {
  const inputType = field.inputType || 'text';
  const types = {
    text: 'Text',
    number: 'Number',
    dropdown: 'Dropdown'
  };
  return types[inputType] || inputType;
};