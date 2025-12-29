import{j as e,T as A,f as D,d as B,u as C,r as u,bk as T,bl as k,bm as P}from"./index-D_CM1r6M.js";import{M as p,D as z,n as M,i as L,a9 as y,q as F,E as _}from"./index-jLjFIv2f.js";import{j as I}from"./index-C4dsM683.js";import{R as E}from"./server.browser-DuO4EFVg.js";import"./iconBase-DSUUJbys.js";const $=({bill:a})=>{const s=(n,o="N/A")=>n||o,d=n=>{if(!n)return"N/A";const o=new Date(n),h=o.getDate().toString().padStart(2,"0"),x=(o.getMonth()+1).toString().padStart(2,"0"),b=o.getFullYear();return`${h}-${x}-${b}`},t=!!a.templateName||!!a.finalContent;return e.jsxs("html",{children:[e.jsxs("head",{children:[e.jsx("title",{children:"Bill Details"}),e.jsx("style",{children:`
            @page {
              size: A4;
              margin: 5mm 10mm;
            }
            
            body {
              margin: 0;
              padding: 5mm;
              color: #333;
              width: 190mm;
              height: 277mm;
              position: relative;
              font-size: 13px;
              line-height: 1.3;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-family: Arial, sans-serif;
            }

            .header {
              text-align: center;
              margin-bottom: 10px;
              border-bottom: 2px solid #2b6cb0;
              padding-bottom: 10px;
            }

            .hospital-name {
              font-size: 24px;
              font-weight: bold;
              color: #2b6cb0;
              margin-bottom: 5px;
              text-transform: uppercase;
            }

            .hospital-subtitle {
              font-size: 14px;
              color: #555;
              margin-bottom: 5px;
            }

            .patient-info, .billing-info, .test-table, .summary-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }

            .patient-info td, .billing-info td, .summary-table td {
              padding: 3px 5px;
              vertical-align: top;
              border: none;
            }

            .patient-info .label, .billing-info .label, .summary-table .label {
              font-weight: bold;
              width: 120px;
            }

            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }

            .section-title {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 5px;
              color: #2b6cb0;
              text-transform: uppercase;
            }

            .test-table {
              margin-bottom: 10px;
            }

            .test-table th {
              background-color: #f0f0f0;
              border: 1px solid #ddd;
              padding: 5px;
              text-align: left;
              font-weight: bold;
              font-size: 12px;
            }

            .test-table td {
              border: 1px solid #ddd;
              padding: 5px;
              font-size: 12px;
            }

            .status-paid {
              color: #2f855a;
              font-weight: bold;
            }

            .status-pending {
              color: #b7791f;
              font-weight: bold;
            }

            .footer {
              position: absolute;
              bottom: 10mm;
              width: 100%;
              display: flex;
              justify-content: space-between;
            }

            .signature {
              text-align: center;
              width: 150px;
              border-top: 1px solid #000;
              padding-top: 5px;
              margin-top: 30px;
              font-size: 12px;
            }

            .print-button {
              position: fixed;
              top: 10mm;
              right: 10mm;
              padding: 5px 10px;
              background: #2b6cb0;
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

            .radiology-report {
              margin-bottom: 15px;
            }

            .radiology-report .content {
              border: 1px solid #ddd;
              padding: 10px;
              background-color: #f9f9f9;
              max-height: 300px;
              overflow-y: auto;
            }
          `})]}),e.jsxs("body",{children:[e.jsx("button",{className:"print-button",onClick:()=>window.print(),children:"Print Bill"}),e.jsxs("div",{className:"header",children:[e.jsx("div",{className:"hospital-name",children:"AL-SHAHBAZ MODERN DIAGNOSTIC CENTER"}),e.jsx("div",{className:"hospital-subtitle",children:"ISO Certified Laboratory | Quality Assured"})]}),e.jsx("div",{className:"section-title",children:t?"Radiology Bill Details":"Bill Details"}),e.jsx("table",{className:"patient-info",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"label",children:"Token #"}),e.jsx("td",{children:s(a.billingSummary?.tokenNumber)}),e.jsx("td",{className:"label",children:"Date"}),e.jsx("td",{children:d(t?a.createdAt:a.testResults?.[0]?.createdAt)})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"label",children:"Patient Name"}),e.jsx("td",{children:s(a.patientDetails?.patient_Name||a.patientDetails?.patientName)}),e.jsx("td",{className:"label",children:"MR #"}),e.jsx("td",{children:s(a.patientDetails?.patient_MRNo||a.patientDetails?.patientMRNO)})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"label",children:"Gender"}),e.jsx("td",{children:s(a.patientDetails?.patient_Gender||a.patientDetails?.sex)}),e.jsx("td",{className:"label",children:"Contact #"}),e.jsx("td",{children:s(a.patientDetails?.patient_ContactNo)})]}),t&&a.referBy&&e.jsxs("tr",{children:[e.jsx("td",{className:"label",children:"Referred By"}),e.jsx("td",{children:s(a.referBy)})]})]})}),e.jsx("div",{className:"divider"}),e.jsx("div",{className:"section-title",children:"Billing Information"}),e.jsx("table",{className:"billing-info",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"label",children:"Total Amount"}),e.jsxs("td",{children:["Rs. ",s(a.billingSummary?.totalAmount.toLocaleString(),"0")]}),e.jsx("td",{className:"label",children:"Discount"}),e.jsxs("td",{children:["Rs. ",s(a.billingSummary?.discountAmount.toLocaleString(),"0")]})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"label",children:"Advance Paid"}),e.jsxs("td",{children:["Rs. ",s(a.billingSummary?.advanceAmount.toLocaleString(),"0")]}),e.jsx("td",{className:"label",children:"Remaining"}),e.jsxs("td",{children:["Rs. ",s(a.billingSummary?.remainingAmount.toLocaleString(),"0")]})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"label",children:"Payment Status"}),e.jsx("td",{className:`status-${a.billingSummary?.paymentStatus||"pending"}`,children:s(a.billingSummary?.paymentStatus,"Pending")}),e.jsx("td",{className:"label",children:"Paid After Report"}),e.jsxs("td",{children:["Rs. ",s(a.billingSummary?.paidAfterReport.toLocaleString(),"0")]})]})]})}),e.jsx("div",{className:"divider"}),e.jsx("div",{className:"section-title",children:t?"Radiology Report":"Test Results"}),t?e.jsxs("div",{className:"radiology-report",children:[e.jsxs("div",{style:{fontWeight:"bold",marginBottom:"5px"},children:["Template: ",s(a.templateName)]}),e.jsx("div",{className:"content",children:e.jsx("div",{dangerouslySetInnerHTML:{__html:s(a.finalContent,"<p>No report content available</p>")}})})]}):e.jsxs("table",{className:"test-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Test Name"}),e.jsx("th",{children:"Code"}),e.jsx("th",{children:"Price"}),e.jsx("th",{children:"Status"})]})}),e.jsx("tbody",{children:a.testResults?.map((n,o)=>e.jsxs("tr",{children:[e.jsx("td",{children:s(n.testDetails?.name)}),e.jsx("td",{children:s(n.testDetails?.code)}),e.jsxs("td",{children:["Rs. ",s(n.testDetails?.price.toLocaleString(),"0")]}),e.jsx("td",{className:n.status==="completed"?"status-paid":"status-pending",children:s(n.status)})]},o))})]}),e.jsx("div",{className:"divider"}),e.jsx("div",{className:"section-title",children:t?"Report Summary":"Test Summary"}),e.jsx("table",{className:"summary-table",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"label",children:"Total Items"}),e.jsx("td",{children:s(a.summary?.totalTests,t?"1":"0")}),e.jsx("td",{className:"label",children:"Completed"}),e.jsx("td",{children:s(a.summary?.completedTests,t&&a.billingSummary?.paymentStatus==="paid"?"1":"0")})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"label",children:"Pending"}),e.jsx("td",{children:s(a.summary?.pendingTests,t&&a.billingSummary?.paymentStatus==="pending"?"1":"0")})]})]})}),a.billingSummary?.labNotes&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"divider"}),e.jsx("div",{className:"section-title",children:"Lab Notes"}),e.jsx("div",{style:{fontSize:"12px",color:"#333"},children:s(a.billingSummary.labNotes)})]}),e.jsxs("div",{className:"footer",children:[e.jsxs("div",{className:"signature",children:[e.jsx("div",{children:"Prepared By"}),e.jsx("div",{children:"Billing Officer"})]}),e.jsxs("div",{className:"signature",children:[e.jsx("div",{children:"Verified By"}),e.jsx("div",{children:"Dr. Rabia Sadaf"}),e.jsx("div",{children:"Pathologist"})]}),e.jsxs("div",{className:"signature",children:[e.jsx("div",{children:"Approved By"}),e.jsx("div",{children:"Dr. M. Arif Qureshi"}),e.jsx("div",{children:"CEO"})]})]}),e.jsxs("div",{style:{textAlign:"center",marginTop:"20px",fontSize:"11px"},children:[e.jsx("p",{children:"This is a computer-generated bill and does not require a signature"}),e.jsx("p",{children:"For any queries, please contact: +92-51-1234567 | info@alshahbazdiagnostics.com"})]})]})]})},Q=()=>{const{id:a}=A(),s=D(),d=B(),{data:t,status:n,error:o}=C(i=>i.labBill.currentBill),[h,x]=u.useState(!1),[b,j]=u.useState(null);u.useEffect(()=>((async()=>{try{const l=await s(k(a)).unwrap();j("lab")}catch(l){if(l.statusCode===404)try{const m=await s(P(a)).unwrap();j("radiology")}catch(m){console.error("Failed to fetch radiology bill:",m)}else console.error("Failed to fetch lab bill:",l)}})(),()=>s(T())),[s,a]);const N=async()=>{if(t.billingSummary?.paymentStatus!=="paid"){x(!0);return}f()},f=async()=>{try{if(!t){alert("No bill data available for printing.");return}const i=E.renderToStaticMarkup(e.jsx($,{bill:t})),l=window.open("","_blank");if(!l){alert("Please allow popups for printing");return}l.document.open(),l.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Bill</title>
            <style>
              @page {
                size: A4;
                margin: 5mm 10mm;
              }
              
              body {
                margin: 0;
                padding: 5mm;
                color: #333;
                width: 190mm;
                height: 277mm;
                position: relative;
                font-size: 13px;
                line-height: 1.3;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                font-family: Arial, sans-serif;
              }

              .header {
                text-align: center;
                margin-bottom: 10px;
                border-bottom: 2px solid #2b6cb0;
                padding-bottom: 10px;
              }

              .hospital-name {
                font-size: 24px;
                font-weight: bold;
                color: #2b6cb0;
                margin-bottom: 5px;
                text-transform: uppercase;
              }

              .hospital-subtitle {
                font-size: 14px;
                color: #555;
                margin-bottom: 5px;
              }

              .patient-info, .billing-info, .test-table, .summary-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
              }

              .patient-info td, .billing-info td, .summary-table td {
                padding: 3px 5px;
                vertical-align: top;
                border: none;
              }

              .patient-info .label, .billing-info .label, .summary-table .label {
                font-weight: bold;
                width: 120px;
              }

              .divider {
                border-top: 1px dashed #000;
                margin: 10px 0;
              }

              .section-title {
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 5px;
                color: #2b6cb0;
                text-transform: uppercase;
              }

              .test-table {
                margin-bottom: 10px;
              }

              .test-table th {
                background-color: #f0f0f0;
                border: 1px solid #ddd;
                padding: 5px;
                text-align: left;
                font-weight: bold;
                font-size: 12px;
              }

              .test-table td {
                border: 1px solid #ddd;
                padding: 5px;
                font-size: 12px;
              }

              .status-paid {
                color: #2f855a;
                font-weight: bold;
              }

              .status-pending {
                color: #b7791f;
                font-weight: bold;
              }

              .footer {
                position: absolute;
                bottom: 10mm;
                width: 100%;
                display: flex;
                justify-content: space-between;
              }

              .signature {
                text-align: center;
                width: 150px;
                border-top: 1px solid #000;
                padding-top: 5px;
                margin-top: 30px;
                font-size: 12px;
              }

              @media print {
                body {
                  padding: 0;
                  margin: 0;
                  width: 210mm;
                  height: 297mm;
                }
              }

              .radiology-report {
                margin-bottom: 15px;
              }

              .radiology-report h3 {
                font-size: 16px;
                margin-bottom: 5px;
              }

              .radiology-report .content {
                border: 1px solid #ddd;
                padding: 10px;
                background-color: #f9f9f9;
                max-height: 300px;
                overflow-y: auto;
              }
            </style>
          </head>
          <body>${i}</body>
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            };
          <\/script>
        </html>
      `),l.document.close()}catch(i){console.error("Error in proceedWithPrint:",i),alert(`Failed to print bill: ${i.message||"Unknown error"}`)}},v=({isOpen:i,onClose:l,onConfirm:m})=>i?e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-transform duration-300 ease-in-out scale-95 animate-scale-up",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-800",children:"Payment Pending"}),e.jsx("button",{onClick:l,className:"text-gray-400 hover:text-gray-600",children:e.jsx(I,{size:20})})]}),e.jsx("p",{className:"text-sm text-gray-600 mb-6",children:"The payment is pending. Are you sure you want to print the bill before payment?"}),e.jsxs("div",{className:"flex justify-end space-x-3",children:[e.jsx("button",{onClick:l,className:"px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors",children:"Cancel"}),e.jsx("button",{onClick:m,className:"px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors",children:"Confirm Print"})]})]})}):null;if(n==="loading")return e.jsx("div",{className:"flex justify-center items-center h-screen bg-white",children:e.jsx("div",{className:"animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"})});if(n==="failed")return e.jsx("div",{className:"max-w-4xl mx-auto p-4",children:e.jsxs("div",{className:"bg-red-50 border-l-4 border-red-500 p-4 rounded-lg",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("svg",{className:"h-5 w-5 text-red-500 mr-2",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})}),e.jsx("p",{className:"text-sm text-red-700",children:o||"Failed to load bill details"})]}),e.jsxs("button",{onClick:()=>d(-1),className:"mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition",children:[e.jsx(p,{className:"inline mr-1"})," Go Back"]})]})});if(!t)return e.jsxs("div",{className:"max-w-4xl mx-auto p-4 text-center",children:[e.jsx("p",{className:"text-gray-500 mb-4",children:"No bill data found"}),e.jsxs("button",{onClick:()=>d(-1),className:"px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition",children:[e.jsx(p,{className:"inline mr-1"})," Back to Bills"]})]});const c=!!t.templateName||!!t.finalContent,g=i=>Number(i)||0,w=g(t?.billingSummary?.discountAmount),S=Array.isArray(t?.billingSummary?.refunded)?t.billingSummary.refunded.reduce((i,l)=>i+g(l.refundAmount),0):g(t?.billingSummary?.refundableAmount),R=w+S;return e.jsxs("div",{className:"max-w-4xl mx-auto p-4 bg-white min-h-screen",children:[e.jsx(v,{isOpen:h,onClose:()=>x(!1),onConfirm:()=>{f(),x(!1)}}),e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("button",{onClick:()=>d(-1),className:"mr-4 text-teal-600 hover:text-teal-800 transition","aria-label":"Go back",children:e.jsx(p,{className:"text-xl"})}),e.jsx("div",{className:"bg-teal-100 p-2 rounded-full mr-3",children:e.jsx(z,{className:"text-teal-600 text-xl"})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-800",children:c?"Radiology Bill Details":"Bill Details"}),e.jsxs("p",{className:"text-teal-600 text-sm",children:["Token #: ",t.billingSummary?.tokenNumber||"N/A"]})]})]}),e.jsxs("div",{className:"bg-white shadow-lg rounded-xl overflow-hidden",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 p-6",children:[e.jsxs("div",{className:"bg-teal-50 p-4 rounded-lg",children:[e.jsxs("h3",{className:"font-semibold text-lg text-gray-800 mb-3 flex items-center",children:[e.jsx(M,{className:"mr-2 text-teal-600"})," Patient Information"]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{label:"Name",value:t.patient?.patient_Name||t.patientDetails?.patient_Name||"N/A"}),e.jsx(r,{label:"MR Number",value:t.patient?.patient_MRNo||t.patientDetails?.patient_MRNo||"N/A"}),e.jsx(r,{label:"Contact",value:t.patient?.patient_ContactNo||t.patientDetails?.patient_ContactNo||"N/A"}),e.jsx(r,{label:"Gender",value:t.patient?.patient_Gender||t.patientDetails?.patient_Gender||"N/A"})]})]}),e.jsxs("div",{className:"bg-teal-50 p-4 rounded-lg",children:[e.jsxs("h3",{className:"font-semibold text-lg text-gray-800 mb-3 flex items-center",children:[e.jsx(L,{className:"mr-2 text-teal-600"})," Billing Information"]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{label:"Total Amount",value:`Rs. ${t.billingSummary?.totalAmount.toLocaleString()||"0"}`}),e.jsx(r,{label:"Discount",value:`Rs. ${R.toLocaleString()}`}),e.jsx(r,{label:"Advance Paid",value:`Rs. ${t.billingSummary?.advanceAmount.toLocaleString()||"0"}`}),e.jsx(r,{label:"Remaining",value:`Rs. ${t.billingSummary?.remainingAmount.toLocaleString()||"0"}`}),e.jsx(r,{label:"Payment Status",value:e.jsx("span",{className:`px-2 py-1 rounded-full text-xs font-medium ${t.billingSummary?.paymentStatus==="paid"?"bg-green-100 text-green-800":"bg-yellow-100 text-yellow-800"}`,children:t.billingSummary?.paymentStatus||"pending"})})]})]})]}),e.jsxs("div",{className:"p-6 border-t border-gray-100",children:[e.jsxs("h3",{className:"font-semibold text-lg text-gray-800 mb-3 flex items-center",children:[e.jsx(y,{className:"mr-2 text-teal-600"})," ",c?"Radiology Report":"Test Results"]}),c?e.jsxs("div",{className:"radiology-report",children:[e.jsxs("h4",{className:"font-medium mb-2",children:["Template: ",t.templateName||"N/A"]}),e.jsx("div",{className:"content overflow-auto max-h-96 bg-gray-50 p-4 rounded-lg border border-gray-200",children:e.jsx("div",{dangerouslySetInnerHTML:{__html:t.finalContent||"<p>No report content available</p>"}})}),t.referBy&&e.jsxs("p",{className:"mt-4 text-sm text-gray-600",children:["Referred By: ",t.referBy]})]}):t.testResults?.length>0?e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-left",children:[e.jsx("thead",{className:"bg-teal-50",children:e.jsxs("tr",{children:[e.jsx("th",{className:"p-3 text-gray-700 font-medium",children:"Test Name"}),e.jsx("th",{className:"p-3 text-gray-700 font-medium",children:"Code"}),e.jsx("th",{className:"p-3 text-right text-gray-700 font-medium",children:"Price"}),e.jsx("th",{className:"p-3 text-gray-700 font-medium",children:"Status"})]})}),e.jsx("tbody",{className:"divide-y divide-gray-100",children:t.testResults.map((i,l)=>e.jsxs("tr",{className:"hover:bg-teal-50 transition",children:[e.jsx("td",{className:"p-3 text-gray-800",children:i.testDetails?.name||"N/A"}),e.jsx("td",{className:"p-3 text-gray-800",children:i.testDetails?.code||"N/A"}),e.jsxs("td",{className:"p-3 text-right text-gray-800",children:["Rs. ",i.testDetails?.price.toLocaleString()||"0"]}),e.jsx("td",{className:"p-3",children:e.jsx("span",{className:`px-2 py-1 rounded-full text-xs font-medium ${i.status==="completed"?"bg-green-100 text-green-800":"bg-yellow-100 text-yellow-800"}`,children:i.status||"pending"})})]},l))})]})}):e.jsx("div",{className:"bg-yellow-50 p-3 rounded-lg text-yellow-800 text-sm",children:"No test results found for this bill"})]}),e.jsxs("div",{className:"p-6 border-t border-gray-100",children:[e.jsxs("h3",{className:"font-semibold text-lg text-gray-800 mb-3 flex items-center",children:[e.jsx(y,{className:"mr-2 text-teal-600"})," ",c?"Report Summary":"Test Summary"]}),(()=>{const i=t.summary?.totalTests??(c?1:0),l=t.summary?.completedTests??(c&&t.billingSummary?.paymentStatus==="paid"?1:0),m=t.summary?.pendingTests??(c&&t.billingSummary?.paymentStatus==="pending"?1:0);return e.jsxs("div",{className:"bg-teal-50 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4",children:[e.jsx(r,{inline:!0,label:"Total items",value:i}),e.jsx(r,{inline:!0,label:"Completed",value:l}),e.jsx(r,{inline:!0,label:"Pending",value:m})]})})()]}),t.billingSummary?.labNotes&&e.jsxs("div",{className:"p-6 border-t border-gray-100",children:[e.jsxs("h3",{className:"font-semibold text-lg text-gray-800 mb-3 flex items-center",children:[e.jsx(F,{className:"mr-2 text-teal-600"})," Lab Notes"]}),e.jsx("div",{className:"bg-teal-50 p-3 rounded-lg text-gray-800 text-sm",children:t.billingSummary.labNotes})]}),e.jsxs("div",{className:"p-6 border-t border-gray-100 flex justify-end space-x-3",children:[e.jsxs("button",{onClick:()=>d(-1),className:"px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition",children:[e.jsx(p,{className:"inline mr-1"})," Back"]}),e.jsxs("button",{onClick:N,className:"px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition",children:[e.jsx(_,{className:"inline mr-1"})," Print Invoice"]})]})]})]})},r=({label:a,value:s,inline:d=!1})=>{const t=s??"N/A";return d?e.jsxs("div",{className:"text-gray-800 text-sm",children:[e.jsx("span",{className:"font-medium text-gray-700",children:a}),": ",t]}):e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsx("p",{className:"font-medium text-gray-700 text-sm",children:a}),e.jsx("p",{className:"text-gray-800 text-sm",children:t})]})};export{Q as default};
