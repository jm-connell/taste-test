import { useEffect, useState } from 'react';
import { fetchRecentlyPlayedTracks } from '../services/spotifyService';
import { useSpotifyToken } from '../context/SpotifyTokenContext';
import './HomePage.css'; // Import the CSS file for styling

function HomePage() {
  const spotifyToken = useSpotifyToken();
  const [listeningData, setListeningData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
