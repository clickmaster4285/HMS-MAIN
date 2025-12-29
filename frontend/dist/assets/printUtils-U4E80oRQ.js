import{j as e,e as j}from"./index-D_CM1r6M.js";import{R as b}from"./server.browser-DuO4EFVg.js";import{l as u}from"./logo1-Cp_MkaTU.js";const L=({formData:i})=>{const s=i?.patient_MRNo||i?.patientMRNo||"N/A",a=i?.patient_Name||i?.patientName||"N/A",n=i?.visitData?.doctor?.user?.user_Name||i?.doctorName||"N/A",h=i?.visitData?.doctor?.doctor_Department||i?.doctorDepartment||"N/A",r=i?.visitData?.doctor?.doctor_Fee||i?.doctorFee||0,c=i?.visitData?.discount||i?.discount||0,x=r-c,m=i?.visitData?.amountPaid||i?.amountPaid||0,g=i?.visitData?.paymentMethod||i?.paymentMethod||"cash",N=i?.visitData?.token||"N/A";return e.jsxs("html",{children:[e.jsxs("head",{children:[e.jsx("title",{children:"Thermal Print"}),e.jsx("style",{children:`
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
          `})]}),e.jsxs("body",{children:[e.jsxs("div",{className:"header",children:[e.jsx("div",{className:"hospital-name",children:"Al-Shahbaz Hospital"}),e.jsx("div",{children:"PATIENT REGISTRATION"}),e.jsx("div",{children:new Date().toLocaleDateString()})]}),e.jsx("div",{className:"divider"}),e.jsxs("div",{className:"token-number",children:["Token: ",N]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"MR Number:"}),e.jsx("span",{className:"value",children:s})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Name:"}),e.jsx("span",{className:"value",children:a})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Doctor:"}),e.jsxs("span",{className:"value",children:["Dr. ",n]})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Department:"}),e.jsx("span",{className:"value",children:h})]}),e.jsx("div",{className:"divider"}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Fee:"}),e.jsxs("span",{className:"value",children:["Rs. ",r.toLocaleString()]})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Discount:"}),e.jsxs("span",{className:"value",children:["- Rs. ",c.toLocaleString()]})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Total:"}),e.jsxs("span",{className:"value",children:["Rs. ",x.toLocaleString()]})]}),m>0&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Paid:"}),e.jsxs("span",{className:"value",children:["Rs. ",m.toLocaleString()]})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Method:"}),e.jsx("span",{className:"value",style:{textTransform:"capitalize"},children:g.replace("_"," ")})]})]}),e.jsx("div",{className:"divider"}),e.jsxs("div",{className:"footer",children:[e.jsx("div",{style:{fontWeight:"bold"},children:"Thank you for visiting"}),e.jsx("div",{children:"Please wait for your turn"})]}),e.jsx("script",{dangerouslySetInnerHTML:{__html:`
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 300);
          `}})]})]})},E=({formData:i})=>{const s=(o,d="_________")=>o==null||o===""?d:o,a=i?.patient_MRNo||i?.patientMRNo||"_______",n=i?.patient_Name||i?.patientName||"_______",h=i?.patient_Age||i?.age||"_______",r=i?.patient_Gender||i?.gender||"_______",c=i?.patient_Guardian?.guardian_Name||i?.guardianName||"_______",x=i?.patient_Guardian?.guardian_Contact||i?.guardianContact||"_______",m=i?.patient_Guardian?.guardian_Relation||i?.guardianRelation||"_______",g=i?.patient_Address||i?.address||"_______";i?.patient_MaritalStatus||i?.maritalStatus;const N=i?.visitData?.doctor?.user?.user_Name||i?.doctorName||"_______",v=i?.visitData?.doctor?.doctor_Qualifications||i?.doctorQualification||"_______",_=i?.visitData?.doctor?.doctor_Department||i?.doctorDepartment||"_______",f=i?.visitData?.doctor?.doctor_Specialization||i?.doctorSpecialization||"_______",w=i?.visitData?.purpose||"_______",y=i?.visitData?.disease||"_______",k=i?.visitData?.referredBy||"_______",A=i?.visitData?.verbalConsentObtained||!1,T=i?.visitData?.amountStatus||"cash",S=i?.visitData?.token||0,R=i?.visitData?.notes,[t,z]=j.useState("");return j.useEffect(()=>{((d,I)=>{const l=new Image;l.crossOrigin="Anonymous",l.onload=()=>{const p=document.createElement("canvas"),C=p.getContext("2d");p.width=l.width,p.height=l.height,C.drawImage(l,0,0);const P=p.toDataURL("image/png");I(P)},l.src=d})(u,d=>{z(d)})},[]),e.jsxs("html",{children:[e.jsxs("head",{children:[e.jsx("title",{children:"Patient Registration - A4 Form"}),e.jsx("style",{children:`
            @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600&family=Roboto:wght@400;500&display=swap');

            /* Base font for all text */
            body {
              font-family: 'Roboto', sans-serif;
              font-weight: 400;
              font-size: 18px;
              background-image: ${t?`url(${t})`:"none"};
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
              grow: 1;
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
                background-image: ${t?`url(${t})`:"none"} !important;
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
          `})]}),e.jsxs("body",{className:"print-body",children:[t&&e.jsx("img",{src:t,className:"watermark",alt:"Hospital Watermark"}),e.jsxs("div",{className:"content",children:[e.jsxs("div",{className:"date-time",children:[new Date().toLocaleDateString()," ",new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})]}),e.jsx("div",{className:"form-title",children:"PATIENT REGISTRATION FORM"}),e.jsxs("div",{className:"header-container",children:[e.jsxs("div",{className:"logo-section",children:[e.jsx("img",{src:t||u,className:"logo",alt:"Hospital Logo"}),e.jsx("div",{className:"hospital-name",children:"Al-Shahbaz Hospital"}),e.jsx("div",{className:"hospital-name-urdu",children:"الشہباز ہسپتال"})]}),e.jsxs("div",{className:"patient-details-section",children:[e.jsx("div",{className:"section-title",children:"PATIENT DETAILS"}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Token Number:"}),e.jsx("span",{className:"detail-value",children:s(S)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"MR Number:"}),e.jsx("span",{className:"detail-value",children:s(a)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Patient Name:"}),e.jsx("span",{className:"detail-value",children:s(n)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Age/Gender:"}),e.jsxs("span",{className:"detail-value",children:[s(h),"/",s(r)]})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Guardian Name:"}),e.jsx("span",{className:"detail-value",children:s(c)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Guardian Contact:"}),e.jsxs("span",{className:"detail-value",children:[s(x),"/",s(m)]})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Address:"}),e.jsx("span",{className:"detail-value",children:s(g)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Referred By:"}),e.jsx("span",{className:"detail-value",children:s(k)})]})]}),e.jsxs("div",{className:"doctor-details-section",children:[e.jsx("div",{className:"section-title",children:"DOCTOR & VISIT DETAILS"}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Doctor Name:"}),e.jsx("span",{className:"detail-value",children:s(N)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Qualification:"}),e.jsx("span",{className:"detail-value",children:s(v)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Department:"}),e.jsx("span",{className:"detail-value",children:s(_)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Specialization:"}),e.jsx("span",{className:"detail-value",children:s(f)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Visit Purpose:"}),e.jsx("span",{className:"detail-value",children:s(w)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Disease/Condition:"}),e.jsx("span",{className:"detail-value",children:s(y)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Payment Status:"}),e.jsx("span",{style:{textTransform:"capitalize"},children:s(T)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"VCO:"}),e.jsx("span",{className:"detail-value",children:e.jsx("span",{className:`vco-checkbox ${A?"checked":""}`})})]})]})]}),e.jsx("div",{className:"main-content-area",children:e.jsxs("div",{className:"good-border",children:[e.jsx("div",{className:"section-title",children:"DOCTOR'S NOTES & OBSERVATIONS"}),e.jsx("div",{style:{minHeight:"150mm",marginTop:"3mm",whiteSpace:"pre-wrap"},children:s(R,"No notes recorded.")})]})}),e.jsx("div",{className:"footer",children:e.jsx("div",{className:"signature-box",children:"Doctor Signature/Stamp"})}),e.jsx("div",{className:"disclamare",children:"Note: Not Valid For The Court !"}),e.jsxs("div",{className:"contact-info",children:[e.jsx("div",{children:"Al-Shabaz Hospital"}),e.jsx("div",{children:"Loc: Thana Road Kahuta"}),e.jsx("div",{children:"Ph: 051-3312120, 3311111"})]})]}),e.jsx("button",{className:"no-print",style:{position:"fixed",top:"10mm",right:"10mm",padding:"2mm 5mm",background:"#2b6cb0",color:"white",border:"none",borderRadius:"2mm",cursor:"pointer",zIndex:1e3},onClick:()=>window.print(),children:"Print"})]})]})},M=({formData:i})=>e.jsxs("html",{children:[e.jsxs("head",{children:[e.jsx("title",{children:"Patient Registration - PDF"}),e.jsx("style",{children:`
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #2b6cb0; padding-bottom: 10px; }
            .hospital-name { font-size: 24px; font-weight: bold; color: #2b6cb0; margin-bottom: 5px; }
            .form-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .patient-info { margin-bottom: 30px; }
            .section-title { font-weight: bold; background-color: #f0f4f8; padding: 5px 10px; margin: 15px 0 10px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-item { margin-bottom: 8px; }
            .label { font-weight: bold; display: inline-block; width: 150px; }
            .footer { margin-top: 30px; text-align: right; font-size: 12px; }
            .watermark { position: fixed; opacity: 0.1; font-size: 80px; color: #2b6cb0; 
                         transform: rotate(-45deg); top: 50%; left: 50%; transform-origin: center center; }
          `})]}),e.jsxs("body",{children:[e.jsx("div",{className:"watermark",children:"CONFIDENTIAL"}),e.jsxs("div",{className:"header",children:[e.jsx("div",{className:"hospital-name",children:"Al-Shahbaz Hospital"}),e.jsx("div",{className:"form-title",children:"PATIENT REGISTRATION - OFFICIAL RECORD"}),e.jsx("div",{children:new Date().toLocaleDateString()})]}),e.jsxs("div",{className:"patient-info",children:[e.jsx("div",{className:"section-title",children:"PATIENT DETAILS"}),e.jsxs("div",{className:"info-grid",children:[e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"MR Number:"})," ",i.mrNumber||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Registration Date:"})," ",new Date().toLocaleDateString()]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Patient Name:"})," ",i.patientName||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Father/Husband:"})," ",i.fatherHusbandName||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Date of Birth:"})," ",i.dob||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Age:"})," ",i.age||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Gender:"})," ",i.gender||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Marital Status:"})," ",i.maritalStatus||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"CNIC:"})," ",i.cnic||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Blood Group:"})," ",i.bloodGroup||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Mobile:"})," ",i.mobileNumber||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Emergency Contact:"})," ",i.emergencyContact||"N/A"]}),e.jsxs("div",{className:"info-item",style:{gridColumn:"span 2"},children:[e.jsx("span",{className:"label",children:"Address:"})," ",i.address||"N/A"]})]}),e.jsx("div",{className:"section-title",children:"MEDICAL INFORMATION"}),e.jsxs("div",{className:"info-grid",children:[e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Consulting Doctor:"})," ",i.doctor||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Department:"})," ",i.doctorDepartment||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Specialization:"})," ",i.doctorSpecialization||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Qualification:"})," ",i.doctorQualification||"N/A"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Referred By:"})," ",i.referredBy||"N/A"]})]}),e.jsx("div",{className:"section-title",children:"BILLING DETAILS"}),e.jsxs("div",{className:"info-grid",children:[e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Consultation Fee:"})," Rs. ",i.doctorFee||"0"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Discount:"})," Rs. ",i.discount||"0"]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"label",children:"Total Fee:"})," Rs. ",i.totalFee||"0"]})]})]}),e.jsxs("div",{className:"footer",children:[e.jsx("div",{children:"This is an official document of Al-Shahbaz Hospital"}),e.jsxs("div",{children:["Generated on: ",new Date().toLocaleString()]})]}),e.jsx("script",{children:`
            setTimeout(function() {
              alert("In a real implementation, this would generate and download a PDF file.");
            }, 500);
          `})]})]}),O=i=>{const s=window.open("","_blank"),a=`
    <!DOCTYPE html>
    ${b.renderToString(e.jsx(L,{formData:i}))}
  `;s.document.write(a),s.document.close()},F=i=>{const s=window.open("","_blank"),a=`
    <!DOCTYPE html>
    ${b.renderToString(e.jsx(E,{formData:i}))}
  `;s.document.write(a),s.document.close();const n=()=>{s.print(),s.onafterprint=()=>s.close()};s.document.readyState==="complete"?setTimeout(n,500):s.addEventListener("load",()=>{setTimeout(n,500)},{once:!0})},G=i=>{const s=window.open("","_blank");s.document.write(`
    <!DOCTYPE html>
    ${b.renderToString(e.jsx(M,{formData:i}))}
  `),s.document.close()},Q=(i,s)=>{if(!s)throw new Error("Please select a print option");switch(s){case"thermal":O(i);break;case"a4":F(i);break;case"pdf":G(i);break;default:throw new Error("Invalid print option")}return!0};export{Q as h};
