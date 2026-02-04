import React, { useState } from 'react';
import Header from './Header';
import StatsCard from './StatsCard';
import FilterDropdown from './FilterDropdown';
import FilterBar from './FilterBar';
import PendingCollection from './PendingCollection';

const initialSampleData = [
  {
    id: 'LB-2024-001',
    patient: 'Amjad Khan',
    doctor: 'Dr. Aisha Khan',
    specialization: 'Pediatrics',
    testType: 'Blood Test, Urinalysis',
    urgency: 'Critical',
    date: '2024-07-07',
    status: 'Pending',
  },
  {
    id: 'LB-2024-002',
    patient: 'Ali Hamza',
    doctor: 'Dr. Nazish Sultan',
    specialization: 'Pediatrics',
    testType: 'Blood Test, Urinalysis',
    urgency: 'Critical',
    date: '2024-07-07',
    status: 'Pending',
  },
  {
    id: 'LB-2024-003',
    patient: 'Usama Khalid',
    doctor: 'Dr. Ahmer Awan',
    specialization: 'ENT',
    testType: 'MRI, Urinalysis',
    urgency: 'Normal',
    date: '2024-07-07',
    status: 'Pending',
  },
];

const SampleCollection = () => {
  const [view, setView] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredData = initialSampleData.filter((sample) => {
    if (view !== 'Pending') return false;

    const { patient, doctor, specialization } = sample;

    return (
      patient.toLowerCase().includes(searchTerm) ||
      doctor.toLowerCase().includes(searchTerm) ||
      specialization.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Header />
      <StatsCard />
      <div className="flex justify-end mb-4">
        <FilterDropdown view={view} setView={setView} />
      </div>

      {view === 'Pending' && (
        <>
          <FilterBar onSearchChange={handleSearchChange} />
          <PendingCollection data={filteredData} />
        </>
      )}

      {view === 'Collected' && (
        <div className="bg-white p-4 rounded shadow text-gray-600">
          Collected Samples will appear here...
        </div>
      )}

      {view === 'Re-Collection' && (
        <div className="bg-white p-4 rounded shadow text-gray-600">
          Re-Collection Requests will appear here...
        </div>
      )}
    </div>
  );
};

export default SampleCollection;
