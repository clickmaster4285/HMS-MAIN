import{j as e,f as E,d as O,u as C,ah as B,ai as G,r as p,k as U,m as W,aj as H,ak as V,al as Y}from"./index-D_CM1r6M.js";import{d as K,e as q,f as J,g as Q,c as X,h as Z,i as ee}from"./index-C4dsM683.js";import{a as te}from"./index-DK6bWzrh.js";import{m as se,p as ae}from"./index-CVhLpNpZ.js";import"./iconBase-DSUUJbys.js";const re=({patientsList:t,searchTerm:r,setSearchTerm:n,dateRange:o,setDateRange:m,handleDateRangeChange:d})=>e.jsx("div",{className:"mb-8",children:e.jsx("div",{className:"bg-primary-600 rounded-lg shadow-md p-6 text-white",children:e.jsxs("div",{className:"flex flex-col 2xl:flex-row justify-between items-start",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"text-2xl font-bold flex items-center",children:[e.jsx(te,{className:"mr-2"})," Admitted Patients Management"]}),e.jsxs("p",{className:"text-primary-100 mt-1 flex flex-wrap gap-2",children:[e.jsxs("span",{className:"bg-green-500/20 text-green-100 px-2 py-1 rounded-full text-xs flex items-center",children:[e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-green-400 mr-1"}),t?.filter(s=>s.status==="Admitted").length||0," Admitted"]}),e.jsxs("span",{className:"bg-red-500/20 text-red-100 px-2 py-1 rounded-full text-xs flex items-center",children:[e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-red-400 mr-1"}),t?.filter(s=>s.status==="Discharged").length||0," Discharged"]}),e.jsxs("span",{className:"bg-primary-500/20 text-primary-100 px-2 py-1 rounded-full text-xs flex items-center",children:[e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-primary-300 mr-1"}),t?.length||0," Total"]})]})]}),e.jsxs("div",{className:"mt-4 flex flex-col lg:flex-row gap-4 w-full md:w-auto",children:[e.jsxs("div",{className:"relative grow max-w-md",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(K,{className:"text-primary-700"})}),e.jsx("input",{type:"text",placeholder:"Search patients...",className:"block text-primary-700 w-full pl-10 pr-3 py-2 border border-primary-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white bg-white/90",value:r,onChange:s=>n(s.target.value)})]}),e.jsxs("div",{className:"flex text-gray-600 gap-2 items-center",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("input",{type:"date",className:"block w-full pl-3 pr-3 py-2 border border-primary-300 rounded-lg bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500",value:o.start,onChange:s=>d("start",s.target.value),placeholder:"Start date",max:o.end}),e.jsx("input",{type:"date",className:"block w-full pl-3 pr-3 py-2 border border-primary-300 rounded-lg bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500",value:o.end,onChange:s=>d("end",s.target.value),placeholder:"End date",min:o.start})]}),e.jsxs("div",{className:"grid items-center grid-cols-2 gap-1",children:[e.jsx("button",{onClick:()=>{const s=new Date().toISOString().split("T")[0];m({start:s,end:s})},className:"text-xs text-primary-900 px-2 py-0.5 bg-primary-100 rounded hover:bg-primary-200",children:"Today"}),e.jsx("button",{onClick:()=>{const s=new Date,i=new Date(s.setDate(s.getDate()-s.getDay()));m({start:i.toISOString().split("T")[0],end:new Date().toISOString().split("T")[0]})},className:"text-xs px-2 text-primary-900 py-0.5 bg-primary-100 rounded hover:bg-primary-200",children:"This Week"}),e.jsx("button",{onClick:()=>{const s=new Date;m({start:new Date(s.getFullYear(),s.getMonth(),1).toISOString().split("T")[0],end:new Date().toISOString().split("T")[0]})},className:"col-span-2 text-xs px-2 text-primary-900 py-0.5 bg-primary-100 rounded hover:bg-primary-200",children:"This Month"})]})]})]})]})})}),ie=t=>{try{const r=t.patient||{},n=t.admission_Details||{},o=t.ward_Information||{},m=t.financials||{},d=r.patient_Guardian||{},s=u=>{if(!u)return"N/A";try{return new Date(u).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}catch{return u}},i=`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Admission Record - ${r.patient_MRNo||"N/A"}</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            @media print {
              body {
                width: 210mm;
                height: 148mm;
                margin: 0;
                padding: 10mm;
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.3;
              }
            }
            body {
              width: 190mm;
              height: 128mm;
              margin: 0 auto;
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.3;
              padding: 10mm;
            }
            .print-header {
              text-align: center;
              margin-bottom: 10px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .hospital-name {
              font-size: 18px;
              font-weight: bold;
              margin: 5px 0;
            }
            .document-title {
              font-size: 16px;
              font-weight: bold;
              margin: 10px 0;
            }
            .print-table {
              width: 100%;
              border-collapse: collapse;
              margin: 5px 0;
              page-break-inside: avoid;
            }
            .print-table td {
              padding: 3px 5px;
              border: 1px solid #ddd;
              vertical-align: top;
              font-size: 11px;
            }
            .label-cell {
              font-weight: bold;
              width: 30%;
              background-color: #f5f5f5;
            }
            .section-title {
              font-size: 13px;
              font-weight: bold;
              margin: 8px 0 4px 0;
              border-bottom: 1px solid #ccc;
              padding-bottom: 2px;
            }
            .footer {
              margin-top: 10px;
              padding-top: 5px;
              border-top: 1px solid #ccc;
              font-size: 10px;
              text-align: center;
            }
            .signature-area {
              display: inline-block;
              width: 45%;
              margin: 0 2%;
            }
            .signature-line {
              border-top: 1px solid #000;
              width: 80%;
              margin: 20px auto 5px auto;
            }
            .logo {
              height: 40px;
              width: auto;
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <div class="hospital-name">Al-Shahbaz Hospital</div>
            <div>Thana Road Kahuta | Phone: (123) 456-7890</div>
            <div class="document-title">PATIENT ADMISSION RECORD</div>
          </div>

          <!-- Patient Information -->
          <div class="section-title">Patient Information</div>
          <table class="print-table">
            <tr>
              <td class="label-cell">MR Number</td>
              <td>${r.patient_MRNo||"N/A"}</td>
              <td class="label-cell">Name</td>
              <td>${r.patient_Name||"N/A"}</td>
            </tr>
            <tr>
              <td class="label-cell">Gender</td>
              <td>${r.patient_Gender||"N/A"}</td>
              <td class="label-cell">Date of Birth</td>
              <td>${s(r.patient_DateOfBirth)}</td>
            </tr>
            <tr>
              <td class="label-cell">CNIC</td>
              <td>${r.patient_CNIC||"N/A"}</td>
              <td class="label-cell">Contact</td>
              <td>${r.patient_ContactNo||"N/A"}</td>
            </tr>
            <tr>
              <td class="label-cell">Address</td>
              <td colspan="3">${r.patient_Address||"N/A"}</td>
            </tr>
          </table>

          <!-- Admission Details -->
          <div class="section-title">Admission Details</div>
          <table class="print-table">
            <tr>
              <td class="label-cell">Admission Date</td>
              <td>${s(n.admission_Date)}</td>
              <td class="label-cell">Status</td>
              <td>${t.status||"N/A"}</td>
            </tr>
            <tr>
              <td class="label-cell">Ward Type</td>
              <td>${o.ward_Type||"N/A"}</td>
              <td class="label-cell">Bed Number</td>
              <td>${o.bed_No||"N/A"}</td>
            </tr>
            <tr>
              <td class="label-cell">Diagnosis</td>
              <td colspan="3">${n.diagnosis||"N/A"}</td>
            </tr>
          </table>

          <!-- Financial Information -->
          <div class="section-title">Financial Information</div>
          <table class="print-table">
            <tr>
              <td class="label-cell">Admission Fee</td>
              <td>Rs. ${m.admission_Fee||"0"}</td>
              <td class="label-cell">Payment Status</td>
              <td>${m.payment_Status||"N/A"}</td>
            </tr>
          </table>

          <div class="footer">
            <div style="display: flex; justify-content: space-between;">
              <div class="signature-area">
                <div>Patient/Guardian Signature</div>
                <div class="signature-line"></div>
              </div>
              <div class="signature-area">
                <div>Admitting Officer</div>
                <div class="signature-line"></div>
              </div>
            </div>
            <div style="font-size: 9px; margin-top: 5px;">
              Computer generated document - ${new Date().toLocaleDateString()}
            </div>
          </div>
        </body>
      </html>
    `,l=window.open("","_blank");l.document.write(i),l.document.close(),l.onload=()=>{setTimeout(()=>{l.print(),l.onafterprint=()=>l.close()},500)}}catch(r){throw console.error("Print error:",r),new Error("Failed to generate print preview")}},ne=({filteredPatients:t,handleView:r,handleEditClick:n,setModals:o})=>{const m=async d=>{try{await ie(d)}catch(s){console.error("Print failed:",s),alert("Failed to print patient record")}};return e.jsx("div",{className:"bg-white shadow-md rounded-lg overflow-hidden",children:e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[e.jsx("thead",{className:"bg-gray-50",children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Patient Info"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"MR Number"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Admission Date"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Admission Type"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Ward Information"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Status"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Diagnosis"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Actions"})]})}),e.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:t.map(d=>{const s=d.patient||{},i=d.admission_Details||{},l=d.ward_Information||{};return e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center",children:e.jsx(q,{className:"h-5 w-5 text-primary-600"})}),e.jsxs("div",{className:"ml-4",children:[e.jsx("div",{className:"text-sm font-medium text-gray-900",children:s.patient_Name||"N/A"}),e.jsxs("div",{className:"text-sm text-gray-500",children:[d.patient_Age?`${d.patient_Age}yrs`:"Age N/A",", ",s.patient_Gender||"N/A"]})]})]})}),e.jsxs("td",{className:"px-6 py-4 whitespace-nowrap",children:[e.jsx("div",{className:"text-sm text-gray-900 font-mono",children:s.patient_MRNo||"N/A"}),e.jsx("div",{className:"text-sm text-gray-500",children:s.patient_CNIC||"N/A"})]}),e.jsxs("td",{className:"px-6 py-4 whitespace-nowrap",children:[e.jsx("div",{className:"text-sm text-gray-900",children:i.admission_Date?new Date(i.admission_Date).toLocaleDateString():"N/A"}),e.jsx("div",{className:"text-sm text-gray-500",children:i.admission_Date?new Date(i.admission_Date).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):""})]}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsx("div",{className:"text-sm text-gray-900",children:i.admission_Type||"N/A"})}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsxs("div",{children:[e.jsx("div",{className:"text-sm font-medium text-gray-900",children:l.ward_Type||"Not assigned"}),e.jsx("div",{className:"text-sm text-gray-500",children:l.bed_No?`Bed ${l.bed_No}`:"Bed not assigned"})]})}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsx("span",{className:`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${d.status==="Discharged"?"bg-red-100 text-red-800":"bg-green-100 text-green-800"}
                    `,children:d.status||"N/A"})}),e.jsx("td",{className:"px-6 py-4",children:e.jsx("div",{className:"text-sm text-gray-900 max-w-xs truncate",children:i.diagnosis||"Not specified"})}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-right text-sm font-medium",children:e.jsxs("div",{className:"flex justify-end space-x-2",children:[e.jsx("button",{onClick:()=>r(s.patient_MRNo),className:"text-primary-600 border border-primary-200 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50","aria-label":`View ${s.patient_Name}`,children:e.jsx(se,{className:"h-5 w-5"})}),e.jsx("button",{onClick:()=>m(d),className:"text-primary-600 border border-primary-200 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50",title:"Print",children:e.jsx(J,{className:"h-4 w-4"})}),e.jsx("button",{onClick:()=>n(d),className:"text-indigo-600 border border-purple-300 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50",title:"Edit",children:e.jsx(Q,{className:"h-4 w-4"})}),e.jsx("button",{onClick:()=>o(u=>({...u,delete:{show:!0,patientId:d._id}})),className:"text-red-600 border border-red-300 hover:text-red-900 p-1 rounded-md hover:bg-red-50",title:"Delete",children:e.jsx(X,{className:"h-4 w-4"})})]})})]},d._id)})})]})})})},de=({searchTerm:t,dateRange:r,handleResetFilters:n})=>e.jsxs("div",{className:"text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200",children:[e.jsx("svg",{className:"mx-auto h-16 w-16 text-gray-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsx("h3",{className:"mt-4 text-lg font-medium text-gray-900",children:"No patients found"}),e.jsx("p",{className:"mt-2 text-gray-500",children:t||r.start&&r.end?"No patients match your search criteria.":"No patients are currently admitted."}),e.jsx("div",{className:"mt-6",children:e.jsx("button",{onClick:n,className:"inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",children:"Reset filters"})})]}),le=({modals:t,setModals:r,onClose:n})=>{if(!t.success.show)return null;const o=()=>{n?n():r(m=>({...m,success:{show:!1,message:""}}))};return e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center",children:[e.jsx("div",{className:"absolute inset-0 backdrop-blur-lg bg-white/20"}),e.jsx("div",{className:"bg-white rounded-lg shadow-xl p-6 max-w-sm w-full z-10 transform transition-all",children:e.jsxs("div",{className:"text-center",children:[e.jsx(ae,{className:"mx-auto h-16 w-16 text-green-500"}),e.jsx("h3",{className:"text-lg font-medium text-gray-900 mt-4",children:t.success.message}),e.jsx("div",{className:"mt-6",children:e.jsx("button",{onClick:o,className:"inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm",children:"Close"})})]})})]})},oe=({modals:t,setModals:r,handleDeleteConfirm:n})=>t.delete.show?e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-white/20",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 max-w-sm w-full z-10",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-800 mb-2",children:"Confirm Deletion"}),e.jsx("p",{className:"text-gray-600 mb-4",children:"Are you sure you want to delete this patient record?"}),e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx("button",{onClick:()=>r(o=>({...o,delete:{show:!1,patientId:null}})),className:"px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300",children:"Cancel"}),e.jsx("button",{onClick:n,className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",children:"Yes, Delete"})]})]})}):null,ce=({currentPage:t=1,totalPages:r=1,totalItems:n=0,onPageChange:o})=>{if(r<=1)return null;const m=[],d=5;let s=Math.max(1,t-Math.floor(d/2)),i=Math.min(r,s+d-1);i-s+1<d&&(s=Math.max(1,i-d+1));for(let l=s;l<=i;l++)m.push(l);return e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6",children:[e.jsxs("div",{className:"flex justify-between flex-1 sm:hidden",children:[e.jsx("button",{onClick:()=>o(t-1),disabled:t===1,className:"relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Previous"}),e.jsx("button",{onClick:()=>o(t+1),disabled:t===r,className:"relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Next"})]}),e.jsxs("div",{className:"hidden sm:flex sm:flex-1 sm:items-center sm:justify-between",children:[e.jsx("div",{children:e.jsxs("p",{className:"text-sm text-gray-700",children:["Showing ",e.jsx("span",{className:"font-medium",children:(t-1)*20+1})," to"," ",e.jsx("span",{className:"font-medium",children:Math.min(t*20,n)})," of"," ",e.jsx("span",{className:"font-medium",children:n})," results"]})}),e.jsx("div",{children:e.jsxs("nav",{className:"inline-flex -space-x-px rounded-md shadow-sm","aria-label":"Pagination",children:[e.jsxs("button",{onClick:()=>o(t-1),disabled:t===1,className:"relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx("span",{className:"sr-only",children:"Previous"}),e.jsx(Z,{className:"w-5 h-5"})]}),m.map(l=>e.jsx("button",{onClick:()=>o(l),className:`relative inline-flex items-center px-4 py-2 text-sm font-medium ${t===l?"z-10 bg-primary-600 border-primary-600 text-white":"bg-white border-gray-300 text-gray-500 hover:bg-gray-50"} border`,children:l},l)),e.jsxs("button",{onClick:()=>o(t+1),disabled:t===r,className:"relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx("span",{className:"sr-only",children:"Next"}),e.jsx(ee,{className:"w-5 h-5"})]})]})})]})]})},ge=()=>{const t=E(),r=O(),{patientsList:n,errorMessage:o,pagination:m}=C(a=>a.ipdPatient),d=C(B),s=C(G),[i,l]=p.useState({start:"",end:""}),[u,k]=p.useState(""),[x,w]=p.useState("all-admitted"),[j,I]=p.useState(1),[N,y]=p.useState({delete:{show:!1,patientId:null},success:{show:!1,message:""}}),[v,D]=p.useState(!1),g=p.useCallback((a=1,c=null)=>{let b="Admitted";x==="all-discharge"?b="Discharged":x==="all"&&(b="Admitted,Discharged"),t(U({page:a,limit:20,status:b,ward_Type:x!=="all-admitted"&&x!=="all-discharge"&&x!=="all"?x:void 0})),I(a)},[x,t]);p.useEffect(()=>(g(1),t(W()),()=>{t(H())}),[t,g]),p.useEffect(()=>{g(1)},[x,g]),p.useEffect(()=>{s==="succeeded"&&v&&(y(a=>({...a,success:{show:!0,message:"Operation completed successfully!"}})),D(!1),g(j))},[s,v,j,g]);const M=p.useMemo(()=>{if(!Array.isArray(n))return[];const a=n.map(c=>c.ward_Information?.ward_Type).filter(c=>c&&typeof c=="string");return[...new Set(a)]},[n]),A=p.useMemo(()=>{if(!Array.isArray(n))return[];const a=u.toLowerCase();return n.filter(c=>{const b=(c.patient?.patient_MRNo||"").toLowerCase().includes(a)||(c.patient?.patient_CNIC||"").toLowerCase().includes(a)||(c.patient?.patient_Name||"").toLowerCase().includes(a)||(c.ward_Information?.ward_Type||"").toLowerCase().includes(a)||(c.ward_Information?.ward_No||"").toLowerCase().includes(a)||(c.ward_Information?.bed_No||"").toLowerCase().includes(a)||(c.status?.toLowerCase()||"").includes(a);let h=!0;if(i.start&&i.end)try{const f=new Date(c.admission_Details?.admission_Date),_=new Date(i.start),S=new Date(i.end);if(isNaN(f.getTime()))return!1;S.setHours(23,59,59),h=f>=_&&f<=S}catch(f){return console.error("Invalid date format",f),!1}return b&&h})},[n,u,i]),T=a=>{a.status==="Admitted"&&r(`/receptionist/ipd/edit/${a.patient.patient_MRNo}`)},$=()=>{N.delete.patientId&&(t(Y(N.delete.patientId)),y({...N,delete:{show:!1,patientId:null}}))},P=a=>{r(`/receptionist/patient-details/${a}`)},F=async a=>{if(!a?._id){console.error("Patient ID is missing!");return}D(!0);try{const c={id:a._id,wardId:a.ward_Information?.ward_Id,bedNumber:a.ward_Information?.bed_No,patientMRNo:a.patient?.patient_MRNo};await t(V(c))}catch(c){console.error("Discharge error:",c),D(!1)}},L=(a,c)=>{l(b=>{const h={...b,[a]:c};if(h.start&&h.end){const f=new Date(h.start),_=new Date(h.end);if(f>_)return{start:h.end,end:h.start}}return h})},R=()=>{k(""),l({start:"",end:""}),w("all-admitted")},z=()=>{y(a=>({...a,success:{show:!1,message:""}}))};return e.jsxs("div",{className:"",children:[e.jsx(re,{patientsList:n,searchTerm:u,setSearchTerm:k,dateRange:i,handleDateRangeChange:L}),e.jsx("div",{className:"border-b border-gray-200 mb-6",children:e.jsxs("nav",{className:"-mb-px flex space-x-8",children:[e.jsx("button",{onClick:()=>w("all-admitted"),className:`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${x==="all-admitted"?"border-primary-500 text-primary-600":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:"Admitted Patients"}),e.jsx("button",{onClick:()=>w("all-discharge"),className:`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${x==="all-discharge"?"border-primary-500 text-primary-600":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:"Discharged Patients"}),e.jsx("button",{onClick:()=>w("all"),className:`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${x==="all"?"border-primary-500 text-primary-600":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:"All Patients"}),M.map(a=>e.jsx("button",{onClick:()=>w(a),className:`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${x===a?"border-primary-500 text-primary-600":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:a},a))]})}),d==="pending"&&e.jsxs("div",{className:"text-center py-12",children:[e.jsx("div",{className:"inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"}),e.jsx("p",{className:"mt-4 text-gray-600 font-medium",children:"Loading patient data..."})]}),o&&e.jsx("div",{className:"bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg",children:e.jsx("div",{className:"flex items-center",children:e.jsx("div",{className:"ml-3",children:e.jsx("p",{className:"text-sm text-red-700 font-medium",children:o||"Failed to load patient data"})})})}),i.start&&i.end&&A?.length>0&&e.jsxs("div",{className:"text-sm inline-block px-4 py-2 rounded-b-lg bg-primary-200 text-primary-700 mb-2",children:["Showing patients admitted between ",new Date(i.start).toLocaleDateString()," and ",new Date(i.end).toLocaleDateString()]}),A?.length>0?e.jsxs(e.Fragment,{children:[e.jsx(ne,{filteredPatients:A,handleView:P,handleEditClick:T,handleDischarge:F,setModals:y,isUpdating:v,activeTab:x}),e.jsx(ce,{currentPage:j,totalPages:m?.totalPages||1,totalItems:m?.totalItems||0,onPageChange:g})]}):e.jsx(de,{searchTerm:u,dateRange:i,handleResetFilters:R}),i.start||i.end?e.jsx("div",{className:"my-4",children:e.jsx("button",{onClick:()=>l({start:"",end:""}),className:"inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50",children:"Reset Dates"})}):null,e.jsx(le,{modals:N,setModals:y,onClose:z}),e.jsx(oe,{modals:N,setModals:y,handleDeleteConfirm:$})]})};export{ge as default};
