import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TestTypeOverview = ({ testHistory }) => {
  // Process test data to get statistics by test type
const processTestData = () => {
  if (!Array.isArray(testHistory)) return [];

  const testTypeMap = {};

  testHistory.forEach(test => {
    test.selectedTests.forEach(t => {
      const type = t.testDetails.testName;
      if (!testTypeMap[type]) {
        testTypeMap[type] = { completed: 0, pending: 0 };
      }

      if (t.testDetails.reportStatus === 'completed') {
        testTypeMap[type].completed++;
      } else {
        testTypeMap[type].pending++;
      }
    });
  });

  return Object.entries(testTypeMap).map(([type, counts]) => ({
    type,
    ...counts,
    total: counts.completed + counts.pending
  })).sort((a, b) => b.total - a.total);
};


  const testData = processTestData();
  
  // Prepare data for chart
  const chartData = testData.map(item => ({
    name: item.type.length > 10 ? `${item.type.substring(0, 8)}...` : item.type,
    completed: item.completed,
    pending: item.pending
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Test Types Overview</h3>
        <div className="flex gap-2">
          <span className="flex items-center text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-[#009689] mr-1"></span>
            Completed
          </span>
          <span className="flex items-center text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-[#4db6ac] mr-1"></span>
            Pending
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {testData.map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#009689]"></div>
                <span className="font-medium text-gray-700">{item.type}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#009689] font-medium">{item.completed}</span>
                <span className="text-[#4db6ac] font-medium">{item.pending}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#009689" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#4db6ac" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default TestTypeOverview;