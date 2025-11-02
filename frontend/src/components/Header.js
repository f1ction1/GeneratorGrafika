import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <h2 className="header-title">Panel administracyjny</h2>
      </div>
      <div className="header-right">
        <div className="user-avatar">U</div>
      </div>
    </header>
  );
}

export default Header;
