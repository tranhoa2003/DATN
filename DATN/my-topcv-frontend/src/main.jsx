import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from './components/Auth/Register';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext'; // ✅ Thêm dòng này
import './styles/main.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <ChatProvider> {/* ✅ Bọc thêm ChatProvider */}
          <App />
        </ChatProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
