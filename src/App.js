import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 

// --- NEW IMPORTS FOR TOAST ---
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
// -----------------------------

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentHome from './pages/student/StudentHome';
import StudentProfile from './pages/student/StudentProfile';
import StudentCalendar from './pages/student/StudentCalendar';
import AdminHome from './pages/admin/AdminHome'; 
import AdminProfile from './pages/admin/AdminProfile'; 
import AdminCalendar from './pages/admin/AdminCalendar';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Put the ToastContainer here so it sits on top of everything */}
        <ToastContainer position="top-right" autoClose={3000} />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/student/home" element={<StudentHome />} /> 
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/calendar" element={<StudentCalendar />} />
          
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;