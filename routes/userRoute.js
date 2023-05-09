import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import userController from '../controllers/userController.js'
import session from 'express-session'
import auth from '../middlewares/auth.js'
import { config } from 'dotenv'


config()
const user_route = express()

const { SESSION_SECRET } = process.env
user_route.use(session({ secret:SESSION_SECRET }))

user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded( { extended: true }))

user_route.set('view engine', 'ejs')
user_route.set('views', './views')

user_route.use(express.static('public'))


var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    }
})

var upload = multer({ storage: storage })

user_route.get('/register', userController.registerLoad)
user_route.post('/register', upload.single('image'), userController.register)

user_route.get('/', userController.loginLoad)
user_route.post('/', userController.login)

user_route.get('/logout', userController.logout)

user_route.post('/save-contact', userController.saveContact)
user_route.post('/update-contact', userController.updateContact)
user_route.post('/delete-contact', userController.deleteContact)

user_route.post('/save-chat', userController.saveChat)
user_route.post('/delete-chat', userController.deleteChat)
user_route.post('/update-chat', userController.updateChat)

user_route.post('/update-user', userController.updateInformationUser)



// user_route.post('/dashboard', userController.loadDashboard)

user_route.get('*', (req, res) => {
    res.redirect('/')
})


export default user_route
