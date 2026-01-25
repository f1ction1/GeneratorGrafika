import { useState, useEffect } from 'react';
import './Auth.css';
import fetcher from '../api/fetcher';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Sprawdź czy użytkownik jest już zalogowany
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Jeśli token istnieje, przekieruj do dashboard
      window.location.href = '/dashboard';
    }
  }, []);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsResetMode(false);
    setError('');
    setSuccessMessage('');
  };

  const toggleResetMode = () => {
    setIsResetMode(!isResetMode);
    setError('');
    setSuccessMessage('');
  };

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

    try {
      if (isResetMode) {
        // Password reset request
        const response = await fetch('http://localhost:8000/auth/password/reset/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Reset request failed');
        }

        setSuccessMessage('If the email exists, password reset instructions were sent.');
        setFormData({ ...formData, email: '' });
      } else if (!isLogin) {
        // Rejestracja
        if (formData.password !== formData.confirmPassword) {
          setError('The passwords do not match.');
          setLoading(false);
          return;
        }

        const response = await fetcher('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            password: formData.password,
            password_confirm: formData.confirmPassword,
            role: 'owner'
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Registration failed');
        }

        const data = await response.json();
        console.log('Zarejestrowano pomyślnie, token:', data.access_token);
        
        localStorage.setItem('token', data.access_token);
        
        // Sprawdź status użytkownika i przekieruj do odpowiedniej strony
        await checkUserStatusAndRedirect(data.access_token);
        
      } else {
        // Logowanie
        const response = await fetcher('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Login failed');
        }

        const data = await response.json();
        console.log('Zalogowano pomyślnie, token:', data.access_token);
        
        localStorage.setItem('token', data.access_token);
        
        // Sprawdź status użytkownika i przekieruj do odpowiedniej strony
        await checkUserStatusAndRedirect(data.access_token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funkcja sprawdzająca status użytkownika i przekierowująca
  const checkUserStatusAndRedirect = async (token) => {
    try {
      // Sprawdź czy użytkownik ma employer poprzez GET /employer
      const employerResponse = await fetch('/employer', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Jeśli 404, użytkownik nie ma employer - przekieruj do complete-registration
      if (employerResponse.status === 404) {
        window.location.href = '/complete-registration';
      } 
      // Jeśli 200, użytkownik ma employer - przekieruj do dashboard
      else if (employerResponse.ok) {
        window.location.href = '/dashboard';
      } 
      // Inne błędy - domyślnie przekieruj do dashboard (może być manager bez employer)
      else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Błąd sprawdzania statusu:', err);
      // W przypadku błędu, przekieruj do dashboard
      window.location.href = '/dashboard';
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
            <h1 className="auth-title">
              {isResetMode ? 'Passowrd reset' : (isLogin ? 'Welcome back!' : 'Join us')}
            </h1>
            <p className="auth-subtitle">
              {isResetMode 
                ? 'Type your email to get reset your passowrd'
                : (isLogin 
                  ? 'Sign in to continue' 
                  : 'Create account and start using Schedulr')}
            </p>
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
            
            {!isLogin && !isResetMode && (
              <>
                <div className="form-group">
                  <label htmlFor="firstName">First name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    placeholder="Jan"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required={!isLogin}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    placeholder="Kowalski"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {!isResetMode && (
              <>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input 
                      type="password" 
                      id="confirmPassword" 
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>
                )}
              </>
            )}

            {isLogin && !isResetMode && (
              <div className="form-extras">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button" onClick={toggleResetMode} className="forgot-password">
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Loading...' : (isResetMode ? 'Send password reset' : (isLogin ? 'Sign in' : 'Sign up'))}
            </button>

            {isResetMode && (
              <button 
                type="button" 
                onClick={toggleResetMode} 
                className="btn btn-full"
                style={{ marginTop: '10px', background: 'rgba(255,255,255,0.1)', color: 'white' }}
              >
                Back to login
              </button>
            )}
          </form>

          {!isResetMode && (
            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have account yet?" : 'Already have account?'}
                {' '}
                <button type="button" onClick={toggleMode} className="link-button">
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
