import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Routes from '@/Router/Routes';
import './index.css';
import { Auth, AuthContext } from './Context/AuthContext';

const router = createBrowserRouter(Routes)
const auth = new Auth();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>    
    <AuthContext.Provider value={ auth }>
      <RouterProvider router={router}/>
    </AuthContext.Provider>    
  </React.StrictMode>
)
