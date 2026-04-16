import { useState, useEffect } from 'react';

export default function Dashboard({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  // Estados do formulário
  const [patient, setPatient] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Clínico Geral');

  // Carrega as consultas exclusivas do usuário logado ao montar o componente
  useEffect(() => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const userAppointments = allAppointments.filter(app => app.userEmail === user.email);
    
    // Ordena por data e hora
    userAppointments.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    setAppointments(userAppointments);
  }, [user.email]);

  const saveToLocalStorage = (newAppointments) => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    // Remove as consultas antigas deste usuário e adiciona as novas
    const otherUsersAppointments = allAppointments.filter(app => app.userEmail !== user.email);
    localStorage.setItem('appointments', JSON.stringify([...otherUsersAppointments, ...newAppointments]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação 1: Não permitir datas passadas
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    if (selectedDateTime < now) {
      alert('Não é possível agendar em datas e horários que já passaram.');
      return;
    }

    // Validação 2: Não permitir horários duplicados para o mesmo usuário
    const isDuplicate = appointments.some(app => 
      app.date === date && app.time === time && app.id !== editingId
    );
    if (isDuplicate) {
      alert('Você já possui uma consulta agendada para este exato horário!');
      return;
    }

    let updatedAppointments;

    if (editingId) {
      // Editando existente
      updatedAppointments = appointments.map(app => 
        app.id === editingId ? { ...app, patient, date, time, type } : app
      );
      alert('Consulta atualizada com sucesso!');
    } else {
      // Criando nova
      const newAppointment = {
        id: Date.now().toString(),
        userEmail: user.email,
        patient,
        date,
        time,
        type
      };
      updatedAppointments = [...appointments, newAppointment];
      alert('Consulta agendada com sucesso!');
    }

    // Reordena após adicionar/editar
    updatedAppointments.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    
    setAppointments(updatedAppointments);
    saveToLocalStorage(updatedAppointments);
    resetForm();
  };

  const handleEdit = (app) => {
    setEditingId(app.id);
    setPatient(app.patient);
    setDate(app.date);
    setTime(app.time);
    setType(app.type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja cancelar esta consulta?')) {
      const updatedAppointments = appointments.filter(app => app.id !== id);
      setAppointments(updatedAppointments);
      saveToLocalStorage(updatedAppointments);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setPatient('');
    setDate('');
    setTime('');
    setType('Clínico Geral');
  };

  // Formata data para o padrão brasileiro (DD/MM/YYYY)
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <header className="app-header">
        <h1>Olá, {user.name.split(' ')[0]}</h1>
        <button onClick={onLogout} className="logout-btn">Sair</button>
      </header>

      <div className="container">
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--border)' }}>
          <h2>{editingId ? 'Editar Consulta' : 'Nova Consulta'}</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome do Paciente</label>
              <input 
                type="text" 
                value={patient} 
                onChange={(e) => setPatient(e.target.value)} 
                required 
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Data</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Hora</label>
                <input 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Especialidade</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Clínico Geral">Clínico Geral</option>
                <option value="Dentista">Dentista</option>
                <option value="Psicólogo">Psicólogo</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              {editingId ? 'Atualizar Consulta' : 'Agendar Horário'}
            </button>
            
            {editingId && (
              <button type="button" className="btn btn-link" onClick={resetForm}>
                Cancelar Edição
              </button>
            )}
          </form>
        </div>

        <h2>Minhas Consultas ({appointments.length})</h2>
        
        {appointments.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Você ainda não tem consultas agendadas.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {appointments.map((app) => (
              <div key={app.id} className="appointment-card">
                <div className="card-header">
                  <strong>{app.patient}</strong>
                  <span className="badge">{app.type}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  📅 {formatDate(app.date)} às ⏰ {app.time}
                </div>
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => handleEdit(app)}>Editar</button>
                  <button className="btn-danger" onClick={() => handleDelete(app.id)}>Cancelar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}