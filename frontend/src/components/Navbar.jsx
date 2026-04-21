import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { getAuthRole, isLoggedIn } from '../utils/api';

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const role = getAuthRole();
  const isAdmin = role === 'admin';

  function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
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
        {loggedIn ? (
          <>
            {isAdmin && <Link to="/admin" className="navbutton">Admin</Link>}
            <button className="navbutton" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="navbutton">Login</Link>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
