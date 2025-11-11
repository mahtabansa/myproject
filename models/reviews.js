const mongoose = require("mongoose");
const Schema  = mongoose.Schema; 
// const User = require("./user.js");
const middleware = require("../middleware");


const reviewSchema = new Schema({
    
    comment:String,
    rating: {
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
    type: Date,
    default:Date.now(),
    },
    author:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    },
});



module.exports = mongoose.model("Review",reviewSchema);