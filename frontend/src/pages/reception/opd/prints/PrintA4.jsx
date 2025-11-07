import React from 'react';
import Logo from '../../../../assets/images/logo1.png';

const PrintA4 = ({ formData }) => {
  const safeData = (value, fallback = '_________') => {
    if (value === null || value === undefined || value === '') return fallback;
    return value;
  };

  // Extract data with proper fallbacks based on your actual form structure
  const patientMRNo = formData?.patient_MRNo || formData?.patientMRNo || '_______';
  const patientName = formData?.patient_Name || formData?.patientName || '_______';
  const patientAge = formData?.patient_Age || formData?.age || '_______';
  const patientGender = formData?.patient_Gender || formData?.gender || '_______';
  const guardianName = formData?.patient_Guardian?.guardian_Name || formData?.guardianName || '_______';
  const guardianContact = formData?.patient_Guardian?.guardian_Contact || formData?.guardianContact || '_______';
  const guardianRelation = formData?.patient_Guardian?.guardian_Relation || formData?.guardianRelation || '_______';
  const patientAddress = formData?.patient_Address || formData?.address || '_______';
  const maritalStatus = formData?.patient_MaritalStatus || formData?.maritalStatus || '_______';

  const doctorName = formData?.visitData?.doctor?.user?.user_Name || formData?.doctorName || '_______';
  const doctorQualification = formData?.visitData?.doctor?.doctor_Qualifications || formData?.doctorQualification || '_______';
  const doctorDepartment = formData?.visitData?.doctor?.doctor_Department || formData?.doctorDepartment || '_______';
  const doctorSpecialization = formData?.visitData?.doctor?.doctor_Specialization || formData?.doctorSpecialization || '_______';

  // Visit data
  const purpose = formData?.visitData?.purpose || '_______';
  const disease = formData?.visitData?.disease || '_______';
  const referredBy = formData?.visitData?.referredBy || '_______';
  const verbalConsentObtained = formData?.visitData?.verbalConsentObtained || false;

  // Payment info
  const amountStatus = formData?.visitData?.amountStatus || 'cash';
  const token = formData?.visitData?.token || 0;
  const notes = formData?.visitData?.notes;

  // Convert logo to base64 for reliable printing
  const [logoDataUrl, setLogoDataUrl] = React.useState('');

  React.useEffect(() => {
    // Convert logo to base64 for reliable printing
    const convertImageToBase64 = (url, callback) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        callback(dataURL);
      };
      img.src = url;
    };

    convertImageToBase64(Logo, (base64) => {
      setLogoDataUrl(base64);
    });
  }, []);

  return (
    <html>
      <head>
        <title>Patient Registration - A4 Form</title>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600&family=Roboto:wght@400;500&display=swap');

            /* Base font for all text */
            body {
              font-family: 'Roboto', sans-serif;
              font-weight: 400;
              font-size: 18px;
              background-image: ${logoDataUrl ? `url(${logoDataUrl})` : 'none'};
              background-repeat: no-repeat;
              background-position: center;
              background-size: 300px;
              background-attachment: fixed;
              opacity: 1;
            }
            
            /* Form title */
            .form-title {
              font-family: 'Montserrat', sans-serif;
              font-weight: 600;
            }
            
            /* Section headers */
            .section-title, .vital-title {
              font-family: 'Montserrat', sans-serif;
              font-weight: 500;
              font-size: 14px;    
            }
            
            /* Labels */
            .detail-label { 
              font-weight: 500; /* Semi-bold for labels */
            }

            @page {
              size: A4;
              margin: 5mm 10mm;
            }
              
            .print-body {
              margin: 0;
              padding: 5mm;
              color: #333;
              width: 210mm;
              height: 277mm;
              position: relative;
              font-size: 13px;
              line-height: 1.3;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            /* Watermark styles */
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              opacity: 0.08;
              z-index: -1;
              width: 400px;
              height: auto;
              pointer-events: none;
            }

            .header-container {
              display: flex;
              width: 100%;
              border-bottom: 2px solid #2b6cb0;
              padding-bottom: 5mm;
              margin-bottom: 5mm;
              page-break-inside: avoid;
            }

            .logo-section {
              width: 30%;
              min-width: 40mm;
            }

            .logo {
              height: 20mm;
              width: auto;
              max-width: 100%;
            }

            .hospital-name {
              font-family: 'Montserrat', sans-serif;
              font-size: 20px;
              font-weight: 600;
              color: #2b6cb0;
              margin-top: 2mm;
            }

            .patient-details-section,
            .doctor-details-section {
              width: 35%;
              padding: 0 5mm;
              border-left: 1px solid #ddd;
              overflow: hidden;
            }

            .section-title {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 3mm;
              color: #2b6cb0;
            }

            .detail-row {
              display: flex;
              margin-bottom: 2mm;
              min-height: 5mm;
            }

            .detail-label {
              font-weight: bold;
              width: 35mm;
              min-width: 35mm;
            }

            .detail-value {
              flex-grow: 1;
              word-break: break-word;
            }

            .vital-signs {
              display: flex;
              margin: 5mm 0;
              page-break-inside: avoid;
            }

            .vital-signs-left {
              width: 50%;
              padding-right: 5mm;
            }

            .vital-signs-right {
              width: 50%;
              padding-left: 5mm;
              border-left: 1px solid #ddd;
            }

            .vital-title {
              font-weight: bold;
              margin-bottom: 3mm;
              font-size: 14px;
            }

            .main-content-area {
              height: 210mm;
              margin-top: 3mm;
              padding: 3mm;
              position: relative;
              page-break-inside: avoid;
            }

            .good-border {
              border-left: 2px solid;
              border-right: 2px solid;
              border-image: linear-gradient(to bottom, #1371d6, #d61323) 1;
              padding: 3mm;
              height: 100%;
              border-radius: 2mm;
              box-sizing: border-box;
              background-color: rgba(249, 249, 249, 0.9);
            }

            .footer {
              position: absolute;
              bottom: 5mm;
              left: 0;
              right: 0;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }

            .signature-box {
              width: 60mm;
              border-top: 1px solid #333;
              text-align: center;
              padding-top: 2mm;
              font-size: 12px;
            }

            .form-title {
              font-size: 18px;
              font-weight: bold;
              text-align: center;
              margin: 3mm 0;
              color: #2b6cb0;
            }

            .date-time {
              font-size: 11px;
              text-align: right;
              margin-bottom: 2mm;
              color: #666;
            }

            .contact-info {
              text-align: right;
              transform: skewX(-10deg);
              background: #0891b2;
              background: linear-gradient(to right, #0891b2, #4b5563);
              color: white;
              padding: 2mm 5mm;
              max-width: 80mm;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              position: absolute;
              bottom: 5mm;
              right: 0;
            }

            .contact-info div:first-child {
              font-weight: bold;
              font-size: 14px;
            }

            .no-print {
              display: none;
            }
            
            .hospital-name-urdu {
              font-family: 'Noto Nastaliq Urdu', sans-serif;
              font-size: 26px;
              margin-top: 0.75rem;
              margin-right: 1rem;
              direction: rtl;
              line-height: 1.4;
              font-weight: 800;
              color: #2b6cb0;
            }

            .payment-info {
              margin-top: 5mm;
              padding: 3mm;
              border: 1px solid #ddd;
              border-radius: 2mm;
              background: rgba(248, 250, 252, 0.9);
            }

            .payment-row {
              display: flex;
              justify-content: space-between;
              margin: 2mm 0;
            }

            .payment-total {
              font-weight: bold;
              border-top: 1px solid #ccc;
              padding-top: 2mm;
              margin-top: 2mm;
            }
            
            .disclamare {
              position: absolute;
              bottom: 2mm;
              left: 50%;
              transform: translateX(-50%);
              font-size: 14px;
              color: red;
              font-weight: bold;
              text-align: center;
              width: 100%;
            }

            .content {
              position: relative;
              z-index: 1;
            }

            /* Checkbox styles for printing */
            .vco-checkbox {
              width: 14px;
              height: 14px;
              border: 2px solid #333;
              display: inline-block;
              margin-right: 5px;
              vertical-align: middle;
              position: relative;
            }
            
            .vco-checkbox.checked:before {
              content: "✓";
              position: absolute;
              top: -2px;
              left: 1px;
              font-size: 12px;
              font-weight: bold;
            }

            @media print {
              .print-body {
                padding: 0;
                margin: 0;
                width: 210mm;
                height: 297mm;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                background-image: ${logoDataUrl ? `url(${logoDataUrl})` : 'none'} !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
                background-size: 300px !important;
                background-attachment: fixed !important;
                opacity: 1 !important;
              }
              
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .no-print {
                display: none !important;
              }
              
              .watermark {
                opacity: 0.05 !important;
              }
              
              .contact-info {
                background: #0891b2 !important;
              }
              
              .good-border {
                background-color: rgba(249, 249, 249, 0.9) !important;
              }
              
              .payment-info {
                background: rgba(248, 250, 252, 0.9) !important;
              }
              
              .vco-checkbox {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          `}
        </style>
      </head>
      <body className="print-body">
        {/* Watermark background */}
        {logoDataUrl && (
          <img src={logoDataUrl} className="watermark" alt="Hospital Watermark" />
        )}

        <div className="content">
          <div className="date-time">
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          <div className="form-title">PATIENT REGISTRATION FORM</div>

          <div className="header-container">
            <div className="logo-section">
              <img src={logoDataUrl || Logo} className="logo" alt="Hospital Logo" />
              <div className="hospital-name">Al-Shahbaz Hospital</div>
              <div className="hospital-name-urdu">
                الشہباز ہسپتال
              </div>
            </div>

            <div className="patient-details-section">
              <div className="section-title">PATIENT DETAILS</div>
              <div className="detail-row">
                <span className="detail-label">Token Number:</span>
                <span className="detail-value">{safeData(token)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">MR Number:</span>
                <span className="detail-value">{safeData(patientMRNo)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Patient Name:</span>
                <span className="detail-value">{safeData(patientName)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Age/Gender:</span>
                <span className="detail-value">{safeData(patientAge)}/{safeData(patientGender)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Guardian Name:</span>
                <span className="detail-value">{safeData(guardianName)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Guardian Contact:</span>
                <span className="detail-value">{safeData(guardianContact)}/{safeData(guardianRelation)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{safeData(patientAddress)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Referred By:</span>
                <span className="detail-value">{safeData(referredBy)}</span>
              </div>
            </div>

            <div className="doctor-details-section">
              <div className="section-title">DOCTOR & VISIT DETAILS</div>
              <div className="detail-row">
                <span className="detail-label">Doctor Name:</span>
                <span className="detail-value">{safeData(doctorName)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Qualification:</span>
                <span className="detail-value">{safeData(doctorQualification)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Department:</span>
                <span className="detail-value">{safeData(doctorDepartment)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Specialization:</span>
                <span className="detail-value">{safeData(doctorSpecialization)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Visit Purpose:</span>
                <span className="detail-value">{safeData(purpose)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Disease/Condition:</span>
                <span className="detail-value">{safeData(disease)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payment Status:</span>
                <span style={{ textTransform: 'capitalize' }}>{safeData(amountStatus)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">VCO:</span>
                <span className="detail-value">
                  <span className={`vco-checkbox ${verbalConsentObtained ? 'checked' : ''}`}></span>
                </span>
              </div>
            </div>
          </div>

          <div className="main-content-area">
            <div className="good-border">
              <div className="section-title">DOCTOR'S NOTES & OBSERVATIONS</div>
              <div style={{ minHeight: '150mm', marginTop: '3mm', whiteSpace: 'pre-wrap' }}>
                {safeData(notes, 'No notes recorded.')}
              </div>
            </div>
          </div>

          <div className="footer">
            <div className="signature-box">
              Doctor Signature/Stamp
            </div>
          </div>

          <div className="disclamare">
            Note: Not Valid For The Court !
          </div>

          <div className="contact-info">
            <div>Al-Shabaz Hospital</div>
            <div>Loc: Thana Road Kahuta</div>
            <div>Ph: 051-3312120, 3311111</div>
          </div>
        </div>

        <button className="no-print" style={{
          position: 'fixed',
          top: '10mm',
          right: '10mm',
          padding: '2mm 5mm',
          background: '#2b6cb0',
          color: 'white',
          border: 'none',
          borderRadius: '2mm',
          cursor: 'pointer',
          zIndex: 1000
        }} onClick={() => window.print()}>
          Print
        </button>
      </body>
    </html>
  );
};

export default PrintA4;