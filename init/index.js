const mongoose = require("mongoose");

const initdata = require("./data.js");
const listing = require("../models/listing.js");

// const DB_URL = "mongodb://127.0.0.1:27017/wanderlust";

//     main()
//     .then(()=> console.log("connected to DB"))
//     .catch((err)=>{
//         console.log(err);
//     })
//     async function main(){
//         await mongoose.connect(DB_URL);
//     }
    
//     const initDB = async () => {
      
//         await listing.deleteMany({});
//         initdata.data = initdata.data.map((obj)=>({...obj,owner:"6909d03ea3e51504ec861d86"}));
//         await listing.insertMany(initdata.data);
//        console.log("data was initialized");

//     }

//     // initDB();
