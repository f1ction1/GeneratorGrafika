import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/Home';
import ProfilePage from './pages/Profile';
import EmployerPage from './pages/Employer';
import EmployeesPage from './pages/Employee';
import RootLoyout from './pages/Root';
import SchedulePage from './pages/Schedule';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLoyout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/employer', element: <EmployerPage /> },
      { path: '/employees', element: <EmployeesPage /> },
      { path: '/schedule', element: <SchedulePage /> },
    ],
  }

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
