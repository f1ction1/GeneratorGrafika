import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import HomePage from './pages/Home';
import AuthPage from './pages/Auth';
import DashboardPage from './pages/Dashboard';
import EmployeesPage from './pages/Employees';
import SchedulePage from './pages/Schedule';

import AppLayout from './components/Layout';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/auth', element: <AuthPage /> },
  {
    path: '/dashboard',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'schedule', element: <SchedulePage /> },

    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;