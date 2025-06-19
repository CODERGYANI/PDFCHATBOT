import React from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <h1>Welcome to PDF Chatbot</h1>
      <button onClick={() => navigate('/login')}>Login</button>
      <button onClick={() => navigate('/register')} style={{ marginLeft: '10px' }}>Register</button>
    </div>
  );
}

export default App;
