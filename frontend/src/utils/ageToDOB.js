// utils/ageToDOB.js
import { isValid } from 'date-fns';

// Calculate DOB from age string
export const calculateDOBFromAge = (ageStr) => {
   if (!ageStr || !ageStr.trim()) return '';

   const str = ageStr.toLowerCase().trim();
   let years = 0, months = 0, days = 0;

   try {
      // Handle different formats
      // "34" or "34y"
      if (/^\d+$/.test(str)) {
         years = parseInt(str);
      }
      // "20.11" (years.months)
      else if (/^\d+\.\d+$/.test(str)) {
         const [y, m] = str.split('.');
         years = parseInt(y);
         months = parseInt(m);
      }
      // "2y6m" or "2y" or "6m" or "15d"
      else {
         const yMatch = str.match(/(\d+)\s*y/);
         const mMatch = str.match(/(\d+)\s*m/);
         const dMatch = str.match(/(\d+)\s*d/);

         if (yMatch) years = parseInt(yMatch[1]);
         if (mMatch) months = parseInt(mMatch[1]);
         if (dMatch) days = parseInt(dMatch[1]);
      }
   } catch (err) {
      console.error('Error parsing age:', err);
      return '';
   }

   // Validate ranges
   if (months > 11) {
      years += Math.floor(months / 12);
      months = months % 12;
   }
   if (days > 31) days = 31;

   // Calculate DOB
   const today = new Date();
   const dob = new Date(today);

   dob.setFullYear(dob.getFullYear() - years);
   dob.setMonth(dob.getMonth() - months);
   dob.setDate(dob.getDate() - days);

   // Handle month overflow (e.g., moving from March to February with 31 days)
   const expectedMonth = (today.getMonth() - months + 12) % 12;
   while (dob.getMonth() !== expectedMonth) {
      dob.setDate(dob.getDate() - 1);
   }

   // Format as YYYY-MM-DD
   const year = dob.getFullYear();
   const month = String(dob.getMonth() + 1).padStart(2, '0');
   const day = String(dob.getDate()).padStart(2, '0');

   return `${year}-${month}-${day}`;
};

// Calculate age from DOB
export const calculateAgeFromDOB = (dobString) => {
   if (!dobString) return '';

   try {
      const dob = new Date(dobString);
      const today = new Date();

      // Validate date
      if (isNaN(dob.getTime())) return 'Invalid date';
      if (dob > today) return 'Future date';

      let years = today.getFullYear() - dob.getFullYear();
      let months = today.getMonth() - dob.getMonth();
      let days = today.getDate() - dob.getDate();

      // Adjust for negative days
      if (days < 0) {
         months--;
         // Get last day of previous month
         const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
         days += lastDayOfMonth;
      }

      // Adjust for negative months
      if (months < 0) {
         years--;
         months += 12;
      }

      // Format the age string
      const parts = [];
      if (years > 0) parts.push(`${years}y`);
      if (months > 0) parts.push(`${months}m`);
      if (days > 0 || (years === 0 && months === 0)) parts.push(`${days}d`);

      return parts.join('-') || '0d';

   } catch (error) {
      console.error('Error calculating age from DOB:', error);
      return '';
   }
};

// Validate age input format
export const validateAgeFormat = (value) => {
   if (!value) return true;

   const pattern = /^(\d+y)?-?(\d+m)?-?(\d+d)?$/i;
   return pattern.test(value) || /^\d+(\.\d+)?$/.test(value);
};