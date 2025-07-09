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

export const fetchLongTermPlayHistory = async (spotifyToken) => {
  if (!spotifyToken) {
    throw new Error('No Spotify token available');
  }

  try {
    // Get as much recent history as possible by making multiple requests
    let allTracks = [];
    let url = 'https://api.spotify.com/v1/me/player/recently-played?limit=50';

    // Increase iterations to get more history (up to API limits)
    for (let i = 0; i < 10; i++) {
      // Try to get up to 500 tracks for longer term analysis
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch play history: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      allTracks = allTracks.concat(data.items);
      url = data.next;
      if (!url) break; // Stop if there's no more data
    }

    return allTracks;
  } catch (error) {
    console.error('Error fetching play history:', error);
    throw error;
  }
};

export const fetchTopArtists = async (
  spotifyToken,
  timeRange = 'medium_term',
  limit = 20
) => {
  if (!spotifyToken) {
    throw new Error('No Spotify token available');
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch top artists: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw error;
  }
};

export const fetchArtistDetails = async (spotifyToken, artistId) => {
  if (!spotifyToken || !artistId) {
    throw new Error('Token and artist ID are required');
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch artist details: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching artist details:', error);
    throw error;
  }
};
