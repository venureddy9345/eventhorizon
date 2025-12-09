import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify'; // <--- Import Toast

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Removed local 'error' state because Toast handles it now

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await login(email, password);
      
      // Success Notification
      toast.success(`Welcome back, ${userData.name}! 👋`);

      if (userData.role === 'admin') {
        navigate('/admin/home');
      } else {
        navigate('/student/home');
      }
    } catch (err) {
      console.error("Login Error:", err);
      // Error Notification
      toast.error(err.response?.data?.message || 'Invalid Email or Password');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 text-primary">Login</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2">
                  Login
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-muted">
                  New Student? <Link to="/signup" className="text-primary text-decoration-none">Create an Account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;