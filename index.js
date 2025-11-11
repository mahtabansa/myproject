 require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
app.use(express.urlencoded({extended: true}));
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const sampleData = require("./init/index.js"); 
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./ExpressError/ExpressError.js");
const joi = require("joi");
const Listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const router = express.Router({ mergeParams:true });
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRoute = require("./routes/user.js");
app.use(express.json())

   const dbUrl = process.env.ATLAS_DBURL;
   const connectToDB = async function main(){
    try {
        await mongoose.connect(dbUrl);
        console.log(" Connected  db atlas");
    } catch (error) {
        console.log("Databse error",error);
    }
    }
    connectToDB();

   
    
    const  store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
    });
      

     const sessionOption = {
        store,
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized: true,
        cookie :{
            expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge:7 * 24 * 60 * 60 * 1000,
            httpOnly:true,
        }
    }

    console.log("this is after session store console");
    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(methodOverride("_method"));
    app.engine('ejs',ejsMate);
    app.use(express.static(path.join(__dirname,"/public")));



    app.use(session(sessionOption));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
     
      app.use((req,res,next)=>{
        res.locals.successMsg = req.flash("success");
        res.locals.errorMsg = req.flash("error");
        res.locals.currUser = req.user;
        res.locals.mapToken = process.env.MAPTILER_API_KEY;
        next();
     });

    app.get("/",(req,res)=>{
        res.send("server is working");
        });

      app.get("/demouser",async (req,res)=>{
            let fakeuser = new User({
            email:"suhel@gmail.com",
            username:"suhel0123",
     });
        let newUser = await User.register(fakeuser,"hello");
        console.log(newUser);
        return res.send(newUser);
    });
     

    app.use("/listings",Listing);
    app.use("/listings/:id/reviews", review);
    app.use("/",userRoute);


    app.all(/.*/,(req,res,next)=>{
        next(new ExpressError(404,"page not found"));
    });
    
    app.use((err,req,res,next)=>{
        let {status = 500 ,message = "something went wrong!"} = err;
        res.render("./listing/Error.ejs",{err});
    });

    app.listen(8080,()=>{
        console.log("server is running on port 8080");
    });





