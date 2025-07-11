import { useEffect, useState } from 'react';
import { fetchRecentlyPlayedTracks } from '../services/spotifyService';
import { useSpotifyToken } from '../context/SpotifyTokenContext';
import '../App.css';

const RecentlyPlayedTracks = () => {
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
      <h2>Recently Played Tracks</h2>
      {listeningData ? (
        <div className="table-container">
          <table className="recently-played-table">
            <thead>
              <tr>
                <th>Track Name</th>
                <th>Artists</th>
                <th>Last Played</th>
              </tr>
            </thead>
            <tbody>
              {listeningData.items.slice(0, 10).map((item, index) => (
                <tr
                  key={item.track.id}
                  className={index % 2 === 0 ? 'even' : 'odd'}
                >
                  <td>{item.track.name}</td>
                  <td>
                    {item.track.artists.map((artist) => artist.name).join(', ')}
                  </td>
                  <td>{new Date(item.played_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default RecentlyPlayedTracks;
