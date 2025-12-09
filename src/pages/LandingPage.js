import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* --- Hero Section --- */}
      <header className="bg-primary text-white text-center py-5 mb-4">
        <div className="container px-4">
          <h1 className="fw-bolder display-3">Event Horizon</h1>
          <p className="lead mb-4">The Centralized Event Management Platform for Colleges & Universities</p>
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link to="/login" className="btn btn-light btn-lg px-4 gap-3 fw-bold">Login</Link>
            <Link to="/signup" className="btn btn-outline-light btn-lg px-4 fw-bold">Get Started</Link>
          </div>
        </div>
      </header>

      {/* --- Features Section --- */}
      <section className="py-5" id="features">
        <div className="container px-4 my-5">
          <div className="row gx-4 justify-content-center">
            
            {/* Feature 1 */}
            <div className="col-lg-4 mb-5">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-calendar-event fs-2"></i>
                  </div>
                  <h2 className="h4 fw-bold">Centralized Events</h2>
                  <p className="mb-0 text-muted">Never miss an update. View all inter-college technical, cultural, and sports events in one single feed.</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-lg-4 mb-5">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-person-check fs-2"></i>
                  </div>
                  <h2 className="h4 fw-bold">Easy Registration</h2>
                  <p className="mb-0 text-muted">One-click registration for students. Admins can track real-time participant counts effortlessly.</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-lg-4 mb-5">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-graph-up fs-2"></i>
                  </div>
                  <h2 className="h4 fw-bold">Smart Dashboard</h2>
                  <p className="mb-0 text-muted">Powerful dashboards for Admins to manage events and students to track their participation history.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-4 bg-dark mt-auto">
        <div className="container">
            <p className="m-0 text-center text-white">Copyright &copy; Event Horizon 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;