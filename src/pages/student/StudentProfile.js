import React, { useContext, useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';

const StudentProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // State for form fields
  const [studentDetails, setStudentDetails] = useState({
    branch: '',
    year: '',
    universityRegNo: ''
  });

  // 1. Fetch Profile & Events from Backend
  const fetchProfile = useCallback(async () => {
    if (!user || !user._id) return;
    try {
      // GET request to /api/users/profile
      const { data } = await api.get(`/users/profile?userId=${user._id}`);
      
      // Update Events List (Populated from backend)
      setMyEvents(data.registeredEvents || []);
      
      // Update Form Data if it exists in the database
      if (data.studentDetails) {
        setStudentDetails({
            branch: data.studentDetails.branch || '',
            year: data.studentDetails.year || '',
            universityRegNo: data.studentDetails.universityRegNo || ''
        });
      }
    } catch (error) {
      console.error("Error fetching profile", error);
      setMessage({ type: 'danger', text: 'Could not load profile data.' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // 2. Update Profile Logic
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
        // PUT request to update details
        const { data } = await api.put('/users/profile', {
            userId: user._id,
            studentDetails: studentDetails
        });
        
        // Update local storage/context so the changes persist in the session
        const updatedUser = { ...user, studentDetails: data.studentDetails };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));

        setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
        setMessage({ type: 'danger', text: 'Update failed. Please try again.' });
        console.error("Update Error:", error);
    }
  };

  // Loading State
  if (loading && !user) {
      return (
          <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
              </div>
          </div>
      );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          {/* Left Column: Student Details Form */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h4 className="mb-0">{user?.name}</h4>
                <p className="text-muted small">{user?.email}</p>
                
                {message && <div className={`alert alert-${message.type} small mt-2`}>{message.text}</div>}
                
                <hr />
                <h5 className="text-start mb-3 fs-6 text-secondary">Edit Details</h5>
                <form onSubmit={handleUpdate} className="text-start">
                    <div className="mb-3">
                        <label className="form-label small fw-bold">University Reg No.</label>
                        <input type="text" className="form-control form-control-sm" 
                            value={studentDetails.universityRegNo} 
                            onChange={(e) => setStudentDetails({...studentDetails, universityRegNo: e.target.value})}
                            placeholder="e.g., 21BCE1001"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Branch</label>
                        <input type="text" className="form-control form-control-sm" 
                            value={studentDetails.branch}
                            onChange={(e) => setStudentDetails({...studentDetails, branch: e.target.value})}
                            placeholder="e.g., Computer Science"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Year</label>
                        <select className="form-select form-select-sm"
                            value={studentDetails.year}
                            onChange={(e) => setStudentDetails({...studentDetails, year: e.target.value})}
                        >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                    </div>
                    <button className="btn btn-primary w-100 btn-sm">Save Changes</button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Registered Events List */}
          <div className="col-md-8">
            <div className="card shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0 text-primary"><i className="bi bi-ticket-perforated me-2"></i>My Registered Events</h5>
                    <span className="badge bg-primary rounded-pill">{myEvents.length} Events</span>
                </div>
                <div className="card-body p-0">
                    {myEvents.length === 0 ? (
                        <div className="p-5 text-center text-muted">
                            <i className="bi bi-calendar-x mb-3" style={{fontSize: '2.5rem'}}></i>
                            <p>You haven't registered for any events yet.</p>
                            <a href="/student/home" className="btn btn-outline-primary btn-sm mt-2">Browse Events</a>
                        </div>
                    ) : (
                        <div className="list-group list-group-flush">
                            {myEvents.map(event => (
                                <div key={event._id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center p-3 action-hover">
                                    <div className="mb-2 mb-md-0">
                                        <h6 className="mb-1 fw-bold text-dark">{event.title}</h6>
                                        <small className="text-muted d-block">
                                            <i className="bi bi-calendar-event me-1"></i>
                                            {new Date(event.date).toLocaleDateString()} 
                                            <span className="mx-2 text-muted">|</span> 
                                            <i className="bi bi-geo-alt me-1"></i>
                                            {event.location}
                                        </small>
                                    </div>
                                    <div className="text-end">
                                        <span className="badge bg-success rounded-pill px-3 py-2">
                                            <i className="bi bi-check-circle-fill me-1"></i>Registered
                                        </span>
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

export default StudentProfile;