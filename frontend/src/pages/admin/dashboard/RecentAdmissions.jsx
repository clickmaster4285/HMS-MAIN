// src/components/dashboard/DashboardComponents/RecentAdmissions.jsx
import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export const RecentAdmissions = ({ patients = [] }) => {
  // Safely process recent admissions data
  const recentAdmissions = React.useMemo(() => {
    if (!Array.isArray(patients)) return [];
    
    return patients
      .filter(patient => patient?.status) // Ensure patient has status
      .slice(0, 5) // Get only the first 5
      .map(patient => ({
        id: patient?._id || Math.random().toString(36).substring(7),
        name: patient?.patient_Name || 'Unknown Patient',
        mrNo: patient?.patient_MRNo || 'N/A',
        ward: patient?.ward_Information?.ward_Type || 'Unknown Ward',
        bed: patient?.ward_Information?.bed_No || 'N/A',
        doctor: patient?.admission_Details?.admitting_Doctor || 'Unknown Doctor',
        status: patient?.status || 'Unknown',
        amount: patient?.financials?.total_Charges || 0,
        admissionDate: patient?.admission_Details?.admission_Date
          ? new Date(patient.admission_Details.admission_Date)
          : null
      }));
  }, [patients]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Admissions</h3>
      </div>
      <div className="overflow-x-auto">
        {recentAdmissions.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ward/Bed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAdmissions.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-medium">
                        {patient.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.mrNo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {patient.ward}
                    </div>
                    <div className="text-sm text-gray-500">
                      Bed {patient.bed}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.doctor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.status === 'Admitted' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Admitted
                      </span>
                    ) : patient.status === 'Discharged' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Discharged
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Unknown
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    PKR {patient.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No recent admissions data available
          </div>
        )}
      </div>
    </div>
  );
};