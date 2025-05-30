import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useEvents } from "../hooks/useEvent";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import EventsManagementTable from "./EventManagement";
import { useEventStore } from "../stores/useEventStore";

export const EventsList = ({ isAdmin = false }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { events, loading, error, fetchEvents } = useEvents();
    const {deleteEvent} = useEventStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortOption, setSortOption] = useState("newest");

    useEffect(() => {
        if (!user) return;
        fetchEvents(isAdmin ? null : user.id);
    }, [user, isAdmin]);

    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteEvent(eventId);
                toast.success("Event deleted successfully");
            } catch (error) {
                toast.error(`Error deleting event: ${error.message}`);
            }
        }
    };
    // Filter and sort events
    const filteredEvents = events
        .filter(event => 
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(event => 
            selectedCategory === "all" || event.category === selectedCategory
        )
        .sort((a, b) => {
            if (sortOption === "newest") {
                return new Date(b.date_time) - new Date(a.date_time);
            } else {
                return new Date(a.date_time) - new Date(b.date_time);
            }
        });

    if (loading) return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-lg font-medium">Loading events...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="alert alert-error max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Error loading events: {error}</span>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {
            !isAdmin ? (
                <>
                <div className="hero bg-gradient-to-r from-primary to-secondary rounded-2xl mb-12">
                <div className="hero-overlay bg-opacity-60 rounded-2xl"></div>
                <div className="hero-content text-center text-neutral-content py-16">
                    <div className="max-w-2xl">
                        <h1 className="mb-6 text-5xl font-bold">Discover Amazing Events</h1>
                        <p className="mb-8 text-xl">"Manage all events in your system" 
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="input input-bordered w-full pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-3 top-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                </div>

                {/* Category Filter */}
                <select 
                    className="select select-bordered w-full"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="concert">Concert</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="sports">Sports</option>
                    <option value="exhibition">Exhibition</option>
                </select>

                {/* Sort Options */}
                <select 
                    className="select select-bordered w-full"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {/* Stats Bar */}
            <div className="stats shadow mb-8 w-full">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Total Events</div>
                    <div className="stat-value text-primary">{events.length}</div>
                    <div className="stat-desc">In our system</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Upcoming</div>
                    <div className="stat-value text-secondary">
                        {events.filter(e => new Date(e.date_time) > new Date()).length}
                    </div>
                    <div className="stat-desc">Events coming soon</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure">
                        <div className="avatar online">
                            <div className="w-16 rounded-full">
                                <img src={user?.user_metadata?.avatar_url || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} alt="User" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-value">
                        {isAdmin ? "Admin" : "My"} View
                    </div>
                    <div className="stat-title">Events Dashboard</div>
                    <div className="stat-desc text-secondary">{filteredEvents.length} filtered</div>
                </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
                <div className="text-center py-16">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-2xl font-medium mt-4">No events found</h3>
                    <p className="text-gray-500 mt-2">
                        {searchTerm 
                            ? "Try a different search term" 
                            : "No events match your current filters"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => (
                        <div key={event.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                            <figure className="relative h-48 overflow-hidden">
                                <img
                                    src={event.image_url || "https://via.placeholder.com/600x400?text=Event+Image"}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <div className="flex justify-between items-end">
                                        <span className="badge badge-primary capitalize">
                                            {event.category || 'Event'}
                                        </span>
                                        <span className={`badge ${event.status === 'approved' ? 'badge-success' : event.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                </div>
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title line-clamp-1">{event.title}</h2>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {format(new Date(event.date_time), 'MMM d, yyyy • h:mm a')}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {event.location || 'Online'}
                                </div>
                                <p className="line-clamp-2 mb-4">{event.description}</p>
                                <div className="card-actions justify-between items-center">
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => navigate(`/events/${event.id}`)}
                                    >
                                        View Details
                                    </button>
                                        <div className="flex gap-2">
                                            <button className="btn btn-circle btn-sm btn-ghost">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button className="btn btn-circle btn-sm btn-ghost text-error" onClick={() => handleDelete(event.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create New Event Button (for user) */}
                <div className="fixed bottom-8 right-8">
                    <button 
                        className="btn btn-primary btn-circle btn-lg shadow-xl"
                        onClick={() => navigate('/create-event')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

            </>
            ) : (
                // <div className="text-center py-16">
                 <EventsManagementTable />
            )
            }
        </div>
    );
};