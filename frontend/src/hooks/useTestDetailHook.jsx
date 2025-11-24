// hooks/useTestDetailHook.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  getTestById, 
  selectSelectedTest, 
  selectGetByIdLoading, 
  selectGetByIdError 
} from '../features/testManagment/testSlice';

// Helper functions
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

export const formatReportDeliveryTime = (reportTime) => {
  if (!reportTime) return { display: 'Not specified', className: 'text-slate-500' };
  
  const str = reportTime.toLowerCase();
  const dateMatch = str.match(/^(\d{4}-\d{2}-\d{2})/);
  
  if (dateMatch) {
    const dateObj = new Date(reportTime);
    if (!isNaN(dateObj.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = dateObj.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      let rel = '';
      if (diffDays === 0) rel = '(today)';
      else if (diffDays > 0) rel = `(in ${diffDays} day${diffDays !== 1 ? 's' : ''})`;
      else rel = `(${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago)`;
      
      return {
        display: (
          <div className="flex items-center space-x-2">
            <span>{dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded-full">{rel}</span>
          </div>
        ),
        className: 'text-slate-800'
      };
    }
  }
  
  if (str.includes('hour')) {
    const match = str.match(/(\d+)/);
    if (match) {
      const hours = parseInt(match[1], 10);
      if (!isNaN(hours)) {
        const days = hours / 24;
        const daysDisplay = Number.isInteger(days) ? days : days.toFixed(2);
        return {
          display: (
            <div className="flex items-center space-x-2">
              <span>{reportTime}</span>
              <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded-full">
                ({daysDisplay} day{daysDisplay !== '1' ? 's' : ''})
              </span>
            </div>
          ),
          className: 'text-slate-800'
        };
      }
    }
  }
  
  return { display: reportTime, className: 'text-slate-800' };
};

export const getInputTypeDisplay = (field) => {
  const inputType = field.inputType || 'text';
  const types = {
    text: 'Text Input',
    number: 'Number Input',
    dropdown: 'Dropdown'
  };
  return types[inputType] || inputType;
};

// Main hook
export const useTestDetailHook = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const selectedTest = useSelector(selectSelectedTest);
  const getByIdLoading = useSelector(selectGetByIdLoading);
  const getByIdError = useSelector(selectGetByIdError);

  useEffect(() => {
    if (id) {
      dispatch(getTestById(id));
    }
  }, [id, dispatch]);

  return {
    selectedTest,
    getByIdLoading,
    getByIdError,
    id
  };
};