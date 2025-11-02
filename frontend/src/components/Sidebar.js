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
  FaTimes
} from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
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
            {isOpen && <span className="brand-text">Schedulr</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* Dashboard */}
          <NavLink to="/dashboard" className="nav-item" end>
            <FaTachometerAlt className="nav-icon" />
            {isOpen && <span>Dashboard</span>}
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
                <NavLink to="/dashboard/employees" className="nav-item nav-subitem">
                  <FaUsers className="nav-icon" />
                  {isOpen && <span>Employees</span>}
                </NavLink>
                
                <NavLink to="/dashboard/schedule" className="nav-item nav-subitem">
                  <FaCalendarAlt className="nav-icon" />
                  {isOpen && <span>Schedule</span>}
                </NavLink>
                
                <NavLink to="/dashboard/company" className="nav-item nav-subitem">
                  <FaBuilding className="nav-icon" />
                  {isOpen && <span>Company</span>}
                </NavLink>
              </div>
            )}
          </div>

          {/* Reports Section */}
          <div className="nav-section">
            <div 
              className="nav-section-header" 
              onClick={() => toggleSection('reports')}
            >
              {isOpen && <span>Reports & Analytics</span>}
              {isOpen && (
                openSections.reports ? 
                  <FaChevronDown className="section-icon" /> : 
                  <FaChevronRight className="section-icon" />
              )}
            </div>
            
            {openSections.reports && (
              <div className="nav-section-content">
                <NavLink to="/dashboard/reports" className="nav-item nav-subitem">
                  <FaChartBar className="nav-icon" />
                  {isOpen && <span>Reports</span>}
                </NavLink>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="nav-divider"></div>
          <NavLink to="/dashboard/settings" className="nav-item">
            <FaCog className="nav-icon" />
            {isOpen && <span>Settings</span>}
          </NavLink>
        </nav>

        {/* Sidebar Footer */}
        {isOpen && (
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">JD</div>
              <div className="user-details">
                <div className="user-name">John Doe</div>
                <div className="user-role">Administrator</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
}

export default Sidebar;
