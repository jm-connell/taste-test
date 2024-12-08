import { useSpotifyToken } from '../context/SpotifyTokenContext';
import RecentlyPlayedTracks from '../components/RecentlyPlayedTracks';
import '../styles/HomePage.css';

function HomePage() {
  const spotifyToken = useSpotifyToken();

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <RecentlyPlayedTracks />
    </div>
  );
}

export default HomePage;
