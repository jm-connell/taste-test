import { useEffect } from "react";
import PropTypes from "prop-types";

function Login({ setAuthenticated }) {
  let url = "https://accounts.spotify.com/authorize";
  const client_id = import.meta.env.VITE_APP_CLIENT_ID;
  const redirect_uri = import.meta.env.VITE_APP_REDIRECT_URI;
  const client_secret = import.meta.env.VITE_APP_CLIENT_SECRET;

  const handleLogin = () => {
    // build authorization request url
    url += `?client_id=${client_id}`;
    url += `&response_type=code`;
    url += `&redirect_uri=${redirect_uri}`;
    url += `&show_dialog=true`;
    url += `&scope=user-top-read user-read-recently-played`;

    window.location.href = url;
  };

  const handleRedirect = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get("code");

    if (code) {
      fetchAccessToken(code).then((access_token) => {
      setAuthenticated(true);
      // get first access token and refresh token
      fetchInitialAccessToken(code).then((access_token) => {
        localStorage.setItem("access_token", access_token);
        setAuthenticated(true);
      });

      // Remove the code parameter from URL so it doesn't send two POST requests
      urlSearchParams.delete("code");
      const newUrl = `${window.location.origin}${
        window.location.pathname
      }?${urlSearchParams.toString()}`;
      window.history.pushState({}, document.title, newUrl);
    }
  };

  // Get first tokens as part of account creation
  async function fetchInitialAccessToken(code) {
    let requestBody = "";
    requestBody += `grant_type=authorization_code`;
    requestBody += `&code=${code}`;
    requestBody += `&redirect_uri=${redirect_uri}`;

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody,
    });

    if (response.ok) {
      const tokenData = await response.json();
      return Promise.resolve(tokenData.access_token);
      sessionStorage.setItem("access_token", tokenData.access_token);
      // send refresh token to backend to store in database
      return null;
    } else {
      console.error("Token exchange failed.");
      return Promise.reject();
    }
  }

  // Get refreshed access token for existing users
  async function fetchRefreshedAccessToken(refreshToken) {
    let requestBody = "";
    requestBody += `grant_type=refresh_token`;
    requestBody += `&refresh_token=${refreshToken}`;

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody,
    });

    if (response.ok) {
      const tokenData = await response.json();
      return tokenData.access_token;
    } else {
      console.error("Token refresh failed.");
    }
  }

  // Get refreshed access token for existing users
  async function fetchRefreshedAccessToken(refreshToken) {
    let requestBody = "";
    requestBody += `grant_type=refresh_token`;
    requestBody += `&refresh_token=${refreshToken}`;

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody,
    });

    if (response.ok) {
      const tokenData = await response.json();
      return tokenData.access_token;
    } else {
      console.error("Token refresh failed.");
    }
  }

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get("code");

    if (code) {
      handleRedirect();
    }
  }, []);

  return (
    <div>
      <button className="login-button center-button" onClick={handleLogin}>
        Log in with Spotify
      </button>
    </div>
  );
}

Login.propTypes = {
  setAuthenticated: PropTypes.func.isRequired,
};

export default Login;
