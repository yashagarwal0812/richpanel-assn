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

      return (<>
        <div key={index} className={`message ${message.sender === "You" ? "user" : "other"}`}>
            {isLastMessageFromSender && (
            <div className={`profile-pic-svg ${message.sender === "You" ? "user" : "other"}`}>
                <svg height="25px" width="25px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 512 512"  xml:space="preserve">
                    <g>
                        <path fill="currentColor" class="st0" d="M256,0C114.613,0,0,114.616,0,255.996C0,397.382,114.613,512,256,512c141.386,0,256-114.617,256-256.004
                            C512,114.616,397.387,0,256,0z M255.996,401.912c-69.247-0.03-118.719-9.438-117.564-18.058
                            c6.291-47.108,44.279-51.638,68.402-70.94c10.832-8.666,16.097-6.5,16.097-20.945c0-5.053,0-14.446,0-23.111
                            c-6.503-7.219-8.867-6.317-14.366-34.663c-11.112,0-10.396-14.446-15.638-27.255c-4.09-9.984-0.988-14.294,2.443-16.165
                            c-1.852-9.87-0.682-43.01,13.532-60.259l-2.242-15.649c0,0,4.47,1.121,15.646-1.122c11.181-2.227,38.004-8.93,53.654,4.477
                            c37.557,5.522,47.53,36.368,40.204,72.326c3.598,1.727,7.178,5.962,2.901,16.392c-5.238,12.809-4.522,27.255-15.634,27.255
                            c-5.496,28.346-7.863,27.444-14.366,34.663c0,8.666,0,18.058,0,23.111c0,14.445,5.261,12.279,16.093,20.945
                            c24.126,19.301,62.111,23.831,68.406,70.94C374.715,392.474,325.246,401.882,255.996,401.912z"/>
                    </g>
                    </svg>
            </div>
          )}
          {message.text}
        </div>
        {isLastMessageFromSender && (
            <div className={`message-info ${message.sender === "You" ? "user" : "other"}`}>
              <span className="profile-pic">{message.sender}</span>
              <span className="timestamp">{message.time}</span>
            </div>
          )}
        </>
      );
    });
  };

  return (
    <div className="dashboard-container">
      <div className="left-pane">
        <img src="/logo.png" alt="Logo" className="logo" />
        <div
          className={`icon ${selectedIcon === "chat" ? "selected" : ""}`}
          onClick={() => setSelectedIcon("chat")}
        >
          <svg width="30px" height="30px" viewBox="0 -32 576 576" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M567.938 243.908L462.25 85.374A48.003 48.003 0 0 0 422.311 64H153.689a48 48 0 0 0-39.938 21.374L8.062 243.908A47.994 47.994 0 0 0 0 270.533V400c0 26.51 21.49 48 48 48h480c26.51 0 48-21.49 48-48V270.533a47.994 47.994 0 0 0-8.062-26.625zM162.252 128h251.497l85.333 128H376l-32 64H232l-32-64H76.918l85.334-128z"/></svg>
        </div>
        <div
          className={`icon ${selectedIcon === "contacts" ? "selected" : ""}`}
          onClick={() => setSelectedIcon("contacts")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
                width="30px" height="30px" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve">
            <g>
                <path fill="currentColor" d="M42,22.3c-2.8-1.1-3.2-2.2-3.2-3.3s0.8-2.2,1.8-3c1.7-1.4,2.6-3.5,2.6-5.8c0-4.4-2.9-8.2-8-8.2
                    c-4.7,0-7.5,3.2-7.9,7.1c0,0.4,0.2,0.7,0.5,0.9c3.8,2.4,6.1,6.6,6.1,11.7c0,3.8-1.5,7.2-4.2,9.6c-0.2,0.2-0.2,0.6,0,0.8
                    c0.7,0.5,2.3,1.2,3.3,1.7c0.3,0.1,0.5,0.2,0.8,0.2h12.1c2.3,0,4.1-1.9,4.1-4v-0.6C50,25.9,46.2,24,42,22.3z"/>
                <path fill="currentColor" d="M28.6,36.2c-3.4-1.4-3.9-2.6-3.9-3.9c0-1.3,1-2.6,2.1-3.6c2-1.7,3.1-4.1,3.1-6.9c0-5.2-3.4-9.7-9.6-9.7
                    c-6.1,0-9.6,4.5-9.6,9.7c0,2.8,1.1,5.2,3.1,6.9c1.1,1,2.1,2.3,2.1,3.6c0,1.3-0.5,2.6-4,3.9c-5,2-9.9,4.3-9.9,8.5V45v1
                    c0,2.2,1.8,4,4.1,4h27.7c2.3,0,4.2-1.8,4.2-4v-1v-0.4C38,40.5,33.6,38.2,28.6,36.2z"/>
            </g>
          </svg>
        </div>
        <div
          className={`icon ${selectedIcon === "settings" ? "selected" : ""}`}
          onClick={() => setSelectedIcon("settings")}
        >
          <svg width="30px" height="30px" viewBox="0 0 6.3500002 6.3500002" id="svg1976" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg">

            <defs id="defs1970"/>

            <g id="layer1">

            <path fill="currentColor" d="m 0.26485,5.8204456 a 0.2645835,0.2645835 0 0 0 -0.26563,0.26563 0.2645835,0.2645835 0 0 0 0.26563,0.26367 h 5.82031 a 0.2645835,0.2645835 0 0 0 0.26562,-0.26367 0.2645835,0.2645835 0 0 0 -0.26562,-0.26563 z" id="path726" />

            <path fill="currentColor" d="m 1.16328,3.9688856 c -0.34722,0 -0.63476,0.28754 -0.63476,0.63477 v 1.48242 a 0.26460996,0.26460996 0 0 0 0.26562,0.26367 h 1.0586 a 0.26460996,0.26460996 0 0 0 0.26367,-0.26367 v -1.48242 c 0,-0.34723 -0.28755,-0.63477 -0.63477,-0.63477 z" id="path728"/>

            <path fill="currentColor" d="m 3.0168,3.0684956 c -0.34722,0 -0.63477,0.28753 -0.63477,0.63477 v 2.38281 a 0.26460996,0.26460996 0 0 0 0.26367,0.26367 h 1.0586 a 0.26460996,0.26460996 0 0 0 0.26367,-0.26367 v -2.38281 c 0,-0.34724 -0.28755,-0.63477 -0.63477,-0.63477 z" id="path730"/>

            <path fill="currentColor" d="m 4.86836,2.2755256 c -0.34722,0 -0.63477,0.28754 -0.63477,0.63477 v 3.17578 a 0.26460996,0.26460996 0 0 0 0.26368,0.26367 h 1.05859 a 0.26460996,0.26460996 0 0 0 0.26563,-0.26367 v -3.17578 c 0,-0.34723 -0.2895,-0.63477 -0.63672,-0.63477 z" id="path732"/>

            <path fill="currentColor" d="M 4.6205208,2.5237e-4 A 0.2645835,0.2645835 0 0 0 4.3564534,0.26380219 0.2645835,0.2645835 0 0 0 4.6205208,0.52941905 H 4.8938883 C 3.3974791,1.8159538 1.8306324,2.6151331 0.2161369,2.9142865 A 0.2645835,0.2645835 0 0 0 0.0052984,3.2227949 0.2645835,0.2645835 0 0 0 0.3117388,3.4357016 C 2.050091,3.1136013 3.722697,2.2498105 5.2923138,0.88753671 V 1.1991456 A 0.2645835,0.2645835 0 0 0 5.5558626,1.4647625 0.2645835,0.2645835 0 0 0 5.8214805,1.1991456 V 0.41986501 C 5.8215308,0.19150501 5.62816,2.0237e-4 5.3998008,2.5237e-4 Z" id="path734"/>

            </g>

            </svg>
        </div>
      </div>

      <div className="conversations-pane">
        <div className="heading">
            <h2>Conversations</h2>
            <svg className="refresh" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 3V8M21 8H16M21 8L18 5.29168C16.4077 3.86656 14.3051 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.2832 21 19.8675 18.008 20.777 14" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div className="conversations">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`conversation-item ${selectedConversation?.id === conversation.id ? "selected" : ""}`}
            onClick={() => handleConversationClick(conversation)}
          >
            <svg height="30px" width="30px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 512 512"  xml:space="preserve">
            <g>
                <path fill="currentColor" class="st0" d="M256,0C114.613,0,0,114.616,0,255.996C0,397.382,114.613,512,256,512c141.386,0,256-114.617,256-256.004
                    C512,114.616,397.387,0,256,0z M255.996,401.912c-69.247-0.03-118.719-9.438-117.564-18.058
                    c6.291-47.108,44.279-51.638,68.402-70.94c10.832-8.666,16.097-6.5,16.097-20.945c0-5.053,0-14.446,0-23.111
                    c-6.503-7.219-8.867-6.317-14.366-34.663c-11.112,0-10.396-14.446-15.638-27.255c-4.09-9.984-0.988-14.294,2.443-16.165
                    c-1.852-9.87-0.682-43.01,13.532-60.259l-2.242-15.649c0,0,4.47,1.121,15.646-1.122c11.181-2.227,38.004-8.93,53.654,4.477
                    c37.557,5.522,47.53,36.368,40.204,72.326c3.598,1.727,7.178,5.962,2.901,16.392c-5.238,12.809-4.522,27.255-15.634,27.255
                    c-5.496,28.346-7.863,27.444-14.366,34.663c0,8.666,0,18.058,0,23.111c0,14.445,5.261,12.279,16.093,20.945
                    c24.126,19.301,62.111,23.831,68.406,70.94C374.715,392.474,325.246,401.882,255.996,401.912z"/>
            </g>
            </svg>
            {conversation.name}
          </div>
        ))}
        </div>
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