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
      setError('Brak tokenu resetującego. Link jest nieprawidłowy.');
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
      setError('Brak tokenu resetującego.');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Hasła nie pasują do siebie');
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
        throw new Error(errorData.detail || 'Nie udało się zresetować hasła');
      }

      setSuccessMessage('Hasło zostało zmienione! Przekierowanie do logowania...');
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
            <h1 className="auth-title">Ustaw nowe hasło</h1>
            <p className="auth-subtitle">Wprowadź swoje nowe hasło poniżej</p>
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
              <label htmlFor="newPassword">Nowe hasło</label>
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
              <label htmlFor="confirmPassword">Potwierdź nowe hasło</label>
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
              {loading ? 'Resetowanie...' : 'Zmień hasło'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Pamiętasz hasło?{' '}
              <button type="button" onClick={() => navigate('/auth')} className="link-button">
                Wróć do logowania
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
