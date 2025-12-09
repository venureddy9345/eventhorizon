import React, { useState, useContext } from 'react';
import AdminLayout from './AdminLayout';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api'; 
import { toast } from 'react-toastify'; 

const AdminProfile = () => {
  const { user, setUser } = useContext(AuthContext);

  const [collegeData, setCollegeData] = useState({
    collegeName: user?.collegeDetails?.collegeName || '',
    website: user?.collegeDetails?.website || '',
    description: user?.collegeDetails?.description || '',
  });

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    // Initialize with current date/time to prevent "incomplete" errors
    date: new Date().toISOString().slice(0, 16), 
    location: '',
    category: 'Technical',
    registrationFee: 0, // <--- NEW STATE
    brochureImage: '', 
  });
  
  const [uploading, setUploading] = useState(false); 
  const [activeTab, setActiveTab] = useState('profile');

  // --- Profile Update Logic ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
        const { data } = await api.put('/users/profile', {
            userId: user._id,
            collegeDetails: collegeData
        });
        
        const updatedUser = { ...user, collegeDetails: data.collegeDetails };
        setUser(updatedUser); 
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        
        toast.success('College details updated successfully! 🎓');
    } catch (error) {
        console.error("Profile Update Error:", error);
        toast.error(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  // --- Image Upload Logic ---
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]; 
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file); 
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await api.post('/upload', formData, config);
      const imagePath = `http://localhost:5000${data}`;
      
      setEventData({ ...eventData, brochureImage: imagePath });
      setUploading(false);
      toast.success('Image uploaded! 🖼️'); 
    } catch (error) {
      console.error("Upload Error:", error);
      setUploading(false);
      toast.error('Image upload failed.'); 
    }
  };

  // --- Event Hosting Logic ---
  const handleEventHost = async (e) => {
    e.preventDefault();

    if (!eventData.date) {
        toast.warning('Please select a valid Date and Time.');
        return;
    }

    try {
        const eventToCreate = {
            ...eventData,
            date: new Date(eventData.date).toISOString(), 
            host: user._id
        };
        
        await api.post('/events', eventToCreate);
        
        toast.success(`"${eventData.title}" hosted successfully! 🎉`);
        
        // Reset form
        setEventData({ 
            title: '', 
            description: '', 
            date: new Date().toISOString().slice(0, 16), 
            location: '', 
            category: 'Technical', 
            registrationFee: 0,
            brochureImage: '' 
        });
        
    } catch (error) {
        console.error("Event Hosting Error:", error);
        toast.error(error.response?.data?.message || 'Event hosting failed.');
    }
  };

  return (
    <AdminLayout>
      <h1 className="display-5 fw-bold text-danger">College Host Management</h1>
      <p className="lead text-muted">Update your institution details and create new events.</p>
      
      <ul className="nav nav-tabs mb-4 mt-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <i className="bi bi-person-gear me-2"></i>Edit College Profile
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'host' ? 'active' : ''}`} onClick={() => setActiveTab('host')}>
            <i className="bi bi-calendar-plus me-2"></i>Host New Event
          </button>
        </li>
      </ul>

      {activeTab === 'profile' && (
        <div className="card shadow-sm p-4">
          <h3 className="mb-3">College Details</h3>
          <form onSubmit={handleProfileUpdate}>
            <div className="mb-3">
              <label className="form-label">College Name</label>
              <input type="text" className="form-control" 
                value={collegeData.collegeName}
                onChange={(e) => setCollegeData({...collegeData, collegeName: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">College Website</label>
              <input type="url" className="form-control" 
                value={collegeData.website}
                onChange={(e) => setCollegeData({...collegeData, website: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Brief Description</label>
              <textarea className="form-control" rows="3"
                value={collegeData.description}
                onChange={(e) => setCollegeData({...collegeData, description: e.target.value})}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Save Profile Changes</button>
          </form>
        </div>
      )}

      {activeTab === 'host' && (
        <div className="card shadow-sm p-4">
          <h3 className="mb-3">New Event Details</h3>
          <form onSubmit={handleEventHost}>
            <div className="mb-3">
              <label className="form-label">Event Title</label>
              <input type="text" className="form-control" 
                value={eventData.title}
                onChange={(e) => setEventData({...eventData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="3"
                value={eventData.description}
                onChange={(e) => setEventData({...eventData, description: e.target.value})}
                required
              ></textarea>
            </div>
            
            <div className="row mb-3">
                <div className="col-md-4">
                    <label className="form-label">Date & Time</label>
                    <input type="datetime-local" className="form-control" 
                        value={eventData.date}
                        onChange={(e) => setEventData({...eventData, date: e.target.value})}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control" 
                        value={eventData.location}
                        onChange={(e) => setEventData({...eventData, location: e.target.value})}
                        required
                    />
                </div>
                {/* --- NEW FEE INPUT --- */}
                <div className="col-md-4">
                    <label className="form-label">Reg. Fee (₹)</label>
                    <input type="number" className="form-control" 
                        value={eventData.registrationFee}
                        onChange={(e) => setEventData({...eventData, registrationFee: e.target.value})}
                        placeholder="0 for Free"
                    />
                </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select"
                value={eventData.category}
                onChange={(e) => setEventData({...eventData, category: e.target.value})}
                required
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Brochure/Poster Image</label>
              <input 
                className="form-control" 
                type="file" 
                id="image-file"
                accept="image/png, image/jpeg"
                onChange={uploadFileHandler} 
              />
              {uploading && <div className="text-primary small mt-1 spinner-border spinner-border-sm"></div>}
              
              {eventData.brochureImage && (
                  <div className="mt-2 border p-2 rounded" style={{width: 'fit-content'}}>
                      <img src={eventData.brochureImage} alt="Preview" style={{height: '120px', objectFit: 'contain'}} />
                  </div>
              )}
            </div>
            
            <button type="submit" className="btn btn-danger w-100 mt-3 py-2" disabled={uploading}>
                <i className="bi bi-megaphone-fill me-2"></i>
                {uploading ? 'Uploading Image...' : 'Host Event'}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProfile;