import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const SpotifyTokenContext = createContext();

export const SpotifyTokenProvider = ({ children }) => {
  const [spotifyToken, setSpotifyToken] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log('Session from Supabase:', session);
      console.log('Provider token available:', !!session?.provider_token);

      if (session?.provider_token) {
        setSpotifyToken(session.provider_token);
      } else {
        console.warn('No provider token found in session');
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        console.log('New provider token available:', !!session?.provider_token);
        setSpotifyToken(session?.provider_token);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <SpotifyTokenContext.Provider value={spotifyToken}>
      {children}
    </SpotifyTokenContext.Provider>
  );
};

export const useSpotifyToken = () => {
  return useContext(SpotifyTokenContext);
};
