import React from "react";

const PrintReportSummary = ({ reports, dateRange }) => {
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

  // Format time to "HH:MM AM/PM" format
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
          totalAmount: acc.totalAmount + report.totalAmount,
          totalDiscount: acc.totalDiscount + (report.discountAmount || 0),
          totalPaid: acc.totalPaid + (report.advanceAmount || 0),
          totalBalance:
            acc.totalBalance +
            ((report.totalAmount || 0) - (report.advanceAmount || 0)),
        };
      },
      { totalAmount: 0, totalDiscount: 0, totalPaid: 0, totalBalance: 0 }
    );
  };

  const totals = calculateTotals();

  // Get referred doctors with counts
  const getReferredDoctors = () => {
    const doctors = {};
    reports.forEach((report) => {
      const doctor = report.patient_Detail?.referredBy || "Not Specified";
      doctors[doctor] = (doctors[doctor] || 0) + 1;
    });
    return Object.entries(doctors)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const referredDoctors = getReferredDoctors();

  return (
    <html>
      <head>
        <title>Report Summary</title>
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

            .print-button {
              position: fixed;
              top: 10mm;
              right: 10mm;
              padding: 5px 10px;
              background: #333;
              color: white;
              border: none;
              border-radius: 3px;
              cursor: pointer;
              z-index: 1000;
            }

            @media print {
              .print-button {
                display: none;
              }
            }
          `}
        </style>
      </head>
      <body className="bg-white">
        <button className="print-button" onClick={() => window.print()}>
          Print Report
        </button>

        {/* Header */}
        <div className="text-center mb-6 border-b pb-4">
          <h1 className="text-xl font-bold uppercase tracking-wide">
            AL-SHAHBAZ MODERN DIAGNOSTIC CENTER
          </h1>

          <h2 className="text-md font-medium mt-2">
            Report Summary: {formatDate(dateRange.startDate)}
            {dateRange.endDate && ` to ${formatDate(dateRange.endDate)}`}
          </h2>
        </div>

        {/* Summary Cards */}
        {/* <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Amount", value: totals.totalAmount },
            { label: "Total Paid", value: totals.totalPaid },
            { label: "Total Discount", value: totals.totalDiscount },
            { label: "Total Balance", value: totals.totalBalance },
          ].map((item, index) => (
            <div key={index} className="border p-3 rounded shadow-sm">
              <h3 className="text-xs font-medium text-gray-500">
                {item.label}
              </h3>
              <p className="text-lg font-semibold">
                {formatCurrency(item.value)}
              </p>
            </div>
          ))}
        </div> */}

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Amount", value: totals.totalAmount },
            { label: "Total Paid", value: totals.totalPaid },
            { label: "Total Discount", value: totals.totalDiscount },
            { label: "Total Balance", value: totals.totalBalance },
          ].map((item, index) => (
            <div key={index} className="border p-3 rounded shadow-sm">
              <h3 className="text-xs font-medium text-gray-500">
                {item.label}
              </h3>
              <p className="text-lg font-semibold">
                {formatCurrency(item.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Referred Doctors Section */}
        <div className="mb-6">
          <h3 className="font-medium border-b pb-1 mb-3">
            Referred By Doctors Summary
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {referredDoctors.map((doctor, index) => (
              <div key={index} className="flex justify-between p-1 border-b">
                <span>{doctor.name}</span>
                <span className="font-medium">{doctor.count} patients</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reports Table */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Patient Reports</h3>
            <p className="text-xs text-gray-500">
              Total Reports: {reports.length}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left border-b">
                  <th className="p-2 border border-gray-200">#</th>
                  <th className="p-2 border border-gray-200">Patient_Name</th>
                  <th className="p-2 border border-gray-200">Test Names</th>
                  <th className="p-2 border border-gray-200">MR No.</th>
                  <th className="p-2 border border-gray-200">Recp. #</th>
                  <th className="p-2 border border-gray-200">Date</th>
                  <th className="p-2 border border-gray-200">InTime</th>
                  <th className="p-2 border border-gray-200">OutTime</th>
                  <th className="p-2 border border-gray-200">Referred By</th>
                  <th className="p-2 border border-gray-200 text-right">
                    Amount
                  </th>
                  <th className="p-2 border border-gray-200 text-right">
                    Paid
                  </th>
                  <th className="p-2 border border-gray-200 text-right">
                    Discount
                  </th>
                  <th className="p-2 border border-gray-200 text-right">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => {
                  const latest = report.testResults
                    ?.map((u) => new Date(u.updatedAt))
                    ?.sort((a, b) => b - a)[0];

                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 border border-gray-200">
                        {index + 1}
                      </td>
                      <td className="p-2 border border-gray-200">
                        {safeData(report.patient_Detail?.patient_Name)}
                      </td>
                      <td className="p-2 border border-gray-200">
                        {report.selectedTests
                          ?.map(test => test.testDetails?.testName || "N/A")
                          ?.filter(name => name !== "N/A")
                          ?.join(", ")}
                      </td>
                      <td className="p-2 border border-gray-200">
                        {safeData(report.patient_Detail?.patient_MRNo)}
                      </td>
                      <td className="p-2 border border-gray-200">
                        {report.tokenNumber}
                      </td>
                      <td className="p-2 border border-gray-200">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="p-2 border border-gray-200">
                        {formatTime(report.createdAt)}
                      </td>
                      <td className="p-2 border border-gray-200">
                        {latest ? formatTime(latest) : "N/A"}
                      </td>
                      <td className="p-2 border border-gray-200">
                        {safeData(report.patient_Detail?.referredBy)}
                      </td>
                      <td className="p-2 border border-gray-200 text-right">
                        {formatCurrency(report.totalAmount)}
                      </td>
                      <td className="p-2 border border-gray-200 text-right">
                        {formatCurrency(report.totalPaid)}
                      </td>
                      <td className="p-2 border border-gray-200 text-right">
                        {formatCurrency(report.discountAmount)}
                      </td>
                      <td className="p-2 border border-gray-200 text-right">
                        {formatCurrency(report.remainingAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>


        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t absolute bottom-0 left-0 right-0 pb-2">
          <p>
            Computer generated report | Page 1 of 1 |{" "}
            {new Date().toLocaleString()}
          </p>
        </div>
      </body>
    </html>
  );
};

export default PrintReportSummary;
