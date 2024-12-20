import React, { useEffect, useState } from 'react';
import FeedPost from '../components/FeedPost';
import samplePosts from '../data/samplePosts';
import { useSpotifyToken } from '../context/SpotifyTokenContext';
import '../App.css';

const FriendFeed = () => {
  const spotifyToken = useSpotifyToken();
  const [posts, setPosts] = useState([]);

  /* Get placeholder data */
  useEffect(() => {
    const fetchData = async () => {
      setPosts(samplePosts);
    };

    fetchData();
  }, [spotifyToken]);

  return (
    <div>
      <h1>Friend Activity Feed</h1>
      {posts.map((post, index) => (
        <FeedPost
          key={index}
          profilePicture={post.profilePicture}
          username={post.username}
          date={post.date}
          content={post.content}
          artwork={post.artwork}
        />
      ))}
    </div>
  );
};

export default FriendFeed;
