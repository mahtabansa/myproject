 const express = require("express");
 const Joi = require("joi");
 const router = express.Router({mergeParams:true});
  const listing = require("../models/listing.js");
  const reviews = require("../models/reviews.js");
 const wrapAsyn = require("../utils/wrapAsync.js");
 const ExpressError = require("../ExpressError/ExpressError.js");
 const { listingSchema } = require("../schema.js");
 const { isloggedIn ,validateListing } = require("../middleware.js");
const listingControler = require("../controlers/listings.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

    const isOwner = async (req,res,next) => {
        let { id } = req.params;
        res.locals.currUser = req.user;
        let lis =  await listing.findById(id);
        if(!lis.owner.equals(res.locals.currUser._id)) {
        req.flash("error","you are not the owner of this listing");
        return res.redirect(`/listings/${ id }`);
        }
        next();
    }

   router
   .route("")
   .get(wrapAsyn(listingControler.index))
   .post(isloggedIn,upload.single('listing[image]'),validateListing, wrapAsyn(listingControler.CreateNewlisting))
       
         
    

    router.get("/new",isloggedIn, listingControler.createNewListingFormRender);

    router
    .route("/:id")
    .get((listingControler.showRoute))
    .delete(isloggedIn, isOwner, listingControler.destroyListing)
    .put(isloggedIn,isOwner,upload.single('listing[image]'), validateListing,wrapAsyn(listingControler.updateListing))

     router.get("/:id/edit",isloggedIn, isOwner, wrapAsyn(listingControler.EditFormRender));
    
     
    router.use((err,req,res,next)=>{
    let {status = 500 ,message = "something went wrong!"} = err;
    // res.status(status).send(message);
    res.render("./listing/Error.ejs",{err});
});

 module.exports = router;