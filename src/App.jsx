import React, { useEffect, useState, useContext } from 'react';
import { Toaster } from 'react-hot-toast';

import { Navigate } from 'react-router-dom';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Layout from './pages/Layout';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerView from './pages/CustomerView';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { CreateEvent } from './pages/CreateEvent';
import  EventDetail  from './pages/EventDetail';
import EventsAdmin from './pages/EventsAdmin';
import ManageUsers from './pages/ManageUsers';
import ParticipantsList from './participants/ParticipantsList';

import { useAuth } from './hooks/useAuth';
import {AuthProvider, AuthContext} from './context/store';

function App() {
  // const [admin, setIsAdmin] = useState(true);
  // const [user, setUser] = useState(true);
  // const {user, admin} = useContext(AuthContext);

  const { user, isAdmin, loading } = useAuth();
  // console.log(user);
  
  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  if (loading) {
 return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
}
  return (
    <AuthProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    <Routes>
    {!user ? (
      <>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />

      </>
    ) : (
      <>
      <Route element={<Layout isAdmin={isAdmin} />}>
      {isAdmin ? (
        <>
        <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/customer/:id" element={<CustomerView />} />
            <Route path="*" element={<Navigate to="/admin" />} />
            <Route path="/events-admin" element={<EventsAdmin />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/events/:eventId/add-participants" element={<ParticipantsList />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <>
            <Route path="/" element={<CustomerDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/events" element={<Events />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/events/:eventId/add-participants" element={<ParticipantsList />} />



            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
    </Route>
    </>
    )}
  </Routes>
    </AuthProvider>
  );
}

export default App;
