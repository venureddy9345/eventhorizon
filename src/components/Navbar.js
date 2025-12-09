import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to landing page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        {/* Brand/Logo */}
        <Link className="navbar-brand fw-bold text-warning" to="/student/home">
          <i className="bi bi-calendar-event me-2"></i>Event Horizon
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            
            {/* Home Link */}
            <li className="nav-item">
              <Link className="nav-link" to="/student/home">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>

            {/* Calendar Link */}
            <li className="nav-item">
              <Link className="nav-link" to="/student/calendar">
                <i className="bi bi-calendar-check me-1"></i> Calendar
              </Link>
            </li>
            
            {/* Profile Link (Fixed: Uses button instead of anchor tag) */}
            <li className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle" 
                id="navbarDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                type="button"
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                }}
              >
                <i className="bi bi-person-circle me-1"></i> {user ? user.name : 'Profile'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/student/profile">
                    My Profile
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;