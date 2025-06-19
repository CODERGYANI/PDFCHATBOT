import React from 'react';

function Sidebar({ history, onSelect }) {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const truncateQuestion = (question, maxLength = 50) => {
    if (question.length <= maxLength) return question;
    return question.substring(0, maxLength) + "...";
  };

  return (
    <div className="sidebar">
      <h2>💬 Chat History</h2>

      {history.length === 0 ? (
        <div className="sidebar-empty">
          <div className="sidebar-empty-icon">📝</div>
          <p className="sidebar-empty-text">
            No conversations yet. Start chatting to see your history here!
          </p>
        </div>
      ) : (
        <div className="sidebar-list">
          {history.map((msg, i) => (
            <div
              key={i}
              className="sidebar-item"
              onClick={() => onSelect(msg)}
              title={msg.question}
            >
              <div className="sidebar-item-content">
                <div className="sidebar-item-question">
                  {truncateQuestion(msg.question)}
                </div>
                {msg.time && (
                  <div className="sidebar-item-time">
                    {formatTime(msg.time)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
