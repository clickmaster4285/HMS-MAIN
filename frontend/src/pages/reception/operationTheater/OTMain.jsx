import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaUserMd, FaClock, FaHospital, FaProcedures, FaSearch, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import OTForm from "./OTForm";
import OTTable from "./OTTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOperations, createOperation, updateOperation, deleteOperation } from "../../../features/operationManagment/otSlice"
import { toast } from 'react-toastify';
import DeleteConfirmationModal from './DeleteOperation';
import DateRangePicker from '../../../components/common/DateRangePicker';

const OperationSchedule = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [currentOperation, setCurrentOperation] = useState(null)
    const { departments } = useSelector(state => state.department);
    const { doctors } = useSelector(state => state.doctor);
    const [dateRange, setDateRange] = useState({
        start: new Date(), // Will be adjusted to start of day
        end: new Date()    // Will be adjusted to end of day
    });;


    const handleDateRangeChange = (newRange) => {
        // Ensure we're working with Date objects
        const validatedRange = {
            start: new Date(newRange.start),
            end: new Date(newRange.end)
        };

        // Validate dates
        if (isNaN(validatedRange.start.getTime())) {
            validatedRange.start = new Date(new Date().setHours(0, 0, 0, 0));
        }
        if (isNaN(validatedRange.end.getTime())) {
            validatedRange.end = new Date(new Date().setHours(23, 59, 59, 999));
        }

        setDateRange(validatedRange);
    };

    const [deleteModal, setDeleteModal] = useState({
        show: false,
        mrno: null,
        patientName: ''
    });
    const {
        operations = [],
        isLoading = false,
        error = null
    } = useSelector(state => state.ot || {});
    const [visibleFields, setVisibleFields] = useState({
        patient_MRNo: true,
        patient_Name: true,
        procedure: true,
        surgeon: true,
        department: true,
        otTime: true,
        otNumber: true,
        status: true,
        anesthesiaType: true,
        operationName: true,
        totalCost: true,
        paymentStatus: true
    });
    const toggleFieldVisibility = (field) => {
        setVisibleFields(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleEdit = (operation) => {
        setCurrentOperation({
            ...operation,
            // Ensure nested objects exist
            otInformation: operation.otInformation || {
                operationName: "",
                reasonForOperation: "",
                doctor: {
                    seniorSurgeon: [],
                    assistantDoctors: [],
                    nurses: [],
                    doctors_Fee: 0,
                    anesthesia_Type: "",
                    operation_Date: "",
                    surgery_Type: "",
                    operation_Outcomes: "",
                },
                equipment_Charges: 0,
            },
            otTime: operation.otTime || { startTime: "", endTime: "" }
        });
        setShowForm(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (currentOperation) {

                await dispatch(updateOperation({
                    mrno: currentOperation.patient_MRNo,
                    operationData: formData
                })).unwrap();
                toast.success("Operation updated successfully!");
            } else {
                // For create operation
                await dispatch(createOperation(formData)).unwrap();
                toast.success("Operation created successfully!");
            }
            // Refresh the operations list
            await dispatch(fetchAllOperations());
            setShowForm(false);
            setCurrentOperation(null);
        } catch (error) {
            console.error("Operation failed:", error);
            toast.error(error.message || "Operation failed");
        }
    };

    useEffect(() => {
        dispatch(fetchAllOperations());
    }, [dispatch]);

    const handleFormCancel = () => {
        setShowForm(false);
        setCurrentOperation(null);
    };

    const handleDelete = async (mrno) => {
        if (window.confirm("Are you sure you want to delete this operation?")) {
            try {
                await dispatch(deleteOperation(mrno)).unwrap();
                dispatch(fetchAllOperations()); // Refresh the list
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                    <div className="shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleReorder = (reorderedItems) => {
        dispatch(reorderOperations(reorderedItems));
    };

    const handleDeleteClick = (mrno, patientName) => {
        setDeleteModal({
            show: true,
            mrno,
            patientName
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            show: false,
            mrno: null,
            patientName: ''
        });
    };

    return (
        <>
            <div>
                {/* Header Section */}
                <div className="bg-primary-600 text-white rounded-md px-6 py-8 shadow-md">
                    <div className="max-w-9xl mx-auto">
                        <div className="flex flex-col space-y-2 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex items-center ">
                                <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
                                <div>
                                    <h1 className="text-3xl font-bold">Operation Theater Management</h1>
                                    <p className="text-primary-100 mt-1">Manage surgical procedures, teams, and scheduling</p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <div className="flex gap-2">
                                    <DateRangePicker
                                        initialStartDate={dateRange.start}
                                        initialEndDate={dateRange.end}
                                        onDateRangeChange={setDateRange}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-9xl mx-auto px-6 py-8">
                    {/* Controls Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaSearch className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by MR Number, patient name, or procedure..."
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                                    {showForm ? 'Cancel' : 'New Operation'}
                                </button>

                                <div className="relative group">
                                    <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <FaEye className="mr-1" /> View
                                    </button>
                                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 hidden group-hover:block">
                                        <div className="py-1 px-2 grid grid-cols-1 gap-1">
                                            {Object.keys(visibleFields).map(field => (
                                                <label key={field} className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={visibleFields[field]}
                                                        onChange={() => toggleFieldVisibility(field)}
                                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                                                    />
                                                    {field.split(/(?=[A-Z])/).join(' ')}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    {showForm && (
                        <OTForm
                            operation={currentOperation}
                            onSubmit={handleFormSubmit}
                            onCancel={handleFormCancel}
                        />
                    )}

                    {/* Table Section */}

                    <OTTable
                        operations={operations}
                        searchTerm={searchTerm}
                        dateRange={dateRange}
                        visibleFields={visibleFields}
                        departments={departments}
                        doctors={doctors}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        onReorder={handleReorder}
                        isLoading={isLoading}
                        error={error}
                    />
                    {deleteModal.show && (
                        <DeleteConfirmationModal
                            mrno={deleteModal.mrno}
                            patientName={deleteModal.patientName}
                            onClose={closeDeleteModal}
                        />
                    )}
                </div>
            </div>

            <div className="flex border rounded-md border-primary-300 flex-col sm:flex-row sm:justify-between justify-center sm:items-start items-center gap-2 px-6 py-3 bg-gray-50">
                <div className="text-sm px-3 py-1.5 rounded-md bg-primary-600 text-white">
                    Showing operations between{' '}
                    <span className="font-medium">
                        {dateRange.start.toLocaleDateString()}
                    </span>{' '}
                    and{' '}
                    <span className="font-medium">
                        {dateRange.end.toLocaleDateString()}
                    </span>
                </div>
            </div>

        </>
    );
};

export default OperationSchedule;