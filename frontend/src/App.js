import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/Home';
import AuthPage from './pages/Auth';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/auth', element: <AuthPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
