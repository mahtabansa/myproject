const User = require("../models/user");

module.exports.signUpRenderForm = (req,res)=>{
res.render("../views/user/signup.ejs");
}

module.exports.signUp = async (req,res)=>{
    
   let { username,email,password } = req.body;
 
    let newUser =  new User({
        username,email
    });
    let userRegister = await User.register(newUser,password);
    console.log("new user:",userRegister)
    req.login(userRegister,(err)=>{
        if(err) {
            next(err);
        }
        req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
    })

}

module.exports.loginFormRender = (req,res)=>{
    res.render("../views/user/login.ejs");
}

module.exports.login = async (req,res)=>{
      req.flash("success","Welcome to wanderlust");
      let redirectUrl = res.locals.redirectUrl || "/listings"
       res.redirect(redirectUrl);

    }
 module.exports.logOut = (req,res)=>{
        req.logout((err)=> {
         if(err) {
            return next(err);
         }
         req.flash("success","logged you out!");
         return res.redirect("/listings");
        });
    }   