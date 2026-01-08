import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';
import fetcher from '../api/fetcher';

function AppLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        // Sprawdź czy użytkownik ma employer poprzez GET /employer
        const response = await fetcher('/employer', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Jeśli 401, token nieprawidłowy - wyloguj
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/auth');
          return;
        }

        // Jeśli 404, użytkownik nie ma employer - przekieruj do complete-registration
        if (response.status === 404) {
          navigate('/complete-registration');
          return;
        }
        
        // Jeśli OK lub inny błąd (np. użytkownik może być managerem), pozwól na dostęp
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking user status:', error);
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="app-layout" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
