import React, { useState, useEffect, useRef } from 'react';
import { InputField } from '../../../../components/common/FormFields';
import { PURPOSE_OPTIONS, MAIN_PURPOSE_CATEGORIES, ALL_PURPOSE_OPTIONS } from '../../../../utils/purposeOptions';

const PurposeInput = ({ value, onChange, name, ...props }) => {
   const [showSubOptions, setShowSubOptions] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState('');
   const [customInput, setCustomInput] = useState('');
   const [showCustomInput, setShowCustomInput] = useState(false);
   const [filteredOptions, setFilteredOptions] = useState([]);
   const [suggestion, setSuggestion] = useState('');
   const containerRef = useRef(null);

   // Initialize when value changes or on first render
   useEffect(() => {
      if (!value) {
         // Set default value to "General Consultation" if no value is provided
         const defaultValue = "General Consultation";
         onChange({ target: { name, value: defaultValue } });
         setSelectedCategory('Consultation');
      } else if (value) {
         // Check if value is a main category
         if (MAIN_PURPOSE_CATEGORIES.includes(value)) {
            setSelectedCategory(value);
            setShowSubOptions(true);
         } else {
            // Check which category this belongs to
            const category = Object.entries(PURPOSE_OPTIONS).find(([cat, options]) =>
               options.includes(value)
            )?.[0] || 'Other';

            setSelectedCategory(category);
            setShowSubOptions(false);
         }
      }
   }, [value, name, onChange]);

   // Rest of your component remains the same...
   // Close dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (containerRef.current && !containerRef.current.contains(event.target)) {
            setShowSubOptions(false);
            setFilteredOptions([]);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   // Handle main category selection
   const handleCategorySelect = (category) => {
      setSelectedCategory(category);

      if (category === 'Other') {
         setShowCustomInput(true);
         setShowSubOptions(false);
         setCustomInput(value || '');
      } else {
         setShowSubOptions(true);
         setShowCustomInput(false);
         setFilteredOptions([]);

         // If category is "Consultation", auto-select "General Consultation"
         if (category === 'Consultation' && !value) {
            const defaultSubOption = 'General Consultation';
            onChange({ target: { name, value: defaultSubOption } });
            setShowSubOptions(false); // Hide after selection
         }
      }
   };

   // Handle sub-option selection
   const handleSubOptionSelect = (subOption) => {
      onChange({ target: { name, value: subOption } });
      setShowSubOptions(false);
   };

   // Handle custom input
   const handleCustomInputChange = (e) => {
      const newValue = e.target.value;
      setCustomInput(newValue);

      // Auto-complete in custom input too
      const autoCompleted = autoCompletePurpose(newValue);
      if (autoCompleted !== newValue) {
         setSuggestion(autoCompleted);
      } else {
         setSuggestion('');
      }

      onChange({ target: { name, value: newValue } });
   };

   // Enhanced auto-complete function
   const autoCompletePurpose = (input) => {
      if (!input || input.length < 2) return input;

      const inputLower = input.toLowerCase();
      const words = inputLower.split(' ');

      // Common body parts that likely need X-Ray
      const xrayBodyParts = [
         'chest', 'skull', 'head', 'brain', 'face',
         'hand', 'wrist', 'finger', 'arm',
         'leg', 'foot', 'ankle', 'knee', 'thigh',
         'spine', 'back', 'neck', 'vertebra',
         'abdomen', 'stomach', 'belly',
         'pelvis', 'hip', 'groin',
         'shoulder', 'elbow', 'rib', 'clavicle'
      ];

      // X-Ray detection
      const isXrayRelated = words.some(word =>
         xrayBodyParts.includes(word) ||
         word.includes('fracture') ||
         word.includes('injury') ||
         word.includes('trauma') ||
         word.includes('imaging')
      );

      if (isXrayRelated && !inputLower.includes('x-ray') && !inputLower.includes('xray')) {
         return `${input} X-Ray`;
      }

      // ECG detection
      const ecgKeywords = ['12', 'lead', 'resting', 'stress', 'holter', 'cardiac', 'heart', 'rhythm', 'beat'];
      const isEcgRelated = words.some(word =>
         ecgKeywords.includes(word) ||
         word.includes('electro') ||
         word.includes('cardio')
      );

      if (isEcgRelated && !inputLower.includes('ecg') && !inputLower.includes('ekg')) {
         return `${input} ECG`;
      }

      // BSR detection
      const bsrKeywords = ['fasting', 'random', 'postprandial', 'pp', 'sugar', 'glucose', 'diabetes', 'hba1c'];
      const isBsrRelated = words.some(word =>
         bsrKeywords.includes(word) ||
         word.includes('blood')
      );

      if (isBsrRelated && !inputLower.includes('bsr') && !inputLower.includes('blood sugar')) {
         return `${input} BSR`;
      }

      // Consultation detection
      const consultationKeywords = ['consult', 'doctor', 'physician', 'checkup', 'examination', 'review'];
      const isConsultationRelated = words.some(word =>
         consultationKeywords.includes(word) ||
         word.includes('followup') ||
         word.includes('emergency')
      );

      if (isConsultationRelated && !inputLower.includes('consultation')) {
         return `${input} Consultation`;
      }

      return input;
   };

   // Handle direct input (for searching/filtering)
   const handleInputChange = (e) => {
      const inputValue = e.target.value;
      const autoCompleted = autoCompletePurpose(inputValue);

      if (autoCompleted !== inputValue) {
         setSuggestion(autoCompleted);
      } else {
         setSuggestion('');
      }

      onChange({ target: { name, value: inputValue } });

      // Filter options based on input
      if (inputValue.length > 1) {
         const filtered = ALL_PURPOSE_OPTIONS.filter(option =>
            option.toLowerCase().includes(inputValue.toLowerCase())
         );
         setFilteredOptions(filtered);
         setShowSubOptions(false);
      } else {
         setFilteredOptions([]);
      }
   };

   // Apply suggestion
   const applySuggestion = () => {
      if (suggestion) {
         onChange({ target: { name, value: suggestion } });
         setSuggestion('');
         setFilteredOptions([]);
      }
   };

   return (
      <div className="relative" ref={containerRef}>
         {/* Main Input Field with Suggestion */}
         <div className="relative">
            <InputField
               name={name}
               label="Visit Purpose"
               icon="work"
               value={value}
               onChange={handleInputChange}
               placeholder="General Consultation (default)"
               onFocus={() => {
                  if (!value) {
                     setFilteredOptions(ALL_PURPOSE_OPTIONS.slice(0, 5));
                  }
               }}
               onKeyDown={(e) => {
                  if (e.key === 'Tab' && suggestion) {
                     e.preventDefault();
                     applySuggestion();
                  }
               }}
               {...props}
            />

            {/* Default value indicator */}
            {(!value || value === "General Consultation") && (
               <div className="absolute right-3 top-9 transform -translate-y-1/2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-300">
                     Default
                  </span>
               </div>
            )}

            {/* Suggestion Badge */}
            {suggestion && value !== suggestion && (
               <div className="absolute right-3 top-9 transform -translate-y-1/2 flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Tab to accept:</span>
                  <button
                     type="button"
                     onClick={applySuggestion}
                     className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded border border-primary-300 hover:bg-primary-200 transition-colors"
                  >
                     {suggestion}
                  </button>
               </div>
            )}
         </div>

         {/* Dropdown for filtered search results */}
         {filteredOptions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
               {filteredOptions.map((option) => (
                  <div
                     key={option}
                     className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center justify-between"
                     onClick={() => {
                        onChange({ target: { name, value: option } });
                        setFilteredOptions([]);
                     }}
                  >
                     <span>{option}</span>
                     <span className="text-xs text-gray-400">
                        {Object.entries(PURPOSE_OPTIONS).find(([cat, opts]) =>
                           opts.includes(option)
                        )?.[0] || 'Other'}
                     </span>
                  </div>
               ))}
            </div>
         )}

         {/* Quick Category Buttons */}
         <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-gray-500 self-center">Quick select:</span>
            {MAIN_PURPOSE_CATEGORIES.map((category) => (
               <button
                  key={category}
                  type="button"
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedCategory === category
                     ? 'bg-primary-100 text-primary-700 border-primary-300'
                     : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                     }`}
                  onClick={() => handleCategorySelect(category)}
               >
                  {category}
               </button>
            ))}
         </div>

         {/* Sub-options Dropdown */}
         {showSubOptions && selectedCategory && PURPOSE_OPTIONS[selectedCategory] && (
            <div className="mt-2 p-3 border border-gray-300 rounded-md bg-gray-50">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                     Select {selectedCategory} type:
                  </span>
                  <button
                     type="button"
                     onClick={() => setShowSubOptions(false)}
                     className="text-gray-500 hover:text-gray-700"
                  >
                     ×
                  </button>
               </div>
               <div className="grid grid-cols-2 gap-2">
                  {PURPOSE_OPTIONS[selectedCategory].map((option) => (
                     <button
                        key={option}
                        type="button"
                        className={`px-3 py-2 text-sm rounded border transition-colors ${value === option
                           ? 'bg-primary-500 text-white border-primary-600'
                           : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                           }`}
                        onClick={() => handleSubOptionSelect(option)}
                     >
                        {option}
                     </button>
                  ))}
               </div>
               <div className="mt-2 pt-2 border-t border-gray-300">
                  <button
                     type="button"
                     className="text-sm text-primary-600 hover:text-primary-800"
                     onClick={() => {
                        setShowCustomInput(true);
                        setShowSubOptions(false);
                     }}
                  >
                     + Add custom {selectedCategory.toLowerCase()} purpose
                  </button>
               </div>
            </div>
         )}

         {/* Custom Input Field */}
         {showCustomInput && (
            <div className="mt-2">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                     {selectedCategory === 'Other' ? 'Enter purpose' : `Custom ${selectedCategory}`}
                  </span>
                  <button
                     type="button"
                     onClick={() => {
                        setShowCustomInput(false);
                        setCustomInput('');
                        setSuggestion('');
                     }}
                     className="text-gray-500 hover:text-gray-700"
                  >
                     ×
                  </button>
               </div>
               <div className="relative">
                  <input
                     type="text"
                     value={customInput}
                     onChange={handleCustomInputChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                     placeholder={`Enter ${selectedCategory.toLowerCase()} purpose...`}
                     autoFocus
                     onKeyDown={(e) => {
                        if (e.key === 'Tab' && suggestion) {
                           e.preventDefault();
                           const finalValue = suggestion;
                           setCustomInput(finalValue);
                           onChange({ target: { name, value: finalValue } });
                           setSuggestion('');
                        }
                     }}
                  />
                  {suggestion && (
                     <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <button
                           type="button"
                           onClick={() => {
                              setCustomInput(suggestion);
                              onChange({ target: { name, value: suggestion } });
                              setSuggestion('');
                           }}
                           className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded border border-primary-300 hover:bg-primary-200"
                        >
                           Use: {suggestion}
                        </button>
                     </div>
                  )}
               </div>
               {suggestion && (
                  <div className="mt-1 text-xs text-gray-500">
                     Press Tab to accept suggestion
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default PurposeInput;