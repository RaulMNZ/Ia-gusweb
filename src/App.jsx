import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'

  // Verifica se há um usuário logado ao carregar o app
  useEffect(() => {
    const loggedUser = localStorage.getItem('currentUser');
    if (loggedUser) {
      setCurrentUser(JSON.parse(loggedUser));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setCurrentView('login');
  };

  return (
    <>
      {currentView === 'login' && (
        <Login 
          onLogin={handleLogin} 
          goToRegister={() => setCurrentView('register')} 
        />
      )}
      {currentView === 'register' && (
        <Register 
          goToLogin={() => setCurrentView('login')} 
        />
      )}
      {currentView === 'dashboard' && currentUser && (
        <Dashboard 
          user={currentUser} 
          onLogout={handleLogout} 
        />
      )}
    </>
  );
}

export default App;