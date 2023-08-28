const express = require("express");
const app = express();

// chat
const http = require("http");
const server = http.createServer(app);
const { Server }  = require("socket.io");
const io = new Server(server);

const ejs = require("ejs");
const session = require("express-session");
const mongoose = require("mongoose");
const multer = require("multer");

const dotenv = require("dotenv");
const { log } = require("util");
dotenv.config();

const PORT = process.env.PORT || 3000;
const URI = "mongodb://0.0.0.0:27017/ticket";

mongoose.connect(URI).then(()=>{
    console.log("Database connected ");
}).catch((err)=>{
    console.log("Database connection Error :  ",err);
});

// set view engine
app.set("view engine","ejs");

// middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json());


// use express session to keep track of the user
app.use(
    session({
            secret : "maikyubatau",
            resave : false,
            saveUninitialized : false,
    })
);

// routes
app.get("/",function(req,res){
    if(req.session.isLoggedIn){
        return res.redirect("/user/dashboard");
    }else if(req.session.employeeIsLoggedIn){
        return res.redirect("/employee/dashboard");
    }
    res.render("home");
});



// server
app.listen(PORT,function(){
    console.log(`Listening at port ${PORT}`);
});