import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { BrowserRouter } from 'react-router-dom';

const container = document.querySelector('#rooted');
const root = ReactDOM.createRoot(container);

// root.render(<App/>);

root.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>

);
