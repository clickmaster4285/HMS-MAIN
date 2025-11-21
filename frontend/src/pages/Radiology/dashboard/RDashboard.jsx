import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Calendar, Clock, Users, FileImage, AlertTriangle, CheckCircle, TrendingUp, Download, Search } from 'lucide-react';

const RDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedModality, setSelectedModality] = useState('all');

  // Sample data for different charts
  const dailyScans = [
    { time: '06:00', CT: 12, MRI: 8, XRay: 25, Ultrasound: 15 },
    { time: '08:00', CT: 18, MRI: 12, XRay: 32, Ultrasound: 22 },
    { time: '10:00', CT: 24, MRI: 16, XRay: 28, Ultrasound: 18 },
    { time: '12:00', CT: 20, MRI: 14, XRay: 35, Ultrasound: 25 },
    { time: '14:00', CT: 22, MRI: 18, XRay: 30, Ultrasound: 20 },
    { time: '16:00', CT: 16, MRI: 10, XRay: 26, Ultrasound: 16 },
    { time: '18:00', CT: 8, MRI: 6, XRay: 15, Ultrasound: 12 }
  ];

  const modalityDistribution = [
    { name: 'X-Ray', value: 45, color: '#3B82F6' },
    { name: 'CT Scan', value: 25, color: '#10B981' },
    { name: 'MRI', value: 18, color: '#F59E0B' },
    { name: 'Ultrasound', value: 12, color: '#EF4444' }
  ];

  const weeklyTrends = [
    { day: 'Mon', scans: 142, reports: 138, pending: 4 },
    { day: 'Tue', scans: 156, reports: 149, pending: 7 },
    { day: 'Wed', scans: 134, reports: 130, pending: 4 },
    { day: 'Thu', scans: 168, reports: 162, pending: 6 },
    { day: 'Fri', scans: 172, reports: 165, pending: 7 },
    { day: 'Sat', scans: 95, reports: 92, pending: 3 },
    { day: 'Sun', scans: 78, reports: 76, pending: 2 }
  ];

  const urgentCases = [
    { id: 'RAD001', patient: 'Smith, John', study: 'CT Head', priority: 'STAT', time: '14:32', status: 'pending' },
    { id: 'RAD002', patient: 'Johnson, Mary', study: 'Chest X-Ray', priority: 'Urgent', time: '14:28', status: 'reviewed' },
    { id: 'RAD003', patient: 'Williams, David', study: 'MRI Spine', priority: 'STAT', time: '14:15', status: 'reporting' },
    { id: 'RAD004', patient: 'Brown, Sarah', study: 'CT Abdomen', priority: 'Urgent', time: '14:05', status: 'pending' }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-primary-50 border-primary-200 text-primary-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
      red: 'bg-red-50 border-red-200 text-red-600'
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </div>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <p className="text-gray-600 font-medium">{title}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Radiology Dashboard</h1>
              <p className="text-gray-600">Real-time monitoring and analytics for the radiology department</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            icon={FileImage} 
            title="Today's Scans" 
            value="247" 
            subtitle="12 pending review"
            trend="+8.3%"
            color="blue"
          />
          <StatCard 
            icon={Clock} 
            title="Avg. Report Time" 
            value="2.4h" 
            subtitle="Target: <3h"
            trend="-12%"
            color="green"
          />
          <StatCard 
            icon={Users} 
            title="Active Radiologists" 
            value="8" 
            subtitle="2 on call"
            color="yellow"
          />
          <StatCard 
            icon={AlertTriangle} 
            title="Urgent Cases" 
            value="4" 
            subtitle="Requiring immediate attention"
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Daily Scan Volume */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Daily Scan Volume</h2>
              <select 
                value={selectedModality}
                onChange={(e) => setSelectedModality(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Modalities</option>
                <option value="ct">CT Only</option>
                <option value="mri">MRI Only</option>
                <option value="xray">X-Ray Only</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyScans}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="CT" fill="#3B82F6" />
                <Bar dataKey="MRI" fill="#10B981" />
                <Bar dataKey="XRay" fill="#F59E0B" />
                <Bar dataKey="Ultrasound" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Modality Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Modality Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={modalityDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {modalityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="scans" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="reports" stroke="#10B981" strokeWidth={3} />
                <Line type="monotone" dataKey="pending" stroke="#EF4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Scans</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Reports</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
            </div>
          </div>

          {/* Urgent Cases */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Urgent Cases</h2>
              <button className="text-primary-600 hover:text-primary-700 flex items-center text-sm">
                <Search className="h-4 w-4 mr-1" />
                View All
              </button>
            </div>
            <div className="space-y-4">
              {urgentCases.map((case_) => (
                <div key={case_.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        case_.priority === 'STAT' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {case_.priority}
                      </span>
                      <span className="font-medium text-gray-900">{case_.patient}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{case_.study}</p>
                    <p className="text-xs text-gray-500">{case_.time}</p>
                  </div>
                  <div className="flex items-center">
                    {case_.status === 'reviewed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : case_.status === 'reporting' ? (
                      <Activity className="h-5 w-5 text-primary-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipment Status */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Equipment Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'CT Scanner 1', status: 'operational', utilization: 85 },
              { name: 'CT Scanner 2', status: 'operational', utilization: 72 },
              { name: 'MRI Machine 1', status: 'maintenance', utilization: 0 },
              { name: 'MRI Machine 2', status: 'operational', utilization: 93 },
              { name: 'X-Ray Room 1', status: 'operational', utilization: 67 },
              { name: 'X-Ray Room 2', status: 'operational', utilization: 78 },
              { name: 'Ultrasound 1', status: 'operational', utilization: 54 },
              { name: 'Ultrasound 2', status: 'operational', utilization: 61 }
            ].map((equipment) => (
              <div key={equipment.name} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{equipment.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    equipment.status === 'operational' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {equipment.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      equipment.utilization > 80 ? 'bg-red-500' : 
                      equipment.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${equipment.utilization}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{equipment.utilization}% utilization</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RDashboard;