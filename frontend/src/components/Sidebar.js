import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaCalendarAlt, 
  FaBuilding,
  FaChartBar,
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaBriefcase,
  FaUserCircle
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

function Sidebar() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [openSections, setOpenSections] = useState({
    management: true,
    reports: false,
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = () => {
    // Usuń token z localStorage
    localStorage.removeItem('token');
    // Przekieruj na stronę logowania
    window.location.href = '/auth';
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-brand">
          <div className="brand-content">
            <img 
              src="/logo1024.png" 
              alt="Schedulr Logo" 
              className="brand-logo"
            />
            {isOpen && <span className="brand-text">Schedule</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* Dashboard */}
          <NavLink to="/dashboard" className="nav-item" end>
            <FaTachometerAlt className="nav-icon" />
            {isOpen && <span>Dashboard</span>}
          </NavLink>

          {/* Profile */}
          <NavLink to="/dashboard/profile" className="nav-item">
            <FaUserCircle className="nav-icon" />
            {isOpen && <span>My Profile</span>}
          </NavLink>

          {/* Management Section */}
          <div className="nav-section">
            <div 
              className="nav-section-header" 
              onClick={() => toggleSection('management')}
            >
              {isOpen && <span>Management</span>}
              {isOpen && (
                openSections.management ? 
                  <FaChevronDown className="section-icon" /> : 
                  <FaChevronRight className="section-icon" />
              )}
            </div>
            
            {openSections.management && (
              <div className="nav-section-content">
                <NavLink to="/dashboard/employer" className="nav-item nav-subitem">
                  <FaBriefcase className="nav-icon" />
                  {isOpen && <span>Employer</span>}
                </NavLink>

                <NavLink to="/dashboard/employees" className="nav-item nav-subitem">
                  <FaUsers className="nav-icon" />
                  {isOpen && <span>Employees</span>}
                </NavLink>
                
                <NavLink to="/dashboard/schedule" className="nav-item nav-subitem">
                  <FaCalendarAlt className="nav-icon" />
                  {isOpen && <span>Schedule</span>}
                </NavLink>
              </div>
            )}
          </div>

          
  

          {/* Theme Toggle Button */}
          <button onClick={toggleTheme} className="nav-item theme-toggle-button" title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {isDark ? <FaSun className="nav-icon" /> : <FaMoon className="nav-icon" />}
            {isOpen && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* Logout Button */}
          <button onClick={handleLogout} className="nav-item logout-button">
            <FaSignOutAlt className="nav-icon" />
            {isOpen && <span>Wyloguj</span>}
          </button>
        </nav>

      
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
}

export default Sidebar;
