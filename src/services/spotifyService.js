export const fetchRecentlyPlayedTracks = async (spotifyToken) => {
  const response = await fetch(
    'https://api.spotify.com/v1/me/player/recently-played',
    {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('Failed to fetch recently played tracks');
  }

  const data = await response.json();
  return data;
};
