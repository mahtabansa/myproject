const listing = require("../models/listing");
const Review  = require("../models/reviews");
module.exports.createReview = async (req, res) => {
     let { id } = req.params;
     
    const listing2 = await listing.findById(id); 
    const newReview = new Review(req.body.review);
     newReview.author = req.user._id;
     await newReview.save();
     listing2.reviews.push(newReview._id);
    
     await listing2.save();
     req.flash("success","New review created");
     res.redirect(`/listings/${listing2._id}`);
    }



module.exports.destroyReview = async(req,res)=>{
      let { id,reviewId } = req.params;
        await listing.findByIdAndUpdate(id,{$pull : { reviews:reviewId }});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","review deleted successfull");
        return res.redirect("/listings");
       
    }