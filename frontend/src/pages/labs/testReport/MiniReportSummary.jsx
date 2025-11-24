import React from "react";

const MiniReportSummary = ({ reports, dateRange }) => {
  // Helper function to handle empty values
  const safeData = (value, fallback = "N/A") => value || fallback;

  // Format date to "DD-MM-YYYY" format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `${amount?.toLocaleString("en-PK") || "0"}`;
  };

  // Calculate totals
  const calculateTotals = () => {
    return reports.reduce(
      (acc, report) => {
        return {
          totalAmount: acc.totalAmount + (report.totalAmount || 0),
          totalDiscount: acc.totalDiscount + (report.discountAmount || 0),
          totalPaid: acc.totalPaid + (report.advanceAmount || 0),
          totalBalance: acc.totalBalance + ((report.totalAmount || 0) - (report.advanceAmount || 0)),
        };
      },
      { totalAmount: 0, totalDiscount: 0, totalPaid: 0, totalBalance: 0 }
    );
  };

  const totals = calculateTotals();

  // Get referred doctors with counts and amounts
  const getReferredDoctors = () => {
    const doctors = {};
    reports.forEach((report) => {
      const doctor = report.patient_Detail?.referredBy || "Not Specified";
      if (!doctors[doctor]) {
        doctors[doctor] = {
          count: 0,
          totalAmount: 0,
          totalPaid: 0
        };
      }
      doctors[doctor].count += 1;
      doctors[doctor].totalAmount += report.totalAmount || 0;
      doctors[doctor].totalPaid += report.advanceAmount || 0;
    });
    
    return Object.entries(doctors)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);
  };

  const referredDoctors = getReferredDoctors();

  return (
    <html>
      <head>
        <title>Quick Report Summary</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          {`
            @page {
              size: A4;
              margin: 5mm 10mm;
            }
              
            body {
              margin: 0;
              padding: 5mm;
              color: #333;
              width: 210mm;
              height: 297mm;
              position: relative;
              font-size: 11px;
              line-height: 1.3;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-family: 'Inter', sans-serif;
            }

            @media print {
              .no-print {
                display: none;
              }
            }
          `}
        </style>
      </head>
      <body className="bg-white">
        {/* Header */}
        <div className="text-center mb-6 border-b pb-4">
          <h1 className="text-xl font-bold uppercase tracking-wide">
            AL-SHAHBAZ MODERN DIAGNOSTIC CENTER
          </h1>
          <h2 className="text-md font-medium mt-2">QUICK REPORT SUMMARY</h2>
          <p className="text-sm text-gray-600 mt-1">
            {dateRange.startDate && formatDate(dateRange.startDate)}
            {dateRange.endDate && ` to ${formatDate(dateRange.endDate)}`}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Generated on: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Main Summary Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="border p-3 rounded shadow-sm bg-blue-50">
            <h3 className="text-xs font-medium text-gray-500">Total Patients</h3>
            <p className="text-lg font-semibold">{reports.length}</p>
          </div>
          <div className="border p-3 rounded shadow-sm bg-green-50">
            <h3 className="text-xs font-medium text-gray-500">Total Amount</h3>
            <p className="text-lg font-semibold">PKR {formatCurrency(totals.totalAmount)}</p>
          </div>
          <div className="border p-3 rounded shadow-sm bg-yellow-50">
            <h3 className="text-xs font-medium text-gray-500">Total Paid</h3>
            <p className="text-lg font-semibold">PKR {formatCurrency(totals.totalPaid)}</p>
          </div>
          <div className="border p-3 rounded shadow-sm bg-red-50">
            <h3 className="text-xs font-medium text-gray-500">Total Balance</h3>
            <p className="text-lg font-semibold">PKR {formatCurrency(totals.totalBalance)}</p>
          </div>
        </div>

        {/* Referred Doctors Summary */}
        <div className="mb-6">
          <h3 className="font-medium border-b pb-2 mb-3 text-center">
            Summary by Referred Doctors
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border border-gray-300 font-medium">Doctor Name</th>
                  <th className="p-2 border border-gray-300 font-medium text-center">Patients</th>
                  <th className="p-2 border border-gray-300 font-medium text-right">Total Amount</th>
                  <th className="p-2 border border-gray-300 font-medium text-right">Total Paid</th>
                  <th className="p-2 border border-gray-300 font-medium text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {referredDoctors.map((doctor, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 border border-gray-200">{doctor.name}</td>
                    <td className="p-2 border border-gray-200 text-center">{doctor.count}</td>
                    <td className="p-2 border border-gray-200 text-right">PKR {formatCurrency(doctor.totalAmount)}</td>
                    <td className="p-2 border border-gray-200 text-right">PKR {formatCurrency(doctor.totalPaid)}</td>
                    <td className="p-2 border border-gray-200 text-right">
                      PKR {formatCurrency(doctor.totalAmount - doctor.totalPaid)}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-gray-100 font-medium">
                  <td className="p-2 border border-gray-300">TOTAL</td>
                  <td className="p-2 border border-gray-300 text-center">{reports.length}</td>
                  <td className="p-2 border border-gray-300 text-right">PKR {formatCurrency(totals.totalAmount)}</td>
                  <td className="p-2 border border-gray-300 text-right">PKR {formatCurrency(totals.totalPaid)}</td>
                  <td className="p-2 border border-gray-300 text-right">PKR {formatCurrency(totals.totalBalance)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="border p-3 rounded shadow-sm">
            <h3 className="text-xs font-medium text-gray-500">Average Amount per Patient</h3>
            <p className="text-sm font-semibold">
              PKR {formatCurrency(reports.length > 0 ? totals.totalAmount / reports.length : 0)}
            </p>
          </div>
          <div className="border p-3 rounded shadow-sm">
            <h3 className="text-xs font-medium text-gray-500">Total Discount</h3>
            <p className="text-sm font-semibold">PKR {formatCurrency(totals.totalDiscount)}</p>
          </div>
          <div className="border p-3 rounded shadow-sm">
            <h3 className="text-xs font-medium text-gray-500">Collection Rate</h3>
            <p className="text-sm font-semibold">
              {totals.totalAmount > 0 ? Math.round((totals.totalPaid / totals.totalAmount) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t absolute bottom-0 left-0 right-0 pb-2">
          <p>Quick Summary Report | Computer Generated | Page 1 of 1</p>
        </div>

        {/* Print Button - Only visible in browser */}
        <div className="no-print fixed top-4 right-4">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                clipRule="evenodd"
              />
            </svg>
            Print Quick Summary
          </button>
        </div>

        {/* Auto-print script - ADD THIS */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.onload = function() {
              setTimeout(() => {
                window.print();
                // Optional: close window after print
                setTimeout(() => {
                  window.close();
                }, 500);
              }, 500);
            };
          `
        }} />
      </body>
    </html>
  );
};

export default MiniReportSummary;