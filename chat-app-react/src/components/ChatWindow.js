const ChatWindow = ({ selectedContact, messages }) => {
    return (
      <div className="chat">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <img src={selectedContact.profile || "/default.png"} alt="profile" />
              <h3>{selectedContact.name}</h3>
              <span className={selectedContact.is_online ? "online" : "offline"}>
                {selectedContact.is_online ? "آنلاین" : "آفلاین"}
              </span>
            </div>
            <div className="chat-body">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender_id === "current_user_id" ? "sent" : "received"}`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>یک مخاطب انتخاب کنید</p>
        )}
      </div>
    );
  };
  
  export default ChatWindow;
  