import { useState } from "react";
import "./App.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Login from "./Login";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <>
      <Header />
      {/* Show login page, if authenticated show Main */}
      {authenticated ? <Main /> : <Login setAuthenticated={setAuthenticated} />}
      <Footer />
    </>
  );
}

export default App;
