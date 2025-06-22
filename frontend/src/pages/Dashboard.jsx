import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';

export function Dashboard() {
  const navigate = useNavigate();
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

  const handleFacebookNavigation = () => {
    navigate("/facebook");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  };

  return (
    <div className="dashboard-container">
      <div className="left-pane">
        <div className="menu-items">
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
        <div className="navigation">
        <div
          className={`icon ${selectedIcon === "facebook" ? "selected" : ""}`}
          onClick={handleFacebookNavigation}
        >
          <svg width="30px" height="30px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M640 384v64H448a128 128 0 0 0-128 128v128a128 128 0 0 0 128 128h320a128 128 0 0 0 128-128V576a128 128 0 0 0-64-110.848V394.88c74.56 26.368 128 97.472 128 181.056v128a192 192 0 0 1-192 192H448a192 192 0 0 1-192-192V576a192 192 0 0 1 192-192h192z"/><path fill="currentColor" d="M384 640v-64h192a128 128 0 0 0 128-128V320a128 128 0 0 0-128-128H256a128 128 0 0 0-128 128v128a128 128 0 0 0 64 110.848v70.272A192.064 192.064 0 0 1 64 448V320a192 192 0 0 1 192-192h320a192 192 0 0 1 192 192v128a192 192 0 0 1-192 192H384z"/></svg>
        </div>
        <div
          className={`icon ${selectedIcon === "logout" ? "selected" : ""}`}
          onClick={handleLogout}
        >
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.9453 1.25C13.5778 1.24998 12.4754 1.24996 11.6085 1.36652C10.7084 1.48754 9.95048 1.74643 9.34857 2.34835C8.82363 2.87328 8.55839 3.51836 8.41916 4.27635C8.28387 5.01291 8.25799 5.9143 8.25196 6.99583C8.24966 7.41003 8.58357 7.74768 8.99778 7.74999C9.41199 7.7523 9.74964 7.41838 9.75194 7.00418C9.75803 5.91068 9.78643 5.1356 9.89448 4.54735C9.99859 3.98054 10.1658 3.65246 10.4092 3.40901C10.686 3.13225 11.0746 2.9518 11.8083 2.85315C12.5637 2.75159 13.5648 2.75 15.0002 2.75H16.0002C17.4356 2.75 18.4367 2.75159 19.1921 2.85315C19.9259 2.9518 20.3144 3.13225 20.5912 3.40901C20.868 3.68577 21.0484 4.07435 21.1471 4.80812C21.2486 5.56347 21.2502 6.56459 21.2502 8V16C21.2502 17.4354 21.2486 18.4365 21.1471 19.1919C21.0484 19.9257 20.868 20.3142 20.5912 20.591C20.3144 20.8678 19.9259 21.0482 19.1921 21.1469C18.4367 21.2484 17.4356 21.25 16.0002 21.25H15.0002C13.5648 21.25 12.5637 21.2484 11.8083 21.1469C11.0746 21.0482 10.686 20.8678 10.4092 20.591C10.1658 20.3475 9.99859 20.0195 9.89448 19.4527C9.78643 18.8644 9.75803 18.0893 9.75194 16.9958C9.74964 16.5816 9.41199 16.2477 8.99778 16.25C8.58357 16.2523 8.24966 16.59 8.25196 17.0042C8.25799 18.0857 8.28387 18.9871 8.41916 19.7236C8.55839 20.4816 8.82363 21.1267 9.34857 21.6517C9.95048 22.2536 10.7084 22.5125 11.6085 22.6335C12.4754 22.75 13.5778 22.75 14.9453 22.75H16.0551C17.4227 22.75 18.525 22.75 19.392 22.6335C20.2921 22.5125 21.0499 22.2536 21.6519 21.6517C22.2538 21.0497 22.5127 20.2919 22.6337 19.3918C22.7503 18.5248 22.7502 17.4225 22.7502 16.0549V7.94513C22.7502 6.57754 22.7503 5.47522 22.6337 4.60825C22.5127 3.70814 22.2538 2.95027 21.6519 2.34835C21.0499 1.74643 20.2921 1.48754 19.392 1.36652C18.525 1.24996 17.4227 1.24998 16.0551 1.25H14.9453Z" fill="currentColor"/>
            <path d="M15 11.25C15.4142 11.25 15.75 11.5858 15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H4.02744L5.98809 14.4306C6.30259 14.7001 6.33901 15.1736 6.06944 15.4881C5.79988 15.8026 5.3264 15.839 5.01191 15.5694L1.51191 12.5694C1.34567 12.427 1.25 12.2189 1.25 12C1.25 11.7811 1.34567 11.573 1.51191 11.4306L5.01191 8.43056C5.3264 8.16099 5.79988 8.19741 6.06944 8.51191C6.33901 8.8264 6.30259 9.29988 5.98809 9.56944L4.02744 11.25H15Z" fill="currentColor"/>
            </svg>
        </div>
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
          <p className="skeleton-text">Select a conversation to start chatting</p>
        )}
      </div>

      <div className="info-pane">
        {selectedConversation && (
          <>
          <div className="data">
            <img
              src="https://toppng.b-cdn.net/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png"
              alt="Profile"
              className="profile-picture"
            />
            <h3>{selectedConversation.name}</h3>
            <div className="status-bar">
                <div className="dot"></div>
                <div className="status">Offline</div>
            </div>
            <div className="buttons">
                <div className="call">
                    <svg width="20px" height="20px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.50126 8.23098C6.77229 7.95753 7.11459 7.7656 7.48926 7.67698C7.8517 7.59019 8.23188 7.61458 8.58026 7.74698C8.91971 7.87752 9.20894 8.11248 9.40626 8.41798C9.60531 8.72951 9.70409 9.09458 9.68926 9.46398C9.67449 9.84642 9.55138 10.2168 9.33426 10.532C9.11603 10.8515 8.81349 11.1041 8.46026 11.262C8.1158 11.4173 7.73331 11.4681 7.36026 11.408C6.99957 11.3493 6.66651 11.1785 6.40826 10.92C6.06269 10.5678 5.87873 10.0879 5.90026 9.59498C5.92186 9.0809 6.13646 8.59385 6.50126 8.23098Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1983 17.969C16.4711 17.6962 16.6622 17.3526 16.7503 16.977C16.8375 16.6115 16.8131 16.2284 16.6803 15.877C16.5508 15.537 16.3169 15.2467 16.0123 15.048C15.703 14.8508 15.3407 14.7534 14.9743 14.769C14.5931 14.7842 14.2243 14.908 13.9113 15.126C13.5921 15.3445 13.3394 15.6469 13.1813 16C13.0272 16.3448 12.9765 16.7269 13.0353 17.1C13.1731 17.9766 13.9488 18.6088 14.8353 18.567C15.3489 18.5475 15.8361 18.3337 16.1983 17.969V17.969Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M11.8657 7.05183C11.4525 7.02289 11.094 7.33438 11.0651 7.74759C11.0361 8.16079 11.3476 8.51922 11.7608 8.54817L11.8657 7.05183ZM15.9743 12.6766C16.0117 13.0892 16.3764 13.3933 16.7889 13.3559C17.2014 13.3186 17.5056 12.9539 17.4682 12.5414L15.9743 12.6766ZM13.2957 4.26162C12.8879 4.189 12.4985 4.46072 12.4259 4.86851C12.3533 5.27631 12.625 5.66577 13.0328 5.73838L13.2957 4.26162ZM18.7387 11.3303C18.8195 11.7366 19.2144 12.0004 19.6206 11.9196C20.0269 11.8388 20.2907 11.4439 20.2098 11.0377L18.7387 11.3303ZM7.09732 8.6862C7.34872 8.35701 7.28565 7.88634 6.95645 7.63494C6.62726 7.38354 6.15659 7.4466 5.90519 7.7758L7.09732 8.6862ZM5.52125 10.518L4.78053 10.4004C4.77731 10.4207 4.77492 10.4412 4.77337 10.4617L5.52125 10.518ZM7.88725 16.578L8.43825 16.0692C8.4257 16.0556 8.41265 16.0425 8.39913 16.0298L7.88725 16.578ZM13.9223 18.954L13.9785 19.7019C13.9994 19.7003 14.0202 19.6979 14.0409 19.6945L13.9223 18.954ZM16.6581 18.5641C16.9862 18.3112 17.0472 17.8403 16.7943 17.5122C16.5415 17.1841 16.0705 17.1231 15.7424 17.3759L16.6581 18.5641ZM11.7608 8.54817C13.988 8.7042 15.7729 10.4531 15.9743 12.6766L17.4682 12.5414C17.2004 9.58479 14.8271 7.2593 11.8657 7.05183L11.7608 8.54817ZM13.0328 5.73838C15.9047 6.24979 18.1695 8.46935 18.7387 11.3303L20.2098 11.0377C19.5201 7.57085 16.7757 4.8813 13.2957 4.26162L13.0328 5.73838ZM5.90519 7.7758C5.31858 8.54393 4.93211 9.44583 4.78053 10.4004L6.26197 10.6356C6.37456 9.92663 6.66161 9.25674 7.09732 8.6862L5.90519 7.7758ZM4.77337 10.4617C4.58505 12.9628 5.54216 15.4143 7.37537 17.1262L8.39913 16.0298C6.89847 14.6285 6.11498 12.6217 6.26914 10.5743L4.77337 10.4617ZM7.33625 17.0868C9.03518 18.9266 11.4813 19.8896 13.9785 19.7019L13.866 18.2061C11.8255 18.3595 9.82655 17.5725 8.43825 16.0692L7.33625 17.0868ZM14.0409 19.6945C14.9939 19.5418 15.8936 19.1532 16.6581 18.5641L15.7424 17.3759C15.1761 17.8124 14.5096 18.1003 13.8036 18.2135L14.0409 19.6945Z" fill="#000000"/>
                    </svg>
                    <p>Call</p>
                </div>
                <div className="profile">
                    <svg height="20px" width="20px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
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
                    <p>Profile</p>
                </div>
            </div>
            </div>
            <div className="cards">
                <div className="card">
                    <h3>Customer Details</h3>
                    <div className="row">
                        <div className="key">Email</div>
                        <div className="val">john@richpanel.com</div>
                    </div>
                    <div className="row">
                        <div className="key">First Name</div>
                        <div className="val">John</div>
                    </div>
                    <div className="row">
                        <div className="key">Last Name</div>
                        <div className="val">Doe</div>
                    </div>
                    <div className="button">View more details</div>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}