import React,{useEffect} from 'react';
import { useEventStore } from '../stores/useEventStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { parseISO, format } from 'date-fns';

const COLORS = ['#10B981', '#EF4444', '#3B82F6'];

const AdminDashboard = () => {
  const { events, loading, fetchEvents } = useEventStore();

  // Pie chart: status distribution
  const statusCounts = events.reduce(
    (acc, event) => {
      if (event.status === 'approved') acc.approved++;
      else if (event.status === 'rejected') acc.rejected++;
      else acc.pending++;
      return acc;
    },
    { approved: 0, rejected: 0, pending: 0 }
  );
  const pieData = [
    { name: 'Approved', value: statusCounts.approved },
    { name: 'Rejected', value: statusCounts.rejected },
    { name: 'Pending', value: statusCounts.pending },
  ];

  // Bar chart: events per month
  const monthMap = {};
  events.forEach(event => {
    if (event.date_time) {
      const date = typeof event.date_time === 'string' ? parseISO(event.date_time) : event.date_time;
      const month = format(date, 'MMM yyyy');
      monthMap[month] = (monthMap[month] || 0) + 1;
    }
  });
  const barData = Object.entries(monthMap).map(([name, events]) => ({ name, events }));
  barData.sort((a, b) => new Date(a.name) - new Date(b.name));

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Events Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Total Events</h2>
          <p className="text-3xl font-bold">{events.length}</p>
          <p className="text-sm text-gray-500">Events created</p>
        </div>
        {/* Approved Events Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Approved Events</h2>
          <p className="text-3xl font-bold">{events.filter(event => event.status === 'approved').length}</p>
          <p className="text-sm text-gray-500">Events approved</p>
        </div>
        {/* Rejected Events Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Rejected Events</h2>
          <p className="text-3xl font-bold">{events.filter(event => event.status === 'rejected').length}</p>
          <p className="text-sm text-gray-500">Events rejected</p>
        </div>
        {/* Pending Events Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Pending Events</h2>
          <p className="text-3xl font-bold">{events.filter(event => event.status === 'pending').length}</p>
          <p className="text-sm text-gray-500">Events pending approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Monthly Events Created</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="events" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Event Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
