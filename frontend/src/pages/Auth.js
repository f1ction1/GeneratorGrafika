import { useState } from 'react';
import './Auth.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
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
    setLoading(true);

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Hasła nie pasują do siebie');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            password: formData.password,
            role: 'owner'
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Rejestracja nie powiodła się');
        }

        const data = await response.json();
        console.log('Zarejestrowano pomyślnie, token:', data.access_token);
        
        
        localStorage.setItem('token', data.access_token);
        
        window.location.href = '/dashboard';
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {

      console.log('Logowanie');
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
            <h1 className="auth-title">
              {isLogin ? 'Witaj ponownie!' : 'Dołącz do nas'}
            </h1>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Zaloguj się, aby kontynuować' 
                : 'Stwórz konto i zacznij korzystać z Schedulr'}
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
            
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="firstName">Imię</label>
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
                  <label htmlFor="lastName">Nazwisko</label>
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
                placeholder="twoj@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Hasło</label>
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
                <label htmlFor="confirmPassword">Potwierdź hasło</label>
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

            {isLogin && (
              <div className="form-extras">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Zapamiętaj mnie</span>
                </label>
                <a href="#" className="forgot-password">Zapomniałeś hasła?</a>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Ładowanie...' : (isLogin ? 'Zaloguj się' : 'Zarejestruj się')}
            </button>
          </form>


          <div className="auth-footer">
            <p>
              {isLogin ? 'Nie masz konta?' : 'Masz już konto?'}
              {' '}
              <button type="button" onClick={toggleMode} className="link-button">
                {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
