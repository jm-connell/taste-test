import { useState } from 'react';
import RecentlyPlayedTracks from '../components/RecentlyPlayedTracks';
import TopTracksPopularity from '../components/TopTracksPopularity';
import TopArtist from '../components/TopArtist';
import ListeningActivityChart from '../components/charts/ListeningActivityChart';
import GenreDistributionChart from '../components/charts/GenreDistributionChart';
import ArtistDistributionChart from '../components/charts/ArtistDistributionChart';
import { supabase } from '../supabaseClient';
import { useSpotifyToken } from '../context/SpotifyTokenContext';
import '../App.css';

const HomePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const spotifyToken = useSpotifyToken();

  const handleRefresh = async () => {
    // Force a refresh of all components
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleReconnectSpotify = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        scopes:
          'user-read-recently-played user-read-private user-read-email user-top-read',
      },
    });

    if (error) {
      console.error('Error reconnecting to Spotify:', error);
      alert('Failed to reconnect to Spotify. Please try again.');
    }
  };

  return (
    <div>
      <h1>Home</h1>

      <div className="controls">
        <button onClick={handleRefresh} className="refresh-button">
          Refresh Data
        </button>

        {!spotifyToken && (
          <button onClick={handleReconnectSpotify} className="spotify-button">
            Reconnect to Spotify
          </button>
        )}

        <p className="token-status">
          Spotify connection: {spotifyToken ? 'Active' : 'Not connected'}
        </p>
      </div>

      <div key={refreshKey}>
        <RecentlyPlayedTracks />
        <ListeningActivityChart />
        <div className="chart-grid">
          <GenreDistributionChart />
          <ArtistDistributionChart />
        </div>
        <TopTracksPopularity />
        <TopArtist />
      </div>
    </div>
  );
};

export default HomePage;
