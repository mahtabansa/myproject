const express  = require("express");
const router =  express.Router({mergeParams:true});
const listing = require("../models/listing.js");
const wrapAsyn = require("../utils/wrapAsync.js");
const ExpressError = require("../ExpressError/ExpressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const {  isloggedIn } = require("../middleware.js");
const reviewControler = require("../controlers/reviews.js");

     const validateReview = (req,res,next) => {;
        let { error } = Review.validate(req.body);
        if(error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400,errMsg);
        }
        else {
            next();
        }
    }

   const isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    res.locals.currUser = req.user;
    
    let review = await Review.findById(reviewId);
    
    console.log("Review", review);
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }
    
    if (!review.author || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    
    next(); 
  }
  
//Route for Create Review
 router.post("/",isloggedIn,validateReview,wrapAsyn(reviewControler.createReview));

    // Delete reviews
    router.delete("/:reviewId", isloggedIn, isReviewAuthor,
      wrapAsyn(reviewControler.destroyReview));

    module.exports = router;