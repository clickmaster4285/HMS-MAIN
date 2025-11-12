import React from 'react';

const PrintCriticalSummary = ({ rows = [], dateRange = {} }) => {
  const safe = (v, fb = 'N/A') =>
    v === null || v === undefined || v === '' ? fb : v;

  const fmtDate = (d) => {
    if (!d) return 'N/A';
    const dt = new Date(d);
    if (isNaN(dt)) return String(d);
    const day = String(dt.getDate()).padStart(2, '0');
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const year = dt.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <html>
      <head>
        <title>Critical Results Summary</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          @page { size: A4; margin: 8mm 10mm; }
          body {
            margin: 0; padding: 8mm 10mm;
            color: #111827; font-size: 12px; line-height: 1.35;
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, Noto Sans, "Helvetica Neue", "Apple Color Emoji", "Segoe UI Emoji";
          }
          .no-print { position: fixed; top: 10mm; right: 10mm; }
          @media print { .no-print { display:none; } }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #E5E7EB; padding: 6px 8px; vertical-align: top; }
          th { background: #F9FAFB; text-align: left; font-weight: 600; }
        `}</style>
      </head>
      <body>
        {/* Optional manual print trigger */}
        <button
          className="no-print px-3 py-1.5 rounded bg-gray-800 text-white"
          onClick={() => window.print()}
        >
          Print
        </button>

        {/* Header */}
        <div className="text-center mb-4 pb-3 border-b border-gray-200">
          <h1 className="text-xl font-bold tracking-wide">
            AL-SHAHBAZ MODERN DIAGNOSTIC CENTER
          </h1>
          <h2 className="text-sm mt-1 font-medium">
            Critical Results Summary: {fmtDate(dateRange.startDate)}
            {dateRange?.endDate ? ` to ${fmtDate(dateRange.endDate)}` : ''}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Generated at: {new Date().toLocaleString()}
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="border rounded p-3">
            <div className="text-xs text-gray-500">Total Critical Tests</div>
            <div className="text-lg font-semibold">
              {rows.reduce(
                (acc, r) => acc + (Array.isArray(r.tests) ? r.tests.length : 0),
                0
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mb-6">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>MR No</th>
                <th>Patient</th>
                <th>Gender / Age</th>
                <th>Date</th>
                <th>Times</th>
                <th>Informed To</th>
                <th>Lab Tech</th>
                <th>Doctor</th>
                <th>Critical Tests</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r._id || idx}>
                  <td>{idx + 1}</td>
                  <td>{safe(r.mrNo)}</td>
                  <td>{safe(r.patientName)}</td>
                  <td>
                    {safe(r.gender, '-')}
                    {r.age ? `, ${r.age}` : ''}
                  </td>
                  <td>{fmtDate(r.date || r.createdAt)}</td>
                  <td>
                    <div>
                      <span className="text-gray-500 text-xs">In:</span>{' '}
                      {safe(r.sampleCollectionTime, '-')}
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Out:</span>{' '}
                      {safe(r.reportDeliveryTime, '-')}
                    </div>
                  </td>
                  <td>{safe(r.informedTo, '-')}</td>
                  <td>{safe(r.labTechSignature, '-')}</td>
                  <td>{safe(r.doctorSignature, '-')}</td>
                  <td>
                    {Array.isArray(r.tests) && r.tests.length ? (
                      <ul className="list-disc pl-5">
                        {r.tests.map((t, i) => (
                          <li key={i}>
                            <span className="font-medium">
                              {safe(t.testName)}
                            </span>
                            <span className="text-gray-600">
                              {' '}
                              — {safe(t.criticalValue)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">No tests</span>
                    )}
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={10} className="text-center text-gray-500 py-6">
                    No records for the selected date range
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-gray-500 pt-2 border-t">
          Computer generated document • {new Date().toLocaleString()}
        </div>
      </body>
    </html>
  );
};

export default PrintCriticalSummary;
