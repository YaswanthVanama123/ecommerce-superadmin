import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * SuperadminLayout Component
 * Main layout wrapper for the superadmin application
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render in the main area
 * @param {string} props.className - Additional CSS classes
 */
const SuperadminLayout = ({ children, className = '' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'ml-0 lg:ml-0' : 'ml-0'
      }`}>
        <Header onMenuClick={toggleSidebar} />

        <main className={`flex-1 overflow-y-auto p-6 ${className}`}>
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} SuperAdmin Panel. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Version 1.0.0</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SuperadminLayout;
