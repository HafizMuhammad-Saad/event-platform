import { useState } from 'react';
import {EventsList} from '../events/EventsList';
import { useNavigate } from 'react-router-dom';
const EventsAdmin = () => {
    const navigate = useNavigate();
    return (
        <>
        
        <h1>Events</h1>
        <p>Welcome to the Events page</p>
        <EventsList isAdmin={true} />
        </>
    )
}

export default EventsAdmin;