export const fetchRecentlyPlayedTracks = async (spotifyToken, url = null) => {
  const requestUrl =
    url || 'https://api.spotify.com/v1/me/player/recently-played?limit=50';

  if (!spotifyToken) {
    throw new Error('No Spotify token available');
  }

  try {
    const response = await fetch(requestUrl, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch recently played tracks: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Spotify API error:', error);
    throw error;
  }
};
