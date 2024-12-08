import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const signInWithSpotify = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        scopes:
          'user-read-recently-played user-read-private user-read-email user-top-read',
      },
    });
    if (error) {
      console.error('Error signing in:', error);
      setErrorMessage('Too many requests. Please wait a moment and try again.');
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/home');
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div>
      <button onClick={signInWithSpotify}>Sign in with Spotify</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default LoginPage;
