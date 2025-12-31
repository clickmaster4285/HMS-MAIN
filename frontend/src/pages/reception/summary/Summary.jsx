import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorFinancialSummary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    hospitalRevenue: 0,
    doctorRevenue: 0,
    totalRefunds: 0
  });
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/summary/summary`);
      setSummaryData(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch summary data');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    if (summaryData) {
      applyFilters();
    }
  }, [summaryData, startDate, endDate, selectedDoctor]);

  const applyFilters = () => {
    if (!summaryData) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // End of the day
    
    let totalRevenue = 0;
    let hospitalRevenue = 0;
    let doctorRevenue = 0;
    let totalRefunds = 0;
    
    // Process data for each doctor
    const doctorSummaries = summaryData.totalDoctors.map(doctor => {
      let doctorTotalAmount = 0;
      let doctorRefunds = 0;
      const patientNames = new Set();
      
      // Check each patient's visits for this doctor
      summaryData.totalPatients.forEach(patient => {
        patient.visits.forEach(visit => {
          const visitDate = new Date(visit.visitDate);
          
          // Check if visit is within date range and matches selected doctor
          if (visitDate >= start && visitDate <= end && 
              visit.doctor === doctor._id && 
              (selectedDoctor === '' || doctor._id === selectedDoctor)) {
            
            doctorTotalAmount += visit.amountPaid;
            patientNames.add(patient.patient_Name);
            
            // Calculate refunds for this visit
            const visitRefunds = summaryData.totalRefunds.filter(
              refund => refund.visit === visit._id
            );
            
            visitRefunds.forEach(refund => {
              doctorRefunds += refund.refundAmount;
              totalRefunds += refund.refundAmount;
            });
          }
        });
      });
      
      // Subtract refunds from total amount
      const netAmount = Math.max(0, doctorTotalAmount - doctorRefunds);
      
      // Calculate shares based on net amount
      const hospitalShare = netAmount * (doctor.doctor_Contract.hospital_Percentage / 100);
      const doctorShare = netAmount * (doctor.doctor_Contract.doctor_Percentage / 100);
      
      // Update overall stats
      totalRevenue += netAmount;
      hospitalRevenue += hospitalShare;
      doctorRevenue += doctorShare;
      
      return {
        "Doctor Name": doctor?.user?.user_Name,
        "Specialization": doctor.doctor_Specialization,
        "Patient Names": Array.from(patientNames).join(', '),
        "Patient Count": patientNames.size,
        "Total Amount (PKR)": doctorTotalAmount.toFixed(2),
        "Refunds (PKR)": doctorRefunds.toFixed(2),
        "Net Amount (PKR)": netAmount.toFixed(2),
        "Hospital Share (PKR)": hospitalShare.toFixed(2),
        "Doctor Share (PKR)": doctorShare.toFixed(2),
        doctorId: doctor._id
      };
    });
    
    // Filter out doctors with no patients in the date range
    const filteredSummaries = doctorSummaries.filter(
      summary => summary["Patient Count"] > 0 && 
                (selectedDoctor === '' || summary.doctorId === selectedDoctor)
    );
    
    setFilteredData(filteredSummaries);
    setStats({
      totalRevenue,
      hospitalRevenue,
      doctorRevenue,
      totalRefunds
    });
  };

  const resetFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    setSelectedDoctor('');
  };

  const exportToCSV = () => {
    const headers = ["Doctor Name", "Specialization", "Patient Names", "Patient Count", "Total Amount (PKR)", "Refunds (PKR)", "Net Amount (PKR)", "Hospital Share (PKR)", "Doctor Share (PKR)"];
    
    const csvContent = [
      headers.join(","),
      ...filteredData.map(row => [
        `"${row["Doctor Name"]}"`,
        `"${row["Specialization"]}"`,
        `"${row["Patient Names"]}"`,
        row["Patient Count"],
        row["Total Amount (PKR)"],
        row["Refunds (PKR)"],
        row["Net Amount (PKR)"],
        row["Hospital Share (PKR)"],
        row["Doctor Share (PKR)"]
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `doctor-summary-${startDate}-to-${endDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading financial data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-50">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md border border-gray-100">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchSummary}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Doctor Financial Summary</h1>
            <p className="text-gray-600 mt-1">Track revenue distribution between hospital and doctors</p>
          </div>
          <button
            onClick={exportToCSV}
            className="mt-4 md:mt-0 flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-primary-500 hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.totalRevenue.toFixed(2)} PKR</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Hospital Share</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.hospitalRevenue.toFixed(2)} PKR</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Doctor Share</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.doctorRevenue.toFixed(2)} PKR</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-red-500 hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Refunds</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.totalRefunds.toFixed(2)} PKR</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <button
              onClick={resetFilters}
              className="text-sm text-primary-500 hover:text-primary-700 flex items-center mt-2 md:mt-0 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
              >
                <option value="">All Doctors</option>
                {summaryData.totalDoctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor?.user?.user_Name||"NA"} ({doctor.doctor_Specialization})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Summary Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-700">No data available</h3>
              <p className="mt-2 text-gray-500">Try adjusting your filters to see results</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refunds</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Amount</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital Share</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Share</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item["Doctor Name"]}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item["Specialization"]}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{item["Patient Count"]} patients</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{item["Patient Names"]}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{item["Total Amount (PKR)"]} PKR</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-red-600">{item["Refunds (PKR)"]} PKR</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-primary-800">{item["Net Amount (PKR)"]} PKR</td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">{item["Hospital Share (PKR)"]} PKR</td>
                      <td className="px-6 py-4 whitespace-nowrap text-purple-600 font-medium">{item["Doctor Share (PKR)"]} PKR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Refunds Details Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Refund Details</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Reason</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summaryData.totalRefunds.map((refund, index) => {
                  const patient = summaryData.totalPatients.find(p => p._id === refund.patient);
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {patient ? patient.patient_Name : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {refund.originalAmount} PKR
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        {refund.refundAmount} PKR
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {refund.refundReason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(refund.refundDate).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorFinancialSummary;