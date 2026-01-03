// pages/SummaryDashboard.jsx
import React from 'react';
import { useSummary } from '../../../hooks/useSummary';
import StatsCard from './components/StatsCard';
import SummaryTable from './components/SummaryTable';
import DateRangeFilter from './components/DateRangeFilter';
import ServiceCategoriesTable from './components/ServiceCategoriesTable';
import ReportGenerator from './components/ReportGenerator';
import { Info, Tag, DollarSign, Calculator } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-sky-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard data...</p>
          <p className="text-sm text-slate-500 mt-2">Please wait while we fetch the latest statistics</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-sky-50">
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
            className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-sky-50">
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

  // Calculate OPD summary metrics
  const calculateOPDSummary = () => {
    const doctorAssignedDoctors = opd.doctors.filter(d => d.type === 'doctor_assigned');
    const totalOPDRevenue = opd.statistics.totalRevenue || 0;
    const totalOPDDiscount = opd.statistics.totalDiscount || 0;
    const totalFeesBeforeDiscount = opd.statistics.totalFeesBeforeDiscount || 0;

    // Calculate totals from doctors
    const totalDoctorRevenue = doctorAssignedDoctors.reduce((sum, d) => sum + d.revenue, 0);
    const totalHospitalShare = doctorAssignedDoctors.reduce((sum, d) => sum + d.hospitalShare, 0);
    const totalDoctorShare = doctorAssignedDoctors.reduce((sum, d) => sum + d.doctorShare, 0);
    const totalDiscountGiven = doctorAssignedDoctors.reduce((sum, d) => sum + (d.discountGiven || 0), 0);

    // Calculate percentages
    const hospitalPercentage = totalDoctorRevenue > 0 ? (totalHospitalShare / totalDoctorRevenue * 100).toFixed(1) : 0;
    const doctorPercentage = totalDoctorRevenue > 0 ? (totalDoctorShare / totalDoctorRevenue * 100).toFixed(1) : 0;
    const discountRate = totalFeesBeforeDiscount > 0 ? (totalOPDDiscount / totalFeesBeforeDiscount * 100).toFixed(1) : 0;

    return {
      totalOPDRevenue,
      totalFeesBeforeDiscount,
      totalOPDDiscount,
      totalDoctorRevenue,
      totalHospitalShare,
      totalDoctorShare,
      hospitalPercentage,
      doctorPercentage,
      discountRate,
      doctorCount: doctorAssignedDoctors.length
    };
  };

  const opdSummary = calculateOPDSummary();

  // Enhanced Quick Stats with discount metrics
  const quickStats = [
    {
      title: "OPD Patients",
      value: overview.totalOPDPatients || 0,
      icon: "users",
      color: "sky",
      subValue: `With Doctor: ${opd.statistics.withDoctor}`,
      trend: "up",
      trendValue: "12%"
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
      title: "Total Discount",
      value: formatCurrency(overview.totalDiscount || 0),
      icon: "tag",
      color: "purple",
      subValue: `Rate: ${financialSummary?.collectionMetrics?.discountRate || '0%'}`,
      trend: "down",
      trendValue: "5%"
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
      title: "OPD Revenue",
      value: formatCurrency(opd.statistics.totalRevenue),
      icon: "wallet",
      color: "teal",
      subValue: `Discount: ${formatCurrency(opd.statistics.totalDiscount || 0)}`,
      trend: "up",
      trendValue: "15%"
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
      title: "Total Refunds",
      value: overview.totalRefunds || 0,
      icon: "creditCard",
      color: "rose",
      subValue: `Amount: ${formatCurrency(overview.totalRefundAmount)}`,
      trend: "down",
      trendValue: "3%"
    },
    {
      title: "Doctor Consultations",
      value: opd?.statistics?.withDoctor || 0,
      icon: "stethoscope",
      color: "indigo",
      subValue: `Doctors: ${opd.doctors.filter(d => d.type === 'doctor_assigned').length}`,
      trend: "up",
      trendValue: "10%"
    }
  ];

  // Updated Doctor Table Columns with Discount and Formulas
  const doctorColumns = [
    {
      key: 'name',
      title: 'Doctor Name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-xs text-slate-500">{row.department || 'General'}</div>
          <div className="text-xs text-slate-400 mt-1">
            Split: {row.percentages?.split || '50/50'}
          </div>
        </div>
      )
    },
    {
      key: 'patientCount',
      title: 'Patients',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
          {value}
        </span>
      )
    },
    {
      key: 'totalFees',
      title: 'Total Fees',
      render: (value, row) => (
        <div>
          <div className="font-semibold text-slate-900">{formatCurrency(value || row.revenue)}</div>
          {row.discountGiven > 0 && (
            <div className="text-xs text-amber-600">
              -{formatCurrency(row.discountGiven)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'revenue',
      title: 'Net Revenue',
      render: (value) => <span className="font-semibold text-slate-900">{formatCurrency(value)}</span>
    },
    {
      key: 'hospitalShare',
      title: 'Hospital Share',
      render: (value, row) => (
        <div>
          <div className="font-medium text-emerald-600">{formatCurrency(value)}</div>
          <div className="text-xs text-slate-500">
            ({row.percentages?.hospital || 50}%)
          </div>
        </div>
      )
    },
    {
      key: 'doctorShare',
      title: 'Doctor Share',
      render: (value, row) => (
        <div>
          <div className="font-medium text-violet-600">{formatCurrency(value)}</div>
          <div className="text-xs text-slate-500">
            ({row.percentages?.doctor || 50}%)
          </div>
        </div>
      )
    },
    {
      key: 'discountGiven',
      title: 'Discount Given',
      render: (value) => (
        <span className={`font-medium ${value > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
          {formatCurrency(value || 0)}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-sky-50 p-4">
      <div className="">
        {/* Header with improved design */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Hospital Analytics Dashboard</h1>
              <p className="text-slate-600 mt-2">
                Summary for <span className="font-medium">{dateRange.start}</span> to <span className="font-medium">{dateRange.end}</span>
                {dateRange.isToday && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                    Today
                  </span>
                )}
              </p>
            </div>

            {/* Use the ReportGenerator Component */}
            <div className="mt-4 md:mt-0">
              <ReportGenerator
                data={data}
                dateRange={dateRange}
                isLoading={loading}
              />
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

        {/* Financial Overview Cards with Discount */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">OPD Revenue</h3>
                <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-sky-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(financialSummary.breakdown.opdRevenue)}</p>
              <p className="text-sm text-slate-500 mt-2">{financialSummary.breakdown.opdPercentage} of total revenue</p>
              {financialSummary.breakdown.opdDiscount > 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  Discount: {formatCurrency(financialSummary.breakdown.opdDiscount)}
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">Total Discount</h3>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(financialSummary.totalDiscount || 0)}</p>
              <p className="text-sm text-slate-500 mt-2">
                {financialSummary.collectionMetrics.discountRate || '0%'} of total fees
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Fees before discount: {formatCurrency(financialSummary.totalFeesBeforeDiscount || 0)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">Net Revenue</h3>
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-teal-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(financialSummary.netRevenue)}</p>
              <p className="text-sm text-slate-500 mt-2">After refunds and adjustments</p>
              <div className="text-xs text-slate-400 mt-1 space-y-1">
                <div>Collected: {formatCurrency(financialSummary.totalCollected)}</div>
                <div>Refunds: -{formatCurrency(financialSummary.totalRefundAmount)}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">Collection Rate</h3>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{financialSummary.collectionMetrics.overallCollectionRate}</p>
              <p className="text-sm text-slate-500 mt-2">Overall collection efficiency</p>
              <div className="text-xs text-slate-400 mt-1 space-y-1">
                <div>Pending: {formatCurrency(financialSummary.totalPending)}</div>
                <div>Refund Rate: {financialSummary.collectionMetrics.refundRate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* OPD Performance Section with Formula Explanations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">OPD Performance</h2>
              <p className="text-slate-600 mt-1">Doctor-wise patient consultations and revenue split calculations</p>
            </div>
          </div>

          {/* OPD Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">OPD Summary</h3>
                <p className="text-sm text-slate-500">Total calculations across all doctors</p>
              </div>
              <button className="flex items-center space-x-1 text-sm text-sky-600 hover:text-sky-700">
                <Info className="w-4 h-4" />
                <span>Formula Info</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-sky-50 rounded-lg">
                <p className="text-sm text-slate-600">Total OPD Revenue</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(opdSummary.totalOPDRevenue)}</p>
                <p className="text-xs text-slate-500 mt-1">After {formatCurrency(opdSummary.totalOPDDiscount)} discount</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-slate-600">Hospital Share</p>
                <p className="text-2xl font-bold text-emerald-700">{formatCurrency(opdSummary.totalHospitalShare)}</p>
                <p className="text-xs text-slate-500 mt-1">{opdSummary.hospitalPercentage}% of doctor revenue</p>
              </div>
              <div className="p-4 bg-violet-50 rounded-lg">
                <p className="text-sm text-slate-600">Doctor Share</p>
                <p className="text-2xl font-bold text-violet-700">{formatCurrency(opdSummary.totalDoctorShare)}</p>
                <p className="text-xs text-slate-500 mt-1">{opdSummary.doctorPercentage}% of doctor revenue</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Doctor Performance Table */}
            <SummaryTable
              title={`Doctor Performance (${opd.doctors.filter(d => d.type === 'doctor_assigned').length} Doctors)`}
              columns={doctorColumns}
              data={opd.doctors.filter(d => d.type === 'doctor_assigned')}
              searchable={true}
              sortable={true}
              downloadable={true}
              emptyMessage="No doctor performance data available"
            />

            {/* Add Service Categories Table with Discount */}
            {opd.purposeCategories && opd.purposeCategories.length > 0 && (
              <ServiceCategoriesTable
                title="Service Categories Performance"
                data={opd.purposeCategories}
                formatCurrency={formatCurrency}
              />
            )}

            {/* Hospital Only Services */}
            {opd.doctors.filter(d => d.type === 'hospital_only').length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Direct Services (No Doctor)</h3>
                    <p className="text-sm text-slate-500">Patients without doctor assignment - 100% hospital revenue</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {opd.doctors.find(d => d.type === 'hospital_only')?.patientCount || 0}
                    </p>
                    <p className="text-sm text-emerald-600 font-medium">
                      {formatCurrency(opd.doctors.find(d => d.type === 'hospital_only')?.revenue || 0)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">
                    {opd.doctors.find(d => d.type === 'hospital_only')?.note || ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* IPD & Refunds Sections with Discount */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* IPD Section */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Inpatient Department</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {/* Show total IPD patients prominently */}
              <div className="mb-6 p-4 bg-sky-50 rounded-lg border border-sky-100">
                <p className="text-sm text-sky-600 font-medium mb-1">Total IPD Patients</p>
                <p className="text-3xl font-bold text-sky-800">{ipd.statistics.totalPatients || 0}</p>
                {ipd.statistics.totalDiscount > 0 && (
                  <p className="text-sm text-amber-600 mt-1">
                    Discount: {formatCurrency(ipd.statistics.totalDiscount)}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-sky-50 rounded-lg">
                  <p className="text-sm text-slate-600">Admitted</p>
                  <p className="text-2xl font-bold text-slate-900">{ipd.statistics.admitted || 0}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-slate-600">Discharged</p>
                  <p className="text-2xl font-bold text-slate-900">{ipd.statistics.discharged || 0}</p>
                </div>
              </div>

              {/* Add ward breakdown if available */}
              {ipd.breakdown?.byWard && ipd.breakdown.byWard.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">Ward Distribution</p>
                  <div className="space-y-2">
                    {ipd.breakdown.byWard.map((ward, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">{ward.ward}</span>
                        <span className="font-medium text-slate-800">
                          {ward.count} ({ward.percentage})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Revenue</span>
                  <span className="font-semibold">{formatCurrency(ipd.statistics.totalRevenue)}</span>
                </div>
                {ipd.statistics.totalDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Discount</span>
                    <span className="font-semibold text-amber-600">
                      {formatCurrency(ipd.statistics.totalDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Collection Rate</span>
                  <span className={`font-semibold ${ipd.statistics.collectionRate === '0.0%' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {ipd.statistics.collectionRate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Pending Collection</span>
                  <span className="font-semibold text-amber-600">
                    {formatCurrency(ipd.statistics.pendingRevenue)}
                  </span>
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
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Refund Rate</span>
                  <span className="font-semibold text-rose-600">
                    {financialSummary.collectionMetrics.refundRate}
                  </span>
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