import React, { useState } from 'react';
import './Company.css';
import { 
  Card, 
  Button,
  StatCard,
  Badge,
  ProgressBar,
  Table
} from '../components/dashboard';
import { 
  FaBuilding,
  FaUserTie,
  FaBriefcase,
  FaMapMarkerAlt,
  FaEdit,
  FaPlus,
  FaSave,
  FaUsers,
  FaChartLine,
  FaCog
} from 'react-icons/fa';

function CompanyPage() {
  const [editMode, setEditMode] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: 'GeneratorGrafika Sp. z o.o.',
    industry: 'Software Development',
    employees: '156',
    founded: '2018',
    address: 'ul. Przykładowa 123, 00-001 Warszawa, Poland',
    email: 'contact@generatorgrafika.pl',
    phone: '+48 22 123 45 67',
    website: 'www.generatorgrafika.pl',
    taxId: 'PL1234567890',
  });

  // Company statistics
  const stats = [
    {
      title: 'Total Employees',
      value: '156',
      color: 'primary',
      icon: <FaUsers />,
      change: '+12',
    },
    {
      title: 'Departments',
      value: '8',
      color: 'success',
      icon: <FaBriefcase />,
      change: '+1',
    },
    {
      title: 'Locations',
      value: '3',
      color: 'info',
      icon: <FaMapMarkerAlt />,
      change: '0',
    },
    {
      title: 'Revenue Growth',
      value: '+24%',
      color: 'warning',
      icon: <FaChartLine />,
      change: '+5',
    },
  ];

  // Departments data
  const departmentsData = [
    { id: 1, name: 'IT Department', head: 'Jan Kowalski', employees: 24, budget: '€450,000' },
    { id: 2, name: 'Sales', head: 'Anna Nowak', employees: 18, budget: '€320,000' },
    { id: 3, name: 'Marketing', head: 'Piotr Wiśniewski', employees: 12, budget: '€280,000' },
    { id: 4, name: 'Human Resources', head: 'Maria Wójcik', employees: 8, budget: '€180,000' },
    { id: 5, name: 'Finance', head: 'Tomasz Kamiński', employees: 10, budget: '€220,000' },
    { id: 6, name: 'Operations', head: 'Katarzyna Lewandowska', employees: 16, budget: '€350,000' },
    { id: 7, name: 'Customer Support', head: 'Michał Zieliński', employees: 14, budget: '€240,000' },
    { id: 8, name: 'R&D', head: 'Agnieszka Szymańska', employees: 20, budget: '€520,000' },
  ];

  const departmentColumns = [
    { key: 'name', label: 'Department Name' },
    { key: 'head', label: 'Department Head' },
    { key: 'employees', label: 'Employees' },
    { key: 'budget', label: 'Annual Budget' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <Button size="sm" variant="ghost" color="info">
            <FaEdit /> Edit
          </Button>
        </div>
      )
    }
  ];

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    setEditMode(false);
    alert('Company information saved successfully!');
  };

  const handleInputChange = (field, value) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="company-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Company Management</h1>
          <p className="page-subtitle">Manage your company information and structure</p>
        </div>
        <div className="header-actions">
          {editMode ? (
            <>
              <Button color="success" onClick={handleSave}>
                <FaSave /> Save Changes
              </Button>
              <Button variant="outline" color="danger" onClick={handleEditToggle}>
                Cancel
              </Button>
            </>
          ) : (
            <Button color="primary" onClick={handleEditToggle}>
              <FaEdit /> Edit Information
            </Button>
          )}
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

      {/* Company Information */}
      <div className="dashboard-row">
        <div className="dashboard-col-8">
          <Card header="Company Information" color="primary">
            <div className="company-info-grid">
              <div className="info-group">
                <label className="info-label">
                  <FaBuilding /> Company Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    className="info-input"
                    value={companyData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{companyData.name}</div>
                )}
              </div>

              <div className="info-group">
                <label className="info-label">
                  <FaBriefcase /> Industry
                </label>
                {editMode ? (
                  <input
                    type="text"
                    className="info-input"
                    value={companyData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{companyData.industry}</div>
                )}
              </div>

              <div className="info-group">
                <label className="info-label">
                  <FaUsers /> Number of Employees
                </label>
                {editMode ? (
                  <input
                    type="text"
                    className="info-input"
                    value={companyData.employees}
                    onChange={(e) => handleInputChange('employees', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{companyData.employees}</div>
                )}
              </div>

              <div className="info-group">
                <label className="info-label">Founded</label>
                {editMode ? (
                  <input
                    type="text"
                    className="info-input"
                    value={companyData.founded}
                    onChange={(e) => handleInputChange('founded', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{companyData.founded}</div>
                )}
              </div>

              <div className="info-group full-width">
                <label className="info-label">
                  <FaMapMarkerAlt /> Address
                </label>
                {editMode ? (
                  <input
                    type="text"
                    className="info-input"
                    value={companyData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{companyData.address}</div>
                )}
              </div>

              <div className="info-group">
                <label className="info-label">Email</label>
                {editMode ? (
                  <input
                    type="email"
                    className="info-input"
                    value={companyData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{companyData.email}</div>
                )}
              </div>

              <div className="info-group">
                <label className="info-label">Phone</label>
                {editMode ? (
                  <input
                    type="tel"
                    className="info-input"
                    value={companyData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{companyData.phone}</div>
                )}
              </div>

              <div className="info-group">
                <label className="info-label">Website</label>
                {editMode ? (
                  <input
                    type="text"
                    className="info-input"
                    value={companyData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{companyData.website}</div>
                )}
              </div>

              <div className="info-group">
                <label className="info-label">Tax ID (NIP)</label>
                {editMode ? (
                  <input
                    type="text"
                    className="info-input"
                    value={companyData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{companyData.taxId}</div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="dashboard-col-4">
          <Card header="Quick Stats" color="success">
            <div className="quick-stats-list">
              <div className="stat-item">
                <span className="stat-label">Total Departments</span>
                <span className="stat-value">8</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Active Projects</span>
                <span className="stat-value">24</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Monthly Revenue</span>
                <span className="stat-value">€520K</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Client Satisfaction</span>
                <span className="stat-value">94%</span>
              </div>
            </div>
          </Card>

          <Card header="Company Growth" color="info">
            <div className="growth-metrics">
              <div className="metric-item">
                <span className="metric-label">Employee Growth</span>
                <ProgressBar value={78} color="primary" height="sm" />
                <span className="metric-value">+18 this year</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Revenue Growth</span>
                <ProgressBar value={92} color="success" height="sm" />
                <span className="metric-value">+24% YoY</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Market Share</span>
                <ProgressBar value={65} color="info" height="sm" />
                <span className="metric-value">15% market</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Departments Table */}
      <Card 
        header="Departments Overview" 
        color="warning"
        headerActions={
          <Button size="sm" color="warning">
            <FaPlus /> Add Department
          </Button>
        }
      >
        <Table
          columns={departmentColumns}
          data={departmentsData}
          striped
          hover
        />
      </Card>

      {/* Locations */}
      <div className="dashboard-row">
        <div className="dashboard-col-8">
          <Card header="Office Locations" color="dark">
            <div className="locations-list">
              <div className="location-item">
                <div className="location-header">
                  <FaMapMarkerAlt className="location-icon" />
                  <h3 className="location-name">Headquarters - Warsaw</h3>
                  <Badge color="success">Main Office</Badge>
                </div>
                <p className="location-address">ul. Przykładowa 123, 00-001 Warszawa, Poland</p>
                <div className="location-stats">
                  <span><strong>120</strong> employees</span>
                  <span><strong>5</strong> floors</span>
                  <span><strong>2,500</strong> m²</span>
                </div>
              </div>

              <div className="location-item">
                <div className="location-header">
                  <FaMapMarkerAlt className="location-icon" />
                  <h3 className="location-name">Branch Office - Kraków</h3>
                  <Badge color="info">Branch</Badge>
                </div>
                <p className="location-address">ul. Testowa 45, 30-001 Kraków, Poland</p>
                <div className="location-stats">
                  <span><strong>28</strong> employees</span>
                  <span><strong>2</strong> floors</span>
                  <span><strong>800</strong> m²</span>
                </div>
              </div>

              <div className="location-item">
                <div className="location-header">
                  <FaMapMarkerAlt className="location-icon" />
                  <h3 className="location-name">Regional Office - Gdańsk</h3>
                  <Badge color="info">Branch</Badge>
                </div>
                <p className="location-address">ul. Morska 78, 80-001 Gdańsk, Poland</p>
                <div className="location-stats">
                  <span><strong>18</strong> employees</span>
                  <span><strong>1</strong> floor</span>
                  <span><strong>450</strong> m²</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="dashboard-col-4">
          <Card header="Settings" color="danger">
            <div className="settings-list">
              <Button block variant="outline" color="primary" className="setting-btn">
                <FaCog /> Company Settings
              </Button>
              <Button block variant="outline" color="info" className="setting-btn">
                <FaUsers /> User Permissions
              </Button>
              <Button block variant="outline" color="warning" className="setting-btn">
                <FaBriefcase /> Policies & Procedures
              </Button>
              <Button block variant="outline" color="success" className="setting-btn">
                <FaChartLine /> Analytics & Reports
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CompanyPage;
