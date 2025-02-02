import { config } from "dotenv";
import express from "express";
import user_route from "./routes/userRoute.js";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import db from "./models/index.js";
import { Op } from "sequelize";

const User = db.users;
const Chat = db.chats;
const Contact = db.contacts;

config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

var usp = io.of("/user-namespace");
usp.on("connection", async (socket) => {
  console.log("User Connected");

  var userId = socket.handshake.auth.token;

  const user = await User.findOne({ where: { phone: userId } });
  user.update({ is_online: "1" });
  user.save();

  // user broadcast online status

  socket.broadcast.emit("getOnlineUser", { user_id: userId });

  socket.on("disconnect", async () => {
    console.log("User Disconnected");

    var userId = socket.handshake.auth.token;

    const user = await User.findOne({ where: { phone: userId } });
    user.update({ is_online: "0" });
    user.save();

    // user broadcast offline status

    socket.broadcast.emit("getOfflineUser", { user_id: userId });
  });

  // chatting implemention
  socket.on("newChat", function (data) {
    socket.broadcast.emit("loadNewChat", data);
  });

  // load old chats
  socket.on("existsChat", async function (data) {
    var chats = await Chat.findAll({
      where: {
        [Op.or]: [
          {
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
          },
          {
            sender_id: data.receiver_id,
            receiver_id: data.sender_id,
          },
        ],
      },
    });
    socket.emit("loadChats", { chats: chats });
  });

  // find isRead false for Notif
  socket.on("notification", async (data) => {
    var chats = await Chat.findAndCountAll({
      where: {
        receiver_id: data.sender_id,
        isRead: false,
      },
    });
    let count = chats.count;
    socket.emit("showNotification", {
      count: count,
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
    });
  });

  // delete chat
  socket.on("chatDeleted", function (id) {
    socket.broadcast.emit("chatMessageDeleted", id);
  });

  // update chat
  socket.on("chatUpdated", function (data) {
    socket.broadcast.emit("chatMessageUpdated", data);
  });

  // delete contact
  socket.on("contactDeleted", function (id) {
    socket.broadcast.emit("contactInfoDeleted", id);
  });

  // update contact
  socket.on("contactUpdated", function (data) {
    socket.broadcast.emit("contactInfoUpdated", data);
  });

  // update information user
  socket.on("userUpdated", function (data) {
    socket.broadcast.emit("userInfoUpdated", data);
  });

  socket.on("isReadMessage", async function (data) {
    const contacts = await Contact.findAndCountAll({
      where: {
        user_id: data.sender_id,
      },
    });
    for (let i = 0; i < contacts.count; i++) {
      await Chat.update(
        { isRead: true },
        {
          where: {
            sender_id: contacts.rows[i].phone,
            receiver_id: data.sender_id,
          },
        }
      );
    }
  });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/", user_route);

server.listen(PORT, () => console.log(`Server is running port ${PORT}`));