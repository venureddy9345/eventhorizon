import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify'; // <--- Import Toast

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isAdmin, setIsAdmin] = useState(false); 

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match! ❌'); // <--- Toast Error
      return;
    }

    try {
      const role = isAdmin ? 'admin' : 'student';
      
      await register(formData.name, formData.email, formData.password, role);
      
      // Success Toast
      toast.success(`Registration successful! Welcome to Event Horizon 🚀`);

      if (isAdmin) {
        navigate('/admin/home');
      } else {
        navigate('/student/home');
      }

    } catch (err) {
      // Extract error message
      const errorMessage = err.response?.data?.message || 'Registration failed.';
      console.error("Signup Error:", err);
      toast.error(errorMessage); // <--- Toast Error
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className={`card-header text-white text-center py-3 ${isAdmin ? 'bg-danger' : 'bg-success'}`}>
                <h3 className="mb-0">{isAdmin ? 'Admin Registration (Host)' : 'Student Registration'}</h3>
            </div>
            <div className="card-body p-4">
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" required 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-control" required 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>

                <button type="submit" className={`btn w-100 py-2 fw-bold text-white ${isAdmin ? 'btn-danger' : 'btn-success'}`}>
                    {isAdmin ? 'Register as Admin' : 'Register as Student'}
                </button>
              </form>

              <div className="mt-3 text-center d-grid gap-2">
                <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setIsAdmin(!isAdmin)}
                >
                    {isAdmin ? 'Switch to Student Registration' : 'Need to register as an Admin/Host?'}
                </button>
                
                <div className="mt-2">
                    <Link to="/login" className="text-decoration-none">Already have an account? Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;