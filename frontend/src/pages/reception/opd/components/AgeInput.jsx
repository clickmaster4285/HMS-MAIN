// components/AgeInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import { calculateDOBFromAge, calculateAgeFromDOB, validateAgeFormat } from '../../../../utils/ageToDOB';

const AgeInput = ({ age, dob, onAgeChange, onDOBChange }) => {
   // Local state for inputs
   const [ageInput, setAgeInput] = useState(age || '');
   const [dobInput, setDobInput] = useState(dob || '');

   // Track which input was last changed by user to prevent loops
   const lastChanged = useRef(null); // 'age', 'dob', or null
   const timeoutRef = useRef(null);

   // Update local state when props change (from form reset, etc.)
   useEffect(() => {
      setAgeInput(age || '');
   }, [age]);

   useEffect(() => {
      setDobInput(dob || '');
   }, [dob]);

   // Handle AGE input change
   const handleAgeChange = (e) => {
      const value = e.target.value;
      setAgeInput(value);
      lastChanged.current = 'age';

      // Clear any existing timeout
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }

      // Debounce the calculation
      timeoutRef.current = setTimeout(() => {
         if (value.trim() && validateAgeFormat(value)) {
            // Calculate DOB from age
            const calculatedDOB = calculateDOBFromAge(value);
            if (calculatedDOB && calculatedDOB !== dobInput) {
               setDobInput(calculatedDOB);
               if (onDOBChange) {
                  onDOBChange(calculatedDOB);
               }
            }
         }

         // Call onAgeChange with the raw value
         if (onAgeChange) {
            onAgeChange(value);
         }

         lastChanged.current = null;
      }, 500); // 500ms debounce
   };

   // Handle DOB input change
   const handleDOBChange = (e) => {
      const value = e.target.value;
      setDobInput(value);
      lastChanged.current = 'dob';

      if (value) {
         // Calculate age from DOB
         const calculatedAge = calculateAgeFromDOB(value);
         if (calculatedAge !== ageInput) {
            setAgeInput(calculatedAge);
            if (onAgeChange) {
               onAgeChange(calculatedAge);
            }
         }
      } else {
         // Clear age if DOB is cleared
         setAgeInput('');
         if (onAgeChange) {
            onAgeChange('');
         }
      }

      // Call onDOBChange
      if (onDOBChange) {
         onDOBChange(value);
      }

      lastChanged.current = null;
   };

   // Clean up timeout on unmount
   useEffect(() => {
      return () => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
         }
      };
   }, []);

   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Age
            </label>
            <input
               type="text"
               value={ageInput}
               onChange={handleAgeChange}
               placeholder="e.g., 34, 2y-6m, 15d, 20.11"
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
               Formats: 34 (years), 2y-6m (years-months), 15d (days), 20.11 (years.months)
            </p>
         </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Date of Birth
            </label>
            <input
               type="date"
               value={dobInput || ''}
               onChange={handleDOBChange}
               max={new Date().toISOString().split('T')[0]}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
               Select DOB to auto-calculate age
            </p>
         </div>
      </div>
   );
};

export default AgeInput;