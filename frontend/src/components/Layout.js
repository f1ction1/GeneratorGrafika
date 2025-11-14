import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

function AppLayout() {
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
