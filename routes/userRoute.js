import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import userController from "../controllers/userController.js";
import session from "express-session";
import { config } from "dotenv";
import passport from "passport";
import flash from "express-flash";
import db from "../models/index.js";
import configurePassport from "../middlewares/auth.js";
import checkAuthenticate from "../middlewares/checkAuthenticate.js";
import checkNotAuthenticate from "../middlewares/checkNotAuthenticate.js";

config();
const User = db.users;
const user_route = express();

configurePassport(passport, (phone) =>
  User.findOne({ where: { phone: phone } })
);

user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.use(flash());
user_route.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
user_route.use(passport.initialize());
user_route.use(passport.session());

user_route.use(express.static("public"));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage });

user_route.get("/register", checkNotAuthenticate, userController.registerLoad);
user_route.post(
  "/register",
  checkNotAuthenticate,
  upload.single("image"),
  userController.register
);

user_route.get("/login", checkNotAuthenticate, userController.loginLoad);
user_route.post(
  "/login",
  checkNotAuthenticate,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

user_route.get("/", checkAuthenticate, userController.dashboardLoad);

user_route.get("/logout", userController.logout);

user_route.post("/save-contact", userController.saveContact);
user_route.post("/update-contact", userController.updateContact);
user_route.post("/delete-contact", userController.deleteContact);

user_route.post("/save-chat", userController.saveChat);
user_route.post("/delete-chat", userController.deleteChat);
user_route.post("/update-chat", userController.updateChat);

user_route.post("/update-user", userController.updateInformationUser);

user_route.get("*", (req, res) => {
  res.redirect("/");
});

export default user_route;