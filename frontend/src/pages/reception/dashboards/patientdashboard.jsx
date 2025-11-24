import React from 'react';

const patientdashboard = () => {
  const stats = [
    { title: "Total Patients", value: "1,284" },
    { title: "New Patients", value: "42" },
    { title: "Appointments", value: "28" },
    { title: "Pending Reports", value: "12" },
  ];

  const recentPatients = [
    { id: 1, name: "John Smith", age: 45, status: "Scheduled", date: "2025-04-24" },
    { id: 2, name: "Sarah Johnson", age: 32, status: "Completed", date: "2025-04-23" },
    { id: 3, name: "Mike Wilson", age: 58, status: "In Treatment", date: "2025-04-23" },
    { id: 4, name: "Emma Davis", age: 28, status: "Scheduled", date: "2025-04-25" },
  ];

  const upcomingAppointments = [
    { time: "09:00 AM", patient: "John Smith", type: "Follow-up" },
    { time: "10:30 AM", patient: "Emma Davis", type: "Consultation" },
    { time: "02:00 PM", patient: "Robert Brown", type: "Check-up" },
    { time: "03:30 PM", patient: "Lisa Anderson", type: "Review" },
  ];

  const activities = [
    { time: "1h ago", description: "Patient report updated - John Smith" },
    { time: "2h ago", description: "New appointment scheduled - Emma Davis" },
    { time: "3h ago", description: "Lab results received - Mike Wilson" },
    { time: "5h ago", description: "Prescription renewed - Sarah Johnson" },
  ];

  const healthStats = [
    { label: "Heart Rate", value: "76 bpm" },
    { label: "Blood Pressure", value: "120/80 mmHg" },
    { label: "Blood Glucose", value: "98 mg/dL" },
    { label: "Oxygen Saturation", value: "97%" },
    { label: "Temperature", value: "98.6°F" },
    { label: "Weight", value: "72 kg" },
    { label: "Height", value: "175 cm" },
    { label: "BMI", value: "23.5" },
    { label: "Allergy", value: "Penicillin" },
    { label: "Risk Level", value: "Low", color: "bg-green-100 text-green-800" },
    { label: "Last Checkup", value: "22 April 2025" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Patient Dashboard</h1>
        <p className="text-gray-600">Welcome back, Dr. Anderson</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
            <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Patients Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Patients</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-700 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map((patient) => (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{patient.name}</td>
                      <td className="px-4 py-3">{patient.age}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          patient.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          patient.status === 'In Treatment' ? 'bg-primary-100 text-primary-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{patient.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* White Health Stats Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Patient Health Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {healthStats.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition ${
                    item.color || ''
                  }`}
                >
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-lg font-semibold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Appointments</h2>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-gray-800">{appointment.patient}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                  <span className="text-sm font-medium text-primary-600">{appointment.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex gap-3 text-sm">
                  <span className="text-gray-500 whitespace-nowrap">{activity.time}</span>
                  <p className="text-gray-700">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default patientdashboard;
