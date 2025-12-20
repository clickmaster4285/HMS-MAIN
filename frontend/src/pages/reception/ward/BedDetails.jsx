import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getPatientByBedId,
  getBedHistory,
  clearWardState,
  resetCurrentBed
} from '../../../features/ward/Wardslice';

const BedDetails = () => {
  const { bedId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showHistory, setShowHistory] = useState(false);

  const {
    currentBed,
    currentBedPatient,
    currentBedHistory,
    bedPatientStatus,
    historyStatus,
    error
  } = useSelector((state) => state.ward);

  useEffect(() => {
    dispatch(getPatientByBedId(bedId));

    return () => {
      dispatch(resetCurrentBed());
      dispatch(clearWardState());
    };
  }, [dispatch, bedId]);

  useEffect(() => {
    if (showHistory && currentBed) {
      dispatch(getBedHistory({
        wardId: currentBed.ward.id,
        bedNumber: currentBed.bedNumber
      }));
    }
  }, [showHistory, currentBed, dispatch]);

  if (bedPatientStatus === 'loading') return <div className="text-center py-8">Loading bed details...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!currentBed) return <div className="text-center py-8">Bed not found</div>;

  const toggleHistory = () => setShowHistory(!showHistory);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">
                Bed #{currentBed.bedNumber} - {currentBed.ward.name}
              </h1>
              <p className="mt-1">
                Ward {currentBed.ward.wardNumber} • {currentBed.ward.department}
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Current Status */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Current Status</h2>
            <button
              onClick={toggleHistory}
              className="bg-primary-600 hover:bg-primary-700 text-white py-1 px-4 rounded-md text-sm"
            >
              {showHistory ? 'Hide History' : 'View History'}
            </button>
          </div>

          <div className={`p-4 rounded-lg ${currentBed.status === 'Occupied' ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${currentBed.status === 'Occupied' ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span className="font-medium">
                {currentBed.status}
              </span>
            </div>

            {currentBed.status === 'Occupied' && currentBedPatient && (
              <div className="mt-3 pl-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient Name</p>
                    <p className="font-medium">{currentBedPatient.patient_Name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">MR Number</p>
                    <p className="font-medium">{currentBedPatient.patient_MRNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CNIC</p>
                    <p className="font-medium">{currentBedPatient.patient_CNIC}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{currentBedPatient.patient_Address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Admission Date</p>
                    <p className="font-medium">
                      {new Date(currentBedPatient.admission_Details.admission_Date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Diagnosis</p>
                    <p className="font-medium">{currentBedPatient.admission_Details.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guardian</p>
                    <p className="font-medium">
                      {currentBedPatient.patient_Guardian.guardian_Name} ({currentBedPatient.patient_Guardian.guardian_Relation})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{currentBedPatient.patient_Guardian.guardian_Contact}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bed History Section */}
        {showHistory && (
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Bed History</h2>
            {historyStatus === 'loading' ? (
              <div className="text-center py-8">Loading history...</div>
            ) : currentBedHistory?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MR Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discharge Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentBedHistory.map((record, index) => {
                      const admissionDate = new Date(record.admissionDate);
                      const dischargeDate = record.dischargeDate ? new Date(record.dischargeDate) : null;
                      const duration = dischargeDate
                        ? Math.ceil((dischargeDate - admissionDate) / (1000 * 60 * 60 * 24))
                        : Math.ceil((new Date() - admissionDate) / (1000 * 60 * 60 * 24));

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {record.patientMRNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admissionDate.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {dischargeDate ? dischargeDate.toLocaleString() : 'Current'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {duration} day{duration !== 1 ? 's' : ''} {!dischargeDate && '(ongoing)'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No history records found for this bed
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 flex justify-between">
          <button
            onClick={toggleHistory}
            className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md"
          >
            {showHistory ? 'Hide History' : 'View Full History'}
          </button>
          {currentBed.status === 'Occupied' ? (
            <button
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md"
              onClick={() => { }} >   Discharge Patient </button>
          ) : (
            <button
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md"
              onClick={() => { }} >Assign Patient</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BedDetails;