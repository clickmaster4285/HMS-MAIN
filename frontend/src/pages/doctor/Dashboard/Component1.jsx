import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  Calendar, 
  Heart, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Pill,
  Thermometer,
  Weight,
  Eye,
  MoreVertical,
  Search,
  Bell,
  Settings
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DoctorDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState('patients');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sample data
  const patientStats = [
    { month: 'Jan', patients: 245, revenue: 48500 },
    { month: 'Feb', patients: 289, revenue: 52300 },
    { month: 'Mar', patients: 321, revenue: 59800 },
    { month: 'Apr', patients: 298, revenue: 55600 },
    { month: 'May', patients: 356, revenue: 67200 },
    { month: 'Jun', patients: 389, revenue: 73800 }
  ];

  const vitalTrends = [
    { time: '6:00', heartRate: 72, bloodPressure: 120, temperature: 98.6 },
    { time: '9:00', heartRate: 78, bloodPressure: 118, temperature: 98.4 },
    { time: '12:00', heartRate: 82, bloodPressure: 122, temperature: 98.8 },
    { time: '15:00', heartRate: 76, bloodPressure: 119, temperature: 98.5 },
    { time: '18:00', heartRate: 74, bloodPressure: 121, temperature: 98.7 }
  ];

  const diagnosisData = [
    { name: 'Hypertension', value: 32, color: '#3b82f6' },
    { name: 'Diabetes', value: 28, color: '#ef4444' },
    { name: 'Respiratory', value: 20, color: '#10b981' },
    { name: 'Cardiac', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#8b5cf6' }
  ];

  const recentPatients = [
    { id: 1, name: 'Sarah Johnson', age: 34, condition: 'Hypertension', status: 'stable', lastVisit: '2 hours ago', vitals: { hr: 78, bp: '128/82', temp: '98.4°F' } },
    { id: 2, name: 'Michael Chen', age: 45, condition: 'Diabetes Type 2', status: 'monitoring', lastVisit: '4 hours ago', vitals: { hr: 72, bp: '115/75', temp: '98.2°F' } },
    { id: 3, name: 'Emma Davis', age: 28, condition: 'Asthma', status: 'improved', lastVisit: '1 day ago', vitals: { hr: 80, bp: '110/70', temp: '98.6°F' } },
    { id: 4, name: 'Robert Wilson', age: 52, condition: 'Cardiac Arrhythmia', status: 'critical', lastVisit: '30 min ago', vitals: { hr: 95, bp: '140/90', temp: '99.1°F' } }
  ];

  const upcomingAppointments = [
    { time: '10:30 AM', patient: 'Alice Brown', type: 'Follow-up', duration: '30 min' },
    { time: '11:15 AM', patient: 'David Lee', type: 'Consultation', duration: '45 min' },
    { time: '2:00 PM', patient: 'Linda Martinez', type: 'Check-up', duration: '30 min' },
    { time: '3:30 PM', patient: 'James Taylor', type: 'Emergency', duration: '60 min' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'stable': return 'text-green-600 bg-green-100';
      case 'monitoring': return 'text-yellow-600 bg-yellow-100';
      case 'improved': return 'text-primary-600 bg-primary-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-primary-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-5">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-linear-to-r from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Al-Shahbaz Hospital Dashboard
                </h1>
                <p className="text-sm text-gray-500">Welcome back, Dr. Anderson</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {currentTime.toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Patients', value: '1,847', change: '+12%', icon: Users, color: 'from-primary-500 to-primary-600' },
            { title: 'Appointments Today', value: '24', change: '+3', icon: Calendar, color: 'from-green-500 to-green-600' },
            { title: 'Critical Cases', value: '8', change: '-2', icon: AlertCircle, color: 'from-red-500 to-red-600' },
            { title: 'Recovery Rate', value: '94.2%', change: '+1.2%', icon: TrendingUp, color: 'from-purple-500 to-purple-600' }
          ].map((stat, index) => (
            <div key={index} className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'text-green-600 bg-green-100' : stat.change.startsWith('-') ? 'text-red-600 bg-red-100' : 'text-primary-600 bg-primary-100'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Patient Analytics */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Patient Analytics</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setSelectedMetric('patients')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedMetric === 'patients' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Patients
                  </button>
                  <button 
                    onClick={() => setSelectedMetric('revenue')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedMetric === 'revenue' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Revenue
                  </button>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={patientStats}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey={selectedMetric} 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fill="url(#colorGradient)" 
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Diagnosis Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Common Diagnoses</h3>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diagnosisData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1000}
                    >
                      {diagnosisData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {diagnosisData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vital Signs Monitoring */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg mb-8">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Real-time Vital Signs</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    name="Heart Rate"
                    animationDuration={1500}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bloodPressure" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    name="Blood Pressure"
                    animationDuration={1500}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    name="Temperature"
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Patients */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Patients</h3>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="group hover:bg-gray-50 rounded-xl p-4 transition-all duration-200 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-linear-to-r from-primary-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{patient.name}</h4>
                          <p className="text-sm text-gray-500">Age {patient.age} • {patient.lastVisit}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{patient.condition}</span>
                      <div className="flex space-x-4 text-xs text-gray-500">
                        <span>HR: {patient.vitals.hr}</span>
                        <span>BP: {patient.vitals.bp}</span>
                        <span>Temp: {patient.vitals.temp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Today's Schedule</h3>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
                    <div className="shrink-0">
                      <div className="w-12 h-12 bg-linear-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{appointment.patient}</h4>
                        <span className="text-sm font-medium text-primary-600">{appointment.time}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">{appointment.type}</span>
                        <span className="text-xs text-gray-500">{appointment.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;