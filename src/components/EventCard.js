import React from 'react';

const EventCard = ({ event, isAdmin = false, onRegister }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  
  const formattedTime = new Date(event.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="card h-100 shadow-sm border-0 hover-shadow">
      {/* Image Section */}
      <div className="position-relative">
        {event.brochureImage ? (
            <img 
                src={event.brochureImage} 
                className="card-img-top" 
                alt={event.title} 
                style={{ height: '180px', objectFit: 'cover' }}
            />
        ) : (
            <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '180px' }}>
                <i className="bi bi-calendar-event text-secondary" style={{ fontSize: '3rem' }}></i>
            </div>
        )}
        <span className="badge bg-primary position-absolute top-0 end-0 m-2">
            {event.category}
        </span>
      </div>

      {/* Body Section */}
      <div className="card-body">
        <h5 className="card-title fw-bold text-dark mb-1">{event.title}</h5>
        <p className="text-muted small mb-3">
            <i className="bi bi-geo-alt-fill me-1 text-danger"></i> {event.location}
        </p>
        
        <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded mb-3">
            <div className="text-center px-2 border-end">
                <small className="d-block text-uppercase fw-bold text-muted" style={{fontSize: '0.7rem'}}>Date</small>
                <span className="fw-bold">{formattedDate}</span>
            </div>
            <div className="text-center px-2">
                <small className="d-block text-uppercase fw-bold text-muted" style={{fontSize: '0.7rem'}}>Time</small>
                <span className="fw-bold">{formattedTime}</span>
            </div>
        </div>

        <p className="card-text text-muted small text-truncate">
            {event.description}
        </p>
      </div>

      {/* Footer Section */}
      <div className="card-footer bg-white border-top-0 pb-3">
        {isAdmin ? (
            <div className="d-grid gap-2">
                <button className="btn btn-outline-secondary btn-sm" disabled>
                    <i className="bi bi-people me-1"></i> {event.attendees?.length || 0} Registered
                </button>
            </div>
        ) : (
            <button 
                onClick={() => onRegister(event._id)} 
                className="btn btn-primary w-100 fw-bold"
            >
                Register Now
            </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;