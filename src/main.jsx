import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AudioProvider } from './hooks/useAudio';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AudioProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AudioProvider>
    </BrowserRouter>
  </React.StrictMode>
);
