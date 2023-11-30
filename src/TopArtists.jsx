import { useEffect, useState } from "react";

const TopArtists = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    fetch(
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
      .then((response) => response.json())
      .then((data) => setArtists(data.items))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1 className="column-header">Top Artists</h1>
      {artists.map((artist, index) => (
        <div key={artist.id} className="artist-box">
          <h2 className="artist-heading">{`${index + 1}. ${artist.name}`}</h2>{" "}
          {/* Include the rank number */}
          <img src={artist.images[0]?.url} alt={artist.name} />
        </div>
      ))}
    </div>
  );
};

export default TopArtists;
