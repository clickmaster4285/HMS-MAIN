// pages/reception/opd/prints/PrintThermal.jsx
import React from 'react';

const PrintThermal = ({ formData }) => {
  // Extract data with proper fallbacks - check these paths match your formData structure
  const patientMRNo = formData?.patient_MRNo || formData?.patientMRNo || 'N/A';
  const patientName = formData?.patient_Name || formData?.patientName || 'N/A';
  const doctorName = formData?.visitData?.doctor?.user?.user_Name || formData?.doctorName || 'N/A';
  const doctorDepartment = formData?.visitData?.doctor?.doctor_Department || formData?.doctorDepartment || 'N/A';
  const doctorFee = formData?.visitData?.doctor?.doctor_Fee || formData?.doctorFee || 0;
  const discount = formData?.visitData?.discount || formData?.discount || 0;
  const totalFee = doctorFee - discount;
  const amountPaid = formData?.visitData?.amountPaid || formData?.amountPaid || 0;
  const paymentMethod = formData?.visitData?.paymentMethod || formData?.paymentMethod || 'cash';

  // Add token number if available
  const token = formData?.visitData?.token || 'N/A';

  return (
    <html>
      <head>
        <title>Thermal Print</title>
        <style>
          {`
            @page { size: 80mm auto; margin: 0; }
            body { 
              font-family: 'Courier New', monospace; 
              margin: 0; 
              padding: 2mm; 
              width: 80mm; 
              font-size: 12px; 
              line-height: 1.2;
            }
            .header { 
              text-align: center; 
              margin-bottom: 3px; 
              padding-bottom: 3px;
              border-bottom: 1px dashed #000;
            }
            .hospital-name { 
              font-weight: bold; 
              font-size: 14px; 
              text-transform: uppercase;
            }
            .info-item { 
              margin: 2px 0; 
              display: flex;
              justify-content: space-between;
            }
            .label { 
              font-weight: bold; 
              min-width: 40%;
            }
            .value {
              text-align: right;
              flex: 1;
            }
            .divider { 
              border-top: 1px dashed #000; 
              margin: 5px 0; 
            }
            .footer { 
              font-size: 10px; 
              text-align: center; 
              margin-top: 8px;
              padding-top: 3px;
              border-top: 1px dashed #000;
            }
            .token-number {
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              margin: 5px 0;
              padding: 3px;
              border: 1px solid #000;
            }
            @media print {
              body { padding: 2mm; width: 80mm; }
            }
          `}
        </style>
      </head>
      <body>
        <div className="header">
          <div className="hospital-name">Al-Shahbaz Hospital</div>
          <div>PATIENT REGISTRATION</div>
          <div>{new Date().toLocaleDateString()}</div>
        </div>

        <div className="divider"></div>

        {/* Token Number - prominently displayed */}
        <div className="token-number">
          Token: {token}
        </div>

        <div className="info-item">
          <span className="label">MR Number:</span>
          <span className="value">{patientMRNo}</span>
        </div>
        <div className="info-item">
          <span className="label">Name:</span>
          <span className="value">{patientName}</span>
        </div>
        <div className="info-item">
          <span className="label">Doctor:</span>
          <span className="value">Dr. {doctorName}</span>
        </div>
        <div className="info-item">
          <span className="label">Department:</span>
          <span className="value">{doctorDepartment}</span>
        </div>

        <div className="divider"></div>

        <div className="info-item">
          <span className="label">Fee:</span>
          <span className="value">Rs. {doctorFee.toLocaleString()}</span>
        </div>
        <div className="info-item">
          <span className="label">Discount:</span>
          <span className="value">- Rs. {discount.toLocaleString()}</span>
        </div>
        <div className="info-item">
          <span className="label">Total:</span>
          <span className="value">Rs. {totalFee.toLocaleString()}</span>
        </div>

        {amountPaid > 0 && (
          <>
            <div className="info-item">
              <span className="label">Paid:</span>
              <span className="value">Rs. {amountPaid.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Method:</span>
              <span className="value" style={{ textTransform: 'capitalize' }}>
                {paymentMethod.replace('_', ' ')}
              </span>
            </div>
          </>
        )}

        <div className="divider"></div>

        <div className="footer">
          <div style={{ fontWeight: 'bold' }}>Thank you for visiting</div>
          <div>Please wait for your turn</div>
        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 300);
          `
        }} />
      </body>
    </html>
  );
};

export default PrintThermal;