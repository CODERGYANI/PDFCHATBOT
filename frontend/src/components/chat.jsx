import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import MessageBubble from './MessageBubble';
import Upload from './Upload';

function Chat() {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const chatEndRef = useRef(null);

  const user_id = localStorage.getItem('user_id');

  
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user_id) return;
      try {
        const res = await axios.get('http://localhost:8000/chat/history', {
          params: { user_id },
        });
        setHistory(res.data.reverse());
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    fetchHistory();
  }, [user_id]);

  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/chat/ask', {
        user_id,
        question,
      });

      const newEntry = {
        question,
        answer: res.data.answer,
        source: res.data.source,
        time: new Date().toISOString(),
      };

      setHistory([newEntry, ...history]);
      setSelectedConversation(newEntry);
      setQuestion('');
    } catch (error) {
      console.error('Error sending question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (convo) => {
    setSelectedConversation(convo);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="chat-container">
      <Sidebar history={history} onSelect={handleSelectConversation} />

      <div className="chat-main">
        <div className="chat-header">
          <span className="header-icon">🧠</span>
          <span className="header-title">YourAI Assistant</span>
        </div>

        <div className="chat-body">
          {selectedConversation ? (
            <MessageBubble msg={selectedConversation} />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <p className="empty-state-text">
                Select a conversation from the history to view it, or start a new conversation below.
              </p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-bar">
          <div className="input-container">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything based on the PDF..."
              rows={3}
              className={`chat-textarea ${loading ? "loading-pulse" : ""}`}
            />
          </div>

          <div className="chat-input-actions">
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className={`ask-button ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Thinking...
                </>
              ) : (
                <>
                  <span className="send-icon">📤</span>
                  Ask
                </>
              )}
            </button>

            <div className="upload-container">
              <Upload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
