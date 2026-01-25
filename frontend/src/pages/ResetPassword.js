import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Auth.css';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('No reset token. The link is invalid.');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!token) {
      setError('No reset token.');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('The passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/auth/password/reset/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          new_password: formData.newPassword,
          new_password_confirm: formData.confirmPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Unable to reset password');
      }

      setSuccessMessage('Your password has been changed! Redirecting to login...');
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Set a new password</h1>
            <p className="auth-subtitle">Enter your new password below</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message" style={{
                padding: '10px',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: '4px',
                marginBottom: '15px'
              }}>
                {error}
              </div>
            )}

            {successMessage && (
              <div className="success-message" style={{
                padding: '10px',
                backgroundColor: '#efe',
                color: '#3c3',
                borderRadius: '4px',
                marginBottom: '15px'
              }}>
                {successMessage}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="newPassword">New password</label>
              <input 
                type="password" 
                id="newPassword" 
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm new password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading || !token}>
              {loading ? 'Reset...' : 'Change password'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Remember password?{' '}
              <button type="button" onClick={() => navigate('/auth')} className="link-button">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
