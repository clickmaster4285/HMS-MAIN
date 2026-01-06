// components/FieldInputRenderer.js
import React, { useState } from 'react';
import { FiEdit2, FiCheck, FiX, FiPlus } from 'react-icons/fi';
import { isValueNormal, formatNormalRange, getRangeLabel } from '../../../../utils/rangeUtils';

export const FieldInputRenderer = ({
  field,
  fieldIndex,
  testId,
  value,
  onChange,
  onOptionChange,
  patientData,
  inputRef,
  onKeyDown,
}) => {
  const [isEditingOptions, setIsEditingOptions] = useState(false);
  const [newOption, setNewOption] = useState('');

  const isNormal = isValueNormal(value, field.normalRange, patientData);
  const isDropdown = field.inputType === 'dropdown';
  const options = field.customOptions || field.options || [];

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      const updatedOptions = [...options, newOption.trim()];
      onOptionChange(testId, fieldIndex, updatedOptions);
      setNewOption('');
    }
  };

  const handleRemoveOption = (optionToRemove) => {
    const updatedOptions = options.filter(opt => opt !== optionToRemove);
    onOptionChange(testId, fieldIndex, updatedOptions);
  };

  const handleOptionKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddOption();
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors duration-200">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Field Name */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field Name
          </label>
          <input
            type="text"
            value={field.fieldName}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Result Input - Dynamic based on inputType */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Result {isDropdown && (
              <button
                type="button"
                onClick={() => setIsEditingOptions(!isEditingOptions)}
                className="ml-1 text-primary-600 hover:text-primary-800 transition-colors"
                title="Edit dropdown options"
              >
                <FiEdit2 size={14} />
              </button>
            )}
          </label>
          
          {isDropdown ? (
            <div className="space-y-2">
              <select
                value={value}
                onChange={(e) => onChange(testId, fieldIndex, 'value', e.target.value)}
                ref={inputRef}
                onKeyDown={onKeyDown}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select an option</option>
                {options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Editable Options Panel */}
              {isEditingOptions && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary-800">
                      Edit Options
                    </span>
                    <button
                      onClick={() => setIsEditingOptions(false)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Add New Option */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        onKeyPress={handleOptionKeyPress}
                        placeholder="Add new option"
                        className="flex-1 text-sm border border-primary-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                      <button
                        onClick={handleAddOption}
                        className="bg-primary-600 text-white p-1 rounded hover:bg-primary-700 transition-colors"
                        disabled={!newOption.trim()}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    {/* Existing Options */}
                    <div className="max-h-32 overflow-y-auto">
                      {options.map((option, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white px-2 py-1 rounded text-sm">
                          <span>{option}</span>
                          <button
                            onClick={() => handleRemoveOption(option)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <input
              type={field.inputType === 'number' ? 'number' : 'text'}
              value={value}
              onChange={(e) => onChange(testId, fieldIndex, 'value', e.target.value)}
              ref={inputRef}
              onKeyDown={onKeyDown}
              enterKeyHint="next"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder={`Enter ${field.inputType === 'number' ? 'numeric' : 'text'} value`}
            />
          )}
        </div>

        {/* Unit */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <input
            type="text"
            value={field.unit}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Normal Range */}
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            Normal Range
          </label>
          <div
            className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 border min-h-10.5"
            title={formatNormalRange(field.normalRange, patientData)}
          >
            <div className="font-medium text-xs text-primary-600">
              {getRangeLabel(field.normalRange, patientData)}
            </div>
            {formatNormalRange(field.normalRange, patientData).split(' | ')[0]}
          </div>
        </div>

        {/* Status */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className={`text-sm font-medium rounded-lg px-3 py-2 border ${
            isNormal === true 
              ? 'bg-green-100 text-green-800 border-green-200' 
              : isNormal === false 
              ? 'bg-red-100 text-red-800 border-red-200'
              : 'bg-gray-100 text-gray-600 border-gray-200'
          }`}>
            {isNormal === true ? (
              <span className="flex items-center">
                <FiCheck className="mr-1" /> Normal
              </span>
            ) : isNormal === false ? (
              <span className="flex items-center">
                <FiX className="mr-1" /> Abnormal
              </span>
            ) : (
              <span>Not evaluated</span>
            )}
          </div>
        </div>
      </div>

      {/* Additional range information */}
      {field.normalRange && Object.keys(field.normalRange || {}).length > 1 && (
        <div className="mt-3 p-2 bg-primary-50 rounded text-xs text-primary-700 border border-primary-200">
          <div className="font-medium">Available ranges:</div>
          {formatNormalRange(field.normalRange, patientData)}
        </div>
      )}
    </div>
  );
};