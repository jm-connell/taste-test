import { useEffect, useState } from "react";

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    fetch(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
      .then((response) => response.json())
      .then((data) => setTracks(data.items))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1 className="column-header">Top Tracks</h1>
      {tracks.map((track, index) => (
        <div key={track.id} className="track-box">
          <h2 className="track-heading">
            {`${index + 1}. ${track.name}`} -{" "}
            <i>{track.artists.map((artist) => artist.name).join(", ")}</i>
          </h2>
          <img src={track.album.images[0]?.url} alt={track.name} />
        </div>
      ))}
    </div>
  );
};

export default TopTracks;
