// Enhanced department detection with smart keyword matching
const departmentPatterns = {
   // X-Ray patterns (case-insensitive, handles variations)
   xray: {
      prefix: 'XR',
      name: 'Radiology',
      patterns: [
         /\b(x[\s-]*ray|xray)\b/i,           // X-Ray, X Ray, Xray
         /\b(radiology|radiograph)\b/i,      // Radiology
         /\b(chest|skull|hand|leg|spine|abdomen|pelvis)\s*(x[\s-]*ray|xray)?\b/i,  // Body parts + X-Ray
         /\b(orthopantomogram|opg|cbct)\b/i  // Dental X-Rays
      ],
      keywords: ['x-ray', 'xray', 'radiology', 'radiograph', 'opg', 'cbct']
   },

   // ECG patterns
   ecg: {
      prefix: 'EC',
      name: 'Cardiology',
      patterns: [
         /\b(ecg|ekg)\b/i,                   // ECG, EKG
         /\b(electrocardiogram|electrocardiography)\b/i,
         /\b(12[\s-]*lead|resting|stress|holter)\s*(ecg|ekg)?\b/i,
         /\b(cardiac|heart)\s*(test|monitor)?\b/i
      ],
      keywords: ['ecg', 'ekg', 'electrocardiogram', 'cardiac', 'heart']
   },

   // BSR/Blood Sugar patterns
   bsr: {
      prefix: 'BL',
      name: 'Pathology',
      patterns: [
         /\b(bsr|blood\s*sugar)\b/i,
         /\b(glucose|sugar)\s*(test|level)?\b/i,
         /\b(fasting|random|postprandial|pp)\s*(blood\s*sugar|sugar)?\b/i,
         /\b(hba1c|a1c|glycated\s*hemoglobin)\b/i,
         /\b(blood\s*glucose)\b/i
      ],
      keywords: ['bsr', 'blood sugar', 'glucose', 'hba1c', 'sugar test']
   },

   // Lab Test patterns
   labtest: {
      prefix: 'LB',
      name: 'Laboratory',
      patterns: [
         /\b(lab\s*test|laboratory)\b/i,
         /\b(cbc|complete\s*blood\s*count)\b/i,
         /\b(urine\s*test|urinalysis)\b/i,
         /\b(liver\s*function|lft)\b/i,
         /\b(kidney\s*function|kft|renal)\b/i,
         /\b(lipid\s*profile|cholesterol)\b/i,
         /\b(blood\s*test)\b/i
      ],
      keywords: ['lab test', 'cbc', 'urine test', 'lft', 'kft', 'lipid']
   },

   // Consultation patterns
   consultation: {
      prefix: 'DR',
      name: 'Consultation',
      patterns: [
         /\b(consultation|consult)\b/i,
         /\b(general|follow[\s-]*up|second\s*opinion|emergency)\s*(consultation|consult)?\b/i,
         /\b(opd|outpatient)\b/i,
         /\b(doctor|physician|surgeon)\s*(visit|appointment)?\b/i
      ],
      keywords: ['consultation', 'opd', 'doctor', 'follow-up', 'emergency']
   }
};

// Default fallback
const defaultDept = {
   prefix: 'GE',
   name: 'General',
   patterns: [],
   keywords: []
};

// Smart department detection
const detectDepartment = (purpose) => {
   if (!purpose || typeof purpose !== 'string') {
      return defaultDept;
   }

   const purposeLower = purpose.toLowerCase().trim();

   // Clean the purpose text
   const cleanPurpose = purposeLower
      .replace(/\s+/g, ' ')  // Normalize spaces
      .replace(/[^\w\s-]/g, '')  // Remove special chars
      .trim();

   // Check each department pattern
   for (const [deptKey, deptInfo] of Object.entries(departmentPatterns)) {
      // Check patterns
      for (const pattern of deptInfo.patterns) {
         if (pattern.test(cleanPurpose)) {
            return deptInfo;
         }
      }

      // Check keywords
      for (const keyword of deptInfo.keywords) {
         if (cleanPurpose.includes(keyword)) {
            return deptInfo;
         }
      }
   }

   // Check for common variations
   if (cleanPurpose.includes('ultrasound') || cleanPurpose.includes('sonography')) {
      return { prefix: 'US', name: 'Ultrasound', patterns: [], keywords: [] };
   }

   if (cleanPurpose.includes('mri') || cleanPurpose.includes('scan')) {
      return { prefix: 'MR', name: 'MRI', patterns: [], keywords: [] };
   }

   if (cleanPurpose.includes('ct')) {
      return { prefix: 'CT', name: 'CT Scan', patterns: [], keywords: [] };
   }

   if (cleanPurpose.includes('dental') || cleanPurpose.includes('tooth')) {
      return { prefix: 'DE', name: 'Dental', patterns: [], keywords: [] };
   }

   if (cleanPurpose.includes('eye') || cleanPurpose.includes('vision')) {
      return { prefix: 'EY', name: 'Ophthalmology', patterns: [], keywords: [] };
   }

   return defaultDept;
};

// Main function
const getDepartmentFromPurpose = (purpose) => {
   const detected = detectDepartment(purpose);
   return {
      prefix: detected.prefix,
      name: detected.name
   };
};

// Helper to extract purpose category for statistics
const getPurposeCategory = (purpose) => {
   const detected = detectDepartment(purpose);

   switch (detected.prefix) {
      case 'XR': return 'X-Ray';
      case 'EC': return 'ECG';
      case 'BL': return 'BSR';
      case 'LB': return 'Lab Test';
      case 'DR': return 'Consultation';
      case 'US': return 'Ultrasound';
      case 'MR': return 'MRI';
      case 'CT': return 'CT Scan';
      case 'DE': return 'Dental';
      case 'EY': return 'Eye';
      default: return 'General';
   }
};

// Add custom pattern
const addDepartmentPattern = (prefix, name, patterns, keywords) => {
   departmentPatterns[prefix.toLowerCase()] = {
      prefix,
      name,
      patterns: patterns.map(p => new RegExp(p, 'i')),
      keywords: keywords.map(k => k.toLowerCase())
   };
};

// Extract specific details from purpose
const extractPurposeDetails = (purpose) => {
   const detected = detectDepartment(purpose);
   const cleanPurpose = purpose.toLowerCase().trim();

   let specificType = 'General';

   // Extract specific type
   if (detected.prefix === 'XR') {
      if (cleanPurpose.includes('chest')) specificType = 'Chest';
      else if (cleanPurpose.includes('skull')) specificType = 'Skull';
      else if (cleanPurpose.includes('hand')) specificType = 'Hand';
      else if (cleanPurpose.includes('leg')) specificType = 'Leg';
      else if (cleanPurpose.includes('spine')) specificType = 'Spine';
      else if (cleanPurpose.includes('abdomen')) specificType = 'Abdomen';
      else if (cleanPurpose.includes('pelvis')) specificType = 'Pelvis';
      else specificType = 'X-Ray';
   }
   else if (detected.prefix === 'EC') {
      if (cleanPurpose.includes('12')) specificType = '12-Lead';
      else if (cleanPurpose.includes('resting')) specificType = 'Resting';
      else if (cleanPurpose.includes('stress')) specificType = 'Stress';
      else if (cleanPurpose.includes('holter')) specificType = 'Holter';
      else specificType = 'ECG';
   }
   else if (detected.prefix === 'BL') {
      if (cleanPurpose.includes('fasting')) specificType = 'Fasting';
      else if (cleanPurpose.includes('random')) specificType = 'Random';
      else if (cleanPurpose.includes('postprandial') || cleanPurpose.includes('pp')) specificType = 'Postprandial';
      else if (cleanPurpose.includes('hba1c')) specificType = 'HbA1c';
      else specificType = 'Blood Sugar';
   }
   else if (detected.prefix === 'DR') {
      if (cleanPurpose.includes('general')) specificType = 'General';
      else if (cleanPurpose.includes('follow')) specificType = 'Follow-up';
      else if (cleanPurpose.includes('second')) specificType = 'Second Opinion';
      else if (cleanPurpose.includes('emergency')) specificType = 'Emergency';
      else specificType = 'Consultation';
   }

   return {
      prefix: detected.prefix,
      departmentName: detected.name,
      category: getPurposeCategory(purpose),
      specificType,
      isCustom: !Object.keys(departmentPatterns).some(key =>
         departmentPatterns[key].prefix === detected.prefix
      )
   };
};

module.exports = {
   getDepartmentFromPurpose,
   getPurposeCategory,
   addDepartmentPattern,
   extractPurposeDetails,
   detectDepartment,
   departmentPatterns
};