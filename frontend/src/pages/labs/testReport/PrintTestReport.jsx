import {
  getNormalRange,
  formatNormalRange,
  getRangeLabel,
} from '../../../utils/rangeUtils';
import { shouldPrintOnSeparatePage } from '../../../config/printConfig';

const PrintTestReport = ({ patientTest, testDefinitions }) => {
  // Enhanced helper function to handle empty values - hide "Nill" and empty strings
  const safeData = (value, fallback = '') => {
    if (!value || value === 'Nill' || value === 'NIL' || value === 'nil' || value.trim() === '') {
      return '';
    }
    return value;
  };

  // Extract patient data
  const patientData = {
    ...patientTest.patient_Detail,
    gender: patientTest.patient_Detail?.patient_Gender,
    age: patientTest.patient_Detail?.patient_Age,
    isPregnant: patientTest.patient_Detail?.isPregnant,
  };

  // Format date to "DD-MM-YYYY HH:MM" format in Pakistani timezone
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    // Convert to Pakistani time (UTC+5)
    const options = {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    const formatter = new Intl.DateTimeFormat('en-PK', options);
    const parts = formatter.formatToParts(date);
    
    const day = parts.find(part => part.type === 'day').value;
    const month = parts.find(part => part.type === 'month').value;
    const year = parts.find(part => part.type === 'year').value;
    const hour = parts.find(part => part.type === 'hour').value;
    const minute = parts.find(part => part.type === 'minute').value;
    
    return `${day}-${month}-${year} ${hour}:${minute}`;
  } catch {
    return 'N/A';
  }
};

  // Format age from "X years Y months Z days" to "(X)Y, (Y)M, (Z)D"
  const formatAge = (ageString) => {
    if (!ageString) return 'N/A';
    const matches = ageString.match(/(\d+) years (\d+) months (\d+) days/);
    if (matches) {
      return `(${matches[1]})Y, (${matches[2]})M, (${matches[3]})D`;
    }
    return ageString;
  };

  // Enhanced Get normal range - hide empty ranges
  const getFormattedRange = (field, patientData) => {
    if (!field.normalRange || Object.keys(field.normalRange).length === 0) return '';
    
    const range = getNormalRange(field.normalRange, patientData);
    if (!range) return '';
    
    const min = range.min !== undefined && range.min !== 'Nill' && range.min !== 'Nil' ? range.min : '';
    // const max = range.max !== undefined && range.max !== 'Nill' && range.max !== 'Nil' ? range.max : '';
    const max = range.max ;
    
    // If both min and max are empty, return empty string
    if (!min && !max) return '';
    
    // If only one value exists, return just that value
    if (!min) return max;
    if (!max) return min;
    
    return `${min} - ${max}`;
  };

  // Check if result is abnormal
  const isAbnormal = (field, value, patientData) => {
    if (!field.normalRange || !value) return false;
    const range = getNormalRange(field.normalRange, patientData);
    if (!range) return false;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    const min =
      typeof range.min === 'string' ? parseFloat(range.min) : range.min;
    const max =
      typeof range.max === 'string' ? parseFloat(range.max) : range.max;
    if (isNaN(min) || isNaN(max)) return false;
    return numValue < min || numValue > max;
  };

  // Group tests by page requirement
  const groupTestsByPage = () => {
    const separatePageTests = [];
    const groupedTests = [];
    
    testDefinitions.forEach((test) => {
      const testId = test.testId;
      if (shouldPrintOnSeparatePage(testId)) {
        separatePageTests.push({...test, _printId: testId});
      } else {
        groupedTests.push({...test, _printId: testId});
      }
    });

    return { separatePageTests, groupedTests };
  };

  const { separatePageTests, groupedTests } = groupTestsByPage();

  // Group tests into chunks of maximum 2 tests per page
  const groupTestsIntoPages = (tests) => {
    const pages = [];
    for (let i = 0; i < tests.length; i += 2) {
      pages.push(tests.slice(i, i + 2));
    }
    return pages;
  };

  const groupedTestPages = groupTestsIntoPages(groupedTests);

  // Render patient information section (repeated on every page)
  const renderPatientInfo = () => (
    <div style={styles.patientInfoSection}>
      <div style={styles.legalNotice}>Not valid for court</div>
      <table style={styles.patientInfoTable}>
        <tbody>
          <tr>
            <td style={styles.labelCell}>Lab #</td>
            <td style={styles.valueCell}>{safeData(patientData.patient_MRNo)}</td>
            <td style={styles.labelCell}>Sample Date</td>
            <td style={styles.valueCell}>{formatDate(patientTest.createdAt)}</td>
          </tr>
          <tr>
            <td style={styles.labelCell}>Patient Name</td>
            <td style={styles.valueCell}>{safeData(patientData.patient_Name)}</td>
            <td style={styles.labelCell}>Referred By</td>
            <td style={styles.valueCell}>{safeData(patientTest.patient_Detail.referredBy)}</td>
          </tr>
          <tr>
            <td style={styles.labelCell}>Gender</td>
            <td style={styles.valueCell}>{safeData(patientData.patient_Gender)}</td>
            <td style={styles.labelCell}>Patient Age</td>
            <td style={styles.valueCell}>{formatAge(patientData.patient_Age)}</td>
          </tr>
          <tr>
            <td style={styles.labelCell}>Contact #</td>
            <td style={styles.valueCell}>{safeData(patientData.patient_ContactNo)}</td>
            <td style={styles.labelCell}>Report Date</td>
            <td style={styles.valueCell}>{formatDate(getReportDate())}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  // Render a single test section
  const renderTestSection = (testDef, index, showDivider = false) => (
    <div key={index}>
      <div style={styles.testSection}>
        <div style={styles.testTitle}>{testDef.testName}</div>
        <table style={styles.testTable}>
          <thead>
            <tr>
              <th style={{...styles.tableHeader, ...styles.testNameHeader}}>Test Name</th>
              <th style={{...styles.tableHeader, ...styles.resultHeader}}>Result</th>
              <th style={{...styles.tableHeader, ...styles.unitHeader}}>Unit</th>
              <th style={{...styles.tableHeader, ...styles.rangeHeader}}>Reference Range</th>
            </tr>
          </thead>
          <tbody>
            {testDef.fields && testDef.fields.map((field, idx) => {
              // Get the formatted range (empty if no range)
              const formattedRange = getFormattedRange(field, patientData);
              
              return (
                <tr key={idx}>
                  <td style={{...styles.tableCell, ...styles.testNameCell}}>
                    {field.fieldName || field.name}
                  </td>
                  <td
                    style={
                      isAbnormal(field, field.value, patientData)
                        ? {...styles.tableCell, ...styles.resultCell, ...styles.abnormal}
                        : {...styles.tableCell, ...styles.resultCell}
                    }
                  >
                    {safeData(field.value) || '  '}
                  </td>
                  <td style={{...styles.tableCell, ...styles.unitCell}}>
                    {safeData(field.unit)}
                  </td>
                  <td style={{...styles.tableCell, ...styles.rangeCell}}>
                    {formattedRange}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Visual divider between tests (except for the last test on page) */}
      {showDivider && <div style={styles.testDivider}></div>}
    </div>
  );

  // Render a single test section with patient info (for separate page tests)
  const renderTestWithPatientInfo = (testDef, index, isSeparatePage = false) => (
    <div 
      className={isSeparatePage ? "separate-page-test" : "grouped-test"}
      style={isSeparatePage ? { ...styles.pageContainer, ...styles.separatePage } : styles.pageContainer} 
      key={index}
    >
      {/* Letterhead space - 25% of page height */}
      <div style={styles.letterheadSpace}></div>
      
      {/* Content area - starts after letterhead */}
      <div style={styles.contentArea}>
        {/* Patient information repeated on every page */}
        {renderPatientInfo()}
        
        {/* Test content */}
        {renderTestSection(testDef, index, false)}
      </div>
    </div>
  );

  // Render grouped tests (2 per page) with clear separation
  const renderGroupedTestsPage = (tests, pageIndex) => {
    if (tests.length === 0) return null;

    return (
      <div className="grouped-tests-page" style={styles.pageContainer} key={pageIndex}>
        {/* Letterhead space - 25% of page height */}
        <div style={styles.letterheadSpace}></div>
        
        {/* Content area - starts after letterhead */}
        <div style={styles.contentArea}>
          {/* Patient information */}
          {renderPatientInfo()}
          
          {/* Render tests with visual separation */}
          {tests.map((testDef, index) => (
            renderTestSection(testDef, index, index < tests.length - 1)
          ))}
        </div>
      </div>
    );
  };

  // In the component, add this function to get the report date
const getReportDate = () => {
  // If there are test definitions with createdAt, use the latest one
  if (testDefinitions && testDefinitions.length > 0) {
    const testWithDate = testDefinitions.find(test => test.updatedAt);
    if (testWithDate) return testWithDate.updatedAt;
  }
  
  // Fallback to patientTest creation date
  return patientTest.updatedAt;
};

  return (
    <div style={styles.mainContainer}>
      {/* Render separate page tests first (each on its own page with patient info) */}
      {separatePageTests.map((testDef, index) => 
        renderTestWithPatientInfo(testDef, index, true)
      )}

      {/* Render grouped tests (2 per page) with clear separation */}
      {groupedTestPages.map((pageTests, pageIndex) => 
        renderGroupedTestsPage(pageTests, pageIndex)
      )}

      {/* Show message if no tests */}
      {testDefinitions.length === 0 && (
        <div style={styles.pageContainer}>
          <div style={styles.letterheadSpace}></div>
          <div style={styles.contentArea}>
            {renderPatientInfo()}
            <div style={styles.noTestsMessage}>
              No test results to display
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Updated CSS with visual separation between tests
const styles = {
  mainContainer: {
    width: '210mm',
    margin: '0 auto',
  },

  pageContainer: {
    width: '210mm',
    minHeight: '297mm',
    position: 'relative',
    pageBreakInside: 'avoid',
    backgroundColor: '#fff',
  },

  separatePage: {
    pageBreakAfter: 'always',
    pageBreakBefore: 'always',
  },

  // Letterhead space - 25% of A4 height (297mm * 0.25 = 74.25mm)
  letterheadSpace: {
    height: '60mm', // 20% of 297mm
    backgroundColor: 'transparent',
  },

  // Content area - starts after letterhead
  contentArea: {
    padding: '0 10mm',
    minHeight: '223mm', // Remaining 75% of page
  },

  patientInfoSection: {
    marginBottom: '8mm',
  },

  legalNotice: {
    textAlign: "right",
    marginBottom: '4mm',
    fontSize: '10pt',
    color: '#666',
  },

  patientInfoTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '4mm',
    fontSize: '11pt',
  },

  labelCell: {
    fontWeight: 'bold',
    width: '20%',
    padding: '3px 6px',
    border: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
  },

  valueCell: {
    padding: '3px 6px',
    border: '1px solid #ddd',
    width: '30%',
  },

  testSection: {
    marginBottom: '4mm',
  },

  // Visual divider between tests
  testDivider: {
    height: '10mm',
    margin: '6mm 0',
    border: 'none',
    borderRadius: '1mm',
  },

  testTitle: {
    fontWeight: 'bold',
    fontSize: '13pt',
    marginBottom: '3mm',
    color: '#eaeff5ff',
    backgroundColor: '#47484bff',
    padding: '2px 0',
    borderBottom: '2px solid #bfc9d3ff',
  },

  testTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '2mm',
    tableLayout: 'fixed',
    fontSize: '10pt',
  },

  tableHeader: {
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    padding: '4px 6px',
    textAlign: 'left',
    fontWeight: 'bold',
  },

  tableCell: {
    border: '1px solid #ddd',
    padding: '4px 6px',
    verticalAlign: 'top',
    lineHeight: '1.2',
  },

  noTestsMessage: {
    textAlign: 'center',
    padding: '20mm',
    color: '#666',
    fontSize: '14pt',
  },

  // Fixed width columns
  testNameHeader: { width: '40%' },
  resultHeader: { width: '20%' },
  unitHeader: { width: '15%' },
  rangeHeader: { width: '25%' },

  // Cell styles with word wrapping
  testNameCell: {
    width: '40%',
    wordWrap: 'break-word',
  },
  resultCell: {
    width: '20%',
    wordWrap: 'break-word',
  },
  unitCell: {
    width: '15%',
    wordWrap: 'break-word',
  },
  rangeCell: {
    width: '25%',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
  },

  abnormal: {
    color: 'red',
    fontWeight: 'bold',
  },
};

export default PrintTestReport;