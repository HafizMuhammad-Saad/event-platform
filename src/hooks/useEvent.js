import { useState } from 'react';
import { supabase } from '../services/supabase';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchEvents = async (userId = null) => {
        try {
            setLoading(true);
            // const { data, error } = await supabase
            //     .from('events')
            //     .select('*')
            //     .order('date_time', { ascending: true });
                let query = supabase.from('events').select('*').order('date_time', { ascending: true });
            if (userId) {
                query = query.eq('created_by', userId);
            }
                const { data, error } = await query;
                
            if (error) throw error;
            setEvents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const addEvent = async (event) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .insert([event])
                .select()
                .single();
            
            if (error) throw error;
            setEvents((prev) => [...prev, data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const updateEvent = async (id, updates) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .update(updates)
                .eq('id', id)
                .single();
            
            if (error) throw error;
            setEvents((prev) => prev.map(event => event.id === id ? data : event));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const deleteEvent = async (id) => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            setEvents((prev) => prev.filter(event => event.id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const updateEventStatus = async (id, status) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .update({ status })
                .eq('id', id)
                .single();
            
            if (error) throw error;
            setEvents((prev) => prev.map(event => event.id === id ? data : event));
            alert(`Event status updated to ${status}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }




    
    return { fetchEvents, events, addEvent, updateEvent, deleteEvent, loading, error, updateEventStatus  };
}