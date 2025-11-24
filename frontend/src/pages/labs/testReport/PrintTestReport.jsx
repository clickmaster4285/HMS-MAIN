import {
  getNormalRange,
  formatNormalRange,
  getRangeLabel,
} from '../../../utils/rangeUtils';
import { shouldPrintOnSeparatePage } from '../../../config/printConfig';

const PrintTestReport = ({ patientTest, testDefinitions }) => {
  // Helper function to handle empty values
  const safeData = (value, fallback = 'N/A') => value || fallback;

  // Extract patient data
  const patientData = {
    ...patientTest.patient_Detail,
    gender: patientTest.patient_Detail?.patient_Gender,
    age: patientTest.patient_Detail?.patient_Age,
    isPregnant: patientTest.patient_Detail?.isPregnant,
  };

  // Format date to "DD-MM-YYYY" format
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

  // Format age from "X years Y months Z days" to "(X)Y, (Y)M, (Z)D"
  const formatAge = (ageString) => {
    if (!ageString) return 'N/A';
    const matches = ageString.match(/(\d+) years (\d+) months (\d+) days/);
    if (matches) {
      return `(${matches[1]})Y, (${matches[2]})M, (${matches[3]})D`;
    }
    return ageString;
  };

  // Get normal range based on gender
  const getFormattedRange = (field, patientData) => {
    if (!field.normalRange) return 'NIL';
    const range = getNormalRange(field.normalRange, patientData);
    if (!range) return 'NIL';
    const min = range.min !== undefined ? range.min : 'N/A';
    const max = range.max !== undefined ? range.max : 'N/A';
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

  // Render patient information section (repeated on every page)
  const renderPatientInfo = () => (
    <div style={styles.patientInfoSection}>
      <div style={styles.legalNotice}>Not valid for court</div>
      <table style={styles.patientInfoTable}>
        <tbody>
          <tr>
            <td style={styles.labelCell}>Lab #</td>
            <td style={styles.valueCell}>{safeData(patientData.patient_MRNo)}</td>
            <td style={styles.labelCell}>Date</td>
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
            <td style={styles.labelCell}></td>
            <td style={styles.valueCell}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  // Render a single test section with patient info
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
              {testDef.fields && testDef.fields.map((field, idx) => (
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
                    {field.value || '/-'}
                  </td>
                  <td style={{...styles.tableCell, ...styles.unitCell}}>{safeData(field.unit, '')}</td>
                  <td style={{...styles.tableCell, ...styles.rangeCell}}>
                    {getFormattedRange(field, patientData)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render grouped tests together on one page
  const renderGroupedTests = () => {
    if (groupedTests.length === 0) return null;

    return (
      <div className="grouped-tests-page" style={styles.pageContainer}>
        {/* Letterhead space - 25% of page height */}
        <div style={styles.letterheadSpace}></div>
        
        {/* Content area - starts after letterhead */}
        <div style={styles.contentArea}>
          {/* Patient information */}
          {renderPatientInfo()}
          
          {/* All grouped tests */}
          {groupedTests.map((testDef, index) => (
            <div style={styles.testSection} key={index}>
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
                  {testDef.fields && testDef.fields.map((field, idx) => (
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
                        {field.value || '/-'}
                      </td>
                      <td style={{...styles.tableCell, ...styles.unitCell}}>{safeData(field.unit, '')}</td>
                      <td style={{...styles.tableCell, ...styles.rangeCell}}>
                        {getFormattedRange(field, patientData)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.mainContainer}>
      {/* Render separate page tests first (each on its own page with patient info) */}
      {separatePageTests.map((testDef, index) => 
        renderTestWithPatientInfo(testDef, index, true)
      )}

      {/* Render grouped tests together on one page */}
      {renderGroupedTests()}

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

// Updated CSS for multi-page layout with letterhead
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
    height: '74mm', // 25% of 297mm
    backgroundColor: 'transparent',
    // This area will be empty for physical letterhead
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
    marginBottom: '8mm',
  },

  testTitle: {
    fontWeight: 'bold',
    fontSize: '13pt',
    marginBottom: '3mm',
    color: '#2b6cb0',
    padding: '2px 0',
    borderBottom: '2px solid #2b6cb0',
  },

  testTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '4mm',
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