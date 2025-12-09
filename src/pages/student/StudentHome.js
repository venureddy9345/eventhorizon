import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import EventCard from '../../components/EventCard';
import { toast } from 'react-toastify'; 

const StudentHome = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Modal States ---
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [teammates, setTeammates] = useState(''); // Store as comma separated string

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. Open Modal instead of registering immediately
  const handleRegisterClick = (event) => {
    if (!user) {
      toast.warn("Please login to register! 🔒");
      return;
    }
    setSelectedEvent(event);
    setShowModal(true);
    setTeammates(''); // Reset teammates
  };

  // 2. Handle Payment & Registration Logic
  const confirmRegistration = async () => {
    if (!user._id || !selectedEvent) return;

    try {
      // Split comma separated names into array
      const teammateList = teammates.split(',').map(name => name.trim()).filter(name => name !== '');

      await api.post(`/events/${selectedEvent._id}/register`, { 
          userId: user._id,
          teammates: teammateList
      });
      
      toast.success(`Successfully registered for ${selectedEvent.title}! 🎉`);
      setShowModal(false); // Close Modal
    } catch (error) {
      console.error("Registration Error:", error);
      const msg = error.response?.data?.message || "Registration failed.";
      if (msg.includes("already registered")) {
          toast.info("You are already registered for this event. ✅");
          setShowModal(false);
      } else {
          toast.error(msg);
      }
    }
  };

  return (
    <>
      <Navbar /> 
      <div className="container mt-4">
        {/* --- Header --- */}
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 className="mb-0">Welcome, {user ? user.name : 'Student'}!</h1>
                <p className="text-muted">Explore upcoming events from various colleges.</p>
            </div>
        </div>
        
        {/* --- Search Bar --- */}
        <div className="row mb-5">
          <div className="col-lg-8 offset-lg-2">
            <div className="input-group input-group-lg shadow-sm rounded-pill">
              <input 
                type="text" 
                className="form-control rounded-pill border-primary ps-5" 
                placeholder="Search by event name, category, or location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="input-group-text bg-primary text-white border-primary rounded-pill ms-n5" style={{zIndex: 10}}>
                <i className="bi bi-search"></i>
              </span>
            </div>
          </div>
        </div>

        {/* --- Events Feed --- */}
        <h3 className="text-secondary border-bottom pb-2 mb-4">
            <i className="bi bi-calendar3-event me-2"></i>Upcoming Events
        </h3>

        {loading ? (
             <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
        ) : filteredEvents.length === 0 ? (
            <div className="alert alert-info text-center"><i className="bi bi-info-circle me-2"></i> No events found.</div>
        ) : (
            <div className="row g-4">
                {filteredEvents.map((event) => (
                    <div key={event._id} className="col-md-6 col-lg-4">
                        {/* Pass the entire event object to the handler */}
                        <EventCard event={event} onRegister={() => handleRegisterClick(event)} />
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* --- PAYMENT & REGISTRATION MODAL --- */}
      {showModal && selectedEvent && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                    <i className="bi bi-ticket-detailed me-2"></i>Register for {selectedEvent.title}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              
              <div className="modal-body p-4">
                 <div className="text-center mb-4">
                    <h6 className="text-muted text-uppercase small ls-1">Registration Fee</h6>
                    <h2 className="display-4 fw-bold text-success">
                        ₹{selectedEvent.registrationFee || 0}
                    </h2>
                 </div>

                 <div className="mb-3">
                    <label className="form-label fw-bold">Team Members (Optional)</label>
                    <textarea 
                        className="form-control" 
                        rows="3" 
                        placeholder="Enter names separated by commas (e.g. John, Sarah, Mike)"
                        value={teammates}
                        onChange={(e) => setTeammates(e.target.value)}
                    ></textarea>
                    <div className="form-text">If this is a team event, list your teammates here.</div>
                 </div>

                 <div className="alert alert-light border">
                    <div className="d-flex justify-content-between">
                        <span>User:</span>
                        <strong>{user.name}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span>Email:</span>
                        <strong>{user.email}</strong>
                    </div>
                 </div>
              </div>
              
              <div className="modal-footer bg-light">
                 <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                 <button className="btn btn-success px-4" onClick={confirmRegistration}>
                    <i className="bi bi-credit-card-2-back me-2"></i>
                    {selectedEvent.registrationFee > 0 ? 'Pay Now & Register' : 'Register for Free'}
                 </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentHome;