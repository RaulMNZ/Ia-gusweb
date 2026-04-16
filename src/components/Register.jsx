import { useState } from 'react';

export default function Register({ goToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verifica se o email já existe
    if (users.some(u => u.email === email)) {
      alert('Este email já está cadastrado!');
      return;
    }

    // Salva novo usuário
    const newUser = { name, email, password };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    
    alert('Conta criada com sucesso! Faça login.');
    goToLogin();
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1>Criar Conta 🚀</h1>
      <p>Preencha os dados abaixo para começar.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome Completo</label>
          <input 
            type="text" 
            placeholder="João da Silva" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>

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
            placeholder="Crie uma senha forte" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required 
          />
        </div>

        <button type="submit" className="btn btn-primary">Cadastrar</button>
      </form>

      <button className="btn btn-link" onClick={goToLogin}>
        Já tem uma conta? Faça login.
      </button>
    </div>
  );
}