import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { 
  StatCard, 
  Card, 
  Badge, 
  Button 
} from '../components/dashboard';
import { useNavigate } from 'react-router-dom';

// Import icons
import { 
  FaCalendarAlt, 
  FaClipboardList, 
  FaExclamationTriangle,
  FaUsers,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';

function DashboardPage() {
  const navigate = useNavigate();
  // TODO: Pobierz z API
  const [userRole, setUserRole] = useState('employer'); // 'employer' lub 'employee'
  const [userName, setUserName] = useState('Jan Kowalski');

  // Dane dla pracodawcy
  const employerStats = [
    { 
      title: 'Oczekujące wnioski', 
      value: '3', 
      color: 'warning',
      icon: <FaClipboardList />,
      change: '+1'
    },
    { 
      title: 'Nieobsadzone zmiany', 
      value: '2', 
      color: 'danger',
      icon: <FaExclamationTriangle />,
      change: '-1'
    },
  ];

  // Dane dla pracownika
  const employeeStats = [
    { 
      title: 'Nadchodzące zmiany', 
      value: '5', 
      color: 'primary',
      icon: <FaCalendarAlt />,
      change: '0'
    },
    { 
      title: 'Godziny w tym miesiącu', 
      value: '142h', 
      color: 'success',
      icon: <FaClock />,
      change: '+8h'
    },
  ];

  // Najbliższa zmiana pracownika
  const nextShift = {
    date: 'Dziś',
    time: '08:00 - 16:00',
    position: 'Grafik',
    status: 'Potwierdzona'
  };

  // Event handlers
  const handleNavigate = (path) => {
    navigate(path);
  };

  // Widok dla pracodawcy
  const renderEmployerDashboard = () => (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Witaj, {userName}!</h1>
          <p className="page-subtitle">Przegląd firmy</p>
        </div>
        {/* Tymczasowy przełącznik do testowania */}
        <Button 
          color="secondary" 
          size="sm" 
          onClick={() => setUserRole('employee')}
        >
          Przełącz na widok pracownika(dev)
        </Button>
      </div>

      {/* Tylko najważniejsze alerty */}
      {employerStats.some(stat => parseInt(stat.value) > 0) && (
        <div className="stats-grid">
          {employerStats.map((stat, idx) => (
            parseInt(stat.value) > 0 && (
              <StatCard
                key={idx}
                title={stat.title}
                value={stat.value}
                color={stat.color}
                icon={stat.icon}
                change={stat.change}
              />
            )
          ))}
        </div>
      )}

      {/* Główne akcje */}
      <Card header="Co chcesz zrobić?" color="primary">
        <div className="dashboard-actions-grid">
          <button 
            className="action-card"
            onClick={() => handleNavigate('/dashboard/employees')}
          >
            <div className="action-icon">
              <FaUsers />
            </div>
            <h3>Zarządzaj pracownikami</h3>
            <p>Dodaj, edytuj lub usuń pracowników</p>
          </button>

          <button 
            className="action-card"
            onClick={() => handleNavigate('/dashboard/schedule')}
          >
            <div className="action-icon">
              <FaCalendarAlt />
            </div>
            <h3>Grafik</h3>
            <p>Generuj i zarządzaj grafikiem pracy</p>
          </button>

          <button 
            className="action-card"
            onClick={() => handleNavigate('/dashboard/schedule')}
          >
            <div className="action-icon">
              <FaClipboardList />
            </div>
            <h3>Wnioski pracowników</h3>
            <p>Przeglądaj i zatwierdzaj wnioski</p>
          </button>

          <button 
            className="action-card"
            onClick={() => handleNavigate('/dashboard/company')}
          >
            <div className="action-icon">
              <FaExclamationTriangle />
            </div>
            <h3>Ustawienia firmy</h3>
            <p>Zarządzaj danymi firmy</p>
          </button>
        </div>
      </Card>
    </div>
  );

  // Widok dla pracownika
  const renderEmployeeDashboard = () => (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Witaj, {userName}!</h1>
          <p className="page-subtitle">Twój dzisiejszy dzień</p>
        </div>
        {/* Tymczasowy przełącznik do testowania */}
        <Button 
          color="secondary" 
          size="sm" 
          onClick={() => setUserRole('employer')}
        >
          Przełącz na widok pracodawcy(dev)
        </Button>
      </div>

      {/* Najbliższa zmiana - duża karta */}
      <Card header="Twoja najbliższa zmiana" color="primary">
        <div className="next-shift-card">
          <div className="shift-date">
            <FaCalendarAlt />
            <span>{nextShift.date}</span>
          </div>
          <div className="shift-time">{nextShift.time}</div>
          <div className="shift-details">
            <span>Stanowisko: <strong>{nextShift.position}</strong></span>
            <Badge color="success">{nextShift.status}</Badge>
          </div>
        </div>
      </Card>

      {/* Statystyki pracownika */}
      <div className="stats-grid">
        {employeeStats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            icon={stat.icon}
            change={stat.change}
          />
        ))}
      </div>

      {/* Szybkie akcje dla pracownika */}
      <Card header="Szybkie akcje" color="secondary">
        <div className="quick-actions-employee">
          <Button 
            color="primary" 
            onClick={() => handleNavigate('/dashboard/schedule')}
            style={{ width: '100%' }}
          >
            <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
            Zobacz pełny grafik
          </Button>
          <Button 
            color="info" 
            variant="outline"
            onClick={() => alert('Funkcja w budowie')}
            style={{ width: '100%' }}
          >
            <FaClipboardList style={{ marginRight: '0.5rem' }} />
            Złóż wniosek
          </Button>
        </div>
      </Card>
    </div>
  );

  return userRole === 'employer' ? renderEmployerDashboard() : renderEmployeeDashboard();
}

export default DashboardPage;
