import { useEffect, useState, useRef } from 'react';
import { fetchRecentlyPlayedTracks } from '../services/spotifyService';
import { useSpotifyToken } from '../context/SpotifyTokenContext';
import './HomePage.css'; // Import the CSS file for styling

function HomePage() {
  const spotifyToken = useSpotifyToken();
  const [listeningData, setListeningData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const getListeningData = async () => {
      if (!spotifyToken) {
        console.log('No Spotify token available');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchRecentlyPlayedTracks(spotifyToken);
        console.log('Listening data:', data);
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

  const playPreview = (previewUrl) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(previewUrl);
    audioRef.current.play();
  };

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
        <table className="recently-played-table">
          <thead>
            <tr>
              <th>Track Name</th>
              <th>Artists</th>
              <th>Last Played</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {listeningData.items.map((item, index) => (
              <tr
                key={item.track.id}
                className={index % 2 === 0 ? 'even' : 'odd'}
              >
                <td>{item.track.name}</td>
                <td>
                  {item.track.artists.map((artist) => artist.name).join(', ')}
                </td>
                <td>{new Date(item.played_at).toLocaleString()}</td>
                <td>
                  {item.track.preview_url ? (
                    <button
                      className="play-button"
                      onClick={() => playPreview(item.track.preview_url)}
                    >
                      Play
                    </button>
                  ) : (
                    'No Preview'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default HomePage;
