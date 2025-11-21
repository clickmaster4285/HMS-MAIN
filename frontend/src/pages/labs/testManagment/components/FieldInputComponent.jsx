// components/FieldInputComponent.js
import React from 'react';
import { InputField } from '../../../../components/common/FormFields';
import { UNITS_LIST, INPUT_TYPES, getFieldOptions } from '../../../../hooks/useTestHook';

export const FieldInputComponent = ({ 
  field, 
  fieldIdx, 
  errors, 
  onFieldChange,
  onAddRangeType,
  onRemoveRangeType,
  onRemoveField,
  rangeTypes 
}) => {
  const handleInputTypeChange = (value) => {
    onFieldChange(fieldIdx, 'inputType', value);
    
    // Auto-populate options for dropdown fields
    if (value === 'dropdown') {
      const options = getFieldOptions(field.name);
      if (options.length > 0) {
        onFieldChange(fieldIdx, 'options', options);
      }
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Field #{fieldIdx + 1}</h3>
        <button
          type="button"
          className="text-red-500 hover:text-red-700 p-1"
          onClick={() => onRemoveField(fieldIdx)}
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <InputField
          label="Field Name"
          value={field.name}
          onChange={(e) => onFieldChange(fieldIdx, 'name', e.target.value)}
          error={errors[`field-name-${fieldIdx}`]}
          required
        />
        
        <InputField
          label="Input Type"
          type="select"
          value={field.inputType}
          onChange={(e) => handleInputTypeChange(e.target.value)}
          options={INPUT_TYPES.map(type => ({ value: type.value, label: type.label }))}
        />
        
        <InputField
          label="Unit"
          type="select"
          value={field.unit}
          onChange={(e) => onFieldChange(fieldIdx, 'unit', e.target.value)}
          options={UNITS_LIST}
        />
      </div>

      {field.inputType === 'dropdown' && (
        <div className="mb-6">
          <InputField
            label="Dropdown Options (comma separated)"
            value={field.options?.join(', ') || ''}
            onChange={(e) => onFieldChange(fieldIdx, 'options', e.target.value)}
            error={errors[`field-options-${fieldIdx}`]}
            placeholder="Option 1, Option 2, Option 3"
            helperText="Enter options separated by commas"
          />
          {field.options && field.options.length > 0 && (
            <div className="mt-2">
              <span className="text-sm text-gray-600">Preview: </span>
              {field.options.map((opt, idx) => (
                <span key={idx} className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded mr-1">
                  {opt}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <RangeTypesSection
        field={field}
        fieldIdx={fieldIdx}
        errors={errors}
        onAddRangeType={onAddRangeType}
        onRemoveRangeType={onRemoveRangeType}
        onFieldChange={onFieldChange}
        rangeTypes={rangeTypes}
      />
    </div>
  );
};

const RangeTypesSection = ({ field, fieldIdx, errors, onAddRangeType, onRemoveRangeType, onFieldChange, rangeTypes }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h4 className="font-medium">Reference Ranges</h4>
      <select
        className="border border-gray-300 rounded p-2"
        onChange={(e) => {
          if (e.target.value && !field.ranges[e.target.value]) {
            onAddRangeType(fieldIdx, e.target.value);
          }
          e.target.value = '';
        }}
      >
        <option value="">Add Range Type</option>
        {rangeTypes.map(
          (type) =>
            !field.ranges[type.id] && (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            )
        )}
      </select>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(field.ranges).map(([type, range]) => {
        const rangeConfig = rangeTypes.find((t) => t.id === type) || { label: type };
        return (
          <RangeInputGroup
            key={type}
            type={type}
            range={range}
            rangeConfig={rangeConfig}
            fieldIdx={fieldIdx}
            errors={errors}
            onRemoveRangeType={onRemoveRangeType}
            onFieldChange={onFieldChange}
          />
        );
      })}
    </div>
  </div>
);

const RangeInputGroup = ({ type, range, rangeConfig, fieldIdx, errors, onRemoveRangeType, onFieldChange }) => (
  <div className="border border-gray-200 rounded p-4 relative">
    <button
      type="button"
      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
      onClick={() => onRemoveRangeType(fieldIdx, type)}
    >
      ×
    </button>
    <h5 className="font-medium mb-3">{rangeConfig.label}</h5>
    <div className="space-y-3">
      <InputField
        label="Min Value"
        type="text"
        value={range.min}
        onChange={(e) => onFieldChange(fieldIdx, 'ranges', e.target.value, type, 'min')}
        error={errors[`field-${fieldIdx}-${type}-min`]}
      />
      <InputField
        label="Max Value"
        type="text"
        value={range.max}
        onChange={(e) => onFieldChange(fieldIdx, 'ranges', e.target.value, type, 'max')}
        error={errors[`field-${fieldIdx}-${type}-max`]}
      />
    </div>
  </div>
);