import { useState } from "react";
import '../styles/Dashboard.css';

export function Dashboard() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations] = useState([
    { id: 1, name: "John Doe", messages: [{ sender: "John", text: "Hello!", time: "10:00 AM" }, { sender: "John", text: "Hello!", time: "10:00 AM" }, { sender: "You", text: "Hi!", time: "10:01 AM" }, { sender: "John", text: "Hello!", time: "10:00 AM" }, { sender: "You", text: "Hi!", time: "10:01 AM" }] },
    { id: 2, name: "Jane Smith", messages: [{ sender: "Jane", text: "How are you?", time: "11:00 AM" }, { sender: "You", text: "Good, thanks!", time: "11:01 AM" }] },
  ]);

  const [selectedIcon, setSelectedIcon] = useState("chat");
  const [newMessage, setNewMessage] = useState("");

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const updatedMessages = [
        ...selectedConversation.messages,
        { sender: "You", text: newMessage, time: new Date().toLocaleTimeString() },
      ];
      setSelectedConversation({ ...selectedConversation, messages: updatedMessages });
      setNewMessage("");
    }
  };

  const renderMessages = (messages) => {
    return messages.map((message, index) => {
      const isLastMessageFromSender =
        index === messages.length - 1 || messages[index + 1].sender !== message.sender;

      return (
        <div key={index} className={`message ${message.sender === "You" ? "user" : "other"}`}>
          {message.text}
          {isLastMessageFromSender && (
            <div className="message-info">
              <span className="profile-pic">{message.sender}</span>
              <span className="timestamp">{message.time}</span>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="dashboard-container">
      <div className="left-pane">
        <div className="logo">Logo</div>
        <div
          className={`icon ${selectedIcon === "chat" ? "selected" : ""}`}
          onClick={() => setSelectedIcon("chat")}
        >
          Chat
        </div>
        <div
          className={`icon ${selectedIcon === "contacts" ? "selected" : ""}`}
          onClick={() => setSelectedIcon("contacts")}
        >
          Contacts
        </div>
        <div
          className={`icon ${selectedIcon === "settings" ? "selected" : ""}`}
          onClick={() => setSelectedIcon("settings")}
        >
          Settings
        </div>
      </div>

      <div className="conversations-pane">
        <h2>Conversations</h2>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="conversation-item"
            onClick={() => handleConversationClick(conversation)}
          >
            {conversation.name}
          </div>
        ))}
      </div>

      <div className="chat-pane">
        {selectedConversation ? (
          <>
            <h2>{selectedConversation.name}</h2>
            <div className="messages">
              {renderMessages(selectedConversation.messages)}
            </div>
            <div className="send-message">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="send-message-input"
              />
              <button onClick={handleSendMessage} className="send-message-button">Send</button>
            </div>
          </>
        ) : (
          <p>Select a conversation to start chatting</p>
        )}
      </div>

      <div className="info-pane">
        {selectedConversation && (
          <>
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="profile-picture"
            />
            <h3>{selectedConversation.name}</h3>
          </>
        )}
      </div>
    </div>
  );
}