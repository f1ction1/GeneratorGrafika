import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import { 
  Card, 
  Button,
} from '../components/dashboard';
import { 
  FaUser,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
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
      setUserData(data);
      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      });
    } catch (err) {
      setError('Failed to load user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update user data');
      }

      const data = await response.json();
      setSuccess('Profile updated successfully!');
      setUserData(data);
      setIsEditing(false);
      
      // Odśwież dane użytkownika
      fetchUserData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    if (userData) {
      setFormData({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.profilePage}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Profile</h1>
          <p className={styles.pageSubtitle}>Manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button color="primary" onClick={() => setIsEditing(true)}>
            <FaEdit /> Edit Profile
          </Button>
        ) : (
          <div className={styles.headerActions}>
            <Button 
              color="danger" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <FaTimes /> Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          <FaCheckCircle /> {success}
        </div>
      )}
      {error && (
        <div className={`${styles.alert} ${styles.alertDanger}`}>
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {/* User Information Form */}
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <Card header="Personal Information" color="primary">
          <div className={styles.formContent}>
            <div className={styles.formGroup}>
              <label htmlFor="first_name">
                <FaUser className={styles.labelIcon} />
                First Name *
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                className={styles.formInput}
                placeholder="Enter first name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="last_name">
                <FaUser className={styles.labelIcon} />
                Last Name *
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                className={styles.formInput}
                placeholder="Enter last name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">
                <FaEnvelope className={styles.labelIcon} />
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                className={styles.formInput}
                placeholder="Enter email"
              />
            </div>

            {isEditing && (
              <div className={styles.formActions}>
                <Button 
                  type="submit" 
                  color="success" 
                  disabled={isSubmitting}
                  className={styles.saveButton}
                >
                  <FaSave /> {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </form>

      {/* User Info Card */}
      {userData && (
        <Card header="Account Details" color="info">
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>User ID:</span>
              <span className={styles.infoValue}>{userData.id}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Role:</span>
              <span className={styles.infoValue}>{userData.role}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
