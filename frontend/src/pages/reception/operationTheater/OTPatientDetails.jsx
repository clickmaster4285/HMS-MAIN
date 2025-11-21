import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { fetchOperationByMRNo } from "../../../features/operationManagment/otSlice";
import { useDispatch, useSelector } from "react-redux";
import { getallDepartments } from '../../../features/department/DepartmentSlice';
import { fetchAllDoctors } from '../../../features/doctor/doctorSlice';

const OTPatientDetails = () => {
  const { mrno } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentOperation, isLoading, error } = useSelector((state) => state.ot);
  const { departments, isLoading: isDeptLoading } = useSelector(state => state.department);
  const { doctors, isLoading: isDoctorLoading } = useSelector(state => state.doctor);

  useEffect(() => {
    if (mrno) {
      dispatch(fetchOperationByMRNo(mrno));
      dispatch(getallDepartments());
      dispatch(fetchAllDoctors());
    }
  }, [dispatch, mrno]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Loading Current Operation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching operation:", error);
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }


  if (!currentOperation) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-lg z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No currentOperation data found</h3>
            <div className="mt-6">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <FaArrowLeft className="inline mr-2" /> Back to Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      return dateString.split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto border  border-primary-600 p-2 rounded-t-2xl" >
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center underline text-white hover:text-primary-100"
          >
            <FaArrowLeft className="mr-2" /> Back to Schedule
          </button>
          <h2 className="text-2xl font-bold">Current Operation Details</h2>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
        <div className="flex items-center mt-2">
          <span className="bg-white text-primary-600 px-2 py-1 rounded-md text-sm font-bold">
            MR#: {currentOperation.patient_MRNo || 'N/A'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 ">
        {/* Patient Basic Info */}
        <div className="mb-8">
          <h3 className="text-sm md:text-xl font-bold text-gray-800 border-b border-primary-600 pb-2 mb-4 flex items-center">
            <div className="border flex items-center justify-center border-t-primary-50 border-r-primary-50 rounded-full pl-1.5 py-1  mr-2">
              <svg className="w-5 h-5 md:w-7 md:h-7 mr-2 text-primary-700 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Patient Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <DetailItem label="Patient Name" value={currentOperation.patient_Details?.patient || currentOperation.patient_Details?.patient_Name || 'N/A'} />
            <DetailItem label="MR Number" value={currentOperation.patient_MRNo || 'N/A'} />
            <DetailItem label="Procedure" value={currentOperation.procedure || 'N/A'} />
            <DetailItem label="Department" value={currentOperation.department} />
          </div>
        </div>

        {/* Surgical Team */}
        <div className="mb-8">
          <h3 className="text-sm md:text-xl font-bold text-gray-800 border-b border-primary-600 pb-2 mb-4 flex items-center">
            <div className="border flex items-center justify-center border-t-primary-50 border-r-primary-50 rounded-full pl-1.5 py-1  mr-2">
              <svg className="w-5 h-5 md:w-7 md:h-7 mr-2 text-primary-700 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            Surgical Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <DetailItem
              label="Senior Surgeon"
              value={currentOperation.otInformation?.doctor?.seniorSurgeon.join(', ')}
            />
            <DetailItem
              label="Assistant Doctors"
              value={currentOperation.otInformation?.doctor?.assistantDoctors.join(', ') || 'None'}
            />
            <DetailItem
              label="Nurses"
              value={currentOperation.otInformation?.doctor?.nurses?.join(', ') || 'None'}
            />
          </div>
        </div>

        {/* currentOperation Details */}
        <div className="mb-8">
          <h3 className="text-sm md:text-xl font-bold text-gray-800 border-b border-primary-600 pb-2 mb-4 flex items-center">
            <div className="border flex items-center justify-center border-t-primary-50 border-r-primary-50 rounded-full pl-1.5 py-1  mr-2">
              <svg className="w-5 h-5 md:w-7 md:h-7 mr-2 text-primary-700 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            currentOperation Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <DetailItem
              label="Current Operation Date"
              value={formatDate(currentOperation.otInformation?.doctor?.operation_Date) || 'N/A'}
            />
            <DetailItem
              label="Time"
              value={`${currentOperation.otTime?.startTime || 'N/A'} - ${currentOperation.otTime?.endTime || 'N/A'}`}
            />
            <DetailItem
              label="OT Number"
              value={currentOperation.otNumber || 'N/A'}
            />
            <DetailItem
              label="Status"
              value={
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentOperation.status === 'Scheduled' ? 'bg-primary-100 text-primary-800' :
                  currentOperation.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    currentOperation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                  {currentOperation.status || 'N/A'}
                </span>
              }
            />
          </div>
        </div>

        {/* currentOperation Information */}
        <div className="mb-8">
          <h3 className="text-sm md:text-xl font-bold text-gray-800 border-b border-primary-600 pb-2 mb-4 flex items-center">
            <div className="border flex items-center justify-center border-t-primary-50 border-r-primary-50 rounded-full pl-1.5 py-1  mr-2">
              <svg className="w-5 h-5 md:w-7 md:h-7 mr-2 text-primary-700 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            currentOperation Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <DetailItem
              label="Current Operation Name"
              value={currentOperation.otInformation?.operationName || 'N/A'}
            />
            <DetailItem
              label="Reason for Current Operation"
              value={currentOperation.otInformation?.reasonForOperation || 'N/A'}
            />
            <DetailItem
              label="Anesthesia Type"
              value={currentOperation.otInformation?.doctor?.anesthesia_Type || 'N/A'}
            />
            <DetailItem
              label="Surgery Type"
              value={currentOperation.otInformation?.doctor?.surgery_Type || 'N/A'}
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="mb-8">
          <h3 className="text-sm md:text-xl font-bold text-gray-800 border-b border-primary-600 pb-2 mb-4 flex items-center">
            <div className="border flex items-center justify-center border-t-primary-50 border-r-primary-50 rounded-full pl-1.5 py-1  mr-2">
              <svg className="w-5 h-5 md:w-7 md:h-7 mr-2 text-primary-700 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Financial Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <DetailItem
              label="Total Cost"
              value={`PKR ${currentOperation.total_Operation_Cost?.toLocaleString() || '0'}`}
            />
            <DetailItem
              label="Payment Status"
              value={
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentOperation.operation_PaymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  currentOperation.operation_PaymentStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-fuchsia-100 text-gray-800'
                  }`}>
                  {currentOperation.operation_PaymentStatus || 'N/A'}
                </span>
              }
            />
            <DetailItem
              label="Payment Method"
              value={currentOperation.payment_Method || 'N/A'}
            />
            <DetailItem
              label="Doctor's Fee"
              value={`PKR ${currentOperation.otInformation?.doctor?.doctors_Fee?.toLocaleString() || '0'}`}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-primary-600 pb-2 mb-4 flex items-center">
            <div className="border flex items-center justify-center border-t-primary-50 border-r-primary-50 rounded-full pl-1.5 py-1  mr-2">
              <svg className="w-5 h-5 md:w-7 md:h-7 mr-2 text-primary-700 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            Notes
          </h3>
          <div className="bg-primary-100 p-4 rounded-md">
            <p className="text-gray-700">{currentOperation.notes || 'No additional notes'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable component for detail items
const DetailItem = ({ label, value }) => (
  <div className="bg-primary-50 border border-primary-600 p-3 rounded-md">
    <p className="text-sm font-bold text-gray-700">{label}</p>
    <p className="text-primary-700 font-medium mt-1 italic underline underline-offset-4">{value || 'N/A'}</p>
  </div>
);

export default OTPatientDetails;