import { useSpotifyToken } from '../context/SpotifyTokenContext';

function FriendFeed() {
  const spotifyToken = useSpotifyToken();

  // Add any necessary logic to fetch and display friend activity data
  // For example, you might fetch data from Spotify using the spotifyToken

  return (
    <div>
      <h1>Friend Activity Feed</h1>
      {/* Add UI to display friend activity data */}
    </div>
  );
}

export default FriendFeed;
