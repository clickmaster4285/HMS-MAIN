// config/printConfig.js

// Array of test IDs that should be printed on separate pages
export const SEPARATE_PAGE_TESTS = [
  '68834cbea01362dc885e9043', // Test 1
  '68835847a01362dc885e90cb', // Test 2  
  '6883540ca01362dc885e9081'  // Test 3
];

// Enhanced function to check if a test should be printed on a separate page
export const shouldPrintOnSeparatePage = (testId) => {
  if (!testId) return false;
  
  // Convert to string and trim for comparison
  const cleanTestId = String(testId).trim();
  
  return SEPARATE_PAGE_TESTS.some(separateId => 
    String(separateId).trim() === cleanTestId
  );
};

// Debug function to log test IDs
export const debugTestIds = (testDefinitions) => {
  console.log('=== DEBUG TEST IDs ===');
  testDefinitions.forEach((test, index) => {
    const testId = test.testId || test._id || test.test;
    console.log(`Test ${index}:`, {
      name: test.testName,
      id: testId,
      shouldSeparate: shouldPrintOnSeparatePage(testId),
      allIds: {
        testId: test.testId,
        _id: test._id,
        test: test.test
      }
    });
  });
  console.log('=== END DEBUG ===');
};

export const PRINT_CONFIG = {
  separatePageTests: SEPARATE_PAGE_TESTS,
  maxTestsPerPage: 2,
  includePageNumbers: true,
  showLabHeader: true
};