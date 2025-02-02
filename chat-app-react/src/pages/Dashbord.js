import React, { useState, useEffect } from "react";
import io from "socket.io-client"; // اصلاح به "socket.io-client"
import axios from "axios";
import ContactList from "../components/ContactList";
import ChatWindow from "../components/ChatWindow";
import ProfileSettings from "../components/ProfileSettings";
import "../styles/dashboard.css";

// فرض کنید توکن در localStorage ذخیره شده است
const token = localStorage.getItem("token");
const socket = io("http://localhost:3000/user-namespace", {
  auth: { token },
});

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({ name: "کاربر", profile: "default.png" });
  const [currentUserId, setCurrentUserId] = useState(null); // شناسه کاربر جاری

  // تعریف تابع fetchMessages خارج از useEffect
  const fetchMessages = async (contact) => {
    setSelectedContact(contact);
    try {
      const { data } = await axios.post(
        "/chats/existing",
        { sender_id: currentUserId, receiver_id: contact.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(data.chats);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    // استخراج شناسه کاربر از توکن
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(decodedToken.user_id); // فرض کنید شناسه کاربر در توکن قرار دارد
    }

    fetchContacts();

    socket.on("loadNewChat", (data) => {
      if (selectedContact && selectedContact.phone === data.sender_id) {
        setMessages((prev) => [...prev, data]);
      } else if (selectedContact && selectedContact.phone !== data.sender_id) {
        fetchMessages(selectedContact); // دریافت پیام‌ها برای مخاطب انتخاب‌شده
      }
    });

    socket.on("getOnlineUser", ({ user_id }) => {
      setContacts((prev) =>
        prev.map((contact) =>
          contact.phone === user_id ? { ...contact, is_online: "1" } : contact
        )
      );
    });

    socket.on("getOfflineUser", ({ user_id }) => {
      setContacts((prev) =>
        prev.map((contact) =>
          contact.phone === user_id ? { ...contact, is_online: "0" } : contact
        )
      );
    });

    // پاک کردن لیسنرها هنگام unmount شدن
    return () => {
      socket.off("loadNewChat");
      socket.off("getOnlineUser");
      socket.off("getOfflineUser");
    };
  }, [selectedContact, token, fetchMessages]);  // اضافه کردن selectedContact و token به وابستگی‌ها

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get("/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const message = {
      sender_id: currentUserId,
      receiver_id: selectedContact.phone,
      text: messageText,
    };

    try {
      // ارسال پیام به سرور
      socket.emit("sendMessage", message);

      // به روز رسانی پیام‌ها به صورت محلی
      setMessages((prevMessages) => [...prevMessages, message]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="dashboard">
      <ContactList contacts={contacts} onSelectContact={fetchMessages} />
      <ChatWindow
        selectedContact={selectedContact}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
      <ProfileSettings user={user} setUser={setUser} />
    </div>
  );
};

export default Dashboard;
