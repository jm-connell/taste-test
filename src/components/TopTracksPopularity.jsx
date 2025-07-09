import { useEffect, useState } from 'react';
import { useSpotifyToken } from '../context/SpotifyTokenContext';
import '../App.css';

const fetchTopTracks = async (spotifyToken) => {
  if (!spotifyToken) {
    throw new Error('No Spotify token available');
  }

  try {
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
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to fetch top tracks: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    throw error;
  }
};

const TopTracksPopularity = () => {
  const spotifyToken = useSpotifyToken();
  const [averagePopularity, setAveragePopularity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTopTracks = async () => {
      if (!spotifyToken) {
        console.log(
          'No Spotify token available for TopTracksPopularity component'
        );
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching top tracks data...');
        const data = await fetchTopTracks(spotifyToken);

        if (!data || !data.items || data.items.length === 0) {
          console.warn('No items returned from top tracks API');
          setError(
            'No top tracks found. You may need to use Spotify more to generate this data.'
          );
          setLoading(false);
          return;
        }

        const totalPopularity = data.items.reduce(
          (sum, track) => sum + track.popularity,
          0
        );
        const avgPopularity = totalPopularity / data.items.length;
        setAveragePopularity(avgPopularity);
      } catch (error) {
        console.error('Error in TopTracksPopularity component:', error);
        setError(error.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    getTopTracks();
  }, [spotifyToken]);

  if (loading) {
    return <p>Loading popularity data...</p>;
  }

  if (error) {
    return (
      <div>
        <h2>Average Song Popularity</h2>
        <p>Error: {error}</p>
        <p>
          Note: This data requires Spotify listening history. New accounts may
          not have enough data.
        </p>
      </div>
    );
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
        <p>No data available. Try reconnecting to Spotify.</p>
      )}
    </div>
  );
};

export default TopTracksPopularity;
