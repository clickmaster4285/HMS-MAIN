import React from 'react';
import { useNavigate } from 'react-router-dom';

const BedManagementModal = ({ ward, onClose }) => {
  const navigate = useNavigate();

  if (!ward || !ward.beds) return null;

  const handleBedClick = (bedId,) => {
    navigate(`/receptionist/beds/${bedId}`);
    
  };

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-lg flex justify-center items-center z-50">
      <div className="bg-white border border-gray-400 rounded-xl p-6 shadow-lg w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Bed Management - {ward.name} (Ward {ward.wardNumber})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 border border-gray-400 p-1 rounded-full hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div className="flex space-x-2 underline underline-offset-2 italic mb-2">
            <span className="font-medium">Total Beds:</span>
            <span>{ward.beds.length}</span>
          </div>
          <div className="flex underline underline-offset-2 italic mb-2">
            <span className="font-medium">Available Beds:</span>
            <span>{ward.beds.filter(bed => !bed.occupied).length}</span>
          </div>
          <div className="flex underline underline-offset-2 italic mb-2">
            <span className="font-medium">Occupied Beds:</span>
            <span>{ward.beds.filter(bed => bed.occupied).length}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-700 mb-3">Bed Details</h3>
          <div className="grid grid-cols-3 gap-4">
            {ward.beds.map((bed) => (
              <div 
                key={bed._id}
                className={`p-3 rounded-lg border cursor-pointer transition hover:shadow-md ${
                  bed.occupied ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                }`}
                onClick={() => handleBedClick(bed._id, bed.bedNumber)}
              >
                <div className="font-medium flex justify-between items-start">
                  <span>Bed #{bed.bedNumber}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    bed.occupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {bed.occupied ? 'Occupied' : 'Available'}
                  </span>
                </div>
                {bed.occupied && (
                  <div className="text-sm mt-1 truncate">
                    Patient: {bed.currentPatientMRNo || 'Unknown'}
                  </div>
                )}
                {bed.history?.length > 0 && (
                  <div className="text-xs mt-2 text-gray-500">
                    <span className="font-medium">{bed.history.length}</span> previous patients
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BedManagementModal;