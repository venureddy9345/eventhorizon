import React from 'react';
// Import Sidebar using default import (no curly braces) to match Sidebar.js
import Sidebar from '../../components/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Left Side Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-grow-1 p-4 bg-light">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;