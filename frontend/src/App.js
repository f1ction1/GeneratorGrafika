import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/Home';
import AuthPage from './pages/Auth';
import DashboardPage from './pages/Dashboard';
import EmployeesPage from './pages/Employees';
import SchedulePage from './pages/Schedule';
import CompanyPage from './pages/Company';
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
      { path: 'company', element: <CompanyPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
