import React, { useState } from 'react';
import './Schedule.css';
import { 
  Card, 
  Button,
  StatCard,
  Badge,
  ProgressBar
} from '../components/dashboard';
import { 
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaPlus,
  FaDownload,
  FaRedo,
  FaCalendarWeek
} from 'react-icons/fa';

function SchedulePage() {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [viewMode, setViewMode] = useState('week'); // week or month

  // Schedule statistics
  const stats = [
    {
      title: 'Total Shifts',
      value: '248',
      color: 'primary',
      icon: <FaCalendarAlt />,
      change: '+12',
    },
    {
      title: 'Employees Scheduled',
      value: '142',
      color: 'success',
      icon: <FaUsers />,
      change: '+5',
    },
    {
      title: 'Total Hours',
      value: '1,856',
      color: 'info',
      icon: <FaClock />,
      change: '+124',
    },
    {
      title: 'Coverage',
      value: '96%',
      color: 'warning',
      icon: <FaCheckCircle />,
      change: '+2',
    },
  ];

  // Week days
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Time slots
  const timeSlots = [
    '08:00 - 12:00',
    '12:00 - 16:00',
    '16:00 - 20:00',
    '20:00 - 00:00'
  ];

  // Sample schedule data
  const scheduleData = {
    'Monday': {
      '08:00 - 12:00': ['Jan Kowalski', 'Anna Nowak', 'Piotr Wiśniewski'],
      '12:00 - 16:00': ['Maria Wójcik', 'Tomasz Kamiński'],
      '16:00 - 20:00': ['Katarzyna Lewandowska', 'Michał Zieliński'],
      '20:00 - 00:00': ['Agnieszka Szymańska'],
    },
    'Tuesday': {
      '08:00 - 12:00': ['Anna Nowak', 'Maria Wójcik'],
      '12:00 - 16:00': ['Jan Kowalski', 'Piotr Wiśniewski', 'Tomasz Kamiński'],
      '16:00 - 20:00': ['Katarzyna Lewandowska', 'Michał Zieliński'],
      '20:00 - 00:00': ['Agnieszka Szymańska', 'Jan Kowalski'],
    },
    'Wednesday': {
      '08:00 - 12:00': ['Piotr Wiśniewski', 'Maria Wójcik', 'Tomasz Kamiński'],
      '12:00 - 16:00': ['Anna Nowak', 'Jan Kowalski'],
      '16:00 - 20:00': ['Michał Zieliński', 'Katarzyna Lewandowska'],
      '20:00 - 00:00': ['Agnieszka Szymańska'],
    },
    'Thursday': {
      '08:00 - 12:00': ['Jan Kowalski', 'Anna Nowak'],
      '12:00 - 16:00': ['Maria Wójcik', 'Piotr Wiśniewski', 'Tomasz Kamiński'],
      '16:00 - 20:00': ['Katarzyna Lewandowska', 'Michał Zieliński'],
      '20:00 - 00:00': ['Agnieszka Szymańska', 'Jan Kowalski'],
    },
    'Friday': {
      '08:00 - 12:00': ['Anna Nowak', 'Maria Wójcik', 'Tomasz Kamiński'],
      '12:00 - 16:00': ['Jan Kowalski', 'Piotr Wiśniewski'],
      '16:00 - 20:00': ['Katarzyna Lewandowska', 'Michał Zieliński', 'Agnieszka Szymańska'],
      '20:00 - 00:00': ['Jan Kowalski'],
    },
    'Saturday': {
      '08:00 - 12:00': ['Piotr Wiśniewski', 'Maria Wójcik'],
      '12:00 - 16:00': ['Tomasz Kamiński', 'Anna Nowak'],
      '16:00 - 20:00': ['Michał Zieliński', 'Katarzyna Lewandowska'],
      '20:00 - 00:00': ['Agnieszka Szymańska', 'Jan Kowalski'],
    },
    'Sunday': {
      '08:00 - 12:00': ['Jan Kowalski', 'Anna Nowak'],
      '12:00 - 16:00': ['Maria Wójcik'],
      '16:00 - 20:00': ['Katarzyna Lewandowska', 'Michał Zieliński'],
      '20:00 - 00:00': ['Agnieszka Szymańska'],
    },
  };

  const handleGenerateSchedule = () => {
    alert('Generate Schedule functionality will be implemented here');
  };

  const handleExportSchedule = () => {
    alert('Export Schedule to PDF/Excel');
  };

  const getShiftColor = (employeeCount) => {
    if (employeeCount >= 3) return 'success';
    if (employeeCount === 2) return 'warning';
    return 'danger';
  };

  return (
    <div className="schedule-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Schedule Generation</h1>
          <p className="page-subtitle">Create and manage employee schedules</p>
        </div>
        <div className="header-actions">
          <Button color="success" onClick={handleGenerateSchedule}>
            <FaRedo /> Generate Schedule
          </Button>
          <Button variant="outline" color="primary" onClick={handleExportSchedule}>
            <FaDownload /> Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
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

      {/* Schedule Controls */}
      <Card>
        <div className="schedule-controls">
          <div className="control-group">
            <label className="control-label">Week Selection:</label>
            <select 
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="control-select"
            >
              <option value="previous">Previous Week</option>
              <option value="current">Current Week</option>
              <option value="next">Next Week (Nov 4-10, 2025)</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
          
          <div className="control-group">
            <label className="control-label">View Mode:</label>
            <div className="view-mode-buttons">
              <Button 
                size="sm"
                variant={viewMode === 'week' ? 'solid' : 'outline'}
                color="primary"
                onClick={() => setViewMode('week')}
              >
                <FaCalendarWeek /> Week View
              </Button>
              <Button 
                size="sm"
                variant={viewMode === 'month' ? 'solid' : 'outline'}
                color="primary"
                onClick={() => setViewMode('month')}
              >
                <FaCalendarAlt /> Month View
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Schedule Grid */}
      <Card header="Weekly Schedule" color="primary">
        <div className="schedule-grid">
          <div className="schedule-table">
            {/* Header Row */}
            <div className="schedule-row schedule-header">
              <div className="time-cell">Time Slot</div>
              {weekDays.map(day => (
                <div key={day} className="day-cell">
                  <div className="day-name">{day}</div>
                  <div className="day-date">{day === 'Monday' ? 'Nov 4' : day === 'Tuesday' ? 'Nov 5' : day === 'Wednesday' ? 'Nov 6' : day === 'Thursday' ? 'Nov 7' : day === 'Friday' ? 'Nov 8' : day === 'Saturday' ? 'Nov 9' : 'Nov 10'}</div>
                </div>
              ))}
            </div>

            {/* Time Slot Rows */}
            {timeSlots.map(slot => (
              <div key={slot} className="schedule-row">
                <div className="time-cell">
                  <strong>{slot}</strong>
                </div>
                {weekDays.map(day => {
                  const employees = scheduleData[day][slot] || [];
                  return (
                    <div key={`${day}-${slot}`} className="shift-cell">
                      <div className="shift-info">
                        <Badge 
                          color={getShiftColor(employees.length)} 
                          className="shift-badge"
                        >
                          {employees.length} staff
                        </Badge>
                      </div>
                      <div className="employee-list">
                        {employees.map((emp, idx) => (
                          <div key={idx} className="employee-chip">
                            {emp}
                          </div>
                        ))}
                      </div>
                      <button className="add-shift-btn" title="Add employee to shift">
                        <FaPlus />
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Schedule Summary */}
      <div className="dashboard-row">
        <div className="dashboard-col-8">
          <Card header="Coverage Analysis" color="info">
            <div className="coverage-analysis">
              <div className="coverage-item">
                <span className="coverage-label">Morning Shift (08:00-12:00)</span>
                <ProgressBar value={92} color="success" height="sm" />
                <span className="coverage-value">92% covered</span>
              </div>
              <div className="coverage-item">
                <span className="coverage-label">Afternoon Shift (12:00-16:00)</span>
                <ProgressBar value={88} color="success" height="sm" />
                <span className="coverage-value">88% covered</span>
              </div>
              <div className="coverage-item">
                <span className="coverage-label">Evening Shift (16:00-20:00)</span>
                <ProgressBar value={95} color="success" height="sm" />
                <span className="coverage-value">95% covered</span>
              </div>
              <div className="coverage-item">
                <span className="coverage-label">Night Shift (20:00-00:00)</span>
                <ProgressBar value={75} color="warning" height="sm" />
                <span className="coverage-value">75% covered</span>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="dashboard-col-4">
          <Card header="Generation Settings" color="warning">
            <div className="generation-settings">
              <div className="setting-item">
                <label className="setting-label">Min. Staff per Shift:</label>
                <input type="number" className="setting-input" defaultValue="2" min="1" max="10" />
              </div>
              <div className="setting-item">
                <label className="setting-label">Max. Hours per Employee:</label>
                <input type="number" className="setting-input" defaultValue="40" min="20" max="60" />
              </div>
              <div className="setting-item">
                <label className="setting-label">Consider Availability:</label>
                <input type="checkbox" className="setting-checkbox" defaultChecked />
              </div>
              <div className="setting-item">
                <label className="setting-label">Balance Workload:</label>
                <input type="checkbox" className="setting-checkbox" defaultChecked />
              </div>
              <Button block color="success" className="mt-2">
                Apply Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;
