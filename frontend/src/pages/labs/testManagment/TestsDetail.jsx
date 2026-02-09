// TestsDetail.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import custom hook and components
import { useTestDetailHook, formatReportDeliveryTime } from '../../../hooks/useTestDetailHook';
import { TestHeaderCard } from './components/TestHeaderCard.jsx';
import { InfoCard, InfoItem } from './components/InfoCard.jsx';
import { TestFieldsTable } from './components/TestFieldsTable.jsx';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';

const TestsDetail = () => {
  const navigate = useNavigate();
  const { selectedTest, getByIdLoading, getByIdError } = useTestDetailHook();

  // Icons for reuse
  const basicInfoIcon = (
    <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const reportInfoIcon = (
    <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  if (getByIdLoading) {
    return (
      <DetailLayout navigate={navigate}>
        <LoadingState />
      </DetailLayout>
    );
  }

  if (getByIdError) {
    return (
      <DetailLayout navigate={navigate}>
        <ErrorState error={getByIdError} />
      </DetailLayout>
    );
  }

  if (!selectedTest) {
    return (
      <DetailLayout navigate={navigate}>
        <ErrorState error="Test not found" />
      </DetailLayout>
    );
  }

  const reportTimeInfo = formatReportDeliveryTime(selectedTest.reportDeliveryTime);

  return (
    <DetailLayout navigate={navigate}>
      <div className="space-y-6">
        <TestHeaderCard test={selectedTest} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <BasicInfoCard test={selectedTest} icon={basicInfoIcon} />
          <ReportInfoCard 
            test={selectedTest} 
            icon={reportInfoIcon} 
            reportTimeInfo={reportTimeInfo} 
          />
        </div>

        <TestFieldsTable 
          fields={selectedTest.fields} 
          testName={selectedTest.testName}
          testDept={selectedTest.testDept}
        />
      </div>
    </DetailLayout>
  );
};

// Layout Component
const DetailLayout = ({ navigate, children }) => (
  <div className="min-h-screen bg-linear-to-br from-slate-50 via-primary-50 to-teal-50">
    <Header navigate={navigate} />
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  </div>
);

// Header Component
const Header = ({ navigate }) => (
  <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-20">
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BackButton navigate={navigate} />
          <div className="h-6 w-px bg-slate-300"></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
              Test Details
            </h1>
            <p className="text-slate-600 text-sm">View comprehensive test information</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Back Button Component
const BackButton = ({ navigate }) => (
  <button
    onClick={() => navigate(-1)}
    className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-lg border border-slate-200 transition-all duration-200 hover:shadow-xl"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    <span className="font-medium">Back to Tests</span>
  </button>
);

// Basic Information Card
const BasicInfoCard = ({ test, icon }) => (
  <InfoCard title="Basic Information" icon={icon}>
    <InfoItem label="Description" value={test.description} />
    <InfoItem label="Instructions" value={test.instructions} />
    <InfoItem label="Department" value={test.testDept} />
    <InfoItem label="Created Date">
      {test.createdAt ? new Date(test.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Not available'}
    </InfoItem>
  </InfoCard>
);

// Report Information Card
const ReportInfoCard = ({ test, icon, reportTimeInfo }) => (
  <InfoCard title="Report Information" icon={icon}>
    <InfoItem label="Report Delivery Time">
      <div className={reportTimeInfo.className}>
        {reportTimeInfo.display}
      </div>
    </InfoItem>
    <InfoItem label="Fasting Requirement">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        test.requiresFasting
          ? 'bg-orange-100 text-orange-800'
          : 'bg-green-100 text-green-800'
      }`}>
        {test.requiresFasting ? 'Yes - Fasting Required' : 'No - No Fasting Required'}
      </span>
    </InfoItem>
  </InfoCard>
);

export default TestsDetail;