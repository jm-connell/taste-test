import { useEffect, useState } from 'react';
import { useSpotifyToken } from '../context/SpotifyTokenContext';

const fetchRecentlyPlayedTracks = async (spotifyToken, nextUrl = null) => {
  const url =
    nextUrl || 'https://api.spotify.com/v1/me/player/recently-played?limit=50';
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('Failed to fetch recently played tracks');
  }

  const data = await response.json();
  return data;
};

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
        setLoading(false);
        return;
      }

      try {
        let allTracks = [];
        let nextUrl = null;

        for (let i = 0; i < 4; i++) {
          const data = await fetchRecentlyPlayedTracks(spotifyToken, nextUrl);
          allTracks = allTracks.concat(data.items);
          nextUrl = data.next;
          if (!nextUrl) break;
        }

        const artistCount = {};
        allTracks.forEach((item) => {
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

        const topArtist = Object.keys(artistCount).reduce((a, b) =>
          artistCount[a].count > artistCount[b].count ? a : b
        );

        setTopArtist({
          name: topArtist,
          count: artistCount[topArtist].count,
          firstPlayed: artistCount[topArtist].firstPlayed,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getTopArtist();
  }, [spotifyToken]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Top Artist in Past 200 Tracks</h2>
      {topArtist ? (
        <p>
          You've been listening to a lot of {topArtist.name} recently,{' '}
          {topArtist.count} plays since {getFriendlyDate(topArtist.firstPlayed)}
        </p>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default TopArtist;
