// src/components/dashboard/DashboardComponents/DoctorsTable.jsx
import React, { useState, useEffect } from 'react';
import {
  FaCalendarDay,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartLine,
  FaFilter,
  FaHospital,
  FaUserMd,
  FaSearch,
  FaSync,
  FaExclamationTriangle
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const DoctorsTable = ({ doctors = [], opdPatients = [], admittedPatients = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [sortBy, setSortBy] = useState('earnings'); // 'earnings', 'name', 'percentage'
  const [debugInfo, setDebugInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to get doctor ID from visit (handles both string and object)
  const getDoctorIdFromVisit = (visit) => {
    if (!visit.doctor) return null;

    // If doctor is a string ID
    if (typeof visit.doctor === 'string') {
      return visit.doctor;
    }

    // If doctor is an object with _id
    if (visit.doctor._id) {
      return visit.doctor._id;
    }

    // If doctor is an object with id
    if (visit.doctor.id) {
      return visit.doctor.id;
    }

    return null;
  };

  // Helper function to compare doctor IDs (handles both string and ObjectId)
  const compareDoctorIds = (id1, id2) => {
    if (!id1 || !id2) return false;
    return id1.toString() === id2.toString();
  };

  // Function to properly format dates for comparison (fix timezone issue)
  const formatDateForComparison = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    // Extract just the date part (YYYY-MM-DD) ignoring timezone
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();

    return new Date(Date.UTC(year, month, day));
  };

  // Debug function to log what's happening
  useEffect(() => {
    if (doctors.length > 0 && opdPatients.length > 0) {
      setIsLoading(true);

      const debugData = {
        selectedDate: selectedDate.toISOString(),
        viewMode,
        totalDoctors: doctors.length,
        totalPatients: opdPatients.length,
        allVisits: [],
        matchedVisits: [],
        doctorIds: doctors.map(d => ({
          id: d._id,
          name: d.user?.user_Name,
          idString: d._id.toString()
        }))
      };

      // Log all visits for debugging
      opdPatients.forEach(patient => {
        if (patient.visits && Array.isArray(patient.visits)) {
          patient.visits.forEach(visit => {
            const doctorId = getDoctorIdFromVisit(visit);
            debugData.allVisits.push({
              patientName: patient.patient_Name,
              patientId: patient._id,
              visitDate: visit.visitDate,
              doctorId: doctorId,
              doctorObject: visit.doctor,
              doctorFee: visit.doctorFee || 0,
              discount: visit.discount || 0,
              purpose: visit.purpose,
              formattedDate: visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : 'No date',
              isDoctorObject: typeof visit.doctor === 'object',
              doctorIdType: typeof doctorId
            });
          });
        }
      });

      // Check for doctor matches
      doctors.forEach(doctor => {
        const doctorId = doctor._id.toString();
        const visits = debugData.allVisits.filter(visit => {
          const visitDoctorId = getDoctorIdFromVisit({ doctor: visit.doctorObject || visit.doctorId });
          return compareDoctorIds(visitDoctorId, doctorId);
        });

        if (visits.length > 0) {
          debugData.matchedVisits.push({
            doctorName: doctor.user?.user_Name,
            doctorId: doctorId,
            visits: visits
          });
        }
      });

      setDebugInfo(debugData);
      setIsLoading(false);
    }
  }, [doctors, opdPatients, selectedDate, viewMode]);

  // Function to calculate earnings for a specific date (FIXED VERSION)
  const calculateEarningsForDate = (doctorId, doctorPercentage, targetDate) => {
    if (!doctorId || !doctorPercentage) return 0;

    // Create date boundaries for comparison (ignore timezone)
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    const startOfDay = new Date(targetYear, targetMonth, targetDay, 0, 0, 0, 0);
    const endOfDay = new Date(targetYear, targetMonth, targetDay, 23, 59, 59, 999);

    // Calculate OPD earnings for the selected date
    const dateOpdEarnings = opdPatients.reduce((total, patient) => {
      if (patient.visits && Array.isArray(patient.visits)) {
        const dateVisits = patient.visits.filter(visit => {
          if (!visit.visitDate) return false;

          const visitDate = new Date(visit.visitDate);
          const visitYear = visitDate.getFullYear();
          const visitMonth = visitDate.getMonth();
          const visitDay = visitDate.getDate();

          const isDateMatch =
            visitYear === targetYear &&
            visitMonth === targetMonth &&
            visitDay === targetDay;

          const visitDoctorId = getDoctorIdFromVisit(visit);
          const isDoctorMatch = compareDoctorIds(visitDoctorId, doctorId);

          return isDateMatch && isDoctorMatch;
        });

        if (dateVisits.length > 0) { }

        const visitEarnings = dateVisits.reduce((sum, visit) => {
          // Get fee from the visit
          let doctorFee = 0;

          // Try multiple possible fee field names
          if (visit.doctorFee !== undefined) {
            doctorFee = visit.doctorFee;
          } else if (visit.doctor?.doctor_Fee !== undefined) {
            doctorFee = visit.doctor.doctor_Fee;
          } else if (visit.doctorObject?.doctor_Fee !== undefined) {
            doctorFee = visit.doctorObject.doctor_Fee;
          }

          const discount = visit.discount || 0;
          const netFee = Math.max(0, doctorFee - discount);

          return sum + netFee;
        }, 0);

        return total + visitEarnings;
      }
      return total;
    }, 0);

    // Calculate IPD earnings for the selected date
    const dateIpdEarnings = admittedPatients.reduce((total, patient) => {
      const patientDoctorId = patient.attendingDoctor?._id || patient.attendingDoctor?.id;
      if (compareDoctorIds(patientDoctorId, doctorId)) {
        const admissionDate = new Date(patient.admissionDate || patient.createdAt);
        const admissionYear = admissionDate.getFullYear();
        const admissionMonth = admissionDate.getMonth();
        const admissionDay = admissionDate.getDate();

        const isDateMatch =
          admissionYear === targetYear &&
          admissionMonth === targetMonth &&
          admissionDay === targetDay;

        if (isDateMatch) {
          const dailyCharges = patient.financials?.daily_Charges || 0;
          return total + (dailyCharges * (doctorPercentage / 100));
        }
      }
      return total;
    }, 0);

    const totalDateRevenue = dateOpdEarnings + dateIpdEarnings;
    const doctorEarnings = (totalDateRevenue * (doctorPercentage / 100));

    return doctorEarnings;
  };

  // Helper function to count patients for the selected date
  const calculatePatientCount = (doctorId) => {
    const targetYear = selectedDate.getFullYear();
    const targetMonth = selectedDate.getMonth();
    const targetDay = selectedDate.getDate();

    const opdCount = opdPatients.filter(patient =>
      patient.visits?.some(visit => {
        if (!visit.visitDate) return false;
        const visitDate = new Date(visit.visitDate);
        const visitYear = visitDate.getFullYear();
        const visitMonth = visitDate.getMonth();
        const visitDay = visitDate.getDate();

        const isDateMatch =
          visitYear === targetYear &&
          visitMonth === targetMonth &&
          visitDay === targetDay;

        const visitDoctorId = getDoctorIdFromVisit(visit);
        const isDoctorMatch = compareDoctorIds(visitDoctorId, doctorId);

        return isDateMatch && isDoctorMatch;
      })
    ).length;

    const ipdCount = admittedPatients.filter(patient => {
      const admissionDate = new Date(patient.admissionDate || patient.createdAt);
      const admissionYear = admissionDate.getFullYear();
      const admissionMonth = admissionDate.getMonth();
      const admissionDay = admissionDate.getDate();

      const isDateMatch =
        admissionYear === targetYear &&
        admissionMonth === targetMonth &&
        admissionDay === targetDay;

      const patientDoctorId = patient.attendingDoctor?._id || patient.attendingDoctor?.id;
      const isDoctorMatch = compareDoctorIds(patientDoctorId, doctorId);

      return isDateMatch && isDoctorMatch;
    }).length;

    return opdCount + ipdCount;
  };

  // Safely process doctors data with earnings
  const processedDoctors = React.useMemo(() => {
    if (!Array.isArray(doctors)) return [];

    const doctorsWithEarnings = doctors.map(doctor => {
      const doctorPercentage = doctor?.doctor_Contract?.doctor_Percentage || 0;
      const hospitalPercentage = doctor?.doctor_Contract?.hospital_Percentage || 0;

      let earnings = 0;
      let totalRevenue = 0;

      if (viewMode === 'daily') {
        earnings = calculateEarningsForDate(doctor._id, doctorPercentage, selectedDate);
        totalRevenue = doctorPercentage > 0 ? earnings / (doctorPercentage / 100) : 0;
      }
      // Weekly and monthly calculations would go here...

      const hospitalShare = totalRevenue * (hospitalPercentage / 100);

      return {
        id: doctor?._id || '',
        name: doctor?.user?.user_Name || 'Unknown Doctor',
        image: doctor?.doctor_Image?.filePath || null,
        department: doctor?.doctor_Department || 'Unknown Department',
        specialization: doctor?.doctor_Specialization || '',
        type: doctor?.doctor_Type || '',
        fee: doctor?.doctor_Fee || 0,
        hospitalPercentage: hospitalPercentage,
        doctorPercentage: doctorPercentage,
        earnings: earnings,
        hospitalShare: hospitalShare,
        totalRevenue: totalRevenue,
        patientCount: calculatePatientCount(doctor._id),
        hasEarnings: earnings > 0,
        doctorIdString: doctor._id.toString()
      };
    });

    // Sort doctors based on selected criteria
    return doctorsWithEarnings.sort((a, b) => {
      if (sortBy === 'earnings') return b.earnings - a.earnings;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'percentage') return b.doctorPercentage - a.doctorPercentage;
      return 0;
    });
  }, [doctors, opdPatients, admittedPatients, selectedDate, viewMode, sortBy]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date for display
  const formatDateDisplay = () => {
    if (viewMode === 'daily') {
      return selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else if (viewMode === 'weekly') {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
              ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (viewMode === 'monthly') {
      return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  // Calculate totals
  const totalEarnings = processedDoctors.reduce((sum, doctor) => sum + doctor.earnings, 0);
  const totalHospitalShare = processedDoctors.reduce((sum, doctor) => sum + doctor.hospitalShare, 0);
  const totalRevenue = processedDoctors.reduce((sum, doctor) => sum + doctor.totalRevenue, 0);
  const totalPatients = processedDoctors.reduce((sum, doctor) => sum + doctor.patientCount, 0);

  // Get doctors with actual earnings for current selection
  const doctorsWithEarnings = processedDoctors.filter(d => d.earnings > 0);

  // Reset to today's date
  const handleResetToToday = () => {
    setSelectedDate(new Date());
  };

  // Quick date navigation
  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Get today's date for comparison
  const today = new Date();
  const isToday = selectedDate.toDateString() === today.toDateString();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-primary-600 to-primary-800 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <FaChartLine className="mr-3" />
              Doctors Revenue
            </h2>
            <p className="text-primary-100 mt-1 flex items-center">
              <FaCalendarDay className="mr-2" />
              {formatDateDisplay()}
              {isToday && (
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Today
                </span>
              )}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <FaCalendarAlt className="text-white" />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="bg-transparent border-none text-white placeholder-white/70 w-32 focus:outline-none"
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                maxDate={new Date()} // Can't select future dates
              />
            </div>
            <button
              onClick={handleResetToToday}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors flex items-center"
              title="Reset to today"
            >
              <FaSync className="mr-2" />
              Today
            </button>
          </div>
        </div>

        {/* Quick Date Navigation */}
        <div className="mt-4 flex items-center justify-center space-x-2">
          <button
            onClick={() => handleDateChange(-1)}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            ← Previous Day
          </button>
          <span className="text-white/70 text-sm">|</span>
          <button
            onClick={() => handleDateChange(1)}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm transition-colors"
            disabled={selectedDate.toDateString() === today.toDateString()}
          >
            Next Day →
          </button>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap gap-3">
          {/* View Mode Toggle */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex">
            {['daily', 'weekly', 'monthly'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === mode
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-white hover:bg-white/20'
                  }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <FaFilter className="text-white" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/20 backdrop-blur-sm text-white border-none rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="earnings">Sort by Earnings</option>
              <option value="name">Sort by Name</option>
              <option value="percentage">Sort by Percentage</option>
            </select>
          </div>

          {/* Summary Badges */}
          <div className="flex flex-wrap gap-2 ml-auto">
            <div className="bg-green-500/20 text-green-100 px-3 py-1 rounded-full text-sm flex items-center">
              <FaMoneyBillWave className="mr-2" />
              Total: {formatCurrency(totalEarnings)}
            </div>
            <div className="bg-blue-500/20 text-blue-100 px-3 py-1 rounded-full text-sm flex items-center">
              <FaUserMd className="mr-2" />
              Patients: {totalPatients}
            </div>
            <div className="bg-orange-500/20 text-orange-100 px-3 py-1 rounded-full text-sm flex items-center">
              <FaSearch className="mr-2" />
              {doctorsWithEarnings.length} Active
            </div>
          </div>
        </div>
      </div>

      {/* Data Status Alert */}
      <div className={`px-6 py-3 ${totalEarnings > 0 ? 'bg-green-50 border-b border-green-200' : 'bg-yellow-50 border-b border-yellow-200'}`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center text-sm ${totalEarnings > 0 ? 'text-green-700' : 'text-yellow-700'}`}>
            {totalEarnings > 0 ? (
              <>
                <FaSearch className="mr-2" />
                Showing data for: <strong className="ml-1">{formatDateDisplay()}</strong>
              </>
            ) : (
              <>
                <FaExclamationTriangle className="mr-2" />
                No earnings recorded for: <strong className="ml-1">{formatDateDisplay()}</strong>
              </>
            )}
          </div>
          <div className="text-xs text-gray-600">
            {opdPatients.length} total patients in system • {doctors.length} doctors
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Analyzing revenue data...</p>
        </div>
      )}

      {/* Main Table */}
      {!isLoading && processedDoctors.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Share Distribution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor's Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital Share
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedDoctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className={`hover:bg-gray-50 transition-colors group ${doctor.earnings > 0 ? 'bg-green-50/30' : ''}`}
                >
                  {/* Doctor Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          className="h-12 w-12 rounded-full object-cover border-2 border-primary-100 group-hover:border-primary-300 transition-colors"
                          src={
                            doctor.image
                              ? `${API_URL}${doctor.image}`
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || "D")}&background=random&color=fff&bold=true`
                          }
                          alt={doctor.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || "D")}&background=random&color=fff&bold=true`;
                          }}
                        />
                        {doctor.earnings > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-xs text-white">✓</span>
                          </div>
                        )}
                        {doctor.patientCount > 0 && doctor.earnings === 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white">!</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {doctor.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {doctor.department} • {doctor.specialization}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {doctor.type}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Patient Count */}
                  <td className="px-6 py-4">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${doctor.patientCount > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                        {doctor.patientCount}
                      </div>
                      <div className="text-xs text-gray-500">
                        patients
                      </div>
                    </div>
                  </td>

                  {/* Consultation Fee */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(doctor.fee)}
                    </div>
                    <div className="text-xs text-gray-500">
                      per consultation
                    </div>
                  </td>

                  {/* Share Distribution */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Doctor:</span>
                        <span className="text-xs font-bold text-green-600">
                          {doctor.doctorPercentage}%
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-linear-to-r from-green-400 to-green-600"
                              style={{ width: `${doctor.doctorPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Hospital:</span>
                        <span className="text-xs font-bold text-primary-600">
                          {doctor.hospitalPercentage}%
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-linear-to-r from-primary-400 to-primary-600"
                              style={{ width: `${doctor.hospitalPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Doctor's Earnings */}
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${doctor.earnings > 0
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : doctor.patientCount > 0
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                      <FaMoneyBillWave className="mr-2" />
                      {formatCurrency(doctor.earnings)}
                    </div>
                    {doctor.earnings > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        {Math.round((doctor.earnings / doctor.fee) * 100) / 100} consultations
                      </div>
                    )}
                    {doctor.patientCount > 0 && doctor.earnings === 0 && (
                      <div className="mt-2 text-xs text-yellow-600">
                        Patients but no fee recorded
                      </div>
                    )}
                  </td>

                  {/* Hospital Share */}
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${doctor.hospitalShare > 0
                      ? 'bg-primary-100 text-primary-800 border border-primary-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                      <FaHospital className="mr-2" />
                      {formatCurrency(doctor.hospitalShare)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !isLoading ? (
        <div className="p-12 text-center">
          <FaMoneyBillWave className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors data available</h3>
          <p className="text-gray-500">Add doctors to see revenue calculations</p>
        </div>
      ) : null}

    </div>
  );
};