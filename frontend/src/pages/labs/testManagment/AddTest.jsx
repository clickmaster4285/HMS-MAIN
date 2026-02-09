// LabTestForm.js
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVial, FaListUl, FaPlus } from 'react-icons/fa';

// Import custom hook and components
import { useTestHook, RANGE_TYPES } from '../../../hooks/useTestHook';
import { FieldInputComponent } from './components/FieldInputComponent';
import { ReportTimeSelect } from './components/ReportTimeSelect';
import { InputField, RadioGroup } from '../../../components/common/FormFields';
import { FormSection, FormGrid } from '../../../components/common/FormSection';
import { Button, ButtonGroup } from '../../../components/common/Buttons';

const LabTestForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const formRef = useRef();
  
  const {
    // State
    formData,
    fields,
    errors,
    selectedReportTime,
    customReportTime,
    isSubmitting,
    
    // Handlers
    handleChange,
    handleFieldChange,
    handleReportTimeChange,
    handleSave,
    
    // Field management
    addField,
    removeField,
    addRangeType,
    removeRangeType,
    
    // Setters
    setCustomReportTime,
    
    // Loading states
    getByIdLoading,
    updateLoading
  } = useTestHook(mode);

  const handleKeyDown = (e) => {
    const form = formRef.current;
    if (!form) return;

    const inputs = Array.from(
      form.querySelectorAll('input, select, textarea')
    ).filter((el) => el.type !== 'hidden' && !el.disabled);

    const index = inputs.indexOf(e.target);
    if (index === -1) return;

    if (['Enter', 'ArrowDown', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }

    if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault();
      if (index > 0) {
        inputs[index - 1].focus();
      }
    }
  };

  if (getByIdLoading && mode === 'edit') {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary-50 via-teal-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-primary-700 text-lg">Loading test data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-teal-50 to-white p-0">
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-primary-600 rounded-md text-white px-6 py-8 shadow-md">
            <div className="flex items-center">
              <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <FaVial className="text-white" />
                  {mode === 'create' ? 'New Lab Test' : 'Edit Lab Test'}
                </h1>
                <p className="text-primary-100 mt-1">
                  Please fill in the lab test details below
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSave}
            ref={formRef}
            onKeyDown={handleKeyDown}
            className="p-6"
          >
            <TestInformationSection
              formData={formData}
              errors={errors}
              selectedReportTime={selectedReportTime}
              customReportTime={customReportTime}
              onChange={handleChange}
              onReportTimeChange={handleReportTimeChange}
              onCustomReportTimeChange={setCustomReportTime}
            />

            <TestFieldsSection
              fields={fields}
              errors={errors}
              onAddField={addField}
              onRemoveField={removeField}
              onFieldChange={handleFieldChange}
              onAddRangeType={addRangeType}
              onRemoveRangeType={removeRangeType}
            />

            <FormActions
              isSubmitting={isSubmitting}
              onCancel={() => navigate('../all-tests')}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const TestInformationSection = ({ 
  formData, 
  errors, 
  selectedReportTime, 
  customReportTime, 
  onChange, 
  onReportTimeChange, 
  onCustomReportTimeChange 
}) => (
  <FormSection title="Test Information">
    <FormGrid>
      <InputField
        name="testName"
        label="Test Name"
        value={formData.testName}
        onChange={onChange}
        error={errors.testName}
        required
      />
      <InputField
        name="testDept"
        label="Test Department"
        value={formData.testDept}
        onChange={onChange}
        error={errors.testDept}
      />
      <InputField
        name="testCode"
        label="Test Code"
        value={formData.testCode}
        onChange={onChange}
        error={errors.testCode}
        required
      />
      <InputField
        name="testPrice"
        label="Test Price"
        type="number"
        min="0"
        value={formData.testPrice}
        onChange={onChange}
        error={errors.testPrice}
        required
      />
      <ReportTimeSelect
        selectedReportTime={selectedReportTime}
        customReportTime={customReportTime}
        error={errors.reportDeliveryTime}
        onChange={onReportTimeChange}
        onCustomChange={onCustomReportTimeChange}
      />
      <RadioGroup
        name="requiresFasting"
        label="Requires Fasting?"
        value={formData.requiresFasting}
        onChange={(e) =>
          onChange({
            target: {
              name: 'requiresFasting',
              value: e.target.value === 'true'
            }
          })
        }
        options={[
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ]}
      />
    </FormGrid>
  </FormSection>
);

const TestFieldsSection = ({ 
  fields, 
  errors, 
  onAddField, 
  onRemoveField, 
  onFieldChange, 
  onAddRangeType, 
  onRemoveRangeType 
}) => (
  <FormSection title="Test Fields">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <FaListUl className="text-primary-600" /> Fields
      </h2>
      <Button type="button" onClick={onAddField}>
        <FaPlus className="mr-1" /> Add Field
      </Button>
    </div>

    <div className="space-y-8">
      {fields.map((field, fieldIdx) => (
        <FieldInputComponent
          key={fieldIdx}
          field={field}
          fieldIdx={fieldIdx}
          errors={errors}
          onFieldChange={onFieldChange}
          onAddRangeType={onAddRangeType}
          onRemoveRangeType={onRemoveRangeType}
          onRemoveField={onRemoveField}
          rangeTypes={RANGE_TYPES}
        />
      ))}
    </div>
  </FormSection>
);

const FormActions = ({ isSubmitting, onCancel }) => (
  <div className="flex justify-end gap-4 mt-8">
    <Button
      type="button"
      variant="secondary"
      onClick={onCancel}
    >
      Cancel
    </Button>
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Saving...' : 'Save'}
    </Button>
  </div>
);

export default LabTestForm;