// utils/purposeOptions.js
export const PURPOSE_OPTIONS = {
   'X-Ray': [
      'Chest X-Ray',
      'Skull X-Ray',
      'Left Hand X-Ray',
      'Right Hand X-Ray',
      'Left Leg X-Ray',
      'Right Leg X-Ray',
      'Spine X-Ray',
      'Abdomen X-Ray',
      'Pelvis X-Ray',
      'Other X-Ray'
   ],
   'ECG': [
      '12-Lead ECG',
      'Resting ECG',
      'Stress ECG',
      'Holter Monitor',
      'Other ECG'
   ],
   'BSR': [
      'Fasting Blood Sugar',
      'Random Blood Sugar',
      'Postprandial Blood Sugar',
      'HbA1c',
      'Other BSR'
   ],
   'Consultation': [
      'General Consultation',
      'Follow-up Consultation',
      'Second Opinion',
      'Emergency Consultation'
   ],
   'Lab Test': [
      'CBC',
      'Urine Test',
      'Liver Function Test',
      'Kidney Function Test',
      'Lipid Profile',
      'Other Lab Test'
   ],
   'Other': [] // For custom input
};

// For the main dropdown (top-level categories)
export const MAIN_PURPOSE_CATEGORIES = [
   'Consultation',
   'X-Ray',
   'ECG',
   'BSR',
   'Lab Test',
   'Other'
];

// Helper function to get all options as flat list for autocomplete
export const ALL_PURPOSE_OPTIONS = [
   // Consultations
   'General Consultation',
   'Follow-up Consultation',
   'Second Opinion',
   'Emergency Consultation',

   // X-Rays
   'Chest X-Ray',
   'Skull X-Ray',
   'Left Hand X-Ray',
   'Right Hand X-Ray',
   'Left Leg X-Ray',
   'Right Leg X-Ray',
   'Spine X-Ray',
   'Abdomen X-Ray',
   'Pelvis X-Ray',

   // ECGs
   '12-Lead ECG',
   'Resting ECG',
   'Stress ECG',
   'Holter Monitor',

   // BSR
   'Fasting Blood Sugar',
   'Random Blood Sugar',
   'Postprandial Blood Sugar',
   'HbA1c',

   // Lab Tests
   'CBC',
   'Urine Test',
   'Liver Function Test',
   'Kidney Function Test',
   'Lipid Profile'
];

// Detect if input is likely X-Ray
export const detectXRay = (input) => {
   if (!input) return false;
   const inputLower = input.toLowerCase();

   const xrayKeywords = [
      'chest', 'skull', 'hand', 'leg', 'spine', 'abdomen', 'pelvis',
      'wrist', 'ankle', 'knee', 'elbow', 'shoulder', 'hip', 'rib',
      'fracture', 'injury', 'trauma', 'imaging', 'scan', 'xray', 'x-ray'
   ];

   return xrayKeywords.some(keyword => inputLower.includes(keyword));
};

// Detect if input is likely ECG
export const detectECG = (input) => {
   if (!input) return false;
   const inputLower = input.toLowerCase();

   const ecgKeywords = [
      'ecg', 'ekg', 'electrocardiogram', 'cardiac', 'heart', 'rhythm',
      '12', 'lead', 'resting', 'stress', 'holter', 'beat', 'pulse'
   ];

   return ecgKeywords.some(keyword => inputLower.includes(keyword));
};

// Detect if input is likely BSR
export const detectBSR = (input) => {
   if (!input) return false;
   const inputLower = input.toLowerCase();

   const bsrKeywords = [
      'bsr', 'blood sugar', 'glucose', 'sugar', 'diabetes',
      'fasting', 'random', 'postprandial', 'pp', 'hba1c', 'a1c'
   ];

   return bsrKeywords.some(keyword => inputLower.includes(keyword));
};

// Detect purpose category
export const detectPurposeCategory = (input) => {
   if (!input) return 'Other';

   if (detectXRay(input)) return 'X-Ray';
   if (detectECG(input)) return 'ECG';
   if (detectBSR(input)) return 'BSR';

   const inputLower = input.toLowerCase();
   if (inputLower.includes('consult') || inputLower.includes('doctor')) return 'Consultation';
   if (inputLower.includes('test') || inputLower.includes('lab')) return 'Lab Test';

   return 'Other';
};

// Auto-complete suggestion
export const suggestPurposeCompletion = (input) => {
   if (!input) return input;

   const inputLower = input.toLowerCase();
   const category = detectPurposeCategory(input);

   // Don't suggest if already has proper suffix
   if (category === 'X-Ray' && !inputLower.includes('x-ray') && !inputLower.includes('xray')) {
      return `${input} X-Ray`;
   }

   if (category === 'ECG' && !inputLower.includes('ecg') && !inputLower.includes('ekg')) {
      return `${input} ECG`;
   }

   if (category === 'BSR' && !inputLower.includes('bsr') && !inputLower.includes('blood sugar')) {
      return `${input} BSR`;
   }

   if (category === 'Consultation' && !inputLower.includes('consultation')) {
      return `${input} Consultation`;
   }

   return input;
};

// Get expected token prefix (for UI display)
export const getExpectedTokenPrefix = (purpose) => {
   const category = detectPurposeCategory(purpose);

   switch (category) {
      case 'X-Ray': return 'XR';
      case 'ECG': return 'EC';
      case 'BSR': return 'BL';
      case 'Consultation': return 'DR';
      case 'Lab Test': return 'LB';
      default: return 'GE';
   }
};

// Check if a purpose belongs to a category
export const isPurposeInCategory = (purpose, category) => {
   if (!purpose || !category) return false;

   if (category === 'All') return true;

   // If purpose exactly matches the category (e.g., "Consultation" = "Consultation")
   if (purpose === category) return true;

   if (category === 'Other') {
      return !ALL_PURPOSE_OPTIONS.includes(purpose) && !MAIN_PURPOSE_CATEGORIES.includes(purpose);
   }

   // Check if it's a main category
   if (MAIN_PURPOSE_CATEGORIES.includes(category)) {
      // Check if purpose is exactly the category name OR if it's in the category's options
      if (purpose === category) return true;
      return PURPOSE_OPTIONS[category]?.includes(purpose) || false;
   }

   // Check if it's a specific purpose
   return purpose === category;
};

// Get all purpose categories that a specific purpose belongs to
export const getPurposeCategories = (purpose) => {
   if (!purpose) return [];

   const categories = [];

   // Check if it's in predefined options
   for (const [category, options] of Object.entries(PURPOSE_OPTIONS)) {
      if (options.includes(purpose)) {
         categories.push(category);
      }
   }

   // If not found in predefined, it's "Other"
   if (categories.length === 0) {
      categories.push('Other');
   }

   return categories;
};

// Get all purposes for filtering
export const getPurposesForFilter = () => {
   return [
      'All', // Add "All" option
      ...MAIN_PURPOSE_CATEGORIES,
      ...ALL_PURPOSE_OPTIONS
   ];
};

// Get purposes count by category (for stats)
export const getPurposeStats = (visits = []) => {
   const stats = {
      total: visits.length,
      byCategory: {},
      bySpecific: {}
   };

   visits.forEach(visit => {
      const purpose = visit.purpose || 'Unknown';

      // Count by specific purpose
      stats.bySpecific[purpose] = (stats.bySpecific[purpose] || 0) + 1;

      // Count by category
      const categories = getPurposeCategories(purpose);
      categories.forEach(category => {
         stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      });
   });

   return stats;
};

// Enhanced matchesPurposeFilter with smart detection
export const matchesPurposeFilter = (patientPurpose, selectedFilter) => {
   if (!patientPurpose || !selectedFilter) return false;

   // Always match "All"
   if (selectedFilter === 'All') return true;

   // Exact match
   if (patientPurpose === selectedFilter) return true;

   // Smart category detection
   const purposeCategory = detectPurposeCategory(patientPurpose);
   if (purposeCategory === selectedFilter) return true;

   // Check if selectedFilter is a main category
   if (MAIN_PURPOSE_CATEGORIES.includes(selectedFilter)) {
      // Check if purpose is exactly the category name
      if (patientPurpose === selectedFilter) return true;

      // Check if it's in the category's options
      const categoryOptions = PURPOSE_OPTIONS[selectedFilter] || [];
      return categoryOptions.includes(patientPurpose);
   }

   // Check if patientPurpose is a main category and selectedFilter is a specific purpose
   for (const [category, options] of Object.entries(PURPOSE_OPTIONS)) {
      if (options.includes(selectedFilter) && patientPurpose === category) {
         return true;
      }
   }

   return false;
};