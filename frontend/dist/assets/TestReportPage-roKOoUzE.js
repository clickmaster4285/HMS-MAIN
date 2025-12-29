import{r as o,d as ge,f as he,u as O,i as ye,j as e}from"./index-D_CM1r6M.js";import{D as E}from"./react-datepicker-DcwYWBG_.js";import{P as fe}from"./PrintTestReport-BSxuLDc0.js";import{R as be}from"./server.browser-DuO4EFVg.js";import{d as U,v as je,k as Ne,l as we,j as M,m as ve,w as Ce,h as Pe,i as Se}from"./index-C4dsM683.js";import{f as N}from"./format-C6WB0tTj.js";import"./floating-ui.dom-DefJBFq2.js";import"./index-DzhyyO-l.js";import"./floating-ui.react-dom-BKXo97rI.js";import"./setYear-CB6OQHaj.js";import"./isSameMonth-Dw-C10qa.js";import"./parseISO-4cjP3mE1.js";import"./endOfDay-DNsC1XQt.js";import"./iconBase-DSUUJbys.js";const ke={paid:"bg-green-100 text-green-800",pending:"bg-red-100 text-red-800",partial:"bg-yellow-100 text-yellow-800",refunded:"bg-red-100 text-red-800"},De={completed:"Completed",pending:"Pending",processing:"Processing",registered:"Registered",not_started:"Not Started"},Te={paid:"Paid",pending:"Unpaid",partial:"Partial",refunded:"Refunded"},Ae=()=>{const[h,j]=o.useState(!1),[l,w]=o.useState({search:"",paymentStatus:"all",testStatus:"all",startDate:null,endDate:null}),[H,v]=o.useState(!1),[B,C]=o.useState(!1),[c,Q]=o.useState(null),[y,x]=o.useState([]),[F,$]=o.useState(""),P=ge(),I=he(),S=O(t=>t.patientTest.allPatientTests),k=o.useRef(null),[G,D]=o.useState(!1),[T,V]=o.useState({startDate:new Date,endDate:null}),[n,p]=o.useState(1),[f,W]=o.useState(20),[A,q]=o.useState(""),_=o.useCallback(()=>{const t={page:n,limit:f};let s=[];return A&&s.push(A),l.paymentStatus&&l.paymentStatus!=="all"&&s.push(`paymentStatus:${l.paymentStatus}`),l.testStatus&&l.testStatus!=="all"&&s.push(`status:${l.testStatus}`),s.length>0&&(t.search=s.join(" ")),l.startDate&&(t.startDate=N(l.startDate,"yyyy-MM-dd")),l.endDate&&(t.endDate=N(l.endDate,"yyyy-MM-dd")),t},[n,f,A,l]);o.useEffect(()=>{const t=_();I(ye(t))},[I,_]),o.useEffect(()=>{const t=s=>{k.current&&!k.current.contains(s.target)&&j(!1)};return document.addEventListener("mousedown",t),()=>{document.removeEventListener("mousedown",t)}},[]),o.useEffect(()=>{const t=setTimeout(()=>{q(l.search),p(1)},500);return()=>clearTimeout(t)},[l.search]);const z=t=>!t||t.length===0?"registered":[...t].sort((a,r)=>new Date(r.changedAt)-new Date(a.changedAt))[0].status,K=t=>{if(!t||!t.selectedTests)return null;const s=t.selectedTests.map(r=>z(r.statusHistory)),a=s.includes("pending")?"pending":s.includes("processing")?"processing":s.every(r=>r==="completed")?"completed":"registered";return{id:t._id,token:t.tokenNumber,patientName:t.patient_Detail?.patient_Name||"N/A",patientMRNo:t.patient_Detail?.patient_MRNo||"N/A",patientCNIC:t.patient_Detail?.patient_CNIC||"N/A",patientContact:t.patient_Detail?.patient_ContactNo||"N/A",patientAge:t.patient_Detail?.patient_Age||"N/A",patientGender:t.patient_Detail?.patient_Gender||"N/A",testCount:t.selectedTests.length,tests:t.selectedTests.map(r=>({testName:r.testDetails?.testName||"N/A",testCode:r.testDetails?.testCode||"N/A",status:z(r.statusHistory),amount:r.testDetails?.testPrice||0,testId:r.test})),date:t.createdAt,status:a,paymentStatus:t.paymentStatus||"pending",totalAmount:t.totalAmount||0,discount:t.discountAmount||0,finalAmount:t.finalAmount||0,advancePayment:t.advanceAmount||0,remainingAmount:t.remainingAmount||0,referredBy:t.referredBy||"N/A",labNotes:t.labNotes||"N/A",fullData:t}},X=()=>!S||S.length===0?[]:S.map(s=>K(s)).filter(Boolean),R=t=>{const{name:s,value:a}=t.target;w(r=>({...r,[s]:a})),p(1)},Y=t=>{const[s,a]=t;w(r=>({...r,startDate:s,endDate:a})),p(1)},J=()=>{w({search:"",paymentStatus:"all",testStatus:"all",startDate:null,endDate:null}),p(1)},Z=()=>{j(!1)},ee=(t,s)=>{if(!t||!t.fullData)return null;const a=t.fullData,r=t.fullData.testDefinitions||[],pe=(s.length>0?a.selectedTests.filter(g=>s.includes(g.test)):a.selectedTests).map(g=>{const ue=r.find(m=>m.testCode===g.testDetails?.testCode);return{testName:g.testDetails?.testName||"Unknown Test",testId:g.test,fields:(ue?.fields||[]).map(m=>({fieldName:m.name||"Unknown Field",value:m.value||"",unit:m.unit||"",normalRange:m.normalRange||null,notes:m.notes||""})),notes:g.notes||""}});return{patientTest:a,testResults:pe}},te=t=>{Q(t),x(t.tests.filter(s=>s.status==="completed").map(s=>s.testId)),$(""),C(!0)},se=t=>{x(s=>s.includes(t)?s.filter(a=>a!==t):[...s,t])},ae=()=>{const t=c?.tests?.filter(s=>s.status==="completed").map(s=>s.testId)||[];x(t)},re=()=>{x(c?.tests?.map(t=>t.testId)||[])},ne=()=>{x([])},le=()=>{const t=c?.tests?.filter(s=>s.status==="registered").map(s=>s.testId)||[];x(t)},ie=()=>{if(C(!1),y.length===0){alert("Please select at least one test to print.");return}if(c?.paymentStatus!=="paid"){v(!0);return}L(c,y)},oe=`
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      
      body {
        margin: 0;
        padding: 0;
        color: #333;
        font-family: Arial, sans-serif;
        font-size: 12pt;
        line-height: 1.3;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        background: white;
      }

      .page-container {
        width: 210mm;
        min-height: 297mm;
        position: relative;
        page-break-inside: avoid;
      }

      .letterhead-space {
        height: 74mm;
        background-color: transparent;
      }

      .content-area {
        padding: 0 10mm;
        min-height: 223mm;
      }

      .separate-page-test {
        page-break-after: always !important;
        page-break-before: always !important;
      }

      .grouped-tests-page {
        page-break-after: always;
      }

      .grouped-test {
        page-break-inside: avoid;
      }

      .test-divider {
        height: 1mm;
        margin: 6mm 0;
        background-color: #e0e0e0;
        border: none;
        border-radius: 1mm;
      }

      table {
        border-collapse: collapse;
        width: 100%;
      }

      th, td {
        border: 1px solid #ddd;
        padding: 4px 6px;
        text-align: left;
      }

      th {
        background-color: #f0f0f0;
        font-weight: bold;
      }

      .patient-info {
        margin-bottom: 8mm;
      }

      .legal-notice {
        text-align: right;
        margin-bottom: 4mm;
        font-size: 10pt;
        color: #666;
      }

      .test-section {
        margin-bottom: 4mm;
      }

      .test-title {
        font-weight: bold;
        font-size: 13pt;
        margin-bottom: 3mm;
        color: #2b6cb0;
        border-bottom: 2px solid #2b6cb0;
        padding-bottom: 2px;
      }

      @media print {
        body {
          margin: 0;
          padding: 0;
          width: 210mm;
        }
        
        .separate-page-test {
          page-break-after: always !important;
          page-break-before: always !important;
        }
        
        .grouped-tests-page {
          page-break-after: always;
        }
        
        * {
          visibility: visible !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .letterhead-space {
          background-color: transparent !important;
        }
      }

      .abnormal {
        color: red !important;
        font-weight: bold !important;
      }
    </style>
  `,L=(t,s)=>{const a=ee(t,s);if(!a)return;const r=window.open("","_blank");if(!r){alert("Please allow popups for printing");return}const i=be.renderToStaticMarkup(e.jsx(fe,{patientTest:a.patientTest,testDefinitions:a.testResults}));r.document.open(),r.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Test Report</title>
            ${oe}
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
    `),r.document.close()},de=({isOpen:t,onClose:s,onConfirm:a})=>t?e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-transform duration-300 ease-in-out scale-95 animate-scale-up",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-800",children:"Payment Pending"}),e.jsx("button",{onClick:s,className:"text-gray-400 hover:text-gray-600",children:e.jsx(M,{size:20})})]}),e.jsx("p",{className:"text-sm text-gray-600 mb-6",children:"The payment is pending. Are you sure you want to print before payment?"}),e.jsxs("div",{className:"flex justify-end space-x-3",children:[e.jsx("button",{onClick:s,className:"px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors",children:"Cancel"}),e.jsx("button",{onClick:a,className:"px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors",children:"Confirm Print"})]})]})}):null,ce=({isOpen:t,onClose:s,onPrint:a})=>{if(!t||!c)return null;const r=c.tests.filter(i=>i.testName.toLowerCase().includes(F.toLowerCase()));return e.jsx("div",{className:"fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-transform duration-300 ease-in-out scale-95 animate-scale-up",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsx("h3",{className:"text-xl font-semibold text-gray-900",children:"Select Tests to Print"}),e.jsx("button",{onClick:s,className:"text-gray-500 hover:text-gray-700 transition-colors",children:e.jsx(M,{size:24})})]}),e.jsxs("div",{className:"relative mb-4",children:[e.jsx(U,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",size:20}),e.jsx("input",{type:"text",value:F,onChange:i=>$(i.target.value),placeholder:"Search tests...",className:"w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"})]}),e.jsxs("div",{className:"flex flex-wrap gap-2 mb-4",children:[e.jsx("button",{onClick:ae,className:"px-3 py-1.5 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 text-sm font-medium transition-colors",children:"Completed"}),e.jsx("button",{onClick:re,className:"px-3 py-1.5 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 text-sm font-medium transition-colors",children:"Select All"}),e.jsx("button",{onClick:ne,className:"px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors",children:"Deselect All"}),e.jsx("button",{onClick:le,className:"px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium transition-colors",children:"Registered Tests"})]}),e.jsx("div",{className:"mb-6 max-h-64 overflow-y-auto pr-2",children:r.length>0?r.map(i=>e.jsxs("div",{className:"flex items-center mb-3",children:[e.jsx("input",{type:"checkbox",id:`test-${i.testId}`,checked:y.includes(i.testId),onChange:()=>se(i.testId),className:"h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"}),e.jsxs("label",{htmlFor:`test-${i.testId}`,className:"ml-3 text-sm text-gray-700 hover:text-gray-900 cursor-pointer",children:[i.testName,e.jsxs("span",{className:"ml-2 text-xs text-gray-400",children:["(",De[i.status]||i.status,")"]})]})]},i.testId)):e.jsx("p",{className:"text-sm text-gray-500 text-center",children:"No tests match your search."})}),e.jsxs("div",{className:"flex justify-end space-x-3",children:[e.jsx("button",{onClick:s,className:"px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors",children:"Cancel"}),e.jsx("button",{onClick:a,className:"px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed",disabled:y.length===0,children:"Print Selected Tests"})]})]})})},u=X(),{pagination:d}=O(t=>t.patientTest),me=()=>{const t=d?.totalPages||1,s=[];if(t<=5)for(let a=1;a<=t;a++)s.push(a);else n<=3?s.push(1,2,3,4,"...",t):n>=t-2?s.push(1,"...",t-3,t-2,t-1,t):s.push(1,"...",n-1,n,n+1,"...",t);return s},b=t=>{t>=1&&t<=(d?.totalPages||1)&&p(t)},xe=t=>{const s=parseInt(t.target.value);W(s),p(1)};return e.jsxs("div",{className:"bg-white rounded-xl shadow-sm p-6 relative",children:[e.jsx(de,{isOpen:H,onClose:()=>v(!1),onConfirm:()=>{L(c,y),v(!1)}}),e.jsx(ce,{isOpen:B,onClose:()=>C(!1),onPrint:ie}),e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:"Patient Reports"}),e.jsx("p",{className:"text-sm text-gray-500",children:"Manage and track all patient reports"})]}),e.jsxs("div",{className:"flex items-center space-x-2 relative",children:[e.jsxs("div",{className:"relative w-64",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(U,{className:"text-gray-400"})}),e.jsx("input",{type:"text",name:"search",value:l.search,onChange:R,placeholder:"Search patients, MRNo...",className:"pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"})]}),e.jsxs("div",{className:"relative",ref:k,children:[e.jsxs("button",{onClick:()=>j(!h),className:"flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors",children:[e.jsx(je,{className:"mr-2"}),"More Filters",h?e.jsx(Ne,{className:"ml-2"}):e.jsx(we,{className:"ml-2"})]}),h&&e.jsxs("div",{className:"absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-800",children:"More Filters"}),e.jsx("button",{onClick:()=>j(!1),className:"text-gray-400 hover:text-gray-500",children:e.jsx(M,{size:20})})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Date Range"}),e.jsxs("div",{className:"relative",children:[e.jsx(E,{selectsRange:!0,startDate:l.startDate,endDate:l.endDate,onChange:Y,isClearable:!0,placeholderText:"Select date range",className:"w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"}),e.jsx(ve,{className:"absolute right-3 top-3 text-gray-400"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Payment Status"}),e.jsxs("select",{name:"paymentStatus",value:l.paymentStatus,onChange:R,className:"w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500",children:[e.jsx("option",{value:"all",children:"All Payment Status"}),e.jsx("option",{value:"paid",children:"Paid"}),e.jsx("option",{value:"pending",children:"Unpaid"}),e.jsx("option",{value:"partial",children:"Partial"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Test Status"}),e.jsxs("select",{name:"testStatus",value:l.testStatus,onChange:R,className:"w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500",children:[e.jsx("option",{value:"all",children:"All Test Status"}),e.jsx("option",{value:"completed",children:"Completed"}),e.jsx("option",{value:"processing",children:"Processing"}),e.jsx("option",{value:"registered",children:"Registered"}),e.jsx("option",{value:"not_started",children:"Not Started"})]})]})]})]}),e.jsxs("div",{className:"flex justify-between mt-6",children:[e.jsx("button",{onClick:J,className:"px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors",children:"Clear All"}),e.jsx("button",{onClick:Z,className:"px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium transition-colors",children:"Apply Filters"})]})]})]}),e.jsx("button",{onClick:()=>D(!0),className:"text-white font-medium py-2 px-4 rounded hover:opacity-90 transition bg-[#009689]",children:"View/Download Summary"}),G&&e.jsxs("div",{className:"absolute top-full mt-2 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg right-0",children:[e.jsx(E,{selectsRange:!0,startDate:T.startDate,endDate:T.endDate,onChange:t=>{const[s,a]=t;V({startDate:s,endDate:a})},isClearable:!0,inline:!0}),e.jsxs("div",{className:"flex justify-end mt-2 space-x-2",children:[e.jsx("button",{onClick:()=>D(!1),className:"px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200",children:"Cancel"}),e.jsx("button",{onClick:()=>{const{startDate:t,endDate:s}=T,a=r=>N(r,"yyyy-MM-dd");t&&s?P(`/lab/test-report-Summery/${a(t)}_${a(s)}`):t?P(`/lab/test-report-Summery/${a(t)}`):alert("Please select at least one date."),D(!1)},className:"px-4 py-2 text-sm text-white bg-[#009689] rounded hover:bg-opacity-90",children:"Download"})]})]})]})]}),e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between mb-4 text-sm text-gray-600",children:[e.jsxs("div",{children:["Showing ",(n-1)*f+1," to"," ",Math.min(n*f,d?.totalItems||0)," of"," ",d?.totalItems||0," records"]}),e.jsx("div",{className:"flex items-center space-x-4 mt-2 md:mt-0",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("label",{className:"mr-2 text-sm",children:"Rows per page:"}),e.jsxs("select",{value:f,onChange:xe,className:"border border-gray-300 rounded px-2 py-1 text-sm",children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"}),e.jsx("option",{value:100,children:"100"})]})]})})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4 mb-6",children:[e.jsxs("div",{className:"bg-primary-50 p-4 rounded-lg border border-primary-100",children:[e.jsx("p",{className:"text-sm text-primary-600 font-medium",children:"Total Patients"}),e.jsx("p",{className:"text-2xl font-bold text-primary-800",children:u.length})]}),e.jsxs("div",{className:"bg-green-50 p-4 rounded-lg border border-green-100",children:[e.jsx("p",{className:"text-sm text-green-600 font-medium",children:"Completed"}),e.jsx("p",{className:"text-2xl font-bold text-green-800",children:u.filter(t=>t.status==="completed").length})]}),e.jsxs("div",{className:"bg-yellow-50 p-4 rounded-lg border border-yellow-100",children:[e.jsx("p",{className:"text-sm text-yellow-600 font-medium",children:"Processing"}),e.jsx("p",{className:"text-2xl font-bold text-yellow-800",children:u.filter(t=>t.status==="processing").length})]}),e.jsxs("div",{className:"bg-red-50 p-4 rounded-lg border border-red-100",children:[e.jsx("p",{className:"text-sm text-red-600 font-medium",children:"Pending Payment"}),e.jsx("p",{className:"text-2xl font-bold text-red-800",children:u.filter(t=>t.paymentStatus==="pending").length})]})]}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[e.jsx("thead",{className:"bg-gray-50",children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Token #"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Patient"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Tests"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Date"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Status"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Paid"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Remaining"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Payment Status"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Total Amount"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Actions"})]})}),e.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:u.length>0?u.map(t=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",children:t.token}),e.jsxs("td",{className:"px-6 py-4 whitespace-nowrap",children:[e.jsx("div",{className:"text-sm font-medium text-gray-900",children:t.patientName}),e.jsx("div",{className:"text-sm text-gray-500",children:t.patientMRNo}),e.jsxs("div",{className:"text-xs text-gray-400 mt-1",children:[t.testCount," ",t.testCount===1?"test":"tests"]})]}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsxs("div",{className:"text-sm text-gray-900",children:[t.tests.slice(0,2).map(s=>e.jsx("div",{children:s.testName},s.testCode)),t.testCount>2&&e.jsxs("div",{className:"text-xs text-gray-500",children:["+",t.testCount-2," more"]})]})}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:N(new Date(t.date),"MMM dd, yyyy HH:mm")}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:(()=>{const s=t.tests.length||0,a=t.tests.filter(i=>i.status==="completed").length,r=a===s?"bg-green-100 text-green-800":a>0?"bg-yellow-100 text-yellow-800":"bg-gray-100 text-gray-800";return e.jsxs("span",{className:`px-2 py-1 text-xs font-medium rounded-full ${r}`,children:[a,"/",s," Completed"]})})()}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:t.advancePayment.toFixed(2)}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:t.remainingAmount.toFixed(2)}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsx("span",{className:`px-2 py-1 text-xs font-medium rounded-full ${ke[t.paymentStatus]}`,children:Te[t.paymentStatus]})}),e.jsxs("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:["PKR ",t.totalAmount]}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative",children:e.jsxs("div",{className:"inline-block text-left",children:[e.jsx("div",{children:e.jsxs("button",{type:"button",className:"inline-flex items-center justify-center rounded-full w-8 h-8 bg-gray-100 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",id:`options-menu-${t.id}`,"aria-expanded":"false","aria-haspopup":"true",onClick:s=>{s.stopPropagation();const a=document.getElementById(`dropdown-${t.id}`);a&&a.classList.toggle("hidden")},children:[e.jsx("span",{className:"sr-only",children:"Open options"}),e.jsx(Ce,{className:"h-5 w-5"})]})}),e.jsx("div",{className:"min-h-[90px] absolute top-0 right-16",children:e.jsx("div",{id:`dropdown-${t.id}`,className:"hidden bg-white z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-150 ease-in-out",role:"menu","aria-orientation":"vertical","aria-labelledby":`options-menu-${t.id}`,children:e.jsxs("div",{className:"py-1",role:"none",children:[e.jsx("button",{onClick:()=>P(`/lab/update-report/${t.id}`),className:"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left",role:"menuitem",children:"Update Report"}),e.jsx("button",{onClick:()=>te(t),className:"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left",role:"menuitem",children:"Print"})]})})})]})})]},t.id)):e.jsx("tr",{children:e.jsx("td",{colSpan:"10",className:"px-6 py-4 text-center text-sm text-gray-500",children:"No patients found matching your criteria"})})})]})}),(d?.totalPages||0)>1&&e.jsxs("div",{className:"flex flex-col md:flex-row items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200",children:[e.jsxs("div",{className:"text-sm text-gray-700 mb-4 md:mb-0",children:["Page ",n," of ",d?.totalPages||1]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("button",{onClick:()=>b(1),disabled:n===1,className:`px-3 py-1 rounded border ${n===1?"text-gray-400 cursor-not-allowed":"text-gray-700 hover:bg-gray-50"}`,children:"First"}),e.jsxs("button",{onClick:()=>b(n-1),disabled:n===1,className:`px-3 py-1 rounded border flex items-center ${n===1?"text-gray-400 cursor-not-allowed":"text-gray-700 hover:bg-gray-50"}`,children:[e.jsx(Pe,{className:"mr-1"})," Previous"]}),e.jsx("div",{className:"flex space-x-1",children:me().map((t,s)=>t==="..."?e.jsx("span",{className:"px-3 py-1",children:"..."},`ellipsis-${s}`):e.jsx("button",{onClick:()=>b(t),className:`px-3 py-1 rounded border ${n===t?"bg-primary-600 text-white border-primary-600":"text-gray-700 hover:bg-gray-50"}`,children:t},t))}),e.jsxs("button",{onClick:()=>b(n+1),disabled:n===(d?.totalPages||1),className:`px-3 py-1 rounded border flex items-center ${n===(d?.totalPages||1)?"text-gray-400 cursor-not-allowed":"text-gray-700 hover:bg-gray-50"}`,children:["Next ",e.jsx(Se,{className:"ml-1"})]}),e.jsx("button",{onClick:()=>b(d?.totalPages||1),disabled:n===(d?.totalPages||1),className:`px-3 py-1 rounded border ${n===(d?.totalPages||1)?"text-gray-400 cursor-not-allowed":"text-gray-700 hover:bg-gray-50"}`,children:"Last"})]})]})]})},Re=()=>{const h=new Date().toLocaleTimeString();return e.jsxs("div",{className:"bg-primary-600 rounded-md text-white px-6 py-8 shadow-md",children:[e.jsx("div",{className:"flex justify-between items-center max-w-9xl mx-auto"}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"h-12 w-1 bg-primary-300 mr-4 rounded-full"}),e.jsx("div",{className:"flex justify-between",children:e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold",children:"Test Report"}),e.jsx("p",{className:"text-primary-100 mt-1",children:"Track, Collect, And Manage all reports"})]})})]}),e.jsxs("div",{className:"flex",children:[e.jsxs("div",{className:"text-sm ",children:[e.jsx("h1",{className:"text-xl font-semibold",children:h}),e.jsx("span",{className:"text-primary-100",children:"Live Updates"})]}),e.jsx("div",{className:"h-12 w-1 bg-primary-300 ml-4 rounded-full"})]})]})]})},Ve=()=>e.jsxs("div",{className:" bg-[#f1f5f9] min-h-screen",children:[e.jsx(Re,{}),e.jsx(Ae,{})]});export{Ve as default};
