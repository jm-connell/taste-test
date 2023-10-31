# Overview

Taste Test is a React project that uses the Spotify API to request and display a user's top artists and tracks listened to over the past 4 weeks.

This project is built with React + Vite. Currently it can only show the listening history for the past 4 weeks and the UI is very simple. I have plans to expand this project to include more data, with the ability to select different time frames.

I wrote this project to increase my understanding of both React and using third-party APIs.

[Software Demo Video](https://youtu.be/2eluoMwpecU)

# Web Pages

There are two main pages in this application. The first page the user sees displays a button labeled "Log in with Spotify". Clicking this button redirects the user to Spotify's login page to authenticate the user. Once the user is authenticated, the program uses the access code given by Spotify to build two main components, TopArtists and TopTracks. These two components display in parallel columns, showing the top 10 entries for their respective data.

# Development Environment

This application was written in Visual Studio Code using Node.js and React + Vite.

# Useful Websites

- [Spotify API Docs](https://developer.spotify.com/documentation/web-api)
- [How to Authenticate and use Spotify Web API](https://youtu.be/1vR3m0HupGI?si=4gB4bgyANNq53N3V)

# Future Work

- Display more categories of data, i.e. top genres, minutes listened, average streams per day
- Add ability to choose between multiple time frames for data being displayed
- Display graphs showing listening habits over given periods of time
- Display "Now Listening" to show what user is currently listening to
