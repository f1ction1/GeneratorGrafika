import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
