// hooks/useTestHook.js
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  createTest,
  getTestById,
  updateTest,
  selectSelectedTest,
  selectGetByIdLoading,
  selectUpdateLoading,
  selectUpdateError,
} from '../features/testManagment/testSlice';

// Constants
export const RANGE_TYPES = [
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

export const UNITS_LIST = [
  'mg/dL', 'g/dL', 'mmol/L', 'mIU/L', 'IU/L', 'IU/mL', 'U/L', 'u/mL', '%',
  'x10^2/ul', 'pg/mL', 'Pg', 'ng/mL', 'mEq/L', 'cells/mcL', 'mL/min', 'mg/L',
  'mm/hr', 'g/L', 'µIU/mL', 'μg/dL', 'μmol/L', 'mU/L', 'fL', 'pH', 'min sec',
  'sec', 'ml', 'other'
];

export const REPORT_TIME_OPTIONS = [
  {
    label: 'Hours',
    options: ['45 minutes', '1 hour', '24 hours', '48 hours', '72 hours'],
  },
  { label: 'Days', options: ['1 day', '2 days', '3 days', '5 days', '7 days'] },
  { label: '', options: ['Other'] },
];

export const INPUT_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'number', label: 'Number Input' },
  { value: 'dropdown', label: 'Dropdown' }
];

// Common dropdown options for specific fields
export const FIELD_OPTIONS = {
  colour: ['Yellow', 'Amber', 'Brown', 'Red', 'Orange', 'Green', 'Blue', 'Colorless', 'Dark Yellow', 'Pale Yellow'],
  appearance: ['Clear', 'Hazy', 'Cloudy', 'Turbid', 'Slightly Cloudy'],
  crystals: ['None', 'Calcium Oxalate', 'Uric Acid', 'Triple Phosphate', 'Amorphous Urates', 'Amorphous Phosphates'],
  bacteria: ['None', 'Few', 'Moderate', 'Many', 'Heavy'],
  testResults: ['Negative', 'Trace', '1+', '2+', '3+', '4+'],
  simpleResults: ['Negative', 'Positive'],
  turbidity: ['Clear', 'Slightly Hazy', 'Hazy', 'Cloudy', 'Turbid']
};

// Helper functions
export const getFieldOptions = (fieldName) => {
  const name = fieldName?.toLowerCase();
  if (name.includes('colour') || name.includes('color')) return FIELD_OPTIONS.colour;
  if (name.includes('appearance')) return FIELD_OPTIONS.appearance;
  if (name.includes('crystal')) return FIELD_OPTIONS.crystals;
  if (name.includes('bacteria')) return FIELD_OPTIONS.bacteria;
  if (name.includes('turbidity')) return FIELD_OPTIONS.turbidity;
  if (name.includes('nitrate')) return FIELD_OPTIONS.simpleResults;
  if (name.includes('bilirubin') || name.includes('ketone') || name.includes('glucose') || 
      name.includes('blood') || name.includes('albumin')) return FIELD_OPTIONS.testResults;
  return [];
};

export const shouldUseDropdown = (fieldName) => {
  const options = getFieldOptions(fieldName);
  return options.length > 0;
};

export const getDefaultInputType = (fieldName) => {
  return shouldUseDropdown(fieldName) ? 'dropdown' : 'text';
};

const initialRange = () => ({
  min: '',
  max: '',
  unit: '',
});

export const initialField = () => ({
  name: '',
  unit: '',
  inputType: 'text',
  options: [],
  ranges: {
    male: initialRange(),
    female: initialRange(),
  },
});

const initialFormData = () => ({
  testName: '',
  testDept: '',
  testCode: '',
  testPrice: '',
  requiresFasting: false,
  reportDeliveryTime: '',
});

// Main hook
export const useTestHook = (mode = 'create') => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Redux selectors
  const selectedTest = useSelector(selectSelectedTest);
  const getByIdLoading = useSelector(selectGetByIdLoading);
  const updateLoading = useSelector(selectUpdateLoading);
  const updateError = useSelector(selectUpdateError);

  // Local state
  const [formData, setFormData] = useState(initialFormData());
  const [fields, setFields] = useState([initialField()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedReportTime, setSelectedReportTime] = useState('');
  const [customReportTime, setCustomReportTime] = useState('');
  const [touched, setTouched] = useState({});

  // Fetch test data if in edit mode
  useEffect(() => {
    if (id && mode === 'edit') {
      dispatch(getTestById(id));
    }
  }, [id, dispatch, mode]);

  // Update local state when selectedTest changes
  useEffect(() => {
    if (selectedTest && id) {
      setFormData({
        testName: selectedTest.testName || '',
        testDept: selectedTest.testDept || '',
        testCode: selectedTest.testCode || '',
        testPrice: selectedTest.testPrice || '',
        requiresFasting: selectedTest.requiresFasting || false,
        reportDeliveryTime: selectedTest.reportDeliveryTime || '',
      });

      // Convert the test fields to our format
      setFields(
        Array.isArray(selectedTest.fields) && selectedTest.fields.length > 0
          ? selectedTest.fields.map((f) => {
              const ranges = {};
              const normalRanges = f.normalRange instanceof Map
                ? Object.fromEntries(f.normalRange)
                : f.normalRange || {};

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
                inputType: f.inputType || getDefaultInputType(f.name),
                options: f.options || getFieldOptions(f.name),
                ranges: ranges,
              };
            })
          : [initialField()]
      );

      // Set report time
      if (selectedTest.reportDeliveryTime) {
        const found = REPORT_TIME_OPTIONS.some((group) =>
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
  const validate = useCallback((data = formData, testFields = fields) => {
    const errs = {};

    if (!data.testName) errs.testName = 'Test Name is required';
    if (!data.testCode) errs.testCode = 'Test Code is required';
    if (!data.testPrice || isNaN(data.testPrice) || Number(data.testPrice) < 0) {
      errs.testPrice = 'Valid Test Price is required';
    }

    const reportTime = selectedReportTime === 'Other' ? customReportTime : selectedReportTime;
    if (!reportTime) {
      errs.reportDeliveryTime = 'Report Delivery Time is required';
    }

    testFields.forEach((f, i) => {
      if (!f.name) errs[`field-name-${i}`] = 'Field name required';

      // Validate dropdown fields
      if (f.inputType === 'dropdown' && f.options.length === 0) {
        errs[`field-options-${i}`] = 'Dropdown fields require options';
      }
    });

    return errs;
  }, [formData, fields, selectedReportTime, customReportTime]);

  // Validate on changes
  useEffect(() => {
    setErrors(validate());
  }, [validate]);

  // Field change handlers
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleFieldChange = useCallback((fieldIdx, key, value, rangeType, rangeKey) => {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i !== fieldIdx) return f;

        if (key === 'name') {
          const newField = { 
            ...f, 
            name: value,
            inputType: getDefaultInputType(value),
            options: getFieldOptions(value)
          };
          return newField;
        }

        if (key === 'unit' || key === 'inputType') {
          return { ...f, [key]: value };
        }

        if (key === 'options') {
          return { ...f, options: Array.isArray(value) ? value : value.split(',').map(opt => opt.trim()) };
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
  }, []);

  // Add/remove range types
  const addRangeType = useCallback((fieldIdx, rangeType) => {
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
  }, []);

  const removeRangeType = useCallback((fieldIdx, rangeType) => {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i !== fieldIdx) return f;
        const newRanges = { ...f.ranges };
        delete newRanges[rangeType];
        return { ...f, ranges: newRanges };
      })
    );
  }, []);

  // Field management
  const addField = useCallback(() => setFields((prev) => [...prev, initialField()]), []);
  const removeField = useCallback((idx) =>
    setFields((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev), []);

  // Report time handler
  const handleReportTimeChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedReportTime(value);
    if (value !== 'Other') {
      setCustomReportTime('');
      setFormData((prev) => ({ ...prev, reportDeliveryTime: value }));
    }
  }, []);

  // Form submission
  const handleSave = async (e) => {
    e.preventDefault();
    const currentErrors = validate();
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      toast.error('Please fix form errors');
      return;
    }

    setIsSubmitting(true);
    
    const finalReportTime = selectedReportTime === 'Other' ? customReportTime : selectedReportTime;
    
    const payload = {
      ...formData,
      testPrice: Number(formData.testPrice),
      reportDeliveryTime: finalReportTime,
      fields: fields.map((f) => ({
        name: f.name,
        unit: f.unit,
        inputType: f.inputType,
        options: f.inputType === 'dropdown' ? f.options : undefined,
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

  return {
    // State
    formData,
    fields,
    errors,
    selectedReportTime,
    customReportTime,
    isSubmitting,
    touched,
    
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
    updateLoading,
    updateError,
    
    // Mode
    mode,
    id
  };
};