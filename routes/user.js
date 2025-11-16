const express = require("express");
const app = express();
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controlers/users.js");

//SignUp form Render and signUp

router
.route("/signup")
.get(userController.signUpRenderForm)
.post(wrapAsync(userController.signUp))

//login Renderform and login

router
.route("/login")
.get(userController.loginFormRender)
.post(
      saveRedirectUrl,
      passport.authenticate("local", { 
          failureRedirect:"/login",
          failureFlash:true, 
          }),
       userController.login
    );
  router.get("/logout",userController.logOut);

module.exports = router;