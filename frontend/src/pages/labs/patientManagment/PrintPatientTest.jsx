import React from 'react';
import Logo from '../../../assets/images/logo1.png';
import { QRCodeSVG } from 'qrcode.react';

const PrintA4 = ({ formData }) => {
  
  const safe = (v, fallback = '_________') =>
    v !== undefined && v !== null && v !== '' ? v : fallback;
  const formatCurrency = (amount) =>
    amount?.toLocaleString('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }) || '_________';

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <html>
      <head>
        <style>{`
          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #000;
            margin: 0;
            padding: 20px;
          }
          .header {
            display: flex;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .logo-container {
            flex: 0 0 120px;
          }
          .logo {
            width: 120px;
            height: auto;
          }
          .hospital-details {
            flex: 1;
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .hospital-name {
            font-size: 20px;
            font-weight: bold;
            text-align: left;
            margin-bottom: 5px;
          }
          .hospital-info {
            font-size: 11px;
            text-align: left;
          }
          .hospital-info p {
            margin: 2px 0;
          }
          hr {
            border: none;
            border-top: 3px solid #000;
            margin: 30px 0;
          }
          .details-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .details-block {
            width: 48%;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 6px;
            text-align: left;
          }
          th {
            background-color: #eee;
          }
          tfoot td {
            font-weight: bold;
          }
          .footer {
            display: flex;
            justify-content: space-around;
            margin-top: 40px;
            font-size: 12px;
          }
          .signature {
            width: 30%;
            text-align: center;
            border-top: 1px solid #000;
            padding-top: 5px;
          }
          .duplicate-section {
            page-break-inside: avoid;
            page-break-before: auto;
          }
          @media print {
            .duplicate-section {
              page-break-inside: avoid;
              page-break-before: auto;
            }
          }
        `}</style>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Header Section */}
        <div className="header">
          <div className="logo-container">
            <img src={Logo} alt="Logo" className="logo" />
          </div>
          <div className="hospital-details">
            <div className="hospital-name">AL-SHAHBAZ HOSPITAL</div>
            <div className="hospital-info">
              <p>THANA ROAD KAHUTA.</p>

              <p>Tel: 051-3311342</p>
            </div>
          </div>
        </div>

        {/* Patient & Lab Info */}
        <div className="details-row">
          <div className="details-block">
            <p>
              <strong>MR-NO:</strong> {safe(formData.patient?.MRNo)}
            </p>
            <p>
              <strong>Patient Name:</strong> {safe(formData.patient?.Name)}
            </p>
            <p>
              <strong>Gender:</strong> {safe(formData.patient?.Gender)}
            </p>
            <p>
              <strong>Age:</strong> {safe(formData.patient?.Age)}
            </p>
            <p>
              <strong>Phone Number:</strong> {safe(formData.patient?.ContactNo)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '16px', marginLeft: '10px' }}>
              Lab Test Slip
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginRight: '60px',
                marginTop: '10px',
              }}
            >
              <QRCodeSVG
                value={`${formData.patient?.MRNo}_${formData.sampleDate}_${formData.tokenNumber}`}
                size={100}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
          <div className="details-block">
            <p>
              <strong>Sample Date:</strong> {safe(formData.sampleDate)}
            </p>
   
            <p>
              <strong>Print Time:</strong> {currentTime}
            </p>
            <p>
              <strong>Referred By:</strong> {safe(formData.patient?.ReferredBy)}
            </p>
          </div>
        </div>

        {/* Test Table */}
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Test Name</th>
              <th>Price (PKR)</th>
              <th>Discount (PKR)</th>
              <th>Advance (PKR)</th>
              <th>Final Amount (PKR)</th>
            </tr>
          </thead>
          <tbody>
            {(formData.tests || []).map((test, index) => {
              const price = test.price || test.amount || 0;
              const discount = test.discount || 0;
              const advance = test.paid || 0;
              const final = Math.max(0, price - discount - advance);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{safe(test.testName)}</td>
                  <td>{formatCurrency(price)}</td>
                  <td>{formatCurrency(discount)}</td>
                  <td>{formatCurrency(advance)}</td>
                  <td>{formatCurrency(final)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" style={{ textAlign: 'right' }}>
                Total
              </td>
              <td>{formatCurrency(formData.totalAmount)}</td>
            </tr>
            <tr>
              <td colSpan="5" style={{ textAlign: 'right' }}>
                Paid
              </td>
              <td>{formatCurrency(formData.totalPaid)}</td>
            </tr>
            <tr>
              <td colSpan="5" style={{ textAlign: 'right' }}>
                Discount
              </td>
              <td>{formatCurrency(formData.totalDiscount)}</td>
            </tr>
            <tr>
              <td colSpan="5" style={{ textAlign: 'right' }}>
                Remaining Balance
              </td>
              <td>{formatCurrency(formData.remaining)}</td>
            </tr>
          </tfoot>
        </table>

        <hr />

        {/* Duplicate Section */}
        <div className="duplicate-section">
          <div className="details-row">
            <div className="details-block">
              <p>
                <strong>MR-NO:</strong> {safe(formData.patient?.MRNo)}
              </p>
              <p>
                <strong>Patient Name:</strong> {safe(formData.patient?.Name)}
              </p>
              <p>
                <strong>Gender:</strong> {safe(formData.patient?.Gender)}
              </p>
              <p>
                <strong>Age:</strong> {safe(formData.patient?.Age)}
              </p>
              <p>
                <strong>Phone Number:</strong>{' '}
                {safe(formData.patient?.ContactNo)}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '16px', marginLeft: '10px' }}>
                Lab Test Slip
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginRight: '60px',
                  marginTop: '10px',
                }}
              >
                <QRCodeSVG
                  value="https://www.youtube.com/watch?v=eGpS1VFqBZk"
                  size={100}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
            <div className="details-block">
              <p>
                <strong>Sample Date:</strong> {safe(formData.sampleDate)}
              </p>
              <p>
                <strong>Report Date:</strong>{' '}
                {safe(formData.reportDate || currentDate)}
              </p>
              <p>
                <strong>Print Time:</strong> {currentTime}
              </p>
              <p>
                <strong>Referred By:</strong> {safe(formData.patient?.ReferredBy)}
              </p>
            </div>
          </div>

          {/* Duplicate Test Table */}
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Test Name</th>
                <th>Price (PKR)</th>
                <th>Discount (PKR)</th>
                <th>Advance (PKR)</th>
                <th>Final Amount (PKR)</th>
              </tr>
            </thead>
            <tbody>
              {(formData.tests || []).map((test, index) => {
                const price = test.price || test.amount || 0;
                const discount = test.discount || 0;
                const advance = test.advancePayment || 0;
                const final = Math.max(0, price - discount - advance);
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{safe(test.testName)}</td>
                    <td>{formatCurrency(price)}</td>
                    <td>{formatCurrency(discount)}</td>
                    <td>{formatCurrency(advance)}</td>
                    <td>{formatCurrency(final)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" style={{ textAlign: 'right' }}>
                  Total
                </td>
                <td>{formatCurrency(formData.totalAmount)}</td>
              </tr>
              <tr>
                <td colSpan="5" style={{ textAlign: 'right' }}>
                  Paid
                </td>
                <td>{formatCurrency(formData.totalPaid)}</td>
              </tr>
              <tr>
                <td colSpan="5" style={{ textAlign: 'right' }}>
                  Discount
                </td>
                <td>{formatCurrency(formData.totalDiscount)}</td>
              </tr>
              <tr>
                <td colSpan="5" style={{ textAlign: 'right' }}>
                  Remaining Balance
                </td>
                <td>{formatCurrency(formData.remaining)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </body>
    </html>
  );
};

export default PrintA4;
