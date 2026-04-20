import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const navigate = useNavigate();
  const isAdmin = !!localStorage.getItem('adminToken');

  function handleLogout() {
    localStorage.removeItem('adminToken');
    navigate('/transition', {
      state: {
        to: '/',
        message: 'Logging out...',
        delay: 1100,
      },
    });
  }

  return (
    <div className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 id="title">ChessClub</h2>
      </Link>
      <div className="navbuttons">
        <Link to="/register" className="navbutton">Sign Up</Link>
        <Link to="/gallery" className="navbutton">Gallery</Link>
        {isAdmin ? (
          <>
            <Link to="/admin" className="navbutton">Admin</Link>
            <button className="navbutton" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="navbutton">Admin Login</Link>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
