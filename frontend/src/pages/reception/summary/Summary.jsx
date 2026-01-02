// pages/SummaryDashboard.jsx
import React from 'react';
import { useSummary } from '../../../hooks/useSummary';
import StatsCard from './components/StatsCard';
import SummaryTable from './components/SummaryTable';
import DateRangeFilter from './components/DateRangeFilter';

const SummaryDashboard = () => {
  const { data, loading, error, filters, updateFilters, refresh } = useSummary();

  const handleDateChange = (start, end) => {
    updateFilters({ startDate: start, endDate: end });
    refresh();
  };

  const handleReset = () => {
    const today = new Date().toISOString().split('T')[0];
    updateFilters({ startDate: today, endDate: today });
    refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard data...</p>
          <p className="text-sm text-slate-500 mt-2">Please wait while we fetch the latest statistics</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md border border-slate-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Data</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={refresh}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="text-slate-600 font-medium">No data available</p>
        </div>
      </div>
    );
  }

  const { overview, opd, ipd, refunds, financialSummary, dateRange } = data;

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount || 0).toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  // Enhanced Quick Stats with more metrics
  const quickStats = [
    {
      title: "OPD Patients",
      value: overview.totalOPDPatients || 0,
      icon: "users",
      color: "blue",
      subValue: `Today: ${opd?.statistics?.todayPatients || 0}`,
      trend: "up",
      trendValue: "12%"
    },
    {
      title: "IPD Patients",
      value: overview.totalIPDPatients || 0,
      icon: "hospital",
      color: "green",
      subValue: `Admitted: ${ipd?.statistics?.admitted || 0}`,
      trend: "up",
      trendValue: "5%"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(overview.totalRevenue),
      icon: "dollar",
      color: "amber",
      subValue: `Net: ${formatCurrency(overview.netRevenue)}`,
      trend: "up",
      trendValue: "8%"
    },
    {
      title: "Collected Revenue",
      value: formatCurrency(overview.totalCollected),
      icon: "wallet",
      color: "teal",
      subValue: `Pending: ${formatCurrency(overview.totalPending)}`,
      trend: "up",
      trendValue: "15%"
    },
    {
      title: "Total Refunds",
      value: overview.totalRefunds || 0,
      icon: "creditCard",
      color: "rose",
      subValue: `Amount: ${formatCurrency(overview.totalRefundAmount)}`,
      trend: "down",
      trendValue: "3%"
    },
    {
      title: "Collection Rate",
      value: financialSummary?.collectionMetrics?.overallCollectionRate || '0%',
      icon: "trendingUp",
      color: "violet",
      subValue: `Refund Rate: ${financialSummary?.collectionMetrics?.refundRate || '0%'}`,
      trend: "up",
      trendValue: "2%"
    },
    {
      title: "Doctor Consultations",
      value: opd?.statistics?.withDoctor || 0,
      icon: "stethoscope",
      color: "indigo",
      subValue: `Today: ${opd?.doctors?.filter(d => d.type === 'doctor_assigned')?.reduce((sum, d) => sum + d.todayPatients, 0) || 0}`,
      trend: "up",
      trendValue: "10%"
    },
    {
      title: "Direct Services",
      value: opd?.statistics?.withoutDoctor || 0,
      icon: "package",
      color: "slate",
      // subValue: `Today: ${doctorStats['HOSPITAL_ONLY']?.todayPatients || 0}`,
      trend: "up",
      trendValue: "7%"
    }
  ];

  // Doctor Table Columns
  const doctorColumns = [
    {
      key: 'name',
      title: 'Doctor Name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-xs text-slate-500">{row.department}</div>
        </div>
      )
    },
    {
      key: 'specialization',
      title: 'Specialization'
    },
    {
      key: 'patientCount',
      title: 'Patients',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'revenue',
      title: 'Total Revenue',
      render: (value) => <span className="font-semibold text-slate-900">{formatCurrency(value)}</span>
    },
    {
      key: 'hospitalShare',
      title: 'Hospital Share',
      render: (value) => <span className="font-medium text-emerald-600">{formatCurrency(value)}</span>
    },
    {
      key: 'doctorShare',
      title: 'Doctor Share',
      render: (value) => <span className="font-medium text-violet-600">{formatCurrency(value)}</span>
    }
  ];

  // Enhanced dashboard layout
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-4 ">
      <div className="">
        {/* Header with improved design */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Hospital Analytics Dashboard</h1>
              <p className="text-slate-600 mt-2">
                Summary for <span className="font-medium">{dateRange.start}</span> to <span className="font-medium">{dateRange.end}</span>
                {dateRange.isToday && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Today
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter
          startDate={filters.startDate}
          endDate={filters.endDate}
          onDateChange={handleDateChange}
          onReset={handleReset}
        />

        {/* Quick Stats Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                subValue={stat.subValue}
                trend={stat.trend}
                trendValue={stat.trendValue}
              />
            ))}
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">OPD Revenue</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(financialSummary.breakdown.opdRevenue)}</p>
              <p className="text-sm text-slate-500 mt-2">{financialSummary.breakdown.opdPercentage} of total revenue</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">IPD Revenue</h3>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(financialSummary.breakdown.ipdRevenue)}</p>
              <p className="text-sm text-slate-500 mt-2">{financialSummary.breakdown.ipdPercentage} of total revenue</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">Pending Collection</h3>
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(financialSummary.totalPending)}</p>
              <p className="text-sm text-slate-500 mt-2">Awaiting payment collection</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">Net Revenue</h3>
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(financialSummary.netRevenue)}</p>
              <p className="text-sm text-slate-500 mt-2">After refunds and adjustments</p>
            </div>
          </div>
        </div>

        {/* OPD Performance Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">OPD Performance</h2>
              <p className="text-slate-600 mt-1">Doctor-wise patient consultations and revenue</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100">
                View Details
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <SummaryTable
              title="Doctor Performance"
              columns={doctorColumns}
              data={opd.doctors.filter(d => d.type === 'doctor_assigned')}
              searchable={true}
              sortable={true}
              downloadable={true}
              emptyMessage="No doctor performance data available"
            />
          </div>
        </div>

        {/* IPD & Refunds Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* IPD Section */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Inpatient Department</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-slate-600">Admitted</p>
                  <p className="text-2xl font-bold text-slate-900">{ipd.statistics.admitted}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-slate-600">Discharged</p>
                  <p className="text-2xl font-bold text-slate-900">{ipd.statistics.discharged}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Revenue</span>
                  <span className="font-semibold">{formatCurrency(ipd.statistics.totalRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Collection Rate</span>
                  <span className="font-semibold text-emerald-600">{ipd.statistics.collectionRate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Refunds Section */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Refunds Analysis</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="mb-6">
                <p className="text-sm text-slate-600 mb-2">Total Refunds</p>
                <p className="text-2xl font-bold text-slate-900">{refunds.statistics.totalRefunds}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Amount</span>
                  <span className="font-semibold text-rose-600">{formatCurrency(refunds.statistics.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Average Refund</span>
                  <span className="font-semibold">{formatCurrency(refunds.statistics.averageRefund)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;