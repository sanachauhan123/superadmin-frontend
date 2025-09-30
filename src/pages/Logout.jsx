import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token and user info
    localStorage.removeItem('token');
    localStorage.removeItem('admin');

    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
