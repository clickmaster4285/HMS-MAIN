import { 
  BarChart2, 
  Users, 
  Calendar, 
  Bed, 
  ArrowRight,
  PieChart,
  Activity,
  TrendingUp,
  TrendingDown,
  User,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';

const AdminDashboard = () => {


  // Data for the statistics
  const stats = [
    { title: "Total Invoice", value: "1,287", change: "+2.14%", changeType: "increase", icon: BarChart2, more: "56 more than yesterday" },
    { title: "Total Patients", value: "965", change: "+3.78%", changeType: "increase", icon: Users, more: "45 more than yesterday" },
    { title: "Appointments", value: "128", change: "-1.56%", changeType: "decrease", icon: Calendar, more: "18 less than yesterday" },
    { title: "Bedroom", value: "315", change: "+1.64%", changeType: "increase", icon: Bed, more: "56 more than yesterday" },
  ];

  // Data for the doctors schedule
  const doctors = [
    { name: "Dr. Petra Winsbury", specialty: "General Medicine", status: "Available", time: "09:00 AM - 12:00 PM" },
    { name: "Dr. Ameena Karim", specialty: "Orthopedics", status: "Unavailable", time: "" },
    { name: "Dr. Olivia Martinez", specialty: "Cardiology", status: "Available", time: "10:00 AM - 01:00 PM" },
    { name: "Dr. Damian Sanchez", specialty: "Pediatrics", status: "Available", time: "11:00 AM - 02:00 PM" },
    { name: "Dr. Chloe Harrington", specialty: "Dermatology", status: "Unavailable", time: "" },
  ];

  // Data for reports
  const reports = [
    { title: "Room Cleaning Needed", time: "1 minute ago" },
    { title: "Equipment Maintenance", time: "3 minutes ago" },
    { title: "Medication Restock", time: "5 minutes ago" },
    { title: "HVAC System Issue", time: "1 hour ago" },
    { title: "Patient Transport Required", time: "Yesterday" },
  ];


  // Department data for pie chart
  const departments = [
    { name: "Emergency Medicine", percentage: "35%" },
    { name: "General Medicine", percentage: "28%" },
    { name: "Internal Medicine", percentage: "20%" },
    { name: "Other Departments", percentage: "17%" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      {/* <header className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything"
            className="pl-10 pr-4 py-2 bg-gray-100 rounded-md w-64 focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 bg-gray-100 rounded-full">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-teal-500 rounded-full flex items-center justify-center text-white">
              AW
            </div>
            <span className="font-medium">Alfredo Westervelt</span>
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </header> */}

      <div className="px-6 py-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-500 mb-1">{stat.title}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
                <div className="text-xs font-medium px-2 py-1 rounded-full">
                  <stat.icon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </div>
                <div className="text-xs text-gray-500 ml-2">{stat.more}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Patient Overview */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-bold">Patient Overview</h2>
                <p className="text-xs text-gray-500">by Age Stages</p>
              </div>
              <div className="bg-primary-900 text-white text-xs px-3 py-1 rounded-md flex items-center">
                Last 8 Days <ChevronLeft className="h-3 w-3 ml-1" />
              </div>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-primary-900 rounded-full mr-2"></div>
                <span className="text-sm">Child</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-teal-400 rounded-full mr-2"></div>
                <span className="text-sm">Adult</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-gray-300 rounded-full mr-2"></div>
                <span className="text-sm">Elderly</span>
              </div>
            </div>

            <div className="flex items-end space-x-2 mt-6">
              <div className="flex flex-col items-center">
                <div className="text-xs mb-1">Child</div>
                <div className="text-sm font-bold">105</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs mb-1">Adult</div>
                <div className="text-sm font-bold">132</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs mb-1">Elderly</div>
                <div className="text-sm font-bold">38</div>
              </div>
            </div>

            <div className="h-40 flex items-end space-x-8 mt-4">
              {[4, 5, 6, 7, 8, 9, 10, 11].map((day, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div className="flex flex-col space-y-1 w-full items-center">
                    <div className="h-13 w-2 bg-teal-400 rounded-full"></div>
                    <div className="h-18 w-2 bg-primary-900 rounded-full"></div>
                  </div>
                  <div className="text-xs mt-2">{day} Jul</div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Revenue</h2>
              <div className="flex space-x-2">
                <button className="bg-primary-900 text-white text-xs px-3 py-1 rounded-md">Week</button>
                <button className="text-gray-500 text-xs px-3 py-1 rounded-md">Month</button>
                <button className="text-gray-500 text-xs px-3 py-1 rounded-md">Year</button>
              </div>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-primary-900 rounded-full mr-2"></div>
                <span className="text-sm">Income</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-teal-400 rounded-full mr-2"></div>
                <span className="text-sm">Expense</span>
              </div>
            </div>

            <div className="relative h-56">
              <div className="absolute top-6 right-4 bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-medium">
                $1,495
              </div>
              
              {/* Simplified chart visualization */}
              <div className="h-full flex items-end">
                <div className="flex items-end space-x-12 w-full mt-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div className="relative w-full">
                        {/* Income line (blue) */}
                        <div className={`absolute bottom-0 left-0 right-0 h-[${30 + Math.sin(i) * 20}px] border-b-2 border-primary-600`}></div>
                        {/* Expense line (teal) */}
                        <div className={`absolute bottom-0 left-0 right-0 h-[${20 + Math.cos(i) * 15}px] border-b-2 border-teal-400`}></div>
                      </div>
                      <div className="text-xs mt-2">{day}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between">
                <span className="text-xs text-gray-500">1.6k</span>
                <span className="text-xs text-gray-500">1.2k</span>
                <span className="text-xs text-gray-500">800</span>
                <span className="text-xs text-gray-500">400</span>
                <span className="text-xs text-gray-500">0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Patient Overview by Department */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-bold">Patient Overview</h2>
                <p className="text-xs text-gray-500">by Departments</p>
              </div>
              <div className="text-gray-400 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
              </div>
            </div>

            <div className="flex justify-center my-4">
              <div className="relative w-32 h-32">
                {/* Donut chart simulation */}
                <div className="absolute inset-0 rounded-full border-8 border-transparent" 
                     style={{
                       background: 'conic-gradient(#1e3a8a 0% 35%, #2dd4bf 35% 63%, #a5f3fc 63% 83%, #e5e7eb 83% 100%)',
                       borderRadius: '100%'
                     }}>
                </div>
                <div className="absolute inset-0 rounded-full bg-white m-2 flex items-center justify-center flex-col">
                  <div className="text-xl font-bold">1,890</div>
                  <div className="text-xs text-gray-500">This Week</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {departments.map((dept, index) => (
                <div key={index} className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${
                    index === 0 ? 'bg-primary-900' : 
                    index === 1 ? 'bg-teal-400' : 
                    index === 2 ? 'bg-cyan-200' : 'bg-gray-300'
                  }`}></div>
                  <span className="text-sm grow">{dept.name}</span>
                  <span className="text-sm font-medium">{dept.percentage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Doctors' Schedule */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Doctors' Schedule</h2>
              <div className="text-gray-400 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
              </div>
            </div>

            <div className="space-y-4">
              {doctors.map((doctor, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-8 w-8 bg-teal-100 rounded-full mr-3 flex items-center justify-center text-teal-600">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="grow">
                    <div className="font-medium text-sm">{doctor.name}</div>
                    <div className="text-xs text-gray-500">{doctor.specialty}</div>
                  </div>
                  <div className={`text-xs px-3 py-1 rounded-full ${
                    doctor.status === 'Available' 
                      ? 'bg-teal-100 text-teal-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.status}
                  </div>
                  {doctor.time && (
                    <div className="text-xs text-gray-500 ml-2">{doctor.time}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Report */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Report</h2>
              <div className="text-gray-400 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
              </div>
            </div>

            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-8 w-8 bg-teal-100 rounded-full mr-3 flex items-center justify-center text-teal-600">
                    {index === 0 && <Users className="h-4 w-4" />}
                    {index === 1 && <Activity className="h-4 w-4" />}
                    {index === 2 && <PieChart className="h-4 w-4" />}
                    {index === 3 && <Users className="h-4 w-4" />}
                    {index === 4 && <Users className="h-4 w-4" />}
                  </div>
                  <div className="grow">
                    <div className="font-medium text-sm">{report.title}</div>
                    <div className="text-xs text-gray-500">{report.time}</div>
                  </div>
                  <div className="text-gray-400">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}

    </div>
  );
};

export default AdminDashboard;