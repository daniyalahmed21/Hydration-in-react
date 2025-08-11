import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

// Access the initial state passed from the server
const initialTodos = window.__INITIAL_DATA__;

// Hydrate the server-rendered root element
const root = hydrateRoot(
  document.getElementById('root'),
  <App initialTodos={initialTodos} />
);