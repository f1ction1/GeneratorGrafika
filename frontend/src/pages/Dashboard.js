import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

// Import icons
import { 
  FaCalendarAlt, 
  FaUsers,
  FaCog,
  FaChartLine,
} from 'react-icons/fa';

function DashboardPage() {
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await fetch('http://localhost:8000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserName(`${data.first_name} ${data.last_name}`);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setUserName('Użytkowniku');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Welcome, {userName}!</h1>
        </div>
      </div>

      {/* Główne funkcjonalności - ładne karty */}
      <div className="dashboard-actions-grid">
        <button 
          className="action-card action-card-primary"
          onClick={() => handleNavigate('/dashboard/employees')}
        >
          <div className="action-icon">
            <FaUsers />
          </div>
          <h3>Employees</h3>
          <p>Manage your company's employee list</p>
        </button>

        <button 
          className="action-card action-card-success"
          onClick={() => handleNavigate('/dashboard/schedule')}
        >
          <div className="action-icon">
            <FaCalendarAlt />
          </div>
          <h3>Schedule</h3>
          <p>Generate and view work schedules</p>
        </button>

        <button 
          className="action-card action-card-info"
          onClick={() => handleNavigate('/dashboard/employer')}
        >
          <div className="action-icon">
            <FaChartLine />
          </div>
          <h3>Company details</h3>
          <p>Manage information about your company</p>
        </button>

        <button 
          className="action-card action-card-secondary"
          onClick={() => handleNavigate('/dashboard/profile')}
        >
          <div className="action-icon">
            <FaCog />
          </div>
          <h3>Profile</h3>
          <p>Account settings</p>
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
