import { useState } from 'react';

export default function Login({ onLogin, goToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Busca usuários no localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Validação de credenciais
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      alert('Email ou senha incorretos!');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1>Bem-vindo de volta! 👋</h1>
      <p>Faça login para gerenciar suas consultas.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            placeholder="seu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Senha</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>

      <button className="btn btn-link" onClick={goToRegister}>
        Não tem conta? Crie uma agora.
      </button>
    </div>
  );
}