import React, { useState, useContext, useEffect, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import EventCard from '../../components/EventCard'; // <--- Import New Component

const AdminHome = () => {
  const { user } = useContext(AuthContext);
  const [hostedEvents, setHostedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const collegeName = user?.collegeDetails?.collegeName || 'Your College';
  
  const fetchHostedEvents = useCallback(async () => {
    if (!user || !user._id) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/events/myevents?hostId=${user._id}`); 
      setHostedEvents(data);
    } catch (error) {
      console.error("Failed to fetch hosted events:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
        fetchHostedEvents();
    }
  }, [fetchHostedEvents, user]);

  return (
    <AdminLayout>
      <div className="border-bottom pb-3 mb-4">
        <h1 className="display-5 text-dark fw-bold">
          <i className="bi bi-speedometer2 me-2 text-danger"></i>
          {collegeName} Dashboard
        </h1>
        <p className="lead text-muted">Welcome, {user ? user.name : 'Admin'}. Manage your hosted events and profile.</p>
      </div>

      {/* Stat Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card text-white bg-primary shadow">
            <div className="card-body">
              <h5 className="card-title"><i className="bi bi-plus-circle-fill me-2"></i> Total Hosted Events</h5>
              <p className="card-text fs-2 fw-bold">{hostedEvents.length}</p> 
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h5 className="card-title"><i className="bi bi-calendar-check-fill me-2"></i> Total Attendees</h5>
              <p className="card-text fs-2 fw-bold">
                {hostedEvents.reduce((acc, event) => acc + (event.attendees?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning shadow">
            <div className="card-body">
              <h5 className="card-title"><i className="bi bi-people-fill me-2"></i> Upcoming Events</h5>
              <p className="card-text fs-2 fw-bold">
                {hostedEvents.filter(e => new Date(e.date) > new Date()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mt-5 mb-3 text-dark border-bottom pb-2">Your Hosted Events List</h2>
      
      {loading ? (
        <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : hostedEvents.length === 0 ? (
        <div className="alert alert-secondary">
          <i className="bi bi-info-circle me-2"></i>
          You have not hosted any events yet.
        </div>
      ) : (
        <div className="row g-4">
          {hostedEvents.map(event => (
            <div key={event._id} className="col-md-6 col-lg-4">
              {/* Use Reusable Component with isAdmin flag */}
              <EventCard event={event} isAdmin={true} />
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminHome;