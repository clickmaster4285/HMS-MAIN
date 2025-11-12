import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  FaVial,
  FaClipboardList,
  FaListUl,
  FaPlus,
  FaTimes,
} from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';

// Import your Redux actions and selectors
import {
  createTest,
  getTestById,
  updateTest,
  selectSelectedTest,
  selectGetByIdLoading,
  selectUpdateLoading,
  selectUpdateError,
} from '../../../features/testManagment/testSlice';
import { InputField, RadioGroup } from '../../../components/common/FormFields';
import { FormSection, FormGrid } from '../../../components/common/FormSection';
import { Button, ButtonGroup } from '../../../components/common/Buttons';
import { useRef } from 'react';

// Supported range types
const rangeTypes = [
  { id: 'all', label: 'All' },
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'child', label: 'Child' },
  { id: 'pregnant', label: 'Pregnant' },
  { id: 'nonPregnant', label: 'Non-Pregnant' },
  { id: 'adult', label: 'Adult' },
  { id: 'elderly', label: 'Elderly' },
  { id: 'newborn', label: 'Newborn' },
  { id: 'Diabetic', label: 'Diabetic' },
  { id: 'Non-Diabetic', label: 'Non-Diabetic' },
];

const initialRange = () => ({
  min: '',
  max: '',
  unit: '',
});

const initialField = () => ({
  name: '',
  unit: '',
  ranges: {
    male: initialRange(),
    female: initialRange(),
  },
});

const unitsList = [
  'mg/dL',
  'g/dL',
  'mmol/L',
  'mIU/L',
  'IU/L',
  'IU/mL',
  'U/L',
  'u/mL',
  '%',
  'x10^2/ul',
  'pg/mL',
  'Pg',
  'ng/mL',
  'mEq/L',
  'cells/mcL',
  'mL/min',
  'mg/L',
  'mm/hr',
  'g/L',
  'µIU/mL',
  'μg/dL',
  'μmol/L',
  'mU/L',
  'fL',
  'pH',
  'min sec',
  'sec',
  'ml',
  'other',
];

const reportTimeOptions = [
  {
    label: 'Hours',
    options: ['45 minutes', '1 hour', '24 hours', '48 hours', '72 hours'],
  },
  { label: 'Days', options: ['1 day', '2 days', '3 days', '5 days', '7 days'] },
  { label: '', options: ['Other'] },
];

const LabTestForm = ({ mode = 'create' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const selectedTest = useSelector(selectSelectedTest);
  const getByIdLoading = useSelector(selectGetByIdLoading);
  const updateLoading = useSelector(selectUpdateLoading);
  const updateError = useSelector(selectUpdateError);

  const [formData, setFormData] = React.useState({
    testName: '',
    testDept: '',
    testCode: '',
    testPrice: '',
    requiresFasting: false,
    reportDeliveryTime: '',
  });

  const [fields, setFields] = React.useState([initialField()]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [selectedReportTime, setSelectedReportTime] = React.useState('');
  const [customReportTime, setCustomReportTime] = React.useState('');
  const [touched, setTouched] = React.useState({});
  const [fieldTouched, setFieldTouched] = React.useState({});

  // Fetch test data if in edit mode
  React.useEffect(() => {
    if (id) {
      dispatch(getTestById(id));
    }
  }, [id, dispatch]);

  // When selectedTest changes, update local state
  React.useEffect(() => {
    if (selectedTest && id) {
      setFormData({
        testName: selectedTest.testName || '',
        testDept: selectedTest.testDept || '',
        testCode: selectedTest.testCode || '',
        testPrice: selectedTest.testPrice || '',
        requiresFasting: selectedTest.requiresFasting || false,
        reportDeliveryTime: selectedTest.reportDeliveryTime || '',
      });

      // Convert the test fields to our new format
      setFields(
        Array.isArray(selectedTest.fields) && selectedTest.fields.length > 0
          ? selectedTest.fields.map((f) => {
              const ranges = {};
              // Convert normalRange (Map or Object) to our ranges format
              const normalRanges =
                f.normalRange instanceof Map
                  ? Object.fromEntries(f.normalRange)
                  : f.normalRange || {};

              // Populate ranges with existing data
              Object.entries(normalRanges).forEach(([type, values]) => {
                ranges[type] = {
                  min: values?.min || '',
                  max: values?.max || '',
                  unit: values?.unit || f.unit || '',
                };
              });

              return {
                name: f.name || '',
                unit: f.unit || '',
                ranges: ranges,
              };
            })
          : [initialField()]
      );

      // Set report time select
      if (selectedTest.reportDeliveryTime) {
        const found = reportTimeOptions.some((group) =>
          group.options.includes(selectedTest.reportDeliveryTime)
        );
        if (found) {
          setSelectedReportTime(selectedTest.reportDeliveryTime);
          setCustomReportTime('');
        } else {
          setSelectedReportTime('Other');
          setCustomReportTime(selectedTest.reportDeliveryTime);
        }
      }
    }
  }, [selectedTest, id]);

  // Validation function
  const validate = (data = formData, testFields = fields) => {
    const errs = {};

    if (!data.testName) errs.testName = 'Test Name is required';
    if (!data.testCode) errs.testCode = 'Test Code is required';
    if (
      !data.testPrice ||
      isNaN(data.testPrice) ||
      Number(data.testPrice) < 0
    ) {
      errs.testPrice = 'Valid Test Price is required';
    }

    const reportTime =
      selectedReportTime === 'Other' ? customReportTime : selectedReportTime;
    if (!reportTime) {
      errs.reportDeliveryTime = 'Report Delivery Time is required';
    }

    testFields.forEach((f, i) => {
      if (!f.name) errs[`field-name-${i}`] = 'Field name required';
      // if (!f.unit) errs[`field-unit-${i}`] = 'Unit is required';

      // Object.entries(f.ranges).forEach(([type, range]) => {
      //   if (range.min && isNaN(range.min))
      //     errs[`field-${i}-${type}-min`] = 'Must be a number';
      //   if (range.max && isNaN(range.max))
      //     errs[`field-${i}-${type}-max`] = 'Must be a number';
      //   if (range.min && Number(range.min) < 0)
      //     errs[`field-${i}-${type}-min`] = 'Cannot be negative';
      //   if (range.max && Number(range.max) < 0)
      //     errs[`field-${i}-${type}-max`] = 'Cannot be negative';
      // });
    });

    return errs;
  };

  // Validate on changes
  React.useEffect(() => {
    setErrors(validate());
  }, [formData, fields, selectedReportTime, customReportTime]);

  // Field change handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleFieldChange = (fieldIdx, key, value, rangeType, rangeKey) => {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i !== fieldIdx) return f;

        if (key === 'name' || key === 'unit') {
          return { ...f, [key]: value };
        }

        if (key === 'ranges') {
          return {
            ...f,
            ranges: {
              ...f.ranges,
              [rangeType]: {
                ...f.ranges[rangeType],
                [rangeKey]: value,
              },
            },
          };
        }

        return f;
      })
    );
  };

  // Add/remove range types
  const addRangeType = (fieldIdx, rangeType) => {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i !== fieldIdx) return f;
        return {
          ...f,
          ranges: {
            ...f.ranges,
            [rangeType]: initialRange(),
          },
        };
      })
    );
  };

  const removeRangeType = (fieldIdx, rangeType) => {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i !== fieldIdx) return f;
        const newRanges = { ...f.ranges };
        delete newRanges[rangeType];
        return {
          ...f,
          ranges: newRanges,
        };
      })
    );
  };

  const addField = () => setFields((prev) => [...prev, initialField()]);
  const removeField = (idx) =>
    setFields((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev
    );

  const handleReportTimeChange = (e) => {
    setSelectedReportTime(e.target.value);
    if (e.target.value !== 'Other') {
      setCustomReportTime('');
      setFormData((prev) => ({ ...prev, reportDeliveryTime: e.target.value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const currentErrors = validate();
    console.log(currentErrors);
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      toast.error('Please fix form errors');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      ...formData,
      testPrice: Number(formData.testPrice),
      fields: fields.map((f) => ({
        name: f.name,
        unit: f.unit,
        normalRange: Object.fromEntries(
          Object.entries(f.ranges).map(([type, range]) => [
            type,
            {
              min: range.min || 'Nil',
              max: range.max || 'Nil',
              unit: range.unit || f.unit || undefined,
            },
          ])
        ),
      })),
    };

    try {
      if (id) {
        await dispatch(updateTest({ id, payload }));
        toast.success('Test updated successfully!');
        navigate('../all-tests');
      } else {
        await dispatch(createTest(payload));
        toast.success('Test created successfully!');
        navigate('../all-tests');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formRef = useRef(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-teal-50 to-white p-0">
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
                  Please fill in the lab test details belows
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
            <FormSection title="Test Information">
              <FormGrid>
                <div>
                  <InputField
                    name="testName"
                    label="Test Name"
                    value={formData.testName}
                    onChange={handleChange}
                    error={errors.testName}
                    required
                  />
                </div>
                <div>
                  <InputField
                    name="testDept"
                    label="Test Department"
                    value={formData.testDept}
                    onChange={handleChange}
                    error={errors.testDept}
                  />
                </div>
                <div>
                  <InputField
                    name="testCode"
                    label="Test Code"
                    value={formData.testCode}
                    onChange={handleChange}
                    error={errors.testCode}
                    required
                  />
                </div>
                <div>
                  <InputField
                    name="testPrice"
                    label="Test Price"
                    type="number"
                    min="0"
                    value={formData.testPrice}
                    onChange={handleChange}
                    error={errors.testPrice}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Delivery Time
                  </label>
                  <select
                    className={`block w-full border ${
                      errors.reportDeliveryTime
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-md p-2`}
                    value={selectedReportTime}
                    onChange={handleReportTimeChange}
                  >
                    <option value="">Select time</option>
                    {reportTimeOptions.map((group, idx) => (
                      <optgroup key={idx} label={group.label}>
                        {group.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {selectedReportTime === 'Other' && (
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded-md p-2 mt-2"
                      value={customReportTime}
                      onChange={(e) => setCustomReportTime(e.target.value)}
                      placeholder="Enter custom time"
                    />
                  )}
                  {errors.reportDeliveryTime && (
                    <span className="text-red-500 text-sm">
                      {errors.reportDeliveryTime}
                    </span>
                  )}
                </div>
                <div>
                  <RadioGroup
                    name="requiresFasting"
                    label="Requires Fasting?"
                    value={formData.requiresFasting}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        requiresFasting: e.target.value === 'true',
                      }))
                    }
                    options={[
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No' },
                    ]}
                  />
                </div>
              </FormGrid>
            </FormSection>

            <FormSection title="Test Fields">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FaListUl className="text-primary-600" /> Fields
                </h2>
                <Button type="button" onClick={addField}>
                  <FaPlus className="mr-1" /> Add Field
                </Button>
              </div>

              <div className="space-y-8">
                {fields.map((field, fieldIdx) => (
                  <div
                    key={fieldIdx}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Field #{fieldIdx + 1}</h3>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => removeField(fieldIdx)}
                      >
                        <FaTimes />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <InputField
                        label="Field Name"
                        value={field.name}
                        onChange={(e) =>
                          handleFieldChange(fieldIdx, 'name', e.target.value)
                        }
                        error={errors[`field-name-${fieldIdx}`]}
                        required
                      />
                      <InputField
                        label="Unit"
                        type="select"
                        value={field.unit}
                        onChange={(e) =>
                          handleFieldChange(fieldIdx, 'unit', e.target.value)
                        }
                        options={unitsList}
                        error={errors[`field-unit-${fieldIdx}`]}
                        // required
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Reference Ranges</h4>
                        <select
                          className="border border-gray-300 rounded p-2"
                          onChange={(e) => {
                            if (
                              e.target.value &&
                              !field.ranges[e.target.value]
                            ) {
                              addRangeType(fieldIdx, e.target.value);
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
                          const rangeConfig = rangeTypes.find(
                            (t) => t.id === type
                          ) || { label: type };
                          return (
                            <div
                              key={type}
                              className="border border-gray-200 rounded p-4 relative"
                            >
                              <button
                                type="button"
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                onClick={() => removeRangeType(fieldIdx, type)}
                              >
                                <FaTimes />
                              </button>
                              <h5 className="font-medium mb-3">
                                {rangeConfig.label}
                              </h5>
                              <div className="space-y-3">
                                <InputField
                                  label="Min Value"
                                  type="text"
                                  value={range.min}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      fieldIdx,
                                      'ranges',
                                      e.target.value,
                                      type,
                                      'min'
                                    )
                                  }
                                  error={
                                    errors[`field-${fieldIdx}-${type}-min`]
                                  }
                                />
                                <InputField
                                  label="Max Value"
                                  type="text"
                                  min="0"
                                  value={range.max}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      fieldIdx,
                                      'ranges',
                                      e.target.value,
                                      type,
                                      'max'
                                    )
                                  }
                                  error={
                                    errors[`field-${fieldIdx}-${type}-max`]
                                  }
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FormSection>

            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('../all-tests')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LabTestForm;
