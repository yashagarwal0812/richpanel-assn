import { useState, useEffect, useRef } from "react";
import axios from "axios";
import '../styles/Dashboard.css';

export function Dashboard() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState("chat");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/conversation`, {
          headers: {
            Authorisation: localStorage.getItem("token"),
          },
        });
        const formattedConversations = response.data.map((conversation) => ({
          id: conversation.psid,
          name: conversation.psid,
          messages: conversation.messages.map((message) => ({
            sender: message.direction === "inbound" ? "Other" : "You",
            text: message.text,
            time: new Date(message.timestamp).toLocaleTimeString(),
          })),
        }));
        setConversations(formattedConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the messages when a new message is sent
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation?.messages]);

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const messageData = {
        recipientId: selectedConversation.id,
        messageText: newMessage,
      };

      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/messages/send`, messageData, {
        headers: {
          "Content-Type": "application/json",
          Authorisation: localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (response.status === 200) {
            const updatedMessages = [
              ...selectedConversation.messages,
              { sender: "You", text: newMessage, time: new Date().toLocaleTimeString() },
            ];
            setSelectedConversation({ ...selectedConversation, messages: updatedMessages });
            setNewMessage("");
          } else {
            console.error("Error sending message:", response.statusText);
          }
        })
        .catch((error) => console.error("Error sending message:", error));
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
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
            <div className="messages" style={{ overflowY: "auto", maxHeight: "calc(100vh - 150px)" }}>
              {renderMessages(selectedConversation.messages)}
              <div ref={messagesEndRef} />
            </div>
            <div className="send-message">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
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