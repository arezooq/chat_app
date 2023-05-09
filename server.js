import { config } from "dotenv";
import express from 'express'
import userRoute from './routes/userRoute.js'
import bodyParser from "body-parser";
import { Server } from 'socket.io';
import { createServer } from 'http';
import db from './models/index.js';
import { Op } from 'sequelize'

const User = db.users
const Chat = db.chats
const Contact = db.contacts




config()

const app = express(); 
const server = createServer(app); 
const io = new Server(server);

const PORT = process.env.PORT || 3000


var usp = io.of('/user-namespace')
usp.on('connection', async (socket) => {
    console.log('User Connected')

    var userId = socket.handshake.auth.token
        
       const user = await User.findOne({ where: { phone: userId } })
        user.update({ is_online: '1' });
        user.save();


    // user broadcast online status

    socket.broadcast.emit('getOnlineUser', { user_id: userId })

    socket.on('disconnect', async () => {
        console.log('User Disconnected')

        var userId = socket.handshake.auth.token

           const user = await User.findOne({ where: { phone: userId } })
            user.update({ is_online: '0' });
            user.save();
    
        // user broadcast offline status

        socket.broadcast.emit('getOfflineUser', { user_id: userId })

    })

    // chatting implemention
    socket.on('newChat', function(data) {
        socket.broadcast.emit('loadNewChat', data)
    })

    // load old chats
    socket.on('existsChat', async function(data) {

    var chats = await Chat.findAll({
        where: {
            [Op.or]: [{
                sender_id: data.sender_id, receiver_id: data.receiver_id
                },
                {
                    sender_id: data.receiver_id, receiver_id: data.sender_id
                }
            ]
        }
    })
        socket.emit('loadChats', { chats: chats })
    })

    // load old chats
    socket.on('existsChat', async function(data) {

        var chats = await Chat.findAll({
            where: {
                [Op.or]: [{
                    sender_id: data.sender_id, receiver_id: data.receiver_id
                    },
                    {
                        sender_id: data.receiver_id, receiver_id: data.sender_id
                    }
                ]
            }
        })
            socket.emit('loadChats', { chats: chats })
        })  
        

    // delete chat
    socket.on('chatDeleted', function(id){
        socket.broadcast.emit('chatMessageDeleted', id)
    })

      // update chat
      socket.on('chatUpdated', function(data){
        socket.broadcast.emit('chatMessageUpdated', data)
    })

       // delete contact
       socket.on('contactDeleted', function(id){
        socket.broadcast.emit('contactInfoDeleted', id)
    })

       // update contact
       socket.on('contactUpdated', function(data){
        socket.broadcast.emit('contactInfoUpdated', data)
    })

           // update information user
           socket.on('userUpdated', function(data){
            socket.broadcast.emit('userInfoUpdated', data)
        })
})

app.use('/', userRoute)
app.use(bodyParser.urlencoded({ extended: true }));

server.listen(PORT, () => console.log(`Server is running port ${PORT}`))


