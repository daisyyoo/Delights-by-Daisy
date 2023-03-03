import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter, RouterProvider
} from 'react-router-dom';
import App from './app';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  }
]);

const container = document.querySelector('#rooted');
const root = ReactDOM.createRoot(container);

root.render(<RouterProvider router={router} />);
