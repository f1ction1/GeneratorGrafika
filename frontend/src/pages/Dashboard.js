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
        <div className="dashboard-loading">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Witaj, {userName}!</h1>
          <p className="page-subtitle">Co chcesz dzisiaj zrobić?</p>
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
          <h3>Pracownicy</h3>
          <p>Zarządzaj listą pracowników swojej firmy</p>
        </button>

        <button 
          className="action-card action-card-success"
          onClick={() => handleNavigate('/dashboard/schedule')}
        >
          <div className="action-icon">
            <FaCalendarAlt />
          </div>
          <h3>Grafik</h3>
          <p>Generuj i przeglądaj harmonogram pracy</p>
        </button>

        <button 
          className="action-card action-card-info"
          onClick={() => handleNavigate('/dashboard/employer')}
        >
          <div className="action-icon">
            <FaChartLine />
          </div>
          <h3>Dane firmy</h3>
          <p>Zarządzaj informacjami o Twojej firmie</p>
        </button>

        <button 
          className="action-card action-card-secondary"
          onClick={() => handleNavigate('/dashboard/profile')}
        >
          <div className="action-icon">
            <FaCog />
          </div>
          <h3>Profil</h3>
          <p>Ustawienia konta i preferencje</p>
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
