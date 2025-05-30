import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

// Custom hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admin, setAdmin] = useState(false);
const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);
  useEffect(() => {
  const getProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles2')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data);
    }
  };

  getProfile();
}, [user]);

  // Sign up with role
  const signUp = async (firstName, lastName, email, password, role) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role, firstName, lastName  } }
      });
      if (error) throw error;
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Log in
  const logIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Log out
  const logOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Check if user is admin
//   const isAdmin = setAdmin(user?.user_metadata === 'admin') // = () => user?.user_metadata === 'admin';
const isAdmin = profile?.role === 'admin';

  return { user, loading, error, signUp, logIn, logOut, isAdmin, profile };
};