import { createBrowserRouter } from 'react-router';
import { Root } from './root';
import Dashboard from './routes/_index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
]);

export default router;
