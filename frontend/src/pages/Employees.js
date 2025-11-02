import React, { useState } from 'react';
import './Employees.css';
import { 
  Card, 
  Table, 
  Badge, 
  Button,
  StatCard
} from '../components/dashboard';
import { 
  FaUsers, 
  FaUserPlus, 
  FaUserCheck, 
  FaUserClock,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Employee statistics
  const stats = [
    {
      title: 'Total Employees',
      value: '156',
      color: 'primary',
      icon: <FaUsers />,
      change: '+12',
    },
    {
      title: 'Active Today',
      value: '142',
      color: 'success',
      icon: <FaUserCheck />,
      change: '+5',
    },
    {
      title: 'On Leave',
      value: '8',
      color: 'warning',
      icon: <FaUserClock />,
      change: '-2',
    },
    {
      title: 'New This Month',
      value: '6',
      color: 'info',
      icon: <FaUserPlus />,
      change: '+6',
    },
  ];

  // Table columns configuration
  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'position', label: 'Position' },
    { key: 'department', label: 'Department' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => {
        const colorMap = {
          'Active': 'success',
          'On Leave': 'warning',
          'Inactive': 'danger',
        };
        return <Badge color={colorMap[value] || 'dark'}>{value}</Badge>;
      }
    },
    { key: 'hireDate', label: 'Hire Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <Button 
            size="sm" 
            variant="ghost" 
            color="info" 
            onClick={() => handleEdit(row)}
          >
            <FaEdit />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            color="danger" 
            onClick={() => handleDelete(row)}
          >
            <FaTrash />
          </Button>
        </div>
      )
    }
  ];

  // Sample employee data
  const employeeData = [
    {
      id: 1,
      name: 'Jan Kowalski',
      email: 'jan.kowalski@company.com',
      position: 'Senior Developer',
      department: 'IT',
      status: 'Active',
      hireDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Anna Nowak',
      email: 'anna.nowak@company.com',
      position: 'Project Manager',
      department: 'Management',
      status: 'Active',
      hireDate: '2022-06-10'
    },
    {
      id: 3,
      name: 'Piotr Wiśniewski',
      email: 'piotr.wisniewski@company.com',
      position: 'Designer',
      department: 'Design',
      status: 'On Leave',
      hireDate: '2023-03-20'
    },
    {
      id: 4,
      name: 'Maria Wójcik',
      email: 'maria.wojcik@company.com',
      position: 'HR Specialist',
      department: 'HR',
      status: 'Active',
      hireDate: '2021-09-05'
    },
    {
      id: 5,
      name: 'Tomasz Kamiński',
      email: 'tomasz.kaminski@company.com',
      position: 'Marketing Manager',
      department: 'Marketing',
      status: 'Active',
      hireDate: '2022-11-12'
    },
    {
      id: 6,
      name: 'Katarzyna Lewandowska',
      email: 'katarzyna.lewandowska@company.com',
      position: 'Junior Developer',
      department: 'IT',
      status: 'Active',
      hireDate: '2024-08-01'
    },
    {
      id: 7,
      name: 'Michał Zieliński',
      email: 'michal.zielinski@company.com',
      position: 'Sales Representative',
      department: 'Sales',
      status: 'Inactive',
      hireDate: '2020-04-18'
    },
    {
      id: 8,
      name: 'Agnieszka Szymańska',
      email: 'agnieszka.szymanska@company.com',
      position: 'Accountant',
      department: 'Finance',
      status: 'Active',
      hireDate: '2023-02-28'
    },
  ];

  // Event handlers
  const handleEdit = (employee) => {
    console.log('Edit employee:', employee);
    alert(`Edit: ${employee.name}`);
  };

  const handleDelete = (employee) => {
    console.log('Delete employee:', employee);
    if (window.confirm(`Delete ${employee.name}?`)) {
      alert(`Deleted: ${employee.name}`);
    }
  };

  const handleAddEmployee = () => {
    alert('Open Add Employee Form');
  };

  // Filter employees based on search and status
  const filteredEmployees = employeeData.filter(emp => {
    const matchesSearch = searchTerm === '' || 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="employees-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Management</h1>
          <p className="page-subtitle">Manage your workforce and team members</p>
        </div>
        <Button color="primary" onClick={handleAddEmployee}>
          <FaPlus /> Add Employee
        </Button>
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

      {/* Filters and Search */}
      <Card>
        <div className="filter-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search employees by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <FaFilter className="filter-icon" />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Employee Table */}
      <Card header={`Employees (${filteredEmployees.length})`} color="primary">
        <Table
          columns={tableColumns}
          data={filteredEmployees}
          striped
          hover
        />
      </Card>

      {/* Department Summary */}
      <div className="dashboard-row">
        <div className="dashboard-col-8">
          <Card header="Department Distribution" color="info">
            <div className="department-stats">
              <div className="dept-item">
                <span className="dept-name">IT Department</span>
                <span className="dept-count">24 employees</span>
              </div>
              <div className="dept-item">
                <span className="dept-name">Sales</span>
                <span className="dept-count">18 employees</span>
              </div>
              <div className="dept-item">
                <span className="dept-name">Marketing</span>
                <span className="dept-count">12 employees</span>
              </div>
              <div className="dept-item">
                <span className="dept-name">HR</span>
                <span className="dept-count">8 employees</span>
              </div>
              <div className="dept-item">
                <span className="dept-name">Finance</span>
                <span className="dept-count">10 employees</span>
              </div>
            </div>
          </Card>
        </div>
        <div className="dashboard-col-4">
          <Card header="Quick Actions" color="success">
            <div className="quick-actions">
              <Button block variant="outline" color="primary" className="action-btn">
                <FaUserPlus /> Bulk Import
              </Button>
              <Button block variant="outline" color="info" className="action-btn">
                <FaFilter /> Export to CSV
              </Button>
              <Button block variant="outline" color="warning" className="action-btn">
                <FaUsers /> Generate Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default EmployeesPage;
