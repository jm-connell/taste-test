export const fetchRecentlyPlayedTracks = async (spotifyToken, url = null) => {
  const requestUrl =
    url || 'https://api.spotify.com/v1/me/player/recently-played?limit=50';
  const response = await fetch(requestUrl, {
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('Failed to fetch recently played tracks', errorText);
  }

  const data = await response.json();
  console.log('RECENT TRACK DATA', data);
  return data;
};
