import toast from 'react-hot-toast';

import { create } from 'zustand';
import { supabase } from '../services/supabase';

export const useEventStore = create((set, get) => ({
  events: [],
  loading: true,
  error: null,

  fetchEvents: async (userId = null) => {
    set({ loading: true });
    let query = supabase.from('events').select('*').order('date_time', { ascending: true });
    if (userId) {
      query = query.eq('created_by', userId);
    }

    const { data, error } = await query;

    if (error) return set({ error: error.message, loading: false });

    set({ events: data, loading: false });
  },

  addEvent: async (event) => {
    set({ loading: true });
      const toastId = toast.loading('Adding event...');
    const { data, error } = await supabase.from('events').insert([event]).select().single();
    if (error) return set({ error: error.message, loading: false });
    toast.error(`Error: ${error.message}`, { id: toastId });

    set((state) => ({ events: [...state.events, data], loading: false }));
      toast.success('Event added successfully!', { id: toastId });

  },

  updateEvent: async (id, updates) => {
    set({ loading: true });
          const toastId = toast.loading('Adding event...');
    const { data, error } = await supabase.from('events').update(updates).eq('id', id).select().single();
    if (error) {
    toast.error(`Error: ${error.message}`, { id: toastId });
    set({ error: error.message, loading: false });
    return;
  }
    set((state) => ({
      events: state.events.map((event) => (event.id === id ? data : event)),
      loading: false,
    }));
          toast.success('Event added successfully!', { id: toastId });

  },

  deleteEvent: async (id) => {
    set({ loading: true });
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) return set({ error: error.message, loading: false });

    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
      loading: false,
    }));
  },

   subscribeToEvents: () => {
    const channel = supabase
      .channel('events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        const { events } = get();

        if (eventType === 'INSERT') {
            toast.success('New event added');
          if (!events.some((e) => e.id === newRow.id)) {
  set({ events: [...events, newRow] });
}
        }
        if (eventType === 'UPDATE') {
          set({ events: events.map((event) => (event.id === newRow.id ? newRow : event)) });
        }
        if (eventType === 'DELETE') {
          set({ events: events.filter((event) => event.id !== oldRow.id) });
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  },
  
}));
