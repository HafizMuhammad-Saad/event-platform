import toast from 'react-hot-toast';

import { create } from 'zustand';
import { supabase } from '../services/supabase';

export const useParticipantStore = create((set, get) => ({
  participants: [],
  loading: true,
  error: null,

  fetchParticipants: async (eventId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('event_id', eventId)
      // .order('added_at', { ascending: false });

  //     console.log("Fetched participants:", data); // ✅ Add this
  // console.log("Fetch error:", error);

    if (error) return set({ error: error.message, loading: false });

    set({ participants: data, loading: false });
  },

  addParticipant: async (participant) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('participants')
      .insert([participant])
      .select()
      .single();

    if (error) {
      set({ error: error.message, loading: false });
      return toast.error(`Error adding participant: ${error.message}`);
    }

    set((state) => ({ participants: [...state.participants, data], loading: false }));
    toast.success('Participant added successfully!');
  },

  deleteParticipant: async (id) => {
    set({ loading: true });
    const { error } = await supabase.from('participants').delete().eq('id', id);

    if (error) {
      set({ error: error.message, loading: false });
      return toast.error(`Error deleting participant: ${error.message}`);
    }

    set((state) => ({
      participants: state.participants.filter((participant) => participant.id !== id),
      loading: false,
    }));
    toast.success('Participant deleted successfully!');
  },
}));