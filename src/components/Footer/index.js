import { VscGithubAlt } from 'react-icons/vsc';
import { FiInstagram } from 'react-icons/fi';
import { FaTwitter } from 'react-icons/fa';
import './index.css';

const Footer = () => (
  <footer className="footer">
    <h1 className="footer-logo">
      COVID19<span className="footer-logo-india">INDIA</span>
    </h1>
    <p className="footer-text">We stand with everyone fighting on the front lines</p>
    <div className="icon-container">
      <VscGithubAlt className="icon github-icon" />
      <FiInstagram className="icon instagram-icon" />
      <FaTwitter className="icon twitter-icon" />
    </div>
  </footer>
);

export default Footer;
