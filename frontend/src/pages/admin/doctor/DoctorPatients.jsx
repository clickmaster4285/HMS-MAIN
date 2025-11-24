import React, { useState, useEffect } from 'react';
import {
    FaUserInjured,
    FaCalendarCheck,
    FaNotesMedical,
    FaFilter,
    FaSearch,
    FaFileExport,
    FaTint
} from 'react-icons/fa';
import { HiStatusOnline } from 'react-icons/hi';
import DateRangePicker from '../../../components/common/DateRangePicker';


const DoctorPatients = ({ doctorId, patients = [] }) => {
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilterType, setDateFilterType] = useState('createdAt');
    const today = new Date();
    const [dateRange, setDateRange] = useState({
        start: new Date(today.setHours(0, 0, 0, 0)),
        end: new Date(today.setHours(23, 59, 59, 999))
    });
    const [filters, setFilters] = useState({
        bloodType: '',
        gender: '',
        // other filters...
    });

    useEffect(() => {
        if (patients && patients.length > 0) {
            const filtered = patients.filter(patient => {
                // Use the selected date field for filtering
                const patientDate = new Date(patient[dateFilterType] || patient.createdAt);

                // Create new Date objects to avoid modifying the original dates
                const startDate = new Date(dateRange.start);
                const endDate = new Date(dateRange.end);

                // Normalize the time components
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);

                const matchesDate = patientDate >= startDate && patientDate <= endDate;
                const matchesSearch = patient.patient_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient.patient_MRNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient.patient_CNIC.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesBloodType = !filters.bloodType ||
                    (patient.patient_BloodType &&
                        patient.patient_BloodType.toUpperCase() === filters.bloodType.toUpperCase());
                const matchesGender = !filters.gender ||
                    (patient.patient_Gender &&
                        patient.patient_Gender.toLowerCase() === filters.gender.toLowerCase());

                return matchesDate && matchesSearch && matchesBloodType && matchesGender;
            });
            setFilteredPatients(filtered);
        } else {
            setFilteredPatients([]);
        }
    }, [patients, dateRange, searchTerm, filters, dateFilterType]);

    // console.log('Patients data:', patients);

    return (
        <div className="mt-12 animate-fade-in">
            {/* Header with Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-3 rounded-full mr-4 shadow-lg">
                        <FaUserInjured className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>
                        <p className="text-primary-600">Appointments and treatment history</p>
                    </div>
                </div>

                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search patients..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-100">
                <div className="flex items-center mb-3">
                    <FaFilter className="text-primary-600 mr-2" />
                    <h3 className="font-semibold text-gray-700">Filters</h3>
                </div>
                <div className="flex flex-col xl:justify-between xl:flex-row space-x-3 space-y-3 ">
                    <div className="">
                        <DateRangePicker
                            onDateRangeChange={setDateRange}
                            className="w-full "
                        />
                    </div>
                    <div className="flex flex-col xl:flex-row space-x-2 space-y-3">
                        <div className='py-2'>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                            <select
                                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                value={filters.bloodType}
                                onChange={(e) => setFilters({ ...filters, bloodType: e.target.value })}
                            >
                                <option value="">All</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                        <div className='py-2'>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select
                                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                value={filters.gender}
                                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                            >
                                <option value="">All</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow">
                        Apply Filters
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        onClick={() => {
                            setSearchTerm('');
                            setDateRange({ start: new Date(), end: new Date() });
                            setFilters({
                                bloodType: '',
                                gender: '',
                                // reset other filters...
                            });
                        }}
                    >
                        Reset
                    </button>
                </div>

            </div>

            {/* Stats Cards with Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon={<FaUserInjured className="text-sky-500 text-2xl" />}
                    title="Total Patients"
                    value={patients?.length || 0}
                    trend="up"
                    color="from-gray-50 to-sky-100"
                />
                <StatCard
                    icon={<FaCalendarCheck className="text-green-500 text-2xl" />}
                    title="Filtered Records"
                    value={filteredPatients.length}
                    trend={filteredPatients.length > 0 ? "up" : "down"}
                    color="from-gray-50 to-green-100"
                />
                <StatCard
                    icon={<HiStatusOnline className="text-yellow-500 text-2xl" />}
                    title={`${filters.gender || 'Male'} Patients`}
                    value={filteredPatients.filter(p =>
                        !filters.gender
                            ? (p.patient_Gender && p.patient_Gender.toString().toLowerCase() === 'male')
                            : (p.patient_Gender && p.patient_Gender.toString().toLowerCase() === filters.gender.toLowerCase())
                    ).length}
                    color="from-gray-50 to-yellow-100"
                />
                <StatCard
                    icon={<FaTint className="text-purple-500 text-2xl" />}
                    title={`Blood Type ${filters.bloodType || 'B+'}`}
                    value={filteredPatients.filter(p =>
                        p.patient_BloodType &&
                        p.patient_BloodType.toUpperCase() === (filters.bloodType || 'B+').toUpperCase()
                    ).length}
                    color="from-gray-50 to-purple-100"
                />
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-700">
                        Showing {filteredPatients.length} of {patients.length} patients
                    </h3>
                </div>

                {filteredPatients.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <TableHeader>Patient</TableHeader>
                                    <TableHeader>MR No.</TableHeader>
                                    <TableHeader>Age/Gender</TableHeader>
                                    <TableHeader>Contact</TableHeader>
                                    <TableHeader>Blood Type</TableHeader>
                                    <TableHeader>Hospital Info</TableHeader>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPatients.map((patient) => (
                                    <PatientRow key={patient.patient_MRNo} patient={patient} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="mx-auto w-24 h-24 mb-4 text-gray-300">
                            <FaUserInjured className="w-full h-full" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-500 mb-1">
                            No patients found
                        </h4>
                        <p className="text-gray-400">
                            {searchTerm ? 'Try a different search term' : 'Adjust your filters to see results'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Enhanced StatCard with gradient and trend indicator
const StatCard = ({ icon, title, value, trend, color }) => (
    <div className={`bg-gradient-to-r ${color} p-4 border border-primary-700 text-primary-600 rounded-xl shadow-sm transform hover:scale-[1.02] transition-transform`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium opacity-90">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className="p-2 rounded-full bg-white bg-opacity-20">
                {icon}
            </div>
        </div>
        {trend && (
            <div className="mt-2 text-xs flex items-center">
                {trend === 'up' ? (
                    <>
                        <span className="mr-1">↑</span> Increased
                    </>
                ) : (
                    <>
                        <span className="mr-1">↓</span> Decreased
                    </>
                )}
            </div>
        )}
    </div>
);

const TableHeader = ({ children }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        {children}
    </th>
);

const PatientRow = ({ patient }) => (
    <tr className="hover:bg-gray-50 transition-colors group">
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                    <img
                        className="h-10 w-10 rounded-full object-cover border-2 border-white group-hover:border-primary-100 transition-colors"
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patient.patient_Name)}&background=random`}
                        alt={patient.patient_Name}
                    />
                </div>
                <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                        {patient.patient_Name}
                    </div>
                    <div className="text-xs text-gray-500">
                        {patient.patient_CNIC}
                    </div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-mono font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded inline-block">
                {patient.patient_MRNo}
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
                {patient.patient_Age}
            </div>
            <div className="text-xs text-gray-500">
                {patient.patient_Gender}
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
                {patient.patient_ContactNo}
            </div>
            <div className="text-xs text-gray-500">
                {patient.patient_Guardian?.guardian_Contact}
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <BloodTypeBadge bloodType={patient.patient_BloodType} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
                {patient.patient_HospitalInformation?.doctor_Name}
            </div>
            <div className="text-xs text-gray-500">
                PKR {patient.patient_HospitalInformation?.total_Fee?.toLocaleString()}
            </div>
        </td>
    </tr>
);

const BloodTypeBadge = ({ bloodType }) => {
    const colorMap = {
        'A+': 'bg-red-100 text-red-800',
        'A-': 'bg-red-50 text-red-700',
        'B+': 'bg-primary-100 text-primary-800',
        'B-': 'bg-primary-50 text-primary-700',
        'AB+': 'bg-purple-100 text-purple-800',
        'AB-': 'bg-purple-50 text-purple-700',
        'O+': 'bg-green-100 text-green-800',
        'O-': 'bg-green-50 text-green-700'
    };

    const colorClass = colorMap[bloodType] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${colorClass}`}>
            {bloodType || 'Unknown'}
        </span>
    );
};


export default DoctorPatients;