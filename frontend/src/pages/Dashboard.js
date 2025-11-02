import React from 'react';
import './Dashboard.css';
import { 
  StatCard, 
  Card, 
  ProgressBar, 
  Table, 
  Badge, 
  Button 
} from '../components/dashboard';

// Import icons if available
import { 
  FaUsers, 
  FaTasks, 
  FaChartLine, 
  FaExclamationTriangle 
} from 'react-icons/fa';

function DashboardPage() {

  // Stats data - customize these values
  const stats = [
    { 
      title: 'Użytkownicy', 
      value: '1,234', 
      color: 'primary',
      icon: <FaUsers />,
      change: '+12.5'
    },
    { 
      title: 'Zadania', 
      value: '76', 
      color: 'success',
      icon: <FaTasks />,
      change: '+8.2'
    },
    { 
      title: 'Wydajność', 
      value: '92%', 
      color: 'info',
      icon: <FaChartLine />,
      change: '+3.1'
    },
    { 
      title: 'Błędy', 
      value: '3', 
      color: 'danger',
      icon: <FaExclamationTriangle />,
      change: '-15.3'
    },
  ];

  // Progress data - customize as needed
  const progressData = [
    { label: 'Server Load', value: 45, color: 'primary' },
    { label: 'Disk Usage', value: 78, color: 'warning' },
    { label: 'Memory Usage', value: 62, color: 'info' },
    { label: 'CPU Usage', value: 34, color: 'success' },
  ];

  // Table data - customize structure and data
  const tableColumns = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status', render: (value) => (
      <Badge color={value === 'Active' ? 'success' : value === 'Pending' ? 'warning' : 'danger'}>
        {value}
      </Badge>
    )},
    { key: 'progress', label: 'Progress', render: (value) => (
      <div style={{ minWidth: '120px' }}>
        <ProgressBar value={value} color="primary" height="sm" />
        <small>{value}%</small>
      </div>
    )},
    { key: 'date', label: 'Date' },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        <Button size="sm" variant="ghost" color="info" onClick={() => handleEdit(row)}>
          Edit
        </Button>
        <Button size="sm" variant="ghost" color="danger" onClick={() => handleDelete(row)}>
          Delete
        </Button>
      </div>
    )}
  ];

  const tableData = [
    { id: 1, name: 'Project Alpha', status: 'Active', progress: 85, date: '2025-11-01' },
    { id: 2, name: 'Project Beta', status: 'Pending', progress: 45, date: '2025-11-02' },
    { id: 3, name: 'Project Gamma', status: 'Active', progress: 92, date: '2025-10-28' },
    { id: 4, name: 'Project Delta', status: 'Inactive', progress: 15, date: '2025-10-25' },
    { id: 5, name: 'Project Epsilon', status: 'Active', progress: 68, date: '2025-11-01' },
  ];

  // Activity data - customize as needed
  const recentActivity = [
    { user: 'John Doe', action: 'Created new task', time: '5 minutes ago', type: 'success' },
    { user: 'Jane Smith', action: 'Updated project status', time: '15 minutes ago', type: 'info' },
    { user: 'Bob Johnson', action: 'Reported an issue', time: '1 hour ago', type: 'warning' },
    { user: 'Alice Williams', action: 'Completed milestone', time: '2 hours ago', type: 'success' },
  ];

  // Event handlers - customize these
  const handleEdit = (row) => {
    console.log('Edit:', row);
    alert(`Editing: ${row.name}`);
  };

  const handleDelete = (row) => {
    console.log('Delete:', row);
    if (window.confirm(`Delete ${row.name}?`)) {
      alert(`Deleted: ${row.name}`);
    }
  };

  const handleRefresh = () => {
    // Add your refresh logic here
    // For example: refetch data from API
    alert('Dashboard refreshed!');
  };

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="dashboard-actions">
          <Button color="primary" onClick={handleRefresh}>
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Grid - Fully customizable */}
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

      {/* Two Column Layout */}
      <div className="dashboard-row">
        {/* Left Column - Progress Widgets */}
        <div className="dashboard-col-8">
          <Card 
            header="System Performance" 
            color="primary"
            headerActions={
              <Badge color="success">Live</Badge>
            }
          >
            {progressData.map((item, idx) => (
              <div key={idx} className="progress-item">
                <div className="progress-header">
                  <span className="progress-label">{item.label}</span>
                  <span className="progress-value">{item.value}%</span>
                </div>
                <ProgressBar 
                  value={item.value} 
                  color={item.color}
                  striped
                  animated
                />
              </div>
            ))}
          </Card>

          <Card header="Recent Projects" color="info">
            <Table
              columns={tableColumns}
              data={tableData}
              striped
              hover
            />
          </Card>
        </div>

        {/* Right Column - Activity Feed */}
        <div className="dashboard-col-4">
          <Card header="Recent Activity" color="success">
            <div className="activity-feed">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="activity-item">
                  <div className={`activity-indicator activity-${activity.type}`}></div>
                  <div className="activity-content">
                    <div className="activity-user">{activity.user}</div>
                    <div className="activity-action">{activity.action}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card header="Quick Stats" color="warning">
            <div className="quick-stats">
              <div className="quick-stat-item">
                <span className="quick-stat-label">Total Revenue</span>
                <span className="quick-stat-value">$45,678</span>
              </div>
              <div className="quick-stat-item">
                <span className="quick-stat-label">New Customers</span>
                <span className="quick-stat-value">234</span>
              </div>
              <div className="quick-stat-item">
                <span className="quick-stat-label">Pending Orders</span>
                <span className="quick-stat-value">18</span>
              </div>
              <div className="quick-stat-item">
                <span className="quick-stat-label">Support Tickets</span>
                <span className="quick-stat-value">7</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Full Width Widget */}
      <Card header="Additional Information" color="dark">
        <p>
          This is a fully customizable dashboard inspired by CoreUI. You can easily:
        </p>
        <ul>
          <li>Add or remove stat cards by modifying the <code>stats</code> array</li>
          <li>Customize colors using: primary, success, warning, danger, info, dark</li>
          <li>Change table columns and data in the <code>tableColumns</code> and <code>tableData</code> arrays</li>
          <li>Add custom event handlers to buttons and table actions</li>
          <li>Modify the layout by adjusting the grid classes (dashboard-col-*)</li>
          <li>Use any of the components: Card, StatCard, ProgressBar, Table, Badge, Button</li>
        </ul>
      </Card>
    </div>
  );
}

export default DashboardPage;
