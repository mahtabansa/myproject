const mongoose = require("mongoose");
const Review = require("./reviews");
const User = require("./user");
const { required, number } = require("joi");
const { coordinates } = require("@maptiler/client");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    description: {
        type:String,
    },

    
    image: {
        url:String,
        filename: String,
    },
    price: Number,
    location:String,
    country:String,
    reviews: [
        {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Review",
        },
      ],

    owner:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }, 

    geometry:{
         type:{
            type:String,  // dont do {location :{type:String}}
            enum:['Point'],  // location.type must be point
            required:true,
         },
        coordinates:{
            type:[Number],
            required:true,
        }

    }    
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing) {
        await Review.deleteMany({ _id: { $in : listing.reviews }})
    }
});
const listing = mongoose.model("listing",listingSchema);
module.exports = listing;