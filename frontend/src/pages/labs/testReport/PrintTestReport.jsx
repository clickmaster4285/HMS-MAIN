import {
  getNormalRange,
  formatNormalRange,
  getRangeLabel,
} from '../../../utils/rangeUtils';

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

  return (
    <div style={styles.container}>
      {/* Letterhead space - completely empty */}
      <div style={styles.letterheadSpace}></div>
      
      {/* Content area - all your content goes here */}
      <div style={styles.contentArea}>
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

        {testDefinitions.map((testDef, index) => (
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
                {testDef.fields.map((field, idx) => (
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

// CSS-in-JS styles adapted from PrintRadiologyReport.jsx
const styles = {
  container: {
    width: '210mm',
    height: '297mm', // Fixed A4 height
    margin: '0 auto',
    padding: '0',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: '#333',
    fontFamily: '"Arial", sans-serif',
    fontSize: '14pt', // Reduced from 11pt
    lineHeight: '1.2', // Reduced line height
    position: 'relative',
    overflow: 'hidden', // Prevent overflow to second page
    pageBreakInside: 'avoid',
    pageBreakAfter: 'avoid',
  },

  letterheadSpace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '74mm', // 25% of 297mm ≈ 74mm for letterhead
    backgroundColor: 'transparent',
    // This area will be empty for physical letterhead
  },

  contentArea: {
    position: 'absolute',
    top: '74mm', // Start after letterhead space
    left: '1mm',
    right: '1mm',
    bottom: '1mm',
    overflow: 'hidden',
  },

  printButton: {
    position: 'fixed',
    top: '10mm',
    right: '10mm',
    padding: '5px 10px',
    background: '#2b6cb0',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    zIndex: 1000,
    display: 'block',
  },

  header: {
    textAlign: 'center',
    marginBottom: '8px', // Reduced
    borderBottom: '2px solid #2b6cb0',
    paddingBottom: '8px', // Reduced
  },

  patientInfoTable: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '8px 0', // Reduced from 15px
    fontSize: '11pt', // Smaller font for table
  },

  labelCell: {
    fontWeight: 'bold',
    width: '15%',
    padding: '3px', // Reduced from 5px
    border: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
    fontSize: '11pt', // Consistent font size
  },

  valueCell: {
    padding: '3px', // Reduced from 5px
    border: '1px solid #ddd',
    width: '35%',
    fontSize: '11pt', // Consistent font size
  },

  testSection: {
    marginBottom: '12px', // Reduced from 20px
    pageBreakInside: 'avoid',
  },

  testTitle: {
    fontWeight: 'bold',
    fontSize: '12pt', // Reduced from 16pt
    marginBottom: '3px', // Reduced from 5px
    color: '#2b6cb0',
    padding: '2px 0',
  },

  testTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '8px', // Reduced from 10px
    tableLayout: 'fixed',
    fontSize: '11pt', // Smaller font for test table
  },

  tableHeader: {
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    padding: '3px', // Reduced from 5px
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '11pt', // Reduced from 11pt
  },

  tableCell: {
    border: '1px solid #ddd',
    padding: '3px', // Reduced from 5px
    fontSize: '12pt', // Reduced from 11pt
    fontWeight: 500,
    verticalAlign: 'top',
    lineHeight: '1.2',
  },

  // Fixed width columns
  testNameHeader: {
    width: '35%',
  },

  resultHeader: {
    width: '20%',
  },

  unitHeader: {
    width: '15%',
  },

  rangeHeader: {
    width: '30%',
  },

  // Cell styles with word wrapping
  testNameCell: {
    width: '35%',
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
    width: '30%',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
  },

  abnormal: {
    color: 'red',
    fontWeight: 'bold',
  },
  legalNotice: {
    display: "flex",
    justifyContent: "flex-end",
    textAlign: "right",
  }
};

export default PrintTestReport;