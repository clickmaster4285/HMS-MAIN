import React, { useState } from 'react';
import { FlaskConical, CheckCircle, Timer, AlertCircle, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const getCardDetails = (title) => {
  switch (title.toLowerCase()) {
    case 'pending':
      return {
        icon: <Timer className="w-8 h-8 text-[#009689]" />,
        color: 'text-[#009689]',
        description: 'Awaiting Processing',
      };
    case 'completed':
      return {
        icon: <CheckCircle className="w-8 h-8 text-[#009689]" />,
        color: 'text-[#009689]',
        description: 'Tests Completed Successfully',
      };
    case 'urgent':
      return {
        icon: <AlertCircle className="w-8 h-8 text-red-500" />,
        color: 'text-red-500',
        description: 'Requires Immediate Attention',
      };
    case 'total tests':
      return {
        icon: <FlaskConical className="w-8 h-8 text-[#009689]" />,
        color: 'text-[#009689]',
        description: 'All tests recorded',
      };
    case 'total revenue':
      return {
        icon: <DollarSign className="w-8 h-8 text-[#009689]" />,
        color: 'text-[#009689]',
        description: 'Total income from tests',
      };
    case 'pending revenue':
      return {
        icon: <DollarSign className="w-8 h-8 text-[#009689]" />,
        color: 'text-[#009689]',
        description: 'Awaiting payment',
      };
    case 'completed revenue':
      return {
        icon: <DollarSign className="w-8 h-8 text-[#009689]" />,
        color: 'text-[#009689]',
        description: 'Payments received',
      };
    case 'refunded revenue':
      return {
        icon: <DollarSign className="w-8 h-8 text-red-500" />,
        color: 'text-red-500',
        description: 'Refunded amounts',
      };
    default:
      return {
        icon: null,
        color: 'text-gray-500',
        description: '',
      };
  }
};

const Card = ({ title, value }) => {
  const { icon, color, description } = getCardDetails(title);

  return (
    <div className="bg-white shadow-md p-4 rounded-xl flex flex-col gap-2 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="flex justify-between items-center">
        <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
      <p className="text-base text-gray-600">{title}</p>
      <span className={`text-xs font-medium ${color}`}>{description}</span>
    </div>
  );
};

const TestSummaryCard = ({ data }) => {
  const [viewMode, setViewMode] = useState('test'); // 'test' or 'revenue'
 
  const testChartData = [
    { name: 'Completed', value: data?.completedTests || 0 },
    { name: 'Pending', value: data?.pendingTests || 0 },
    { name: 'Urgent', value: data?.urgentTests || 0 },
  ].filter(item => item.value > 0);

  const revenueChartData = [
    { name: 'Completed Revenue', value: data?.paidRevenue || 0 },
    { name: 'Pending Revenue', value: data?.pendingRevenue || 0 },
    { name: 'Refunded Revenue', value: data?.refundedRevenue || 0 },
  ].filter(item => item.value > 0);

  const COLORS = ['#009689', '#4db6ac', '#b2dfdb'];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          {viewMode === 'test' ? 'Test Summary' : 'Revenue Summary'}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('test')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              viewMode === 'test'
                ? 'bg-[#009689] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Test View
          </button>
          <button
            onClick={() => setViewMode('revenue')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              viewMode === 'revenue'
                ? 'bg-[#009689] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Revenue View
          </button>
        </div>
      </div>

      {viewMode === 'test' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card title="Total Tests" value={data?.totalTests || 0} />
            <Card title="Completed" value={data?.completedTests || 0} />
            <Card title="Pending" value={data?.pendingTests || 0} />
            <Card title="Urgent" value={data?.urgentTests || 0} />
          </div>
          <div className="h-64">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Test Distribution</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={testChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#009689"
                  label
                >
                  {testChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card title="Total Revenue" value={data?.totalRevenue || 0} />
            <Card title="Pending Revenue" value={data?.pendingRevenue || 0} />
            <Card title="Completed Revenue" value={data?.paidRevenue || 0} />
            <Card title="Refunded Revenue" value={data?.refundedRevenue || 0} />
          </div>
          <div className="h-64">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Revenue Distribution</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#009689"
                  label
                >
                  {revenueChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default TestSummaryCard;