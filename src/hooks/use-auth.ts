import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Auth hook initialized');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        addUserToDatabase(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        addUserToDatabase(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const addUserToDatabase = async (user: User) => {
    const { error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error adding user to database:', error);
    }
  };

  return { user, loading };
} 