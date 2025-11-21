import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getIpdPatientByMrno } from '../../../features/ipdPatient/IpdPatientSlice';
import { format } from 'date-fns';

const PatientDetails = () => {
    const { mrno } = useParams();
    // console.log("the mr unmber is ",mrno)
    const dispatch = useDispatch();
    const { currentPatient, status, error } = useSelector(state => state.ipdPatient);

    useEffect(() => {
        if (mrno) {
            dispatch(getIpdPatientByMrno(mrno));
        }
    }, [mrno, dispatch]);

    // Extract patient data from nested structure
    const patientData = currentPatient?.patient || {};
    const admissionDetails = currentPatient?.admission_Details || {};
    const wardInfo = currentPatient?.ward_Information || {};
    const financials = currentPatient?.financials || {};
    const guardianInfo = patientData?.patient_Guardian || {};

    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
        } catch {
            return 'N/A';
        }
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return 'N/A';
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR'
        }).format(amount);
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error?.message || error || 'Failed to load patient details'}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentPatient) {
        return <div className="text-center py-8 text-gray-500">No patient data found</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-7xl mx-auto my-8">
            {/* Header */}
            <div className="bg-primary-600 text-white p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">Patient Details</h1>
                        <div className="flex items-center mt-2">
                            <span className="bg-white text-primary-600 px-3 py-1 rounded-md text-sm font-bold">
                                MR#: {patientData.patient_MRNo || 'N/A'}
                            </span>
                            <span className={`ml-3 px-3 py-1 rounded-md text-sm font-bold ${currentPatient.status === 'Admitted'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-primary-100 text-primary-800'
                                }`}>
                                {currentPatient.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Patient Basic Info */}
                <SectionCard
                    title="Personal Information"
                    icon={
                        <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DetailItem label="Full Name" value={patientData.patient_Name} />
                        <DetailItem label="Gender" value={patientData.patient_Gender} />
                        <DetailItem label="Age" value={`${calculateAge(patientData.patient_DateOfBirth)} years`} />
                        <DetailItem label="Date of Birth" value={formatDate(patientData.patient_DateOfBirth)} />
                        <DetailItem label="CNIC" value={patientData.patient_CNIC || 'N/A'} />
                        <DetailItem label="Address" value={patientData.patient_Address || 'N/A'} />
                    </div>
                </SectionCard>

                {/* Admission Details */}
                <SectionCard
                    title="Admission Details"
                    icon={
                        <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DetailItem label="Admission Date" value={formatDate(admissionDetails.admission_Date)} />
                        <DetailItem label="Discharge Date" value={formatDate(admissionDetails.discharge_Date)} />
                        <DetailItem label="Days Admitted" value={currentPatient.daysAdmitted || 'N/A'} />
                        <DetailItem label="Ward Type" value={wardInfo.ward_Type || 'N/A'} />
                        <DetailItem label="Ward Number" value={wardInfo.ward_No || 'N/A'} />
                        <DetailItem label="Bed Number" value={wardInfo.bed_No || 'N/A'} />
                    </div>
                </SectionCard>

                {/* Medical Information */}
                <SectionCard
                    title="Medical Information"
                    icon={
                        <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem label="Diagnosis" value={admissionDetails.diagnosis || 'N/A'} />
                        <DetailItem label="Admission Type" value={admissionDetails.admission_Type || 'N/A'} />
                        <DetailItem label="Admitting Doctor" value={admissionDetails.admitting_Doctor || 'N/A'} />
                    </div>
                </SectionCard>

                {/* Financial Information */}
                <SectionCard
                    title="Financial Information"
                    icon={
                        <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DetailItem label="Admission Fee" value={formatCurrency(financials.admission_Fee)} />
                        <DetailItem label="Discount" value={formatCurrency(financials.discount)} />
                        <DetailItem label="Total Charges" value={formatCurrency(financials.total_Charges)} />
                        <DetailItem
                            label="Payment Status"
                            value={
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${financials.payment_Status === 'Paid'
                                        ? 'bg-green-100 text-green-800'
                                        : financials.payment_Status === 'Partial'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                    {financials.payment_Status || 'N/A'}
                                </span>
                            }
                        />
                    </div>
                </SectionCard>

                {/* Guardian Information */}
                <SectionCard
                    title="Guardian Information"
                    icon={
                        <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DetailItem label="Name" value={guardianInfo.guardian_Name || 'N/A'} />
                        <DetailItem label="Relation" value={guardianInfo.guardian_Relation || 'N/A'} />
                        <DetailItem label="Contact" value={guardianInfo.guardian_Contact || 'N/A'} />
                    </div>
                </SectionCard>
            </div>
        </div>
    );
};

// Reusable Section Card Component
const SectionCard = ({ title, icon, children }) => (
    <div className="mb-8 bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            {icon}
            {title}
        </h3>
        {children}
    </div>
);

// Reusable Detail Item Component
const DetailItem = ({ label, value }) => (
    <div className="bg-white p-3 rounded-md border border-gray-200">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium mt-1">{value || 'N/A'}</p>
    </div>
);

export default PatientDetails;