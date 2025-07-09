import { useEffect, useState } from 'react';
import { useSpotifyToken } from '../context/SpotifyTokenContext';
import { fetchRecentlyPlayedTracks } from '../services/spotifyService';

const getFriendlyDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 6) {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return daysOfWeek[date.getDay()];
  } else if (diffDays <= 30) {
    return date.toLocaleDateString();
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
};

const TopArtist = () => {
  const spotifyToken = useSpotifyToken();
  const [topArtist, setTopArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTopArtist = async () => {
      if (!spotifyToken) {
        console.log('No Spotify token available for TopArtist component');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching top artist data...');
        let allTracks = [];
        let url = null;

        for (let i = 0; i < 4; i++) {
          const data = await fetchRecentlyPlayedTracks(spotifyToken, url);
          if (!data || !data.items) {
            console.error('Invalid data returned from API:', data);
            throw new Error('Invalid data returned from Spotify API');
          }

          allTracks = allTracks.concat(data.items);
          url = data.next;
          if (!url) break;
        }

        console.log(`Retrieved ${allTracks.length} tracks for analysis`);

        if (allTracks.length === 0) {
          setError('No recently played tracks found');
          setLoading(false);
          return;
        }

        const artistCount = {};
        allTracks.forEach((item) => {
          if (!item.track) {
            console.warn('Track data missing in item:', item);
            return;
          }

          item.track.artists.forEach((artist) => {
            if (!artistCount[artist.name]) {
              artistCount[artist.name] = {
                count: 0,
                firstPlayed: item.played_at,
              };
            }
            artistCount[artist.name].count += 1;
            if (
              new Date(item.played_at) <
              new Date(artistCount[artist.name].firstPlayed)
            ) {
              artistCount[artist.name].firstPlayed = item.played_at;
            }
          });
        });

        const artistNames = Object.keys(artistCount);
        if (artistNames.length === 0) {
          setError('No artist data could be processed');
          setLoading(false);
          return;
        }

        const topArtist = artistNames.reduce((a, b) =>
          artistCount[a].count > artistCount[b].count ? a : b
        );

        setTopArtist({
          name: topArtist,
          count: artistCount[topArtist].count,
          firstPlayed: artistCount[topArtist].firstPlayed,
        });
      } catch (error) {
        console.error('Error in TopArtist component:', error);
        setError(error.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    getTopArtist();
  }, [spotifyToken]);

  if (loading) {
    return <p>Loading top artist data...</p>;
  }

  if (error) {
    return (
      <div>
        <h2>Top Artist in Past 200 Tracks</h2>
        <p>Error: {error}</p>
        <p>Please try refreshing the page or sign in again.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Top Artist in Past 200 Tracks</h2>
      {topArtist ? (
        <p>
          You've been listening to a lot of{' '}
          <span className="accent-text">{topArtist.name}</span> recently,{' '}
          <span className="accent-text">{topArtist.count} plays</span> since{' '}
          {getFriendlyDate(topArtist.firstPlayed)}
        </p>
      ) : (
        <p>No data available. Please check your Spotify account connection.</p>
      )}
    </div>
  );
};

export default TopArtist;
