import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChessLoadingOverlay from '../components/ChessLoadingOverlay';
import Navbar from '../components/Navbar';

export default function TransitionLoader() {
  const navigate = useNavigate();
  const location = useLocation();

  const to = location.state?.to || '/';
  const message = location.state?.message || 'Preparing board...';
  const delay = Number(location.state?.delay) || 1100;

  useEffect(() => {
    const timer = setTimeout(() => navigate(to, { replace: true }), delay);
    return () => clearTimeout(timer);
  }, [delay, navigate, to]);

  return (
    <>
      <Navbar />
      <ChessLoadingOverlay message={message} />
    </>
  );
}