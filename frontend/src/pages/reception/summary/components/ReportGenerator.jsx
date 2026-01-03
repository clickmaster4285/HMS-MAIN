// components/ReportGenerator.jsx
import React from 'react';
import { FileText } from 'lucide-react';

const ReportGenerator = ({ data, dateRange, isLoading }) => {
   const handlePrintReport = () => {
      if (!data || isLoading) return;

      const { overview, opd, ipd, refunds, financialSummary } = data;

      // Format currency function for print
      const formatCurrencyForPrint = (amount) => {
         return `Rs. ${parseFloat(amount || 0).toLocaleString('en-PK', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
         })}`;
      };

      // Format date for display
      const formatDateForPrint = (dateString) => {
         return new Date(dateString).toLocaleDateString('en-PK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
         });
      };

      // Create print content
      const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hospital Analytics Report</title>
        <meta charset="UTF-8">
        <style>
          @page {
            size: A4;
            margin: 15mm;
            @bottom-center {
              content: "Page " counter(page) " of " counter(pages);
              font-size: 10px;
              color: #666;
            }
          }
          
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            font-size: 12px;
            line-height: 1.4;
          }
          
          .report-container {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm 15mm 15mm;
            margin: 0 auto;
            box-sizing: border-box;
          }
          
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #2c5282;
          }
          
          .hospital-name {
            font-size: 24px;
            font-weight: bold;
            color: #2c5282;
            margin: 0 0 5px 0;
          }
          
          .report-title {
            font-size: 18px;
            font-weight: bold;
            color: #4a5568;
            margin: 5px 0;
          }
          
          .period {
            font-size: 14px;
            color: #718096;
            margin: 5px 0 10px 0;
          }
          
          .generated-date {
            font-size: 11px;
            color: #a0aec0;
          }
          
          .section {
            margin-bottom: 15px;
            page-break-inside: avoid;
          }
          
          .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #2d3748;
            background-color: #edf2f7;
            padding: 8px 12px;
            margin: 15px 0 10px 0;
            border-left: 4px solid #4299e1;
            border-radius: 4px;
          }
          
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 15px;
          }
          
          .summary-card {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px;
          }
          
          .summary-card-title {
            font-size: 11px;
            color: #718096;
            margin-bottom: 4px;
          }
          
          .summary-card-value {
            font-size: 16px;
            font-weight: bold;
            color: #2d3748;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0 15px;
            font-size: 11px;
            page-break-inside: avoid;
          }
          
          th {
            background-color: #f8f9fa;
            color: #2d3748;
            font-weight: 600;
            text-align: left;
            padding: 8px 10px;
            border: 1px solid #e2e8f0;
            font-size: 11px;
          }
          
          td {
            padding: 7px 10px;
            border: 1px solid #e2e8f0;
            vertical-align: top;
          }
          
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          
          .financial-highlight {
            background-color: #f0fff4 !important;
            font-weight: bold;
          }
          
          .warning-highlight {
            background-color: #fffaf0 !important;
          }
          
          .text-center {
            text-align: center;
          }
          
          .text-right {
            text-align: right;
          }
          
          .currency {
            font-family: 'Courier New', monospace;
          }
          
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 10px;
            color: #a0aec0;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          /* Print-specific styles */
          @media print {
            .no-print {
              display: none;
            }
            
            .report-container {
              padding: 0;
              margin: 0;
              width: auto;
              min-height: auto;
            }
            
            body {
              font-size: 10pt;
            }
            
            table {
              font-size: 9pt;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <!-- Header Section -->
          <div class="header">
            <div class="hospital-name">HOSPITAL ANALYTICS REPORT</div>
            <div class="report-title">Performance Summary</div>
            <div class="period">Period: ${formatDateForPrint(dateRange.start)} to ${formatDateForPrint(dateRange.end)}</div>
            <div class="generated-date">Generated on: ${new Date().toLocaleDateString('en-PK', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
      })}</div>
          </div>
          
          <!-- Executive Summary Section -->
          <div class="section">
            <div class="section-title">EXECUTIVE SUMMARY</div>
            <div class="summary-cards">
              <div class="summary-card">
                <div class="summary-card-title">Total Patients</div>
                <div class="summary-card-value">${overview.totalOPDPatients + overview.totalIPDPatients}</div>
              </div>
              <div class="summary-card">
                <div class="summary-card-title">Total Revenue</div>
                <div class="summary-card-value currency">${formatCurrencyForPrint(overview.totalRevenue)}</div>
              </div>
              <div class="summary-card">
                <div class="summary-card-title">Net Revenue</div>
                <div class="summary-card-value currency">${formatCurrencyForPrint(overview.netRevenue)}</div>
              </div>
              <div class="summary-card">
                <div class="summary-card-title">Collection Rate</div>
                <div class="summary-card-value">${financialSummary.collectionMetrics.overallCollectionRate}</div>
              </div>
            </div>
          </div>
          
          <!-- Key Metrics Section -->
          <div class="section">
            <div class="section-title">KEY PERFORMANCE INDICATORS</div>
            <table>
              <thead>
                <tr>
                  <th width="25%">Metric</th>
                  <th width="20%">Value</th>
                  <th width="55%">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>OPD Patients</strong></td>
                  <td class="text-center"><strong>${overview.totalOPDPatients}</strong></td>
                  <td>
                    <span style="color: #4299e1;">With Doctor: ${opd.statistics.withDoctor}</span> | 
                    <span style="color: #38a169;">Direct Services: ${opd.statistics.withoutDoctor}</span>
                  </td>
                </tr>
                <tr>
                  <td><strong>IPD Patients</strong></td>
                  <td class="text-center"><strong>${overview.totalIPDPatients}</strong></td>
                  <td>
                    <span style="color: #ed8936;">Admitted: ${ipd.statistics.admitted}</span> | 
                    <span style="color: #38a169;">Discharged: ${ipd.statistics.discharged}</span>
                  </td>
                </tr>
                <tr class="financial-highlight">
                  <td><strong>Total Revenue</strong></td>
                  <td class="text-center"><strong class="currency">${formatCurrencyForPrint(overview.totalRevenue)}</strong></td>
                  <td>
                    <span style="color: #38a169;">Collected: ${formatCurrencyForPrint(overview.totalCollected)}</span> | 
                    <span style="color: #ed8936;">Pending: ${formatCurrencyForPrint(overview.totalPending)}</span>
                  </td>
                </tr>
                <tr>
                  <td><strong>Refunds</strong></td>
                  <td class="text-center"><strong>${overview.totalRefunds}</strong></td>
                  <td>
                    <span style="color: #e53e3e;">Amount: ${formatCurrencyForPrint(overview.totalRefundAmount)}</span> | 
                    <span>Average: ${formatCurrencyForPrint(refunds.statistics.averageRefund)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Financial Breakdown Section -->
          <div class="section">
            <div class="section-title">FINANCIAL BREAKDOWN</div>
            <table>
              <thead>
                <tr>
                  <th width="40%">Category</th>
                  <th width="30%">Revenue</th>
                  <th width="30%">Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>OPD Revenue</td>
                  <td class="currency text-right">${formatCurrencyForPrint(financialSummary.breakdown.opdRevenue)}</td>
                  <td class="text-center">${financialSummary.breakdown.opdPercentage}</td>
                </tr>
                <tr>
                  <td>IPD Revenue</td>
                  <td class="currency text-right">${formatCurrencyForPrint(financialSummary.breakdown.ipdRevenue)}</td>
                  <td class="text-center">${financialSummary.breakdown.ipdPercentage}</td>
                </tr>
                <tr class="financial-highlight">
                  <td><strong>Net Revenue</strong></td>
                  <td class="currency text-right"><strong>${formatCurrencyForPrint(financialSummary.netRevenue)}</strong></td>
                  <td class="text-center">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Doctor Performance Section -->
          ${opd.doctors.filter(d => d.type === 'doctor_assigned').length > 0 ? `
          <div class="section">
            <div class="section-title">DOCTOR PERFORMANCE</div>
            <table>
              <thead>
                <tr>
                  <th width="30%">Doctor</th>
                  <th width="15%">Department</th>
                  <th width="10%" class="text-center">Patients</th>
                  <th width="15%" class="text-right">Revenue</th>
                  <th width="15%" class="text-right">Hospital Share</th>
                  <th width="15%" class="text-right">Doctor Share</th>
                </tr>
              </thead>
              <tbody>
                ${opd.doctors
               .filter(d => d.type === 'doctor_assigned')
               .map((doctor, index) => `
                  <tr>
                    <td>${doctor.name}</td>
                    <td>${doctor.department}</td>
                    <td class="text-center">${doctor.patientCount}</td>
                    <td class="currency text-right">${formatCurrencyForPrint(doctor.revenue)}</td>
                    <td class="currency text-right" style="color: #38a169;">${formatCurrencyForPrint(doctor.hospitalShare)}</td>
                    <td class="currency text-right" style="color: #805ad5;">${formatCurrencyForPrint(doctor.doctorShare)}</td>
                  </tr>
                  `).join('')}
                <!-- Total Row -->
                ${(() => {
               const totalPatients = opd.doctors.filter(d => d.type === 'doctor_assigned').reduce((sum, d) => sum + d.patientCount, 0);
               const totalRevenue = opd.doctors.filter(d => d.type === 'doctor_assigned').reduce((sum, d) => sum + d.revenue, 0);
               const totalHospitalShare = opd.doctors.filter(d => d.type === 'doctor_assigned').reduce((sum, d) => sum + d.hospitalShare, 0);
               const totalDoctorShare = opd.doctors.filter(d => d.type === 'doctor_assigned').reduce((sum, d) => sum + d.doctorShare, 0);

               return `
                  <tr class="financial-highlight">
                    <td><strong>TOTAL</strong></td>
                    <td>-</td>
                    <td class="text-center"><strong>${totalPatients}</strong></td>
                    <td class="currency text-right"><strong>${formatCurrencyForPrint(totalRevenue)}</strong></td>
                    <td class="currency text-right" style="color: #38a169;"><strong>${formatCurrencyForPrint(totalHospitalShare)}</strong></td>
                    <td class="currency text-right" style="color: #805ad5;"><strong>${formatCurrencyForPrint(totalDoctorShare)}</strong></td>
                  </tr>
                  `;
            })()}
              </tbody>
            </table>
          </div>
          ` : ''}
          
          <!-- Service Categories Section -->
          ${opd.purposeCategories.length > 0 ? `
          <div class="section">
            <div class="section-title">SERVICE CATEGORIES</div>
            <table>
              <thead>
                <tr>
                  <th width="40%">Service</th>
                  <th width="20%" class="text-center">Patients</th>
                  <th width="20%" class="text-right">Revenue</th>
                  <th width="20%" class="text-center">Percentage</th>
                </tr>
              </thead>
              <tbody>
                ${opd.purposeCategories.map((category, index) => {
               const totalPatients = opd.purposeCategories.reduce((sum, cat) => sum + cat.patientCount, 0);
               const percentage = totalPatients > 0 ? ((category.patientCount / totalPatients) * 100).toFixed(1) : 0;
               const totalRevenue = opd.purposeCategories.reduce((sum, cat) => sum + cat.revenue, 0);
               const revenuePercentage = totalRevenue > 0 ? ((category.revenue / totalRevenue) * 100).toFixed(1) : 0;

               return `
                  <tr>
                    <td>${category.category.toUpperCase()}</td>
                    <td class="text-center">${category.patientCount}</td>
                    <td class="currency text-right">${formatCurrencyForPrint(category.revenue)}</td>
                    <td class="text-center">${percentage}%</td>
                  </tr>
                  `;
            }).join('')}
                <!-- Total Row -->
                ${(() => {
               const totalPatients = opd.purposeCategories.reduce((sum, cat) => sum + cat.patientCount, 0);
               const totalRevenue = opd.purposeCategories.reduce((sum, cat) => sum + cat.revenue, 0);

               return `
                  <tr class="financial-highlight">
                    <td><strong>TOTAL</strong></td>
                    <td class="text-center"><strong>${totalPatients}</strong></td>
                    <td class="currency text-right"><strong>${formatCurrencyForPrint(totalRevenue)}</strong></td>
                    <td class="text-center"><strong>100%</strong></td>
                  </tr>
                  `;
            })()}
              </tbody>
            </table>
          </div>
          ` : ''}
          
          <!-- Direct Services Section -->
          ${opd.doctors.filter(d => d.type === 'hospital_only').length > 0 ? `
          <div class="section">
            <div class="section-title">DIRECT SERVICES (NO DOCTOR ASSIGNMENT)</div>
            <table>
              <thead>
                <tr>
                  <th width="30%">Service Type</th>
                  <th width="15%" class="text-center">Patients</th>
                  <th width="25%" class="text-right">Revenue</th>
                  <th width="30%">Description</th>
                </tr>
              </thead>
              <tbody>
                ${opd.doctors
               .filter(d => d.type === 'hospital_only')
               .map((service, index) => `
                  <tr>
                    <td>${service.name}</td>
                    <td class="text-center">${service.patientCount}</td>
                    <td class="currency text-right">${formatCurrencyForPrint(service.revenue)}</td>
                    <td style="font-size: 10px;">${service.note}</td>
                  </tr>
                  `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}
          
          <!-- IPD & Refunds Summary -->
          <div class="section">
            <div class="section-title">ADDITIONAL METRICS</div>
            <table>
              <thead>
                <tr>
                  <th width="50%">Category</th>
                  <th width="25%" class="text-center">Value</th>
                  <th width="25%" class="text-center">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>IPD Collection Rate</td>
                  <td class="text-center">${ipd.statistics.collectionRate}</td>
                  <td class="text-center">Pending: ${formatCurrencyForPrint(ipd.statistics.pendingRevenue)}</td>
                </tr>
                <tr>
                  <td>Refund Analysis</td>
                  <td class="text-center">${refunds.statistics.totalRefunds} refunds</td>
                  <td class="text-center">Avg: ${formatCurrencyForPrint(refunds.statistics.averageRefund)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p><strong>Hospital Management System Report</strong></p>
            <p>This report contains confidential information. For internal use only.</p>
            <p>Generated automatically by the Hospital Analytics Dashboard</p>
          </div>
        </div>
        
        <script>
          // Auto-print on load
          window.onload = function() {
            setTimeout(function() {
              window.print();
              // Close window after print dialog (with delay for user to make selection)
              setTimeout(function() {
                window.close();
              }, 500);
            }, 250);
          };
          
          // Also allow manual print with Ctrl+P
          document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'p') {
              e.preventDefault();
              window.print();
            }
          });
        </script>
      </body>
      </html>
    `;

      // Open print window
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      printWindow.document.write(printContent);
      printWindow.document.close();

      // Focus on the print window
      printWindow.focus();
   };

   return (
      <button
         onClick={handlePrintReport}
         disabled={isLoading || !data}
         className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
         title="Generate and print report for current date range"
      >
         <FileText className="w-5 h-5" />
         <span>Generate Report</span>
      </button>
   );
};

export default ReportGenerator;