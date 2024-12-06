import { useEffect, useState } from 'react';
import { fetchRecentlyPlayedTracks } from '../services/spotifyService';
import { useSpotifyToken } from '../context/SpotifyTokenContext';

function HomePage() {
  const spotifyToken = useSpotifyToken();
  const [listeningData, setListeningData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getListeningData = async () => {
      if (!spotifyToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchRecentlyPlayedTracks(spotifyToken);
        setListeningData(data);
      } catch (error) {
        console.error('Error fetching listening data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getListeningData();
  }, [spotifyToken]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {listeningData ? (
        <div>
          <h2>Recently Played Tracks</h2>
          <ul>
            {listeningData.items.map((item) => (
              <li key={item.track.id}>
                {item.track.name} by{' '}
                {item.track.artists.map((artist) => artist.name).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default HomePage;
