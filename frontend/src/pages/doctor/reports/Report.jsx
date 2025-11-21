import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Report = () => {
  const [activeTab, setActiveTab] = useState('monthly');

  // Sample data
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Patients Treated',
        data: [45, 59, 72, 81, 56, 89],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const categoryData = {
    labels: ['Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics', 'Dermatology'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Medical Reports Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('monthly')}
          className={`py-2 px-4 font-medium ${activeTab === 'monthly' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
        >
          Monthly Statistics
        </button>
        <button
          onClick={() => setActiveTab('category')}
          className={`py-2 px-4 font-medium ${activeTab === 'category' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
        >
          By Category
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`py-2 px-4 font-medium ${activeTab === 'recent' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
        >
          Recent Activity
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'monthly' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Monthly Patient Statistics</h2>
            <div className="h-80">
              <Bar
                data={monthlyData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'category' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Cases by Medical Category</h2>
            <div className="h-80 flex">
              <div className="w-1/2">
                <Pie
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
              <div className="w-1/2 pl-6">
                <ul className="space-y-3">
                  {categoryData.labels.map((label, index) => (
                    <li key={index} className="flex items-center">
                      <span
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: categoryData.datasets[0].backgroundColor[index] }}
                      ></span>
                      <span className="font-medium">{label}:</span>
                      <span className="ml-2">{categoryData.datasets[0].data[index]} cases</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'recent' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Recent Medical Reports</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">Patient {item}</td>
                      <td className="px-6 py-4 whitespace-nowrap">2023-06-{10 + item}</td>
                      <td className="px-6 py-4">Sample diagnosis {item}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {item % 2 === 0 ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {[
          { title: 'Total Patients', value: '1,248', change: '+12%', trend: 'up' },
          { title: 'New Cases', value: '86', change: '+5%', trend: 'up' },
          { title: 'Completed Treatments', value: '1,102', change: '+8%', trend: 'up' },
          { title: 'Pending Reports', value: '24', change: '-3%', trend: 'down' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <div className={`flex items-center mt-2 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.trend === 'up' ? (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Report;