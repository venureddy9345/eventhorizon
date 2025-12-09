import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AdminLayout from './AdminLayout';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';

const AdminCalendar = () => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [hostedEvents, setHostedEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    const fetchHostedEvents = async () => {
        if (!user) return;
        try {
            const { data } = await api.get(`/events/myevents?hostId=${user._id}`);
            setHostedEvents(data);
        } catch (error) {
            console.error("Error fetching hosted events", error);
        }
    };
    fetchHostedEvents();
  }, [user]);

  useEffect(() => {
    const eventsOnDate = hostedEvents.filter(event => {
        const eventDate = new Date(event.date).toDateString();
        return eventDate === date.toDateString();
    });
    setSelectedEvents(eventsOnDate);
  }, [date, hostedEvents]);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
        const hasEvent = hostedEvents.some(event => 
            new Date(event.date).toDateString() === date.toDateString()
        );
        return hasEvent ? <div className="text-danger" style={{fontSize: '2rem', lineHeight: 0.5}}>.</div> : null;
    }
  };

  return (
    <AdminLayout>
      <h2 className="mb-4"><i className="bi bi-calendar-check me-2"></i>Event Schedule</h2>
      
      <div className="row">
        <div className="col-md-5 mb-4">
            <div className="shadow p-3 rounded bg-white">
                <Calendar 
                    onChange={setDate} 
                    value={date} 
                    tileContent={tileContent}
                    className="border-0 w-100"
                />
            </div>
        </div>

        <div className="col-md-7">
            <div className="card shadow-sm">
                <div className="card-header bg-danger text-white">
                    <h5 className="mb-0">Hosted Events on {date.toDateString()}</h5>
                </div>
                <div className="card-body">
                    {selectedEvents.length === 0 ? (
                        <p className="text-muted text-center mt-4">You have no events on this day.</p>
                    ) : (
                        <div className="list-group list-group-flush">
                            {selectedEvents.map(event => (
                                <div key={event._id} className="list-group-item">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">{event.title}</h5>
                                        <small>{new Date(event.date).toLocaleTimeString()}</small>
                                    </div>
                                    <p className="mb-1 text-muted small">{event.description}</p>
                                    <small className="text-primary">
                                        <i className="bi bi-people-fill me-1"></i>
                                        {event.attendees.length} Students Registered
                                    </small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCalendar;