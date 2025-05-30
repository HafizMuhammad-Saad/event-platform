import React, { use } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
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

import {useEventStore} from '../stores/useEventStore';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import { set } from 'date-fns';
import { fi } from 'date-fns/locale';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ManageUsers = () => {
  const [listUsers, setListUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


     useEffect(() => {
    fetchUsers();
  }
  , []);
  // const { user } = useAuth(); // Get the current user

   const fetchUsers = async () => {
     try {
  setLoading(true);
   // list of all users
  const { data: users, error: usersError} = await supabase
    .from('profiles2')
    .select('*')
    .neq('role', 'admin') // Filter by role if needed
    .order('created_at', { ascending: false });

    // if (!usersError && users) {
    //   console.log('Fetched users:', users);
    //   setListUsers(users);
      
    // }
  // Sample data for charts

 
//     // .order('created_at', { ascending: false });
  if (usersError) {
    console.error('Error fetching users:', usersError);
    return <div>Error loading users</div>;
  }
  if (!users) {
    return <div>Loading users...</div>;
  }
  if (users.length === 0) {
    return <div>No users found.</div>;
  }
  if (users.length > 0) {
  console.log('Fetched users:', users);
  setListUsers(users);
  }

} catch (error) {
    console.error('Error fetching user data:', error);
    setError('Failed to load user data');
  
} finally {
  setLoading(false);
}

  }
  const { events, fetchEvents } = useEventStore();
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Pie chart: Event categories from your actual events data
const categoryCounts = events.reduce((acc, event) => {
  const cat = event.category || 'Other';
  acc[cat] = (acc[cat] || 0) + 1;
  return acc;
}, {});
const categoryLabels = Object.keys(categoryCounts);
const categoryValues = Object.values(categoryCounts);
const categoryColors = [
  'rgba(255, 99, 132, 0.7)',
  'rgba(54, 162, 235, 0.7)',
  'rgba(255, 206, 86, 0.7)',
  'rgba(75, 192, 192, 0.7)',
  'rgba(153, 102, 255, 0.7)',
  'rgba(255, 159, 64, 0.7)',
  'rgba(100, 100, 255, 0.7)'
];
const categoryData = {
  labels: categoryLabels,
  datasets: [
    {
      data: categoryValues,
      backgroundColor: categoryColors.slice(0, categoryLabels.length),
      borderColor: categoryColors.slice(0, categoryLabels.length).map(c => c.replace('0.7', '1')),
      borderWidth: 1,
    },
  ],
};

// Bar chart: Events created and attended per month from your events data
const monthlyData = events.reduce((acc, event) => {
  if (!event.date_time) return acc;
  const date = new Date(event.date_time);
  const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
  if (!acc[month]) {
    acc[month] = { created: 0, attended: 0 };
  }
  acc[month].created++;
  if (event.status === 'approved') {
    acc[month].attended++;
  }
  return acc;
}, {});
const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
const eventsData = {
  labels: sortedMonths,
  datasets: [
    {
      label: 'Events Created',
      data: sortedMonths.map(m => monthlyData[m].created),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
    {
      label: 'Events Attended',
      data: sortedMonths.map(m => monthlyData[m].attended),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};
  

// User stats from real user data
const totalUsers = listUsers.length;
const adminUsers = listUsers.filter(u => u.role === 'admin').length;
const today = new Date().toISOString().slice(0, 10);
const activeToday = listUsers.filter(u => u.last_login && u.last_login.slice(0, 10) === today).length;
const newRegistrations = listUsers.filter(u => u.created_at && u.created_at.slice(0, 10) === today).length;

const userStats = [
  { title: 'Total Users', value: totalUsers, change: '', trend: 'neutral' },
  { title: 'Active Today', value: activeToday, change: '', trend: 'neutral' },
  { title: 'New Registrations', value: newRegistrations, change: '', trend: 'neutral' },
  { title: 'Admin Users', value: adminUsers, change: '', trend: 'neutral' },
];

    if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <button className="btn btn-primary">Generate Report</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userStats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <div className="flex justify-between items-end mt-2">
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <div
                  className={`flex items-center ${
                    stat.trend === 'up'
                      ? 'text-green-500'
                      : stat.trend === 'down'
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      ></path>
                    </svg>
                  ) : stat.trend === 'down' ? (
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      ></path>
                    </svg>
                  ) : null}
                  <span className="text-sm">{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Event Activity
              </h2>
              <select className="select select-bordered select-sm">
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="h-80">
              <Bar
                data={eventsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Event Categories
            </h2>
            <div className="h-80">
              <Pie
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Email</th>
                  <th>User ID</th>
                  <th>Last Name</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {listUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10">
                            <img
                              src={user.avatar_url || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'}
                              alt="Avatar"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.first_name}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.id}</td>
                    <td>{user.last_name}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === 'user'
                            ? 'badge-success'
                            : 'badge-error'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;