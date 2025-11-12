import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const CriticalFormHeader = ({ onOpenModal }) => {
  const navigate = useNavigate();
  const [showSummaryDatePicker, setShowSummaryDatePicker] = useState(false);
  const [summaryDates, setSummaryDates] = useState({
    startDate: new Date(),
    endDate: null,
  });

  const handleDownloadSummary = () => {
    const { startDate, endDate } = summaryDates;
    const formatDate = (date) => format(date, 'yyyy-MM-dd');

    if (startDate && endDate) {
      navigate(
        `/lab/critical-report-Summery/${formatDate(startDate)}_${formatDate(
          endDate
        )}`
      );
    } else if (startDate) {
      navigate(`/lab/critical-report-Summery/${formatDate(startDate)}`);
    } else {
      alert('Please select at least one date.');
    }

    setShowSummaryDatePicker(false);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Critical Results Management</h1>
      <div className="gap-2 flex relative">
        <button
          onClick={onOpenModal}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium py-2 px-4 rounded"
        >
          Add New Critical Result
        </button>
        <button
          onClick={() => setShowSummaryDatePicker(true)}
          className="text-white font-medium py-2 px-4 rounded hover:opacity-90 transition bg-[#009689]"
        >
          View/Download Summary
        </button>
        {showSummaryDatePicker && (
          <div className="absolute top-full mt-2 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg right-0">
            <DatePicker
              selectsRange
              startDate={summaryDates.startDate}
              endDate={summaryDates.endDate}
              onChange={(dates) => {
                const [start, end] = dates;
                setSummaryDates({ startDate: start, endDate: end });
              }}
              isClearable
              inline
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={() => setShowSummaryDatePicker(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadSummary}
                className="px-4 py-2 text-sm text-white bg-[#009689] rounded hover:bg-opacity-90"
              >
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriticalFormHeader;
