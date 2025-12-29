import{j as e,r as b,f as $,u as L,bp as _,bq as P,aY as F,T as I}from"./index-D_CM1r6M.js";import{R}from"./server.browser-DuO4EFVg.js";import{E as V,u as O,i as W,T as G,C as Y,a as q,b as U,c as K,d as Z}from"./index-DweW6Ouc.js";import{l as J}from"./logo1-Cp_MkaTU.js";import"./index-DzhyyO-l.js";import"./with-selector-Cb_tpc66.js";const Q=({currentReport:t,selectedReport:i})=>{const d=m=>{if(!m)return"N/A";try{const l=new Date(m);return isNaN(l.getTime())?"N/A":l.toLocaleDateString()}catch{return"N/A"}};return e.jsxs("div",{className:"bg-linear-to-r from-teal-600 to-teal-800 text-white p-8 relative",children:[e.jsxs("div",{className:"absolute top-4 right-4 flex space-x-2",children:[e.jsxs("span",{className:"bg-teal-800 text-xs px-2 py-1 rounded-full",children:["ID: ",t?._id?.slice(-6)||"N/A"]}),e.jsx("span",{className:"bg-teal-700 text-xs px-2 py-1 rounded-full",children:d(t?.createdAt)})]}),e.jsx("h1",{className:"text-3xl font-bold text-center",children:"Radiology Report"}),e.jsx("p",{className:"text-center text-sm mt-2 opacity-80",children:i?.templateName?.replace(".html","")||"N/A"})]})},X=({report:t,isRadiology:i})=>{const d=(r,o="N/A")=>r||o,m=r=>{if(!r)return"N/A";try{const o=new Date(r);if(isNaN(o.getTime()))return"N/A";const u=o.getDate().toString().padStart(2,"0"),g=(o.getMonth()+1).toString().padStart(2,"0"),n=o.getFullYear();return`${u}-${g}-${n}`}catch{return"N/A"}},l=r=>r==null?"N/A":`Rs. ${Number(r).toLocaleString()}`,N=(r="")=>r.replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o]),h=(r="")=>r?r.replace(/page-break-(before|after|inside)\s*:\s*(always|avoid|auto)\s*;?/gi,"").replace(/margin-(top|bottom)\s*:\s*(\d+)(px|mm)/gi,(o,u,g,n)=>{const x=parseInt(g,10);return n.toLowerCase()==="px"&&x>=20||n.toLowerCase()==="mm"&&x>=10?`margin-${u}: 6mm`:`margin-${u}: ${x}${n}`}):"",p=r=>{const o=Array.isArray(r?.studies)?r.studies:[];if(!o.length)return"<p>No studies found.</p>";const u=o.map((g,n)=>{const x=(g?.templateName||"Unnamed Study").replace(".html",""),j=h(g?.finalContent||"");return`
        <article class="study-block">
          <div class="study-title">${N(`${n+1}. ${x}`)}</div>
          <div class="study-body">${j}</div>
        </article>
      `});return u.map((g,n)=>n<u.length-1?`${g}<hr class="study-sep" />`:g).join("")},f=b.useRef(null);return b.useEffect(()=>{const r=f.current;if(!r)return;const o=v=>v*96/25.4,u=297,g=8,n=8,x=14,j=u-g-n,z=o(j),H=o(x),T=o(15)+H,a=()=>{r.querySelectorAll(".page-break.__auto").forEach(v=>v.remove())},B=()=>{a();const v=Array.from(r.querySelectorAll(".study-block"));if(!v.length)return;const A=r.getBoundingClientRect().top;v.forEach(k=>{const S=(k.getBoundingClientRect().top-A)%z;if(z-S-H<T){const E=document.createElement("div");E.className="page-break __auto",k.parentNode.insertBefore(E,k)}})},w=()=>B(),C=()=>a();if(window.matchMedia){const v=window.matchMedia("print"),A=k=>k.matches?w():C();return v.addEventListener?.("change",A),window.addEventListener("beforeprint",w),window.addEventListener("afterprint",C),()=>{v.removeEventListener?.("change",A),window.removeEventListener("beforeprint",w),window.removeEventListener("afterprint",C),a()}}else return window.addEventListener("beforeprint",w),window.addEventListener("afterprint",C),()=>{window.removeEventListener("beforeprint",w),window.removeEventListener("afterprint",C),a()}},[]),e.jsxs("div",{className:"print-container",style:s.container,children:[e.jsx("style",{children:`
        :root { --footer-height: 14mm; }

        .header {
          display: flex;
          align-items: center;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
        .logo-container { flex: 0 0 120px; }
        .logo { width: 120px; height: auto; }
        .hospital-details { flex: 1; padding-left: 20px; display: flex; flex-direction: column; justify-content: center; }
        .hospital-name { font-size: 20px; font-weight: bold; text-align: left; margin-bottom: 5px; }
        .hospital-info { font-size: 11px; text-align: left; }
        .hospital-info p { margin: 2px 0; }

        .duplicate-section { page-break-inside: avoid; page-break-before: auto; }

        /* Summary area */
        .report-content.summary {
          padding: 8px;
          margin: 10px 0;
          border: 1px solid #eee;
          line-height: 1.35;
          font-size: 11pt;
        }
        .report-content.summary h1,
        .report-content.summary h2,
        .report-content.summary h3,
        .report-content.summary h4,
        .report-content.summary p,
        .report-content.summary ul,
        .report-content.summary ol { margin: 6px 0; }
        .report-content.summary ul,
        .report-content.summary ol { padding-left: 18px; }
        .report-content.summary img { max-width: 100%; height: auto; }

        .study-block { break-inside: avoid; page-break-inside: avoid; margin: 6mm 0 0 0; }
        .study-block:first-child { margin-top: 0; }
        .study-title { font-weight: 600; margin: 0 0 4px 0; }
        .study-sep { border: 0; border-top: 1px solid #ccc; margin: 5mm 0; }

        /* Marker that forces a new printed page */
        .page-break {
          break-before: page;
          page-break-before: always;
          height: 0;
        }

        /* Screen: footer is static so it doesn't cover content */
        .footerNote { position: static; margin-top: 8mm; }

        @media print {
          @page { size: A4; margin: 8mm; }

          .print-container { padding: 0; }
          .logo { width: 90px; }
          .hospital-name { font-size: 18px; }
          .hospital-info { font-size: 10px; }

          .patient-info td { padding: 3px !important; font-size: 11pt; }

          .report-content.summary {
            min-height: auto !important;
            padding: 6px !important;
            margin: 8px 0 !important;
            font-size: 10.5pt;
            line-height: 1.3;
          }
          .report-content.summary h1,
          .report-content.summary h2,
          .report-content.summary h3,
          .report-content.summary p,
          .report-content.summary ul,
          .report-content.summary ol { margin: 4px 0 !important; }

          .study-sep { margin: 3mm 0 !important; break-after: avoid; page-break-after: avoid; }

          /* Footer fixed at bottom of every printed page */
          .footerNote {
            position: fixed !important;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            border-top: 1px solid #ccc;
            text-align: center;
            padding: 6px 10px;
            font-size: 10pt;
            background: #f9f9f9;
          }

          /* Ensure content does not overlap fixed footer */
          .page-body {
            padding-bottom: var(--footer-height) !important;
          }
        }
      `}),e.jsxs("div",{className:"header",children:[e.jsx("div",{className:"logo-container",children:e.jsx("img",{src:J,alt:"Logo",className:"logo"})}),e.jsxs("div",{className:"hospital-details",children:[e.jsx("div",{className:"hospital-name",children:"AL-SHAHBAZ HOSPITAL"}),e.jsxs("div",{className:"hospital-info",children:[e.jsx("p",{children:"THANA ROAD KAHUTA."}),e.jsx("p",{children:"Tel: 051-3311342"})]})]})]}),e.jsxs("div",{className:"page-body",ref:f,children:[e.jsx("h2",{style:s.reportTitle,children:"Radiology Report"}),i||e.jsxs(e.Fragment,{children:[e.jsx("table",{className:"patient-info",style:s.patientInfoTable,children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"MR #"}),e.jsx("td",{style:s.valueCell,children:d(t.patientMRNO)}),e.jsx("td",{style:s.labelCell,children:"Report Date"}),e.jsx("td",{style:s.valueCell,children:m(t.date)})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Patient Name"}),e.jsx("td",{style:s.valueCell,children:d(t.patientName)}),e.jsx("td",{style:s.labelCell,children:"Referred By"}),e.jsx("td",{style:s.valueCell,children:d(t.studies?.[0]?.referBy||"N/A")})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Gender"}),e.jsx("td",{style:s.valueCell,children:d(t.sex)}),e.jsx("td",{style:s.labelCell,children:"Age"}),e.jsx("td",{style:s.valueCell,children:d(t.age)})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Contact No"}),e.jsx("td",{colSpan:"3",style:s.valueCell,children:d(t.patient_ContactNo)})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Test Name"}),e.jsx("td",{colSpan:"3",style:s.valueCell,children:t.studies?.length?t.studies.map((r,o)=>e.jsx("div",{children:d(r.templateName?.replace(".html",""))},r._id||o)):"N/A"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Total Amount"}),e.jsx("td",{style:s.valueCell,children:l(t.totalAmount)}),e.jsx("td",{style:s.labelCell,children:"Discount"}),e.jsx("td",{style:s.valueCell,children:l(t.discount)})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Advance Payment"}),e.jsx("td",{style:s.valueCell,children:l(t.advanceAmount)}),e.jsx("td",{style:s.labelCell,children:"Paid Amount"}),e.jsx("td",{style:s.valueCell,children:l(t.totalPaid)})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Final Amount"}),e.jsx("td",{style:s.valueCell,children:l(t.remainingAmount)}),e.jsx("td",{}),e.jsx("td",{})]})]})}),e.jsx("hr",{}),e.jsxs("div",{className:"duplicate-section",children:[e.jsx("h2",{style:s.reportTitle,children:"Radiology Report"}),e.jsx("table",{className:"patient-info",style:s.patientInfoTable,children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"MR #"}),e.jsx("td",{style:s.valueCell,children:d(t.patientMRNO)}),e.jsx("td",{style:s.labelCell,children:"Report Date"}),e.jsx("td",{style:s.valueCell,children:m(t.date)})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Patient Name"}),e.jsx("td",{style:s.valueCell,children:d(t.patientName)}),e.jsx("td",{style:s.labelCell,children:"Referred By"}),e.jsx("td",{style:s.valueCell,children:d(t.studies?.[0]?.referBy||"N/A")})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Gender"}),e.jsx("td",{style:s.valueCell,children:d(t.sex)}),e.jsx("td",{style:s.labelCell,children:"Age"}),e.jsx("td",{style:s.valueCell,children:d(t.age)})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Contact No"}),e.jsx("td",{colSpan:"3",style:s.valueCell,children:d(t.patient_ContactNo)})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Test Name"}),e.jsx("td",{colSpan:"3",style:s.valueCell,children:t.studies?.length?t.studies.map((r,o)=>e.jsx("div",{children:d(r.templateName?.replace(".html",""))},r._id||o)):"N/A"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Total Amount"}),e.jsx("td",{style:s.valueCell,children:l(t.totalAmount)}),e.jsx("td",{style:s.labelCell,children:"Discount"}),e.jsx("td",{style:s.valueCell,children:l(t.discount)})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Advance Payment"}),e.jsx("td",{style:s.valueCell,children:l(t.advanceAmount)}),e.jsx("td",{style:s.labelCell,children:"Paid Amount"}),e.jsx("td",{style:s.valueCell,children:l(t.totalPaid)})]}),e.jsxs("tr",{children:[e.jsx("td",{style:s.labelCell,children:"Final Amount"}),e.jsx("td",{style:s.valueCell,children:l(t.remainingAmount)}),e.jsx("td",{}),e.jsx("td",{})]})]})})]})]}),i&&e.jsx("div",{className:"report-content summary",style:s.reportContent,dangerouslySetInnerHTML:{__html:p(t)}})]}),e.jsx("div",{className:"footerNote",style:s.footerNote,children:"Radiological findings are based on imaging and are subject to technical limitations; correlation with clinical evaluation and other investigations is recommended."})]})},s={container:{width:"210mm",margin:"0 auto",padding:"8mm",boxSizing:"border-box",backgroundColor:"#fff",color:"#333",fontFamily:'"Arial", sans-serif',fontSize:"12pt",lineHeight:"1.4"},patientInfoTable:{width:"100%",borderCollapse:"collapse",margin:"15px 0"},labelCell:{fontWeight:"bold",width:"15%",padding:"5px",border:"1px solid #ddd",backgroundColor:"#f5f5f5"},valueCell:{padding:"5px",border:"1px solid #ddd",width:"35%"},reportTitle:{fontSize:"18pt",fontWeight:"600",margin:"22px 0px"},reportContent:{margin:"20px 0",padding:"10px",border:"1px solid #eee",minHeight:"100mm"},footerNote:{position:"static",width:"100%",textAlign:"center",fontSize:"11px",padding:"6px 10px",borderTop:"1px solid #ccc",fontStyle:"italic",background:"#f9f9f9",marginTop:"8mm"}},ee=({currentReport:t,selectedReport:i,handlePrint:d})=>{const m=h=>h==null?"N/A":`Rs. ${h.toLocaleString()}`,l=h=>{if(!h)return"N/A";const p=new Date(h),f=new Date;let r=f.getFullYear()-p.getFullYear();const o=f.getMonth()-p.getMonth();return(o<0||o===0&&f.getDate()<p.getDate())&&r--,`${r} Years`},N=h=>{if(!h)return"N/A";try{const p=new Date(h);return isNaN(p.getTime())?"N/A":p.toLocaleDateString()}catch{return"N/A"}};return e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("div",{className:"p-8 border-b border-gray-200",children:[e.jsx("div",{className:"flex justify-between items-center mb-6",children:e.jsxs("h2",{className:"text-2xl font-semibold text-teal-700 flex items-center",children:[e.jsx("svg",{className:"w-6 h-6 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"})}),"Patient Information"]})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"MRN:"})," ",t?.patientMRNO||"N/A"]}),e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Name:"})," ",t?.patientName||"N/A"]}),e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Contact:"})," ",t?.patient_ContactNo||"N/A"]}),e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Test Name:"})," ",i?.templateName?.replace(".html","")||"N/A"]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Age:"})," ",l(t?.age)]}),e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Sex:"})," ",t?.sex||"N/A"]}),e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Performed By:"})," ",t?.performedBy?.name||"N/A"]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Date:"})," ",N(t?.date)]}),e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Referred By:"})," ",i?.referBy||"N/A"]}),e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Status:"})," ",t?.deleted?"Deleted":i?.paymentStatus||"Active"]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Total Amount:"})," ",m(i?.totalAmount)]}),e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Paid Amount:"})," ",m(i?.totalPaid)]}),e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Advance Payment:"})," ",m(i?.advanceAmount)]}),e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Discount:"})," ",m(i?.discount)]}),e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Refund Amount:"})," ",i?.refunded?.length>0?i.refunded.map(h=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:m(h.refundAmount)}),e.jsxs("span",{className:"text-gray-500 text-sm",children:["(",new Date(h.refundedAt).toLocaleDateString(),")"]})]},h._id)):"0.00"]}),e.jsxs("p",{className:"text-gray-700",children:[e.jsx("span",{className:"font-medium text-teal-600",children:"Final Amount:"})," ",m(i?.remainingAmount)]})]})]})]}),e.jsx("div",{className:"m-8",children:e.jsxs("button",{onClick:()=>d(i),className:"flex items-center bg-teal-700 text-white px-5 py-2 rounded-full hover:bg-teal-600 cursor-pointer",children:[e.jsx("svg",{className:"w-4 h-4 mr-1",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"})}),"Print"]})})]})};var te=V.create({name:"fontSize",addOptions(){return{types:["textStyle"]}},addGlobalAttributes(){return[{types:this.options.types,attributes:{fontSize:{default:null,parseHTML:t=>t.style.fontSize,renderHTML:t=>t.fontSize?{style:`font-size: ${t.fontSize}`}:{}}}}]},addCommands(){return{setFontSize:t=>({chain:i})=>i().setMark("textStyle",{fontSize:t}).run(),unsetFontSize:()=>({chain:t})=>t().setMark("textStyle",{fontSize:null}).removeEmptyTextStyle().run()}}});const se=({currentReport:t,selectedReport:i,selectedReportIndex:d,id:m})=>{const l=$(),{user:N}=L(c=>c.auth),h=N.user_Access==="Radiology",[p,f]=b.useState(!1),[r,o]=b.useState(""),[u,g]=b.useState(!1),[n,x]=b.useState("16px"),[j,z]=b.useState("#000000"),[H,D]=b.useState(""),T=async c=>{try{return(await F.get(`/api/templates/${c}`)).data||"<h2>Findings</h2><p>No findings available</p><h3>Summary</h3><p>No summary available</p>"}catch(y){return console.error("Failed to fetch template:",y),"<h2>Findings</h2><p>Template not found</p><h3>Summary</h3><p>Summary not available</p>"}},a=O({extensions:[W.configure({heading:{levels:[1,2,3]}}),G,Y,te,q,U.configure({multicolor:!0}),K.configure({types:["heading","paragraph","listItem"]})],content:r,onUpdate:({editor:c})=>o(c.getHTML())});b.useEffect(()=>{t&&t.templateName&&(async()=>{const y=Array.isArray(t.templateName)?t.templateName[d]:t.templateName;if(y&&y!=="N/A"){const S=await T(y);D(S);const M=t.finalContent?.[d]||t.finalContent||S;o(M),a&&!a.isDestroyed&&a.commands.setContent(M)}})()},[t,d,a]);const B=()=>{const c=i.finalContent||H||"<h2>Findings</h2><p>No findings available</p><h3>Summary</h3><p>No summary available</p>";o(c),a&&a.commands.setContent(c),x("16px"),z("#000000"),f(!0),setTimeout(()=>{a&&a.commands.focus()},100)},w=()=>{f(!1);const c=i.finalContent||H||"<h2>Findings</h2><p>No findings available</p><h3>Summary</h3><p>No summary available</p>";o(c),a&&a.commands.setContent(c),x("16px"),z("#000000")},C=async()=>{if(!r.trim())return;const c=Array.isArray(t?.studies)&&t.studies[d]?t.studies[d]:null;if(!c){console.error("No study at selected index");return}const y=c._id,S=(c.templateName||"").trim().replace(/(\.html)+$/i,"")+".html";g(!0);try{await l(_({id:t._id,reportData:{studyId:y,templateName:S,finalContent:r}})).unwrap(),l(P(t._id)),f(!1)}catch(M){console.error("Failed to save report:",M)}finally{g(!1)}},v=c=>{const y=`${c}px`;x(y),a&&a.chain().focus().setFontSize(y).run()},A=c=>{z(c),a&&a.chain().focus().setColor(c).run()},k=(c="#fffbeb")=>{a&&a.chain().focus().toggleHighlight({color:c}).run()};return e.jsxs("div",{className:"p-8",children:[e.jsx("style",{children:`
  /* Reset the whole editor/read area to normal weight */
  .editor-prose,
  .editor-prose .ProseMirror {
    font-weight: 400;
  }

  /* Make bold sane (not extra heavy) */
  .editor-prose strong,
  .editor-prose b {
    font-weight: 700; /* medium-bold */
  }

  /* If a parent is bold, don't double-bold children */
  .editor-prose * {
    font-weight: inherit;
  }

  /* Headings: readable but not screaming */
  .editor-prose h1 { font-weight: 400; }
  .editor-prose h2 { font-weight: 400; }
  .editor-prose h3 { font-weight: 400; }

  /* Bold inside headings shouldn't stack */
 .editor-prose h1 { font-size: 1.2rem; font-weight: 700; margin: .75rem 0; }
  .editor-prose h2 { font-size: 1.1rem; font-weight: 700; margin: .5rem 0; }
  .editor-prose h3 { font-size: 1rem; font-weight: 600; margin: .5rem 0; }

  /* Pasted HTML often uses inline styles; normalize them visually */
  .editor-prose [style*="font-weight: 700"],
  .editor-prose [style*="font-weight:700"],
  .editor-prose [style*="font-weight:bold"] {
    font-weight: 600 !important;
  }

  /* Keep lists visible (unrelated to bold, but handy) */
  .editor-prose ul { list-style: disc; padding-left: 1.25rem; }
  .editor-prose ol { list-style: decimal; padding-left: 1.25rem; }
  .editor-prose li { margin: .25rem 0; }
`}),e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsxs("h2",{className:"text-2xl font-semibold text-teal-700 flex items-center",children:[e.jsx("svg",{className:"w-6 h-6 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),"Findings"]}),p?e.jsxs("div",{className:"space-x-3 flex",children:[e.jsx("button",{onClick:C,disabled:u,className:"bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200 disabled:opacity-50 shadow-md flex items-center",children:u?e.jsxs(e.Fragment,{children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Saving..."]}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"w-5 h-5 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}),"Save Changes"]})}),e.jsxs("button",{onClick:w,disabled:u,className:"bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 shadow-md flex items-center",children:[e.jsx("svg",{className:"w-5 h-5 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})}),"Cancel"]})]}):h&&e.jsxs("button",{onClick:B,className:"bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-md flex items-center",children:[e.jsx("svg",{className:"w-5 h-5 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"})}),"Edit Report"]})]}),p?e.jsxs("div",{className:"border rounded-2xl overflow-hidden shadow-lg transition-all duration-300",children:[e.jsxs("div",{className:"flex flex-wrap gap-2 p-3 bg-gray-100 border-b border-gray-200",children:[e.jsxs("div",{className:"flex items-center space-x-1 bg-gray-200 rounded-lg p-1",children:[e.jsx("button",{onClick:()=>a.chain().focus().toggleBold().run(),className:`p-2 rounded-md ${a?.isActive("bold")?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Bold",children:e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"})})}),e.jsx("button",{onClick:()=>a.chain().focus().toggleItalic().run(),className:`p-2 rounded-md ${a?.isActive("italic")?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Italic",children:e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"})})}),e.jsx("button",{onClick:()=>a.chain().focus().toggleUnderline().run(),className:`p-2 rounded-md ${a?.isActive("underline")?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Underline",children:e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"})})})]}),e.jsxs("div",{className:"flex items-center space-x-1 bg-gray-200 rounded-lg p-1",children:[e.jsx("button",{onClick:()=>a.chain().focus().toggleHeading({level:1}).run(),className:`p-2 rounded-md ${a?.isActive("heading",{level:1})?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Heading 1",children:"H1"}),e.jsx("button",{onClick:()=>a.chain().focus().toggleHeading({level:2}).run(),className:`p-2 rounded-md ${a?.isActive("heading",{level:2})?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Heading 2",children:"H2"}),e.jsx("button",{onClick:()=>a.chain().focus().toggleHeading({level:3}).run(),className:`p-2 rounded-md ${a?.isActive("heading",{level:3})?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Heading 3",children:"H3"}),e.jsx("button",{onClick:()=>a.chain().focus().setParagraph().run(),className:`p-2 rounded-md ${a?.isActive("paragraph")?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Paragraph",children:e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M9 16h2V8H9v8zm3 0h2V8h-2v8zm3 0h2V8h-2v8zM6 4v3h12V4H6z"})})})]}),e.jsxs("div",{className:"flex items-center space-x-1 bg-gray-200 rounded-lg p-1",children:[e.jsx("button",{onClick:()=>v(parseInt(n)-2),disabled:parseInt(n)<=8,className:"p-2 rounded-md hover:bg-gray-300 disabled:opacity-50",title:"Decrease Font Size",children:e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M19 13H5v-2h14v2z"})})}),e.jsx("span",{className:"text-sm px-2",children:n}),e.jsx("button",{onClick:()=>v(parseInt(n)+2),disabled:parseInt(n)>=36,className:"p-2 rounded-md hover:bg-gray-300 disabled:opacity-50",title:"Increase Font Size",children:e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"})})})]}),e.jsxs("div",{className:"flex items-center space-x-1 bg-gray-200 rounded-lg p-1",children:[e.jsx("input",{type:"color",value:j,onChange:c=>A(c.target.value),className:"w-8 h-8 cursor-pointer border-none bg-transparent",title:"Text Color"}),e.jsx("button",{onClick:()=>A("#000000"),className:"p-2 rounded-md hover:bg-gray-300",title:"Reset Color",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})})})]}),e.jsx("div",{className:"flex items-center space-x-1 bg-gray-200 rounded-lg p-1",children:e.jsx("button",{onClick:()=>k("#fffbeb"),className:`p-2 rounded-md ${a?.isActive("highlight")?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Highlight",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"})})})}),e.jsxs("div",{className:"flex items-center space-x-1 bg-gray-200 rounded-lg p-1",children:[e.jsx("button",{onClick:()=>a.chain().focus().setTextAlign("left").run(),className:`p-2 rounded-md ${a?.isActive("textAlign",{align:"left"})?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Align Left",children:e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M15 15H3v-2h12v2zm0-4H3V9h12v2zM3 5v2h18V5H3zm0 12h18v-2H3v2z"})})}),e.jsx("button",{onClick:()=>a.chain().focus().setTextAlign("center").run(),className:`p-2 rounded-md ${a?.isActive("textAlign",{align:"center"})?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Align Center",children:e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M7 15v-2h10v2H7zm-4-4h18V9H3v2zm0-4h18V5H3v2zm4 8h10v2H7v-2z"})})}),e.jsx("button",{onClick:()=>a.chain().focus().setTextAlign("right").run(),className:`p-2 rounded-md ${a?.isActive("textAlign",{align:"right"})?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Align Right",children:e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M9 15h12v-2H9v2zm0-4h12V9H9v2zM3 5v2h18V5H3zm6 12h12v-2H9v2z"})})})]}),e.jsxs("div",{className:"flex items-center space-x-1 bg-gray-200 rounded-lg p-1",children:[e.jsx("button",{onClick:()=>a.chain().focus().toggleBulletList().run(),className:`p-2 rounded-md ${a?.isActive("bulletList")?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Bullet List",children:e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"})})}),e.jsx("button",{onClick:()=>a.chain().focus().toggleOrderedList().run(),className:`p-2 rounded-md ${a?.isActive("orderedList")?"bg-teal-100 text-teal-700":"hover:bg-gray-300"}`,title:"Numbered List",children:e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"})})})]})]}),e.jsx(Z,{editor:a,className:"p-6 min-h-[400px] bg-white text-gray-800 editor-prose max-w-none focus:outline-none"})]}):e.jsx("div",{className:"editor-prose max-w-none text-gray-800 p-6 bg-gray-50 rounded-2xl shadow-inner",dangerouslySetInnerHTML:{__html:i?.finalContent||"<h2>Findings</h2><p>No findings available</p><h3>Summary</h3><p>No summary available</p>"}})]})},ae=t=>{if(!t)return"N/A";try{const i=new Date(t);return isNaN(i.getTime())?"N/A":i.toLocaleDateString()}catch{return"N/A"}},ne=({currentReport:t})=>e.jsx("div",{className:"bg-teal-50 p-8 text-right border-t border-gray-200",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{className:"text-left",children:[e.jsxs("p",{className:"text-gray-600 text-sm",children:["Report Status:"," ",e.jsx("span",{className:"font-medium text-teal-700",children:t?.deleted?"Deleted":"Finalized"})]}),e.jsxs("p",{className:"text-gray-600 text-sm",children:["Last Updated: ",ae(t?.updatedAt)]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-teal-700 font-semibold text-lg",children:t?.performedBy?.name||"Dr. Mansoor Ghani"}),e.jsx("p",{className:"text-gray-600 text-sm",children:t?.performedBy?.name?"Radiology Technician":"Consultant Radiologist"})]})]})}),le=t=>{if(!t)return"N/A";const i=new Date(t),d=new Date;let m=d.getFullYear()-i.getFullYear();const l=d.getMonth()-i.getMonth();return(l<0||l===0&&d.getDate()<i.getDate())&&m--,`${m} Years`},he=t=>{if(!t)return"N/A";try{const i=new Date(t);return isNaN(i.getTime())?"N/A":i.toLocaleDateString()}catch{return"N/A"}},xe=()=>{const{user:t}=L(n=>n.auth),i=t?.user_Access==="Radiology",d=$(),{id:m}=I(),l=L(n=>n.radiology.currentReport),N=L(n=>n.radiology.isLoading),h=L(n=>n.radiology.error),[p,f]=b.useState(0);b.useEffect(()=>{m&&d(P(m))},[d,m]);const o=(()=>{if(!l||!Array.isArray(l.studies))return null;const n=l.studies[p]||{};return{...l,templateName:n.templateName||"N/A",finalContent:n.finalContent||"<h2>Findings</h2><p>No findings available</p><h3>Summary</h3><p>No summary available</p>",referBy:n.referBy||"N/A",totalAmount:n.totalAmount??l.totalAmount,discount:n.discount??l.discount,totalPaid:n.totalPaid??l.totalPaid,remainingAmount:n.remainingAmount??l.remainingAmount,advanceAmount:n.advanceAmount??l.advanceAmount,refunded:n.refunded??l.refunded,paymentStatus:n.paymentStatus??l.paymentStatus}})(),u=n=>{({...n,age:le(n.age)});const x=window.open("","_blank");if(!x){alert("Please allow popups for printing");return}const j=R.renderToStaticMarkup(e.jsx(X,{report:l,isRadiology:i}));x.document.open(),x.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Radiology Report</title>
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
            .patient-info {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            .patient-info td {
              padding: 3px 5px;
              vertical-align: top;
              border: none;
            }
            .patient-info .label {
              font-weight: bold;
              width: 120px;
            }
            .duplicate-section {
              margin-top: 20px;
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .footer {
              margin-top: 30px;
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
            .footer-note {
              text-align: center;
              margin-top: 20px;
              font-size: 11px;
              color: #666;
            }
            @media print {
              body * {
                visibility: hidden;
              }
              .print-container, .print-container * {
                visibility: visible;
              }
              .print-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>${j}</body>
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          };
        <\/script>
      </html>
    `),x.document.close()},g=n=>{f(n)};return N?e.jsx("div",{className:"min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 to-gray-100",children:e.jsx("div",{className:"text-teal-600 text-2xl font-semibold animate-pulse",children:"Loading..."})}):h?e.jsx("div",{className:"min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 to-gray-100",children:e.jsxs("div",{className:"text-red-600 text-2xl font-semibold",children:["Error: ",h]})}):l?e.jsx("div",{className:"min-h-screen bg-linear-to-br from-teal-50 to-gray-100",children:e.jsxs("div",{className:"mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl",children:[e.jsx(Q,{currentReport:l,selectedReport:o}),Array.isArray(l.studies)&&l.studies.length>1&&e.jsxs("div",{className:"p-4 bg-teal-50 border-b border-gray-200",children:[e.jsx("h3",{className:"text-lg font-semibold text-teal-700 mb-2",children:"Select Report:"}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("div",{className:"flex flex-wrap gap-2",children:l.studies.map((n,x)=>e.jsx("button",{onClick:()=>g(x),className:`px-4 py-2 rounded-full text-sm ${p===x?"bg-teal-600 text-white":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`,children:n.templateName?.replace(".html","")},n._id||x))}),e.jsx("div",{})]})]}),e.jsx(ee,{currentReport:l,selectedReport:o,handlePrint:u}),e.jsx(se,{currentReport:l,selectedReport:o,selectedReportIndex:p,id:m}),e.jsx(ne,{currentReport:l})]})}):e.jsx("div",{className:"min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 to-gray-100",children:e.jsx("div",{className:"text-teal-600 text-2xl font-semibold",children:"No report found"})})};export{le as calculateAge,xe as default,he as formatDate};
