import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSuggestedWardNumber } from '../../../features/ward/Wardslice';

const WardModal = ({
    onClose,
    onAddWard,
    onUpdateWard,
    wardDetails,
    onInputChange,
    departments,
    departmentNurses,
    isCreating,
    isProcessing
}) => {
    const dispatch = useDispatch();
    const { suggestedWardNumber, loading: suggestionLoading } = useSelector((state) => state.ward);

    // Local state to manage form data
    const [formData, setFormData] = useState({
        department: wardDetails.department || '',
        department_Name: wardDetails.department_Name || '',
        name: wardDetails.name || '',
        wardNumber: wardDetails.wardNumber || '',
        bedCount: wardDetails.bedCount || '',
        nurses: wardDetails.nurses || []
    });

    // Single effect to get suggested number on mount for new wards
    useEffect(() => {
        if (isCreating && formData.department && !formData.wardNumber) {
            dispatch(getSuggestedWardNumber(formData.department));
        }
    }, [isCreating, formData.department, dispatch]);

    // Single effect to auto-fill suggested number
    useEffect(() => {
        if (isCreating && suggestedWardNumber && !formData.wardNumber) {
            handleInputChange('wardNumber', suggestedWardNumber);
        }
    }, [suggestedWardNumber, isCreating]);

    // Single effect to auto-generate name
    useEffect(() => {
        if (isCreating && formData.department && formData.wardNumber) {
            const selectedDept = departments.find(dept => dept._id === formData.department);
            if (selectedDept && (!formData.name || formData.name.includes('Ward'))) {
                const autoName = `${selectedDept.name} Ward ${formData.wardNumber}`;
                handleInputChange('name', autoName);
            }
        }
    }, [formData.department, formData.wardNumber, isCreating, departments]);

    // Effect to get suggested number when department changes (for both create and edit)
    useEffect(() => {
        if (formData.department) {
            // Get new suggested number for the selected department
            dispatch(getSuggestedWardNumber(formData.department))
                .unwrap()
                .then((result) => {
                    if (result.success && result.suggestedWardNumber) {
                        // Only auto-fill for new wards, but we can show the suggestion for both
                        console.log('Suggested ward number:', result.suggestedWardNumber);
                    }
                })
                .catch(error => {
                    console.error('Failed to get suggested ward number:', error);
                });
        }
    }, [formData.department, dispatch]);

    // Unified input change handler
    const handleInputChange = (field, value) => {
        const newFormData = {
            ...formData,
            [field]: value
        };

        // Special handling for department change
        if (field === 'department') {
            const selectedDept = departments.find(dept => dept._id === value);
            newFormData.department_Name = selectedDept ? selectedDept.name : '';

            // Get suggested number when department changes
            if (value) {
                dispatch(getSuggestedWardNumber(value));
            }
        }

        setFormData(newFormData);

        // Propagate changes to parent component
        if (onInputChange) {
            onInputChange({ target: { name: field, value } });
            if (field === 'department' && newFormData.department_Name) {
                onInputChange({ target: { name: 'department_Name', value: newFormData.department_Name } });
            }
        }
    };

    // Handle suggest button click
    const handleSuggestClick = () => {
        if (formData.department) {
            dispatch(getSuggestedWardNumber(formData.department))
                .unwrap()
                .then((result) => {
                    if (result.success && result.suggestedWardNumber) {
                        handleInputChange('wardNumber', result.suggestedWardNumber);

                        // Auto-generate name for new wards
                        if (isCreating) {
                            const selectedDept = departments.find(dept => dept._id === formData.department);
                            if (selectedDept) {
                                const autoName = `${selectedDept.name} Ward ${result.suggestedWardNumber}`;
                                handleInputChange('name', autoName);
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Failed to get suggested ward number:', error);
                });
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        if (isCreating) {
            onAddWard();
        } else {
            onUpdateWard();
        }
    };

    // Get department name for display
    const getDepartmentName = () => {
        if (formData.department_Name) return formData.department_Name;
        const dept = departments.find(d => d._id === formData.department);
        return dept ? dept.name : '';
    };

    // Extract just the number part from formatted ward number (for display)
    const getWardNumberDisplay = () => {
        if (!formData.wardNumber) return '';

        // If wardNumber is in format "CARD-1", extract just "1"
        if (typeof formData.wardNumber === 'string' && formData.wardNumber.includes('-')) {
            const parts = formData.wardNumber.split('-');
            return parts[parts.length - 1];
        }

        return formData.wardNumber;
    };

    // Handle ward number input change - ensure we store just the number
    const handleWardNumberChange = (value) => {
        // If value is in format "CARD-1", extract just "1"
        if (typeof value === 'string' && value.includes('-')) {
            const parts = value.split('-');
            value = parts[parts.length - 1];
        }
        handleInputChange('wardNumber', value);
    };

    return (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-lg flex justify-center items-center z-50">
            <div className="bg-white border border-gray-400 rounded-xl p-8 shadow-lg w-[800px] max-h-[90vh] overflow-y-auto transform transition-all">
                <h2 className="text-2xl font-bold mb-4 text-center text-primary-800">
                    {isCreating ? 'Add New Ward' : 'Edit Ward'}
                </h2>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Department Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Department Name *
                        </label>
                        <select
                            value={formData.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                            disabled={isProcessing}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments?.map((dept) => (
                                <option key={dept._id} value={dept._id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ward Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Ward Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                            disabled={isProcessing}
                            placeholder="e.g., Cardiology Ward 1"
                            required
                        />
                    </div>

                    {/* Ward Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Ward Number *
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                value={getWardNumberDisplay()}
                                onChange={(e) => handleWardNumberChange(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                disabled={isProcessing}
                                min="1"
                                required
                                placeholder="Enter ward number"
                            />
                            {/* Show Suggest button for BOTH create and edit modes */}
                            {formData.department && (
                                <button
                                    type="button"
                                    onClick={handleSuggestClick}
                                    disabled={suggestionLoading || isProcessing}
                                    className="whitespace-nowrap px-3 py-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Get next available ward number for this department"
                                >
                                    {suggestionLoading ? '...' : 'Suggest'}
                                </button>
                            )}
                        </div>
                        {!formData.wardNumber && (
                            <p className="mt-1 text-sm text-yellow-600">
                                Please enter a ward number or use Suggest
                            </p>
                        )}
                        {suggestedWardNumber && (
                            <p className="mt-1 text-sm text-green-600">
                                Suggested: {suggestedWardNumber}
                            </p>
                        )}
                    </div>

                    {/* Bed Count */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Total Bed Count *
                        </label>
                        <input
                            type="number"
                            value={formData.bedCount}
                            onChange={(e) => handleInputChange('bedCount', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                            disabled={isProcessing}
                            min="1"
                            required
                        />
                    </div>
                </div>

                {/* Display Ward Preview */}
                {getDepartmentName() && formData.wardNumber && (
                    <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                        <h3 className="font-medium text-primary-800 mb-2">Ward Preview</h3>
                        <p className="text-sm text-primary-700">
                            <strong>Ward Identifier:</strong> {getDepartmentName()} Ward {getWardNumberDisplay()}
                        </p>
                        <p className="text-sm text-primary-700">
                            <strong>Full Ward Number:</strong> {getDepartmentName().substring(0, 4).toUpperCase()}-{getWardNumberDisplay()}
                        </p>
                        {formData.bedCount && (
                            <p className="text-sm text-primary-700">
                                <strong>Beds:</strong> {formData.bedCount} bed{formData.bedCount !== 1 ? 's' : ''} will be created as{' '}
                                {Array.from({ length: Math.min(3, formData.bedCount) }, (_, i) =>
                                    `${getDepartmentName().substring(0, 4).toUpperCase()}-${getWardNumberDisplay()}-B${i + 1}`
                                ).join(', ')}
                                {formData.bedCount > 3 ? ', ...' : ''}
                            </p>
                        )}
                    </div>
                )}

                {/* Ward-Level Nurse Assignment */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Ward-Level Nurses (Optional)
                    </label>
                    <div className="space-y-3">
                        {formData.nurses?.map((nurse, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 items-center">
                                <select
                                    value={nurse.nurse}
                                    onChange={(e) => {
                                        const updatedNurses = [...formData.nurses];
                                        updatedNurses[index].nurse = e.target.value;
                                        handleInputChange('nurses', updatedNurses);
                                    }}
                                    className="p-2 border border-gray-300 rounded-md shadow-sm"
                                    disabled={isProcessing}
                                >
                                    <option value="">Select Nurse</option>
                                    {departmentNurses?.map((n) => (
                                        <option key={n._id} value={n._id}>
                                            {n.user?.user_Name || `${n.firstName} ${n.lastName}`}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={nurse.role}
                                    onChange={(e) => {
                                        const updatedNurses = [...formData.nurses];
                                        updatedNurses[index].role = e.target.value;
                                        handleInputChange('nurses', updatedNurses);
                                    }}
                                    className="p-2 border border-gray-300 rounded-md shadow-sm"
                                    disabled={isProcessing}
                                >
                                    <option value="">Select Role</option>
                                    <option value="Head Nurse">Head Nurse</option>
                                    <option value="Staff Nurse">Staff Nurse</option>
                                    <option value="Trainee">Trainee</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updatedNurses = formData.nurses.filter((_, i) => i !== index);
                                        handleInputChange('nurses', updatedNurses);
                                    }}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                    disabled={isProcessing}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                const updatedNurses = [...formData.nurses, { nurse: '', role: '' }];
                                handleInputChange('nurses', updatedNurses);
                            }}
                            className="text-primary-500 border p-2 rounded-md hover:text-primary-700 text-sm flex items-center"
                            disabled={isProcessing}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Ward Nurse
                        </button>
                    </div>
                </div>

                <div className="flex justify-between border-t pt-3 border-primary-600 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-white hover:bg-gray-400 border border-gray-400 text-gray-800 py-2 px-6 rounded-md transition flex items-center"
                        disabled={isProcessing}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md transition flex items-center disabled:opacity-50"
                        disabled={isProcessing || !formData.wardNumber || !formData.department || !formData.name || !formData.bedCount}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCreating ? "M12 4v16m8-8H4" : "M5 13l4 4L19 7"} />
                        </svg>
                        {isProcessing ? (isCreating ? 'Creating...' : 'Updating...') : (isCreating ? 'Add Ward' : 'Update Ward')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WardModal;