import React, { useState, useEffect } from 'react';
import './Employees.css';
import { 
  Card, 
  Table, 
  Button,
} from '../components/dashboard';
import { 
  FaUsers, 
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaSave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser,
  FaBriefcase,
  FaClock
} from 'react-icons/fa';

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state for adding new employee
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    position: '',
    employment_fraction: 1.0
  });

  // Form state for editing employee
  const [editFormData, setEditFormData] = useState({
    id: null,
    first_name: '',
    last_name: '',
    position: '',
    employment_fraction: 1.0
  });

  // Fetch employees from backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch('http://localhost:8000/employee', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setEmployees([]);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch employees');
      }

      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for add form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'employment_fraction' ? parseFloat(value) : value
    }));
  };

  // Handle input change for edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'employment_fraction' ? parseFloat(value) : value
    }));
  };

  // Handle add employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/employee', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add employee');
      }

      setSuccess('Employee added successfully!');
      setFormData({
        first_name: '',
        last_name: '',
        position: '',
        employment_fraction: 1.0
      });
      setIsAdding(false);
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit employee
  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setEditFormData({
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      position: employee.position,
      employment_fraction: employee.employment_fraction
    });
    setError('');
    setSuccess('');
  };

  // Handle save edited employee
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/employee', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update employee');
      }

      setSuccess('Employee updated successfully!');
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({
      id: null,
      first_name: '',
      last_name: '',
      position: '',
      employment_fraction: 1.0
    });
    setError('');
    setSuccess('');
  };

  // Handle delete employee
  const handleDelete = async (employee) => {
    if (!window.confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`)) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/employee', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: employee.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete employee');
      }

      setSuccess('Employee deleted successfully!');
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  // Table columns configuration
  const tableColumns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'name', 
      label: 'Name',
      render: (_, row) => (
        editingId === row.id ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              name="first_name"
              value={editFormData.first_name}
              onChange={handleEditInputChange}
              placeholder="First Name"
              style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="text"
              name="last_name"
              value={editFormData.last_name}
              onChange={handleEditInputChange}
              placeholder="Last Name"
              style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        ) : (
          `${row.first_name} ${row.last_name}`
        )
      )
    },
    { 
      key: 'position', 
      label: 'Position',
      render: (value, row) => (
        editingId === row.id ? (
          <input
            type="text"
            name="position"
            value={editFormData.position}
            onChange={handleEditInputChange}
            placeholder="Position"
            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        ) : (
          value || 'N/A'
        )
      )
    },
    { 
      key: 'employment_fraction', 
      label: 'Employment',
      render: (value, row) => (
        editingId === row.id ? (
          <input
            type="number"
            name="employment_fraction"
            value={editFormData.employment_fraction}
            onChange={handleEditInputChange}
            min="0.1"
            max="1.0"
            step="0.05"
            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        ) : (
          `${(value * 100).toFixed(0)}%`
        )
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          {editingId === row.id ? (
            <>
              <Button 
                size="sm" 
                color="success" 
                onClick={handleSaveEdit}
              >
                <FaSave /> Save
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                color="danger" 
                onClick={handleCancelEdit}
              >
                <FaTimes /> Cancel
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="employees-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Management</h1>
          <p className="page-subtitle">Manage your workforce and team members</p>
        </div>
        {!isAdding ? (
          <Button color="primary" onClick={() => setIsAdding(true)}>
            <FaPlus /> Add Employee
          </Button>
        ) : (
          <Button color="danger" variant="outline" onClick={() => setIsAdding(false)}>
            <FaTimes /> Cancel
          </Button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="alert alert-success">
          <FaCheckCircle /> {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {/* Add Employee Form */}
      {isAdding && (
        <Card header="Add New Employee" color="primary">
          <form onSubmit={handleAddEmployee} className="employee-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">
                  <FaUser className="label-icon" />
                  First Name *
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter first name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">
                  <FaUser className="label-icon" />
                  Last Name *
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter last name"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="position">
                  <FaBriefcase className="label-icon" />
                  Position *
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Developer, Manager"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="employment_fraction">
                  <FaClock className="label-icon" />
                  Employment Fraction *
                </label>
                <input
                  type="number"
                  id="employment_fraction"
                  name="employment_fraction"
                  value={formData.employment_fraction}
                  onChange={handleInputChange}
                  required
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  placeholder="1.0 = full-time"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit" color="success">
                <FaSave /> Add Employee
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Employee Table */}
      <Card header={`Employees (${employees.length})`} color="primary">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <FaUsers style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
            <p>No employees found. Add your first employee to get started!</p>
          </div>
        ) : (
          <Table
            columns={tableColumns}
            data={employees}
            striped
            hover
          />
        )}
      </Card>
    </div>
  );
}

export default EmployeesPage;
