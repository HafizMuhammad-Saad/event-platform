import { act, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabase'; // Adjust path as needed
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth'; // Assuming you have a useAuth hook for authentication
import { useEvents } from '../hooks/useEvent'; // Assuming you have a custom hook for fetching events
import { useEventStore } from '../stores/useEventStore';

// import { useParticipantStore } from '../stores/useParticipantStore'; // Assuming you have a store for participants
// import  ParticipantsList  from '../participants/ParticipantsList'; // Assuming you have a ParticipantsList component

const EventDetail = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading2, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {  updateEventStatus } = useEvents(); // Assuming you have a custom hook for event actions
  const {updateEvent, loading} = useEventStore(); // Assuming you have a store for event actions
  const { user, isAdmin } = useAuth(); // Assuming useAuth provides user and isAdmin   
  useEffect(() => {
    // console.log({ eventId, user, isAdmin });

    if (!eventId || (!user && !isAdmin)) return;
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (error) throw error;

        // Optional: restrict access for non-admins
        // if (!isAdmin && data.created_by !== user.id) {
        //   throw new Error("Unauthorized to view this event.");
        // }

        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [user, isAdmin, eventId, ]);

  const handleAction = async (action, eventId) => {
  const toastId = toast.loading(`${action === 'approve' ? 'Approving' : 'Rejecting'} event...`);
  setLoading(true);
  try {
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    await updateEvent(eventId, { status: newStatus });

    // Fetch updated event from DB and set local state
    const { data: updatedEvent, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) throw new Error(error.message);

    setEvent(updatedEvent);
    toast.success(`Event ${newStatus}`, { id: toastId });
  } catch (err) {
    toast.error('Action failed', { id: toastId });
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  if (loading2) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-2xl mx-auto my-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error loading event: {error}</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="alert alert-warning max-w-2xl mx-auto my-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Event not found</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost mb-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Events
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Event Image */}
        <div className="relative h-64 md:h-80 lg:h-96">
          <img
            src={event.image_url || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="badge badge-primary mb-2 capitalize">
                  {event.category || 'Event'}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
              </div>
              <span className={`badge ${event.status === 'approved' ? 'badge-success' : 'badge-error'} text-white`}>
                {event.status}
              </span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="whitespace-pre-line">{event.description}</p>
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam provident ducimus libero possimus eius dolores neque exercitationem! Ullam eius illum ad distinctio aspernatur ut. Dolore rerum laboriosam provident, suscipit esse eligendi nulla explicabo consectetur id fugit earum dolorem voluptate nemo est corrupti vel vero at ipsum vitae, reiciendis quae! Doloribus maxime minima earum dicta hic, iure accusamus ipsum! Dolorem quidem, qui tenetur quibusdam non quos, optio possimus incidunt rem voluptatibus commodi quam velit nihil recusandae et cumque consectetur ipsam id explicabo? Pariatur quisquam eaque dolorum aspernatur repellat quaerat, eos delectus possimus cum mollitia quia rerum ullam voluptatibus voluptas! Ex voluptas, iure dolor impedit dicta explicabo unde suscipit maxime commodi nemo voluptate possimus totam aperiam non debitis perferendis inventore blanditiis reprehenderit natus vitae minus sint reiciendis. Aperiam exercitationem temporibus accusamus sit hic? Incidunt illo maiores quo saepe a, perspiciatis quibusdam facilis laudantium unde iste sunt ipsam sed sapiente labore perferendis officiis beatae aperiam harum sit esse cumque dicta praesentium, similique illum? Amet corrupti, quas explicabo voluptatibus eligendi atque ducimus quam. Deleniti veritatis numquam cumque nemo magnam, perferendis incidunt ducimus repudiandae? Voluptates reprehenderit, eum consequatur iste dignissimos ab vitae voluptatem? Maxime voluptatem cum quidem explicabo. Culpa minima quaerat error sit, qui cumque!</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Date & Time */}
            <div className="card bg-base-100 dark:bg-gray-700 shadow-sm">
              <div className="card-body p-4">
                <h3 className="card-title flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Date & Time
                </h3>
                <p className="text-lg font-medium">
                  {format(new Date(event.date_time), 'MMMM d, yyyy')}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {format(new Date(event.date_time), 'h:mm a')}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="card bg-base-100 dark:bg-gray-700 shadow-sm">
              <div className="card-body p-4">
                <h3 className="card-title flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </h3>
                <p className="text-lg font-medium">{event.location || 'To be announced'}</p>
                {event.location && (
                  <button className="btn btn-sm btn-outline mt-2">
                    View on Map
                  </button>
                )}
              </div>
            </div>

            {
              event.status === 'approved' && (
                // add participants button 
                <div className="card bg-base-100 dark:bg-gray-700 shadow-sm">
                
              {/* <button className="btn btn-primary mt-4" onClick={() => navigate(<ParticipantsList />)}> */}
              <button className="btn btn-primary mt-4" onClick={() => navigate(`/events/${event.id}/add-participants`)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9a1 1 0 11-2 0V7a1 1 0 012 0v2zm-1 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
                </svg>
                Add Participants
              </button>
              </div>

              )
            }

            {/* Organizer */}
            <div className="card bg-base-100 dark:bg-gray-700 shadow-sm">
              <div className="card-body p-4">
                <h3 className="card-title flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Organizer
                </h3>
                <p className="text-lg font-medium">Event Organizer</p>
                <button className="btn btn-sm btn-outline mt-2">
                  Contact Organizer
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {isAdmin && (
                <>
                 <button  data-testid="approve-button"
  className="btn btn-success"
  onClick={() => handleAction('approve', event.id)}
  disabled={loading2 || event.status === 'approved'}
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9a1 1 0 11-2 0V7a1 1 0 012 0v2zm-1 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
  </svg>
  Approve
</button>

<button
  className="btn btn-error"
  onClick={() => handleAction('reject', event.id)}
  disabled={loading2 || event.status === 'rejected'}
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9a1 1 0 11-2 0V7a1 1 0 012 0v2zm-1 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
  </svg>
  Reject
</button>
              {/* <button className="btn btn-ghost">
                Share Event
              </button> */}
                </>
              )

              }
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;