import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import EmployerPage, { loader as employerLoader, action as employerAction } from './pages/Employer';

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
      { path: 'employer', element: <EmployerPage />, loader: employerLoader, action: employerAction}
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