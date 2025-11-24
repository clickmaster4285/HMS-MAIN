// src/components/dashboard/DashboardComponents/DoctorsTable.jsx
import React from 'react';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const DoctorsTable = ({ doctors = [] }) => {
  // Safely process doctors data
  const processedDoctors = React.useMemo(() => {
    if (!Array.isArray(doctors)) return [];

    return doctors.map(doctor => ({
      id: doctor?._id || '',
      name: doctor?.user?.user_Name || 'Unknown Doctor',
      image: doctor?.doctor_Image?.filePath || null,
      department: doctor?.doctor_Department || 'Unknown Department',
      specialization: doctor?.doctor_Specialization || '',
      type: doctor?.doctor_Type || '',
      fee: doctor?.doctor_Fee || 0,
      hospitalPercentage: doctor?.doctor_Contract?.hospital_Percentage || 0,
      doctorPercentage: doctor?.doctor_Contract?.doctor_Percentage || 0
    }));
  }, [doctors]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Doctors & Revenue Share</h3>
      </div>
      <div className="overflow-x-auto">
        {processedDoctors.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover border"
                          src={
                            doctor.image
                              ? `${API_URL}${doctor.image}`
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || "D")}&background=random`
                          }
                          alt={doctor.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || "D")}&background=random`;
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {doctor.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {doctor.specialization}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.department}</div>
                    <div className="text-sm text-gray-500">{doctor.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    PKR {doctor.fee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                      {doctor.hospitalPercentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {doctor.doctorPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No doctors data available
          </div>
        )}
      </div>
    </div>
  );
};