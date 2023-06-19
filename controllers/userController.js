import db from '../models/index.js';
import bcrypt from 'bcrypt'
import { Op } from 'sequelize'



const User = db.users
const Chat = db.chats
const Contact = db.contacts



const registerLoad = async (req, res) => {
    try{

        res.render('register')

    } catch (error){
        console.log(error.message)
    }
}

const register = async (req, res) => {
    try{
        const { name, phone, password, confirmPassword } = req.body;
        const passwordHash = await bcrypt.hash(req.body.password, 10)

    // Check required fields
    if (!name || !phone || !password || !confirmPassword) {
        res.render('register', { message: 'Please fill in all fields' });
    }

    // Check password
    if (password !== confirmPassword) {
        res.render('register', { message: 'Passwords do not match' });
    }
    
    // Check exist user with phone
    const existPhone = await User.findOne({ where: { phone: phone } });
    
    if (existPhone) {
            res.render('register', { message: 'A User with Phone already exist!' });
        }
    // create user in DB with default image profile
    if (typeof req.file === "undefined") {
        const user = new User({
            phone: req.body.phone,
            name: req.body.name,
            password: passwordHash,
            image: "/images/default.png"
        })

        await user.save()
        res.redirect('/')
        res.render('dashboard', { message: 'You registered successfully' })
    }

    // Create user in DB
    else{
        const user = new User({
            phone: req.body.phone,
            name: req.body.name,
            password: passwordHash,
            image: '/images/'+req.file.filename,
        })

        await user.save()
        res.redirect('/')
        res.render('dashboard', { message: 'You registered successfully' })
        }

    } catch (error){
        console.log(error.message)
    }
}

const loginLoad = async (req, res) =>{
    try{

        res.render('login')

    } catch (error){
        console.log(error.message)
    }
}

const login = async (req, res) =>{
    try{
        const phone = req.body.phone
        const password = req.body.password

        const userData = await User.findOne({ where: { phone: phone } })
 
        if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password)
            
            if(passwordMatch){ 
                req.user = userData
                res.redirect('/');
                 }
            else{
                res.render('login',{ message: 'Phone and Password is Incorrect!' })
            }
        }
        else{
            res.render('login',{ message: 'Phone and Password is Incorrect!' })
        }

    } catch (error){
        console.log(error.message)
    }
}


const logout = async (req, res) =>{
    try{

        req.session.destroy()
        res.redirect('/')

    } catch (error){
        console.log(error.message)
    }
}


const dashboardLoad = async (req, res) => {
    try{
        const user = await req.user
        console.log(user);
        const contacts = await Contact.findAndCountAll({
            where: {
                user_id: user.phone
            }
        })

        const contactsAll = await Contact.findAll({
            where: {
                user_id: user.phone
            }
        })

        var users = []  
        var lastChat = []
        var isReadChat = []

        for(let i =0; i < contacts.count; i++){
            let isRead = await Chat.findAndCountAll({
                where: {
                    isRead: false,
                    sender_id:contacts.rows[i].phone,
                    receiver_id: user.phone
                }
            })
            isReadChat.push(
                isRead.count
            )
            users.push(await User.findOne({
            where: {
                phone: contacts.rows[i].phone
            }
           }))
           lastChat.push(
            await Chat.findOne({
                where: {
                    [Op.or]: [{
                        sender_id: user.phone, receiver_id: contacts.rows[i].phone
                        },
                        {
                        sender_id: contacts.rows[i].phone, receiver_id: user.phone
                        }
                    ]
                },
                order: [['createdAt', 'DESC']]
            })
            
           )
        }
        for(let x=0; x<lastChat.length; x++){
            if( lastChat[x] === null ){
                lastChat[x] = 'NO'
            }
        }
        res.render('dashboard', { user: user, users: users, contacts: contactsAll, lastChat: lastChat, isReadChat: isReadChat  })
    } catch(error){
        console.log(error.message)
    }
}


// const dashboard = async (req, res) =>{
//     try{


//         res.redirect('/')
//         res.render('dashboard', { user: req.user, users: users, contacts: contactsAll, lastChat: lastChat, isReadChat: isReadChat })

//     } catch (error){
//         console.log(error.message)
//     }
// }

const saveChat = async (req, res) => {
    try {
        var chat = new Chat({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            message: req.body.message,
            date: req.body.date,
            isRead: req.body.isRead
        })

        var newChat = await chat.save()
        res.status(200).send({ success: true, msg: 'chat inserted!', data: newChat})
    } catch (error){
        res.status(400).send({ success: false, msg: error.message })
    }
}


const deleteChat = async (req, res) => {
    try {

        await Chat.destroy({ where: { id: req.body.id } })
        res.status(200).send({ success: true })
    } catch (error){
        res.status(400).send({ success: false, msg: error.message })
    }
}

const updateChat = async (req, res) => {
    try {

        const chat = await Chat.findOne({ where: { id: req.body.id } })
        chat.update({ message: req.body.message });
        chat.save();
        res.status(200).send({ success: true })
    } catch (error){
        res.status(400).send({ success: false, msg: error.message })
    }
}

const saveContact = async (req, res) => {
    
    try {

        const userData = await User.findOne({ where: { phone: req.body.phone } })
        
        if(userData){

        var contact = new Contact({
            phone: req.body.phone,
            name: req.body.name,
            user_id: req.body.user_id
        })

        
        await contact.save()
        res.status(200).send({ success: true, msg: 'contact created!', userData: userData})
    }
    else{
        res.send({ success: false, msg: 'contact Not Join!' })
    }
    } catch (error){
        res.status(400).send({ success: false, msg: error.message })
    }
}

const deleteContact = async (req, res) => {
    try {

        await Contact.destroy({ where: {
            phone: req.body.id,
            user_id: req.body.user_id
        } })
        res.status(200).send({ success: true })
    } catch (error){
        res.status(400).send({ success: false, msg: error.message })
    }
}

const updateContact = async (req, res) => {
    try {

        const contact = await Contact.findOne({ where: {
             phone: req.body.id,
             user_id: req.body.user_id
            } })
            contact.update({ name: req.body.name });
            contact.save();
        res.status(200).send({ success: true })
    } catch (error){
        res.status(400).send({ success: false, msg: error.message })
    }
}


const updateInformationUser = async (req, res) => {
    try {  
        const userInfo = await User.findOne({ where: { phone: req.body.id } })
        userInfo.update({ name: req.body.name });
        userInfo.save();
        res.status(200).send({ success: true }) 
    } catch (error){
        res.status(400).send({ success: false, msg: error.message }) 
    }

}



export default {
    register,
    registerLoad,
    loginLoad,
    login,
    dashboardLoad,
    // dashboard,
    logout,
    saveChat,
    deleteChat,
    updateChat,
    saveContact,
    deleteContact,
    updateContact,
    updateInformationUser,
}