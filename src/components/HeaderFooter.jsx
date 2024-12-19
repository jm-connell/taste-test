import { Link } from 'react-router-dom';
import '../App.css';

const HeaderFooter = ({ children }) => {
  return (
    <div>
      <header>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/feed">Friend Feed</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>Jon Connell - Senior Project at BYU-Idaho</p>
      </footer>
    </div>
  );
};

export default HeaderFooter;
