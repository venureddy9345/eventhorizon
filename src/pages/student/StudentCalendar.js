import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';

const StudentCalendar = () => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [myEvents, setMyEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  // 1. Fetch Registered Events
  useEffect(() => {
    const fetchMyEvents = async () => {
        if (!user) return;
        try {
            const { data } = await api.get(`/users/profile?userId=${user._id}`);
            setMyEvents(data.registeredEvents || []);
        } catch (error) {
            console.error("Error fetching events for calendar", error);
        }
    };
    fetchMyEvents();
  }, [user]);

  // 2. Update selected events when date changes
  useEffect(() => {
    const eventsOnDate = myEvents.filter(event => {
        const eventDate = new Date(event.date).toDateString();
        return eventDate === date.toDateString();
    });
    setSelectedEvents(eventsOnDate);
  }, [date, myEvents]);

  // 3. Tile Content (Add a dot to days with events)
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
        const hasEvent = myEvents.some(event => 
            new Date(event.date).toDateString() === date.toDateString()
        );
        return hasEvent ? <div className="text-primary" style={{fontSize: '2rem', lineHeight: 0.5}}>.</div> : null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4 text-center"><i className="bi bi-calendar3 me-2"></i>My Event Calendar</h2>
        
        <div className="row">
            {/* Calendar Side */}
            <div className="col-md-6 mb-4 d-flex justify-content-center">
                <div className="shadow p-3 rounded bg-white">
                    <Calendar 
                        onChange={setDate} 
                        value={date} 
                        tileContent={tileContent}
                        className="border-0"
                    />
                </div>
            </div>

            {/* Events List Side */}
            <div className="col-md-6">
                <div className="card shadow-sm h-100">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Events on {date.toDateString()}</h5>
                    </div>
                    <div className="card-body">
                        {selectedEvents.length === 0 ? (
                            <p className="text-muted text-center mt-5">No events scheduled for this day.</p>
                        ) : (
                            <div className="list-group">
                                {selectedEvents.map(event => (
                                    <div key={event._id} className="list-group-item">
                                        <h6 className="mb-1 fw-bold">{event.title}</h6>
                                        <small className="text-muted d-block">
                                            <i className="bi bi-clock me-1"></i>
                                            {new Date(event.date).toLocaleTimeString()}
                                        </small>
                                        <small className="text-muted">
                                            <i className="bi bi-geo-alt me-1"></i>
                                            {event.location}
                                        </small>
                                        <div className="mt-2">
                                            <span className="badge bg-info text-dark">{event.category}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default StudentCalendar;