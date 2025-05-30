import { useState } from 'react';
import {EventsList} from '../events/EventsList';
import { useNavigate } from 'react-router-dom';
const Events = () => {
    const navigate = useNavigate();
    return (
        <>
        
        <h1>Events</h1>
        <p>Welcome to the Events page</p>
        <EventsList isAdmin={false} />
        </>
    )
}

export default Events;