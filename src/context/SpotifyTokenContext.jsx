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
      setSpotifyToken(session?.provider_token ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSpotifyToken(session?.provider_token ?? null);
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
