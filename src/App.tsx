import React from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home } from './routes/Home';
import { Tv } from './routes/Tv';
import { Search } from './routes/Search';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  { path: '/tv', element: <Tv /> },
  {
    path: '/search',
    element: <Search />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
