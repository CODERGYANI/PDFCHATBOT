function MessageBubble({ msg }) {
  const formatTime = (timeString) => {
    if (!timeString) return ""
    const date = new Date(timeString)
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Extract law name from the answer if available
  const getLawTitle = (answer) => {
    // This is a simple extraction - you might need to adjust based on your actual data
    const firstLine = answer.split("\n")[0]
    if (firstLine && firstLine.length < 100) {
      return firstLine
    }
    return null
  }

  const lawTitle = getLawTitle(msg.answer)
  const answerContent = lawTitle ? msg.answer.substring(lawTitle.length).trim() : msg.answer

  return (
    <div className="bubble-container">
      {/* User Question */}
      <div className="bubble user">
        <div className="bubble-content">
          {msg.question}
          {msg.time && <div className="message-time">{formatTime(msg.time)}</div>}
        </div>
      </div>

      {/* Bot Response - FULL WIDTH PROFESSIONAL DESIGN */}
      <div className="bubble bot">
        <div className="bubble-content">
          <div className="bot-header">
            <div className="bot-avatar">🤖</div>
            <div className="bot-name">YourAI Assistant</div>
          </div>

          <div className="bot-content">
            {lawTitle && <div className="bot-title">{lawTitle}</div>}

            <div className="bot-body">
              {answerContent
                .split("\n")
                .map((paragraph, index) => (paragraph.trim() ? <p key={index}>{paragraph}</p> : null))
                .filter(Boolean)}
            </div>

            {/* Source Section - Integrated into the main message */}
            {msg.source && (
              <div className="source-section">
                <div className="source-header">
                  <span className="source-icon">📚</span>
                  <span>Sources</span>
                </div>
                <div className="source-content">{msg.source}</div>
              </div>
            )}

            {msg.time && <div className="message-time">{formatTime(msg.time)}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
