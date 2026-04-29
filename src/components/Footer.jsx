import { Link } from 'react-router-dom';
import { FaTrophy, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
  <footer className="footer footer-center p-10 bg-base-200 text-base-content mt-16">
    <div className="grid grid-flow-col gap-4">
      <Link to="/about" className="link link-hover">About</Link>
      <Link to="/how-it-works" className="link link-hover">How It Works</Link>
      <Link to="/contests" className="link link-hover">Contests</Link>
      <Link to="/leaderboard" className="link link-hover">Leaderboard</Link>
    </div>
    <div className="grid grid-flow-col gap-4 text-xl">
      <a href="#" aria-label="GitHub"><FaGithub /></a>
      <a href="#" aria-label="Twitter"><FaTwitter /></a>
      <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
    </div>
    <div className="flex items-center gap-2 font-bold text-primary text-lg">
      <FaTrophy /> ContestHub
    </div>
    <p className="text-base-content/60 text-sm">
      © {new Date().getFullYear()} ContestHub. All rights reserved.
    </p>
  </footer>
);

export default Footer;
