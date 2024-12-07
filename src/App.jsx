import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import FriendFeed from './pages/FriendFeed';
import SettingsPage from './pages/SettingsPage';
import { SpotifyTokenProvider } from './context/SpotifyTokenContext';
import HeaderFooter from './components/HeaderFooter';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <SpotifyTokenProvider>
      <Router>
        <HeaderFooter>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/home" /> : <LoginPage />}
            />
            <Route
              path="/home"
              element={user ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/feed"
              element={user ? <FriendFeed /> : <Navigate to="/" />}
            />
            <Route
              path="/settings"
              element={user ? <SettingsPage /> : <Navigate to="/" />}
            />
            <Route
              path="*"
              element={user ? <Navigate to="/home" /> : <Navigate to="/" />}
            />
          </Routes>
        </HeaderFooter>
      </Router>
    </SpotifyTokenProvider>
  );
}

export default App;
