import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvent';
import { UserCircle2 } from 'lucide-react';
import { useEventStore } from '../stores/useEventStore';
import { useNavigate } from 'react-router-dom';
// import { useParams } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user, isAdmin, profile } = useAuth();
  // const { events, fetchEvents } = useEvents();
  const { events, fetchEvents } = useEventStore();
  const navigate = useNavigate();
  // const { eventId } = useParams();

    // useEffect(() => {
    // // Fetch events when the component mounts
    // const fetchData = async () => {
    //   await fetchEvents();
    // };  
    // fetchData();
    // }, [fetchEvents]);

    // console.log(events, 'events length');
     useEffect(() => {
            if (!user) return;
            fetchEvents(isAdmin ? null : user.id);
        }, [user, isAdmin]);
    
 
  

  return (
    <div className="min-h-screen bg-base-200 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Card */}
        <div className="bg-base-100 shadow-xl rounded-xl p-6 flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <UserCircle2 className="w-full h-full text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {profile?.first_name || 'Customer'} 👋</h2>
            <p className="text-sm text-gray-500">Here’s a quick overview of your dashboard</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="stat-title">Total Events</div>
            <div className="stat-value text-primary">{events?.length}</div>
            <div className="stat-desc">2 upcoming this week</div>
          </div>

          <div className="stat bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="stat-title">Attended</div>
            <div className="stat-value text-secondary">7</div>
            <div className="stat-desc">75% attendance</div>
          </div>

          <div className="stat bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="stat-title">Feedback Given</div>
            <div className="stat-value text-accent">5</div>
            <div className="stat-desc">You’re helping us improve</div>
          </div>

          <div className="stat bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="stat-title">Your Rating</div>
            <div className="stat-value">⭐ 4.8</div>
            <div className="stat-desc">Based on your reviews</div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-base-100 rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Your Recent Events</h3>
            <button className="btn btn-sm btn-outline btn-primary" onClick={()=> navigate('/events')}>View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Example Row - You can map your actual event data here */}
                {
                  events?.map(event => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{new Date(event.date_time).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${event.status === 'approved' ? 'badge-success' : event.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-xs btn-outline btn-info" onClick={() => navigate(`/events/${event.id}`)}>View</button>
                      </td>
                    </tr>
                  ))
                }
                {/* <tr>
                  <td>React Conf</td>
                  <td>2025-06-10</td>
                  <td><span className="badge badge-success">Upcoming</span></td>
                  <td>
                    <button className="btn btn-xs btn-outline btn-info">View</button>
                  </td>
                </tr>
                <tr>
                  <td>UX Workshop</td>
                  <td>2025-05-15</td>
                  <td><span className="badge badge-ghost">Past</span></td>
                  <td>
                    <button className="btn btn-xs btn-outline btn-info">View</button>
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;
