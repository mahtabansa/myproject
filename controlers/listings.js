
const listing = require("../models/listing");
const maptilerClient = require('@maptiler/client');
require('dotenv').config();
const apiKey = process.env.MAPTILER_API_KEY;
maptilerClient.config.apiKey = apiKey;


module.exports.index = async (req,res)=>{
        
     let listings = await listing.find().populate("owner");
     res.render("listing/index.ejs",{ listings });
      
    };

module.exports.createNewListingFormRender = (req,res)=>{
        res.render("listing/new.ejs");
        
    };

module.exports.CreateNewlisting = async (req,res,next)=>{
 
        const location  = req.body.listing.location;
        const result = await maptilerClient.geocoding.forward( location );
        
        const coordinates1 = result.features[0].geometry.coordinates;//[longitude, latitude]
             console.log(coordinates1);
             let url = req.file.path;
             let filename = req.file.filename;
            const newListing = await new listing(req.body.listing);
            newListing.owner = req.user._id;
             newListing.image = {url,filename};
             newListing.geometry =  {
                type:'Point',
                  coordinates: coordinates1
             };
             await newListing.save();
            
            req.flash("success","listed successfully");
           return  res.redirect("/listings");
    }
module.exports.EditFormRender = async (req,res)=>{
        let { id } = req.params;
        const ls = await listing.findById(id);
        if(!ls) {
            req.flash("error","listing you requested for does not exist");
            return res.redirect("/listings");
        }
         let originalImageUrl = ls.image.url;
         console.log(originalImageUrl);
         originalImageUrl = originalImageUrl.replace("/upload","/upload/ar_1.0,c_fill,h_200,w_250");
        return res.render("listing/edit.ejs",{ ls ,originalImageUrl });
        
    }

 module.exports.updateListing =  async (req,res)=> {
        let { id } = req.params;
        let listingData = req.body.listing;
       
       let Listing = await listing.findByIdAndUpdate(id,{listingData});

       if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        console.log(url,filename);
        Listing.image = {url,filename};
        await Listing.save();
        }
        req.flash("success","Updated listing successfull");
        return res.redirect(`/listings/${ id }`);
    }  

module.exports.destroyListing = async(req,res)=>{
        let { id } = req.params;
        console.log("hello",id);
        await listing.findByIdAndDelete(id);
        req.flash("success","delete listing successfull");
        res.redirect("/listings");
    }    

module.exports.showRoute = async (req,res)=>{
        let { id } = req.params;
         const elm = await listing.findById(id)
         .populate({
            path:"reviews",
            populate: {
                path:"author",
            },
         })
         .populate("owner");
           if( !elm ) {
            req.flash("error","listing you requested for does not exist");
            return res.redirect("/listings");
         }
         
         res.render("listing/show.ejs",{ elm });
         
      };