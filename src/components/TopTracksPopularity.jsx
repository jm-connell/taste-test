import { useEffect, useState } from 'react';
import { useSpotifyToken } from '../context/SpotifyTokenContext';

const fetchTopTracks = async (spotifyToken) => {
  const response = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50',
    {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('Failed to fetch top tracks');
  }

  const data = await response.json();
  return data;
};

const TopTracksPopularity = () => {
  const spotifyToken = useSpotifyToken();
  const [averagePopularity, setAveragePopularity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTopTracks = async () => {
      if (!spotifyToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchTopTracks(spotifyToken);
        const totalPopularity = data.items.reduce(
          (sum, track) => sum + track.popularity,
          0
        );
        const avgPopularity = totalPopularity / data.items.length;
        setAveragePopularity(avgPopularity);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getTopTracks();
  }, [spotifyToken]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Average Song Popularity</h2>
      {averagePopularity !== null ? (
        <p>
          Average Popularity: {averagePopularity.toFixed(2)}
          <span
            className="help-icon"
            title="The average global popularity rating of your top 50 tracks in the past month. Popularity is a value between 0 and 100, with 100 being the most popular."
          >
            ?
          </span>
        </p>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default TopTracksPopularity;
