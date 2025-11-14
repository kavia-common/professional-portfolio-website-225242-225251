import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { getLogger } from './utils/logger';

const logger = getLogger('AppInit');
logger.info('app_boot', { version: '0.1.0' });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
