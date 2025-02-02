const ContactList = ({ contacts, onSelectContact }) => {
    return (
      <div className="contacts">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="contact-item"
            onClick={() => onSelectContact(contact)}
          >
            <img src={contact.profile || "/default.png"} alt="profile" />
            <div>
              <h4>{contact.name}</h4>
              <p>{contact.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ContactList;
  