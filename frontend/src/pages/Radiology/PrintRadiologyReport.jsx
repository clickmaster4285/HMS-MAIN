import React, { useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import Logo from '../../assets/images/logo1.png';

const PrintRadiologyReport = ({ report, isRadiology }) => {
  // ---------- Helpers ----------
  const safeData = (value, fallback = 'N/A') => value || fallback;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'N/A';
    return `Rs. ${Number(amount).toLocaleString()}`;
  };

  const escapeHtml = (s = '') =>
    s.replace(
      /[&<>"']/g,
      (c) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        }[c])
    );

  // Try to extract a short "summary" from a study's finalContent HTML.
  const extractStudySummary = (html = '') => {
    if (!html) return '';
    const normalized = html.replace(/\s+/g, ' ');
    const patterns = [
      /<h[1-6][^>]*>\s*(impression|conclusion|summary)\s*<\/h[1-6]>\s*([\s\S]*?)(?=<h[1-6]|$)/i,
      /<strong[^>]*>\s*(impression|conclusion|summary)\s*<\/strong>\s*:?([\s\S]*?)<\/(p|div)>/i,
      /(impression|conclusion|summary)\s*:?\s*<\/?(br|p|div)[^>]*>\s*([\s\S]*?)(?=<\/(p|div)>)/i,
    ];
    for (const re of patterns) {
      const m = normalized.match(re);
      if (m) {
        const body = (m[2] || m[3] || '').trim();
        if (body) return body;
      }
    }
    const p = normalized.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    return p ? p[1].trim() : '';
  };

  // Optional concise summary list (not used by default, but kept)
  const buildSummaryHTML = (rep) => {
    const studies = Array.isArray(rep?.studies) ? rep.studies : [];
    if (!studies.length) return `<p>No studies found.</p>`;
    const items = studies.map((s, i) => {
      const name = (s?.templateName || 'Unnamed Study').replace('.html', '');
      const summary =
        extractStudySummary(s?.finalContent) || 'No concise summary found.';
      const pay = s?.paymentStatus ? ` (${escapeHtml(s.paymentStatus)})` : '';
      return `
        <article class="study-block">
          <div class="study-title">${escapeHtml(
            `${i + 1}. ${name}`
          )}${pay}</div>
          <div class="study-body">${summary}</div>
        </article>
      `;
    });
    return items
      .map((h, i) =>
        i < items.length - 1 ? `${h}<hr class="study-sep" />` : h
      )
      .join('');
  };

  // Clean imported HTML and clamp aggressive inline styles
  const scrubInlineStyles = (html = '') => {
    if (!html) return '';
    return html
      .replace(
        /page-break-(before|after|inside)\s*:\s*(always|avoid|auto)\s*;?/gi,
        ''
      )
      .replace(
        /margin-(top|bottom)\s*:\s*(\d+)(px|mm)/gi,
        (_, side, n, unit) => {
          const val = parseInt(n, 10);
          const tooLarge =
            (unit.toLowerCase() === 'px' && val >= 20) ||
            (unit.toLowerCase() === 'mm' && val >= 10);
          return tooLarge
            ? `margin-${side}: 6mm`
            : `margin-${side}: ${val}${unit}`;
        }
      );
  };

  // Full merged content with separators between studies
  const buildMergedContentHTML = (rep) => {
    const studies = Array.isArray(rep?.studies) ? rep.studies : [];
    if (!studies.length) return `<p>No studies found.</p>`;
    const blocks = studies.map((s, i) => {
      const name = (s?.templateName || 'Unnamed Study').replace('.html', '');
      const body = scrubInlineStyles(s?.finalContent || '');
      return `
        <article class="study-block">
          <div class="study-title">${escapeHtml(`${i + 1}. ${name}`)}</div>
          <div class="study-body">${body}</div>
        </article>
      `;
    });
    return blocks
      .map((h, i) =>
        i < blocks.length - 1 ? `${h}<hr class="study-sep" />` : h
      )
      .join('');
  };

  // ---------- Auto page-breaks (start next block on new page if space too small) ----------
  const pageBodyRef = useRef(null);
  useEffect(() => {
    const container = pageBodyRef.current;
    if (!container) return;

    const mmToPx = (mm) => (mm * 96) / 25.4;

    // Match your @page and footer settings from CSS
    const PAGE_HEIGHT_MM = 297; // A4 height
    const TOP_MARGIN_MM = 8; // @page margin top
    const BOTTOM_MARGIN_MM = 8; // @page margin bottom
    const FOOTER_MM = 14; // var(--footer-height)
    const CONTENT_HEIGHT_MM = PAGE_HEIGHT_MM - TOP_MARGIN_MM - BOTTOM_MARGIN_MM;

    const pageHeightPx = mmToPx(CONTENT_HEIGHT_MM);
    const footerPx = mmToPx(FOOTER_MM);
    const THRESHOLD_MM = 15; // push to next page if leftover < 15mm (+ footer)
    const thresholdPx = mmToPx(THRESHOLD_MM) + footerPx;

    const removeInsertedBreaks = () => {
      container
        .querySelectorAll('.page-break.__auto')
        .forEach((el) => el.remove());
    };

    const prepareBreaks = () => {
      removeInsertedBreaks();
      const blocks = Array.from(container.querySelectorAll('.study-block'));
      if (!blocks.length) return;

      // Measure relative to the container top
      const containerTop = container.getBoundingClientRect().top;

      blocks.forEach((block) => {
        const rect = block.getBoundingClientRect();
        const blockTop = rect.top - containerTop; // px from container top
        const posInPage = blockTop % pageHeightPx; // position within current page
        const remaining = pageHeightPx - posInPage - footerPx;

        // If leftover space is too small, insert a page break before this block
        if (remaining < thresholdPx) {
          const breaker = document.createElement('div');
          breaker.className = 'page-break __auto';
          block.parentNode.insertBefore(breaker, block);
        }
      });
    };

    const handleBeforePrint = () => prepareBreaks();
    const handleAfterPrint = () => removeInsertedBreaks();

    if (window.matchMedia) {
      const mq = window.matchMedia('print');
      const mqListener = (e) =>
        e.matches ? handleBeforePrint() : handleAfterPrint();
      mq.addEventListener?.('change', mqListener);

      window.addEventListener('beforeprint', handleBeforePrint);
      window.addEventListener('afterprint', handleAfterPrint);

      return () => {
        mq.removeEventListener?.('change', mqListener);
        window.removeEventListener('beforeprint', handleBeforePrint);
        window.removeEventListener('afterprint', handleAfterPrint);
        removeInsertedBreaks();
      };
    } else {
      window.addEventListener('beforeprint', handleBeforePrint);
      window.addEventListener('afterprint', handleAfterPrint);
      return () => {
        window.removeEventListener('beforeprint', handleBeforePrint);
        window.removeEventListener('afterprint', handleAfterPrint);
        removeInsertedBreaks();
      };
    }
  }, []);

  // ---------- UI ----------
  return (
    <div className="print-container" style={styles.container}>
      <style>{`
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
      `}</style>

      {/* Header */}
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

      {/* Everything that scrolls/prints */}
      <div className="page-body" ref={pageBodyRef}>
        <h2 style={styles.reportTitle}>Radiology Report</h2>

        {/* Full tables when not in summary mode */}
        {isRadiology || (
          <>
            <table className="patient-info" style={styles.patientInfoTable}>
              <tbody>
                <tr>
                  <td style={styles.labelCell}>MR #</td>
                  <td style={styles.valueCell}>
                    {safeData(report.patientMRNO)}
                  </td>
                  <td style={styles.labelCell}>Report Date</td>
                  <td style={styles.valueCell}>{formatDate(report.date)}</td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Patient Name</td>
                  <td style={styles.valueCell}>
                    {safeData(report.patientName)}
                  </td>
                  <td style={styles.labelCell}>Referred By</td>
                  <td style={styles.valueCell}>
                    {safeData(report.studies?.[0]?.referBy || 'N/A')}
                  </td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Gender</td>
                  <td style={styles.valueCell}>{safeData(report.sex)}</td>
                  <td style={styles.labelCell}>Age</td>
                  <td style={styles.valueCell}>{safeData(report.age)}</td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Contact No</td>
                  <td colSpan="3" style={styles.valueCell}>
                    {safeData(report.patient_ContactNo)}
                  </td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Test Name</td>
                  <td colSpan="3" style={styles.valueCell}>
                    {report.studies?.length
                      ? report.studies.map((s, idx) => (
                          <div key={s._id || idx}>
                            {safeData(s.templateName?.replace('.html', ''))}
                          </div>
                        ))
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Total Amount</td>
                  <td style={styles.valueCell}>
                    {formatCurrency(report.totalAmount)}
                  </td>
                  <td style={styles.labelCell}>Discount</td>
                  <td style={styles.valueCell}>
                    {formatCurrency(report.discount)}
                  </td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Advance Payment</td>
                  <td style={styles.valueCell}>
                    {formatCurrency(report.advanceAmount)}
                  </td>
                  <td style={styles.labelCell}>Paid Amount</td>
                  <td style={styles.valueCell}>
                    {formatCurrency(report.totalPaid)}
                  </td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Final Amount</td>
                  <td style={styles.valueCell}>
                    {formatCurrency(report.remainingAmount)}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <hr />

            {/* duplicate copy */}
            <div className="duplicate-section">
              <h2 style={styles.reportTitle}>Radiology Report</h2>
              <table className="patient-info" style={styles.patientInfoTable}>
                <tbody>
                  <tr>
                    <td style={styles.labelCell}>MR #</td>
                    <td style={styles.valueCell}>
                      {safeData(report.patientMRNO)}
                    </td>
                    <td style={styles.labelCell}>Report Date</td>
                    <td style={styles.valueCell}>{formatDate(report.date)}</td>
                  </tr>
                  <tr>
                    <td style={styles.labelCell}>Patient Name</td>
                    <td style={styles.valueCell}>
                      {safeData(report.patientName)}
                    </td>
                    <td style={styles.labelCell}>Referred By</td>
                    <td style={styles.valueCell}>
                      {safeData(report.studies?.[0]?.referBy || 'N/A')}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.labelCell}>Gender</td>
                    <td style={styles.valueCell}>{safeData(report.sex)}</td>
                    <td style={styles.labelCell}>Age</td>
                    <td style={styles.valueCell}>{safeData(report.age)}</td>
                  </tr>
                  <tr>
                    <td style={styles.labelCell}>Contact No</td>
                    <td colSpan="3" style={styles.valueCell}>
                      {safeData(report.patient_ContactNo)}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.labelCell}>Test Name</td>
                    <td colSpan="3" style={styles.valueCell}>
                      {report.studies?.length
                        ? report.studies.map((s, idx) => (
                            <div key={s._id || idx}>
                              {safeData(s.templateName?.replace('.html', ''))}
                            </div>
                          ))
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.labelCell}>Total Amount</td>
                    <td style={styles.valueCell}>
                      {formatCurrency(report.totalAmount)}
                    </td>
                    <td style={styles.labelCell}>Discount</td>
                    <td style={styles.valueCell}>
                      {formatCurrency(report.discount)}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.labelCell}>Advance Payment</td>
                    <td style={styles.valueCell}>
                      {formatCurrency(report.advanceAmount)}
                    </td>
                    <td style={styles.labelCell}>Paid Amount</td>
                    <td style={styles.valueCell}>
                      {formatCurrency(report.totalPaid)}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.labelCell}>Final Amount</td>
                    <td style={styles.valueCell}>
                      {formatCurrency(report.remainingAmount)}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* SUMMARY mode (full merged content). Swap to buildSummaryHTML(report) for concise version */}
        {isRadiology && (
          <div
            className="report-content summary"
            style={styles.reportContent}
            dangerouslySetInnerHTML={{ __html: buildMergedContentHTML(report) }}
          />
        )}
      </div>

      {/* Footer (repeats at bottom of each printed page) */}
      <div className="footerNote" style={styles.footerNote}>
        Radiological findings are based on imaging and are subject to technical
        limitations; correlation with clinical evaluation and other
        investigations is recommended.
      </div>
    </div>
  );
};

// CSS-in-JS styles (non-header)
const styles = {
  container: {
    width: '210mm',
    margin: '0 auto',
    padding: '8mm',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: '#333',
    fontFamily: '"Arial", sans-serif',
    fontSize: '12pt',
    lineHeight: '1.4',
  },
  patientInfoTable: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '15px 0',
  },
  labelCell: {
    fontWeight: 'bold',
    width: '15%',
    padding: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
  },
  valueCell: {
    padding: '5px',
    border: '1px solid #ddd',
    width: '35%',
  },
  reportTitle: {
    fontSize: '18pt',
    fontWeight: '600',
    margin: '22px 0px',
  },
  reportContent: {
    margin: '20px 0',
    padding: '10px',
    border: '1px solid #eee',
    minHeight: '100mm', // screen comfort; print CSS overrides min-height
  },
  footerNote: {
    // Screen defaults (print CSS sets fixed per page)
    position: 'static',
    width: '100%',
    textAlign: 'center',
    fontSize: '11px',
    padding: '6px 10px',
    borderTop: '1px solid #ccc',
    fontStyle: 'italic',
    background: '#f9f9f9',
    marginTop: '8mm',
  },
};

export default PrintRadiologyReport;
