import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePatient } from '../../../features/patient/patientSlice';
import { useNavigate } from 'react-router-dom';

const DeletePatientConfirmation = ({ patient, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(state => state.patients.status);
  const error = useSelector(state => state.patients.error);

  const handleDelete = async () => {
    try {
      await dispatch(deletePatient(patient._id)).unwrap();
      // Close the modal first
      onClose();
      // Then navigate
      navigate('/receptionist/OPD/manage');
    } catch (err) {
      console.error('Failed to delete patient:', err);
      // Don't close on error
    }
  };

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">Confirm Patient Deletion</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={status === 'loading'}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to permanently delete this patient record?
          </p>
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">This action cannot be undone</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    All data associated with MR#{patient.patient_MRNo} - {patient.patient_Name} will be permanently removed from the system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={status === 'loading'}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : 'Delete Patient'}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletePatientConfirmation;