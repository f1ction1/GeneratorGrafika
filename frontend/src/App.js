import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import HomePage from './pages/Home';
import AuthPage from './pages/Auth';
import DashboardPage from './pages/Dashboard';
import EmployeesPage from './pages/Employees';
import SchedulePage from './pages/Schedule';
import ResetPasswordPage from './pages/ResetPassword';

import AppLayout from './components/Layout';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
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