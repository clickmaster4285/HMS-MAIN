// components/PurposeFilterDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import {
   getPurposesForFilter,
   MAIN_PURPOSE_CATEGORIES
} from '../../../../utils/purposeOptions';

const PurposeFilterDropdown = ({ selectedPurpose, onSelectPurpose, onClear }) => {
   const [isOpen, setIsOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const dropdownRef = useRef(null);

   // Get all purposes for filtering
   const allPurposes = getPurposesForFilter();

   // Filter purposes based on search term
   const filteredPurposes = allPurposes.filter(purpose =>
      purpose.toLowerCase().includes(searchTerm.toLowerCase())
   );

   // Group purposes for better display
   const groupedPurposes = {
      'Categories': allPurposes.filter(p =>
         ['All', ...MAIN_PURPOSE_CATEGORIES].includes(p)
      ),
      'Specific Purposes': allPurposes.filter(p =>
         !['All', ...MAIN_PURPOSE_CATEGORIES].includes(p)
      )
   };

   // Close dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const handleSelect = (purpose) => {
      onSelectPurpose(purpose);
      setIsOpen(false);
      setSearchTerm('');
   };

   const handleClear = () => {
      onClear();
      setIsOpen(false);
      setSearchTerm('');
   };

   return (
      <div className="relative" ref={dropdownRef}>
         <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${selectedPurpose && selectedPurpose !== 'All'
                  ? 'bg-primary-100 border-primary-300 text-primary-700 hover:bg-primary-200'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
               }`}
         >
            <FiFilter className="mr-2" />
            {selectedPurpose === 'All' || !selectedPurpose ? 'Filter by Purpose' : selectedPurpose}
            {selectedPurpose && selectedPurpose !== 'All' && (
               <button
                  onClick={(e) => {
                     e.stopPropagation();
                     handleClear();
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700"
               >
                  <FiX className="h-4 w-4" />
               </button>
            )}
         </button>

         {isOpen && (
            <div className="absolute z-10 mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg">
               {/* Search input */}
               <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFilter className="text-gray-400" />
                     </div>
                     <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-600"
                        placeholder="Search purpose..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                     />
                  </div>
               </div>

               {/* Purpose list */}
               <div className="max-h-96 overflow-y-auto py-2">
                  {searchTerm ? (
                     // Show filtered results when searching
                     <>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                           Search Results ({filteredPurposes.length})
                        </div>
                        {filteredPurposes.length > 0 ? (
                           filteredPurposes.map((purpose) => (
                              <button
                                 key={purpose}
                                 onClick={() => handleSelect(purpose)}
                                 className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${selectedPurpose === purpose ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                                    }`}
                              >
                                 <span>{purpose}</span>
                                 {selectedPurpose === purpose && (
                                    <span className="text-primary-600">✓</span>
                                 )}
                              </button>
                           ))
                        ) : (
                           <div className="px-4 py-3 text-sm text-gray-500">
                              No purposes found matching "{searchTerm}"
                           </div>
                        )}
                     </>
                  ) : (
                     // Show grouped purposes when not searching
                     <>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                           Categories
                        </div>
                        {groupedPurposes['Categories'].map((purpose) => (
                           <button
                              key={purpose}
                              onClick={() => handleSelect(purpose)}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${selectedPurpose === purpose ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                                 }`}
                           >
                              <span className="flex items-center">
                                 {purpose === 'All' && (
                                    <FiFilter className="mr-2 text-gray-400" />
                                 )}
                                 {purpose}
                              </span>
                              {selectedPurpose === purpose && (
                                 <span className="text-primary-600">✓</span>
                              )}
                           </button>
                        ))}

                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-t border-gray-200 mt-2">
                           Specific Purposes
                        </div>
                        {groupedPurposes['Specific Purposes'].map((purpose) => (
                           <button
                              key={purpose}
                              onClick={() => handleSelect(purpose)}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${selectedPurpose === purpose ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                                 }`}
                           >
                              <span>{purpose}</span>
                              {selectedPurpose === purpose && (
                                 <span className="text-primary-600">✓</span>
                              )}
                           </button>
                        ))}
                     </>
                  )}
               </div>

               {/* Footer */}
               <div className="border-t border-gray-200 p-3 bg-gray-50">
                  <button
                     onClick={handleClear}
                     className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                  >
                     Clear Filter
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default PurposeFilterDropdown;