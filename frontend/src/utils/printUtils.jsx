// utils/printUtils.js
import ReactDOMServer from 'react-dom/server';
import PrintThermal from "../pages/reception/opd/prints/PrintThermal";
import PrintA4 from "../pages/reception/opd/prints/PrintA4";
import PrintPdf from "../pages/reception/opd/prints/PrintPdf";

export const printThermal = (formData) => {
   const printWindow = window.open('', '_blank',);
   const htmlContent = `
    <!DOCTYPE html>
    ${ReactDOMServer.renderToString(<PrintThermal formData={formData} />)}
  `;

   printWindow.document.write(htmlContent);
   printWindow.document.close();
};

export const printA4 = (formData) => {
   const printWindow = window.open('', '_blank');
   const htmlContent = `
    <!DOCTYPE html>
    ${ReactDOMServer.renderToString(<PrintA4 formData={formData} />)}
  `;

   printWindow.document.write(htmlContent);
   printWindow.document.close();

   // Auto-print after content loads
   const printAfterLoad = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
   };

   if (printWindow.document.readyState === 'complete') {
      setTimeout(printAfterLoad, 500);
   } else {
      printWindow.addEventListener('load', () => {
         setTimeout(printAfterLoad, 500);
      }, { once: true });
   }
};

export const printPdf = (formData) => {
   const pdfWindow = window.open('', '_blank');
   pdfWindow.document.write(`
    <!DOCTYPE html>
    ${ReactDOMServer.renderToString(<PrintPdf formData={formData} />)}
  `);
   pdfWindow.document.close();
};

// In your printUtils.js, make sure handlePrint accepts both parameters
export const handlePrint = (formData, printOption) => {
   if (!printOption) {
      throw new Error('Please select a print option');
   }

   switch (printOption) {
      case 'thermal':
         printThermal(formData);
         break;
      case 'a4':
         printA4(formData);
         break;
      case 'pdf':
         printPdf(formData);
         break;
      default:
         throw new Error('Invalid print option');
   }

   return true;
};