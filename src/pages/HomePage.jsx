import RecentlyPlayedTracks from '../components/RecentlyPlayedTracks';
import TopTracksPopularity from '../components/TopTracksPopularity';
import TopArtist from '../components/TopArtist';
import React from 'react';
import '../App.css';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <RecentlyPlayedTracks />
      <TopTracksPopularity />
      <TopArtist />
    </div>
  );
};

export default HomePage;
