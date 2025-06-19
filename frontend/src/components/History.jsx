import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const user_id = localStorage.getItem('user_id');
      if (!user_id) return alert('Login first');
      const res = await axios.get(`http://localhost:8000/chat/history`, {
        params: { user_id }
      });
      setHistory(res.data);
    };
    fetchHistory();
  }, []);

  return (
    <div className="container">
      <h2>Conversation History</h2>
      <ul>
        {history.map((msg, i) => (
          <li key={i}>
            <b>Q:</b> {msg.question}<br />
            <b>A:</b> {msg.answer}<br />
            <small>{msg.source}</small>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/chat')}>Back to Chat</button>
    </div>
  );
}

export default History;
