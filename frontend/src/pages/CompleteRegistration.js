import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompleteRegistration.css';

function CompleteRegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await fetch('http://localhost:8000/employer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Nie udało się utworzyć firmy');
      }

      // Rejestracja zakończona pomyślnie, przekieruj do dashboard
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="complete-registration-page">
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="complete-registration-container">
        <div className="complete-registration-card">
          <div className="complete-registration-header">
            <div className="icon-wrapper">
              <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="complete-registration-title">
              Dokończ rejestrację
            </h1>
            <p className="complete-registration-subtitle">
              Aby korzystać z pełni możliwości aplikacji, musisz utworzyć profil swojej firmy
            </p>
          </div>

          <form className="complete-registration-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <svg className="error-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="name">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Nazwa firmy
              </label>
              <input 
                type="text" 
                id="name" 
                placeholder="np. Moja Firma Sp. z o.o."
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Adres firmy
              </label>
              <textarea 
                id="address" 
                placeholder="ul. Przykładowa 123&#10;00-000 Miasto"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Tworzenie firmy...
                </>
              ) : (
                <>
                  <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Utwórz firmę i przejdź dalej
                </>
              )}
            </button>
          </form>

          <div className="info-box">
            <svg className="info-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <p>
              Po utworzeniu firmy będziesz mógł zarządzać pracownikami, tworzyć grafiki i korzystać ze wszystkich funkcji aplikacji.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CompleteRegistrationPage;
