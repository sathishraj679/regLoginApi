// first require the dependancies
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const res = require("express/lib/response");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');



//to connect to the server via express middleware
const app = express();
app.use(express.static("public"));
//using body parser to get data from the body of web page
app.use(bodyparser.urlencoded({
    extended:true,unidentifiedTopology:true
  }));
  //setting view engine as ejs
  app.set('view engine','ejs');
  app.use(session({
    secret:"as long as u like me i feel happy",
    resave:false,
    saveUninitialized:false
  }));
//initializing passport and initializing session using passport
  app.use(passport.initialize());
  app.use(passport.session());
//to connect database with server
mongoose.connect("mongodb://localhost:27017/userDB",{UseUnifiedTopology:true});
//creating a new schema

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

//initializing passport local mongoose
userSchema.plugin(passportLocalMongoose);
 
//creating the model using the schema
const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




 app.get("/",function(req,res){
     res.render("home");
 })
  app.get("/register",function(req,res){
    res.render("register");
  });
  app.get("/login",function(req,res){
    res.render("login");
  });
  app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
  });
  app.get("/unlock",function(req,res){
     if(req.isAuthenticated()){
       res.render("unlock");
     }else{
       res.redirect("/login");
     }
    });
  



// data from user and saving it in our database
app.post("/register",function(req,res){
  //using passport local mongoose unique register function 
User.register({username:req.body.username},req.body.password,function(err,user){
  if(err){
    console.log(err);
    res.redirect("/register");
  }else{
    passport.authenticate("local")(req,res,function(){
      res.redirect("/unlock");
    })
  }
})

});

  
app.post("/login",function(req,res){
//creating the new user
     const user = new User({
       username:req.body.username,
       password:req.body.password
     });
     req.login(user,function(err){
       if(err){
         console.log(err);
       } else {
        passport.authenticate("local")(req,res,function(){
          res.redirect("/unlock");
        })
      }
      
       })
     });
 

    app.listen(6060,function(){
    console.log("running");
  })
