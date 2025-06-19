import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/auth/register', {
        username,
        password,
      });
      alert('✅ Registered successfully!');
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('❌ Registration failed: ' + (err.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account?{' '}
        <span onClick={() => navigate('/login')} style={{ color: '#4f46e5', cursor: 'pointer' }}>
          Login here
        </span>
      </p>
    </div>
  );
}

export default Register;
