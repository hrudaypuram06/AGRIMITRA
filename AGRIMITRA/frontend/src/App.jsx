import { useState } from 'react';
import Login from './pages/Login';
import FarmProfile from './pages/FarmProfile';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'profile', 'dashboard'
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const navigate = (view) => setCurrentView(view);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">🌱 AgriMitra AI</div>
        <button className="btn btn-outline" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </nav>

      <main className="animate-fade-in">
        {currentView === 'login' && <Login onNavigate={navigate} />}
        {currentView === 'profile' && <FarmProfile onNavigate={navigate} />}
        {currentView === 'dashboard' && <Dashboard onNavigate={navigate} />}
      </main>
    </div>
  );
}

export default App;
