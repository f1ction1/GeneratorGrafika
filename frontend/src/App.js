import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import EmployerPage, {
  loader as employerLoader,
  action as employerAction,
} from './pages/Employer';

import HomePage from './pages/Home';
import AuthPage from './pages/Auth';
import CompleteRegistrationPage from './pages/CompleteRegistration';
import DashboardPage from './pages/Dashboard';
import EmployeesPage from './pages/Employees';
import SchedulePage, { action as SchedulePageAction } from './pages/Schedule';
import ResetPasswordPage from './pages/ResetPassword';
import ProfilePage from './pages/Profile';

import AppLayout from './components/Layout';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/complete-registration', element: <CompleteRegistrationPage /> },
  {
    path: '/dashboard',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      {
        path: 'schedule',
        element: <SchedulePage />,
        action: SchedulePageAction,
      },
      {
        path: 'employer',
        element: <EmployerPage />,
        loader: employerLoader,
        action: employerAction,
      },
      { path: 'profile', element: <ProfilePage /> },
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
