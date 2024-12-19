import React from 'react';
import '../App.css';

const FeedPost = ({ profilePicture, username, date, content, artwork }) => {
  return (
    <div className="feed-post">
      <img
        src={profilePicture}
        alt={`${username}'s profile`}
        className="profile-picture"
      />
      <div className="post-content">
        <div className="post-header">
          <span className="username">{username}</span>
          <span className="date">{date}</span>
        </div>
        <div className="content-container">
          <div className="content">{content}</div>
          <img src={artwork} alt="Artwork" className="artwork" />
        </div>
      </div>
    </div>
  );
};

export default FeedPost;
