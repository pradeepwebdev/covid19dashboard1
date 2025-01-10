import { Link } from 'react-router-dom';
import './index.css';

const NotFound = () => (
  <div className="not-found-container">
    <div className="vector-container">
      <h1 className="error-code">404</h1>
    </div>
    <p className="error-message">
      We’re sorry, the page you requested could not be found. <br />
      Please go back to the homepage.
    </p>
    <Link to="/" className="home-button">
      Home
    </Link>
  </div>
);

export default NotFound;
