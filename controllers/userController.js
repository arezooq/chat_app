import db from '../models/index.js';
import bcrypt from 'bcrypt'
import { Op } from 'sequelize'
import Sequelize from "sequelize";

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

    // Create user in DB
    else{

            const user = new User({
                phone: req.body.phone,
                name: req.body.name,
                password: passwordHash,
                image: '/images/'+req.file.filename,
            })

            await user.save()

            res.render('login', { message: 'You registered successfully and you can now login'})
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

        const password = req.body.password
        const phone = req.body.phone

        const userData = await User.findOne({ where: { phone: phone } })
 
        if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password)
            
            if(passwordMatch){ 

                const contacts = await Contact.findAndCountAll({
                    where: {
                        user_id: userData.phone
                    }
                })

                const contactsAll = await Contact.findAll({
                    where: {
                        user_id: userData.phone
                    }
                })

                var users = []  
                var lastChat = []                          

                for(let i =0; i < contacts.count; i++){
                    users.push(await User.findOne({
                    where: {
                        phone: contacts.rows[i].phone
                    }
                   }))
                //    lastChat.push(await Chat.findAll({
                //     where: {
                //         [Op.or]: [{
                //             sender_id: userData.phone, receiver_id: contacts.rows[i].phone
                //             },
                //             {
                //             sender_id: contacts.rows[i].phone, receiver_id: userData.phone
                //             }
                //         ], 
                //         id: { 
                //             [Op.in]: [await Chat.max('id')]
                //           }
                //     }
                // }))
                }
                console.log(lastChat)

                res.render('dashboard', { user: userData, users: users, contacts: contactsAll, lastChat: lastChat })

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

const saveChat = async (req, res) => {
    try {
        var chat = new Chat({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            message: req.body.message
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
    logout,
    saveChat,
    deleteChat,
    updateChat,
    saveContact,
    deleteContact,
    updateContact,
    updateInformationUser
    // loadDashboard
}