import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = ({history}) => {
  const navigateToHome = () => {
    history.push('/')
  }

  return (
    <nav className="header-container">
      <h1 className="header-logo" onClick={navigateToHome}>
        COVID19<span className="logo-india">INDIA</span>
      </h1>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="nav-link">
            About
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
