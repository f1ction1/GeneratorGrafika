import { useState } from 'react';
import './Auth.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tutaj będzie logika logowania/rejestracji
    console.log(isLogin ? 'Logowanie' : 'Rejestracja');
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
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="firstName">Imię</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    placeholder="Jan"
                    required={!isLogin}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Nazwisko</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    placeholder="Kowalski"
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
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Hasło</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••"
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

            <button type="submit" className="btn btn-primary btn-full">
              {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
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
