import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light shadow-sm" style={{ width: '280px', minHeight: '100vh' }}>
      <Link to="/admin/home" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none border-bottom pb-3">
        <span className="fs-5 fw-bold text-dark">Admin Panel</span>
      </Link>
      <ul className="nav nav-pills flex-column mb-auto mt-3">
        <li className="nav-item">
          <Link to="/admin/home" className="nav-link text-dark">
            <i className="bi bi-house-door-fill me-2"></i> Home
          </Link>
        </li>
        <li>
          <Link to="/admin/calendar" className="nav-link text-dark">
            <i className="bi bi-calendar-check-fill me-2"></i> Calendar
          </Link>
        </li>
        <li>
          <Link to="/admin/profile" className="nav-link text-dark">
            <i className="bi bi-person-circle me-2"></i> Profile & Host
          </Link>
        </li>
      </ul>
      <div className="mt-auto pt-3 border-top">
        <strong className="d-block mb-2 text-muted small">Logged in as: {user?.name}</strong>
        <button className="btn btn-danger w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;